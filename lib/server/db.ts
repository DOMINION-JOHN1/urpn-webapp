import { mkdirSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomBytes, randomUUID } from 'node:crypto';
import type { Database, Enrollment, LessonProgress } from './types';
import { hashPasswordSync } from './password';
import { COURSES, getAllLessons } from '../courses';

/**
 * The local portal store is a small JSON file. When Supabase credentials are
 * configured, the same state uses a private Postgres JSONB row with atomic
 * revision checks, so serverless instances share one durable source of truth.
 */

const DB_FILENAME = 'urpn-db.json';
const SUPABASE_STATE_ID = 'main';

interface SupabaseStateRow {
  revision: number;
  state: Database;
}

let writeQueue: Promise<unknown> = Promise.resolve();
let seedPromise: Promise<void> | null = null;

export function getDataDir(): string {
  if (process.env.URPN_DATA_DIR) {
    return path.resolve(process.env.URPN_DATA_DIR);
  }
  return path.join(process.cwd(), 'data');
}

export function getDbPath(): string {
  return path.join(getDataDir(), DB_FILENAME);
}

function supabaseStateConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const apiKey = secretKey || serviceRoleKey;
  return url && apiKey
    ? {
        url,
        apiKey,
        // New Supabase secret keys are API keys, not JWTs. Legacy service-role
        // keys remain JWTs and must also be sent as the bearer token.
        bearerToken: secretKey ? null : serviceRoleKey,
      }
    : null;
}

export function isSupabaseStateConfigured(): boolean {
  return Boolean(supabaseStateConfig());
}

function supabaseHeaders(config: NonNullable<ReturnType<typeof supabaseStateConfig>>): HeadersInit {
  return {
    apikey: config.apiKey,
    ...(config.bearerToken ? { Authorization: `Bearer ${config.bearerToken}` } : {}),
    'Content-Type': 'application/json',
  };
}

async function readSupabaseState(): Promise<SupabaseStateRow | null> {
  const config = supabaseStateConfig();
  if (!config) return null;

  const response = await fetch(
    `${config.url}/rest/v1/urpn_app_state?id=eq.${SUPABASE_STATE_ID}&select=revision,state`,
    { headers: supabaseHeaders(config), cache: 'no-store' }
  );
  if (!response.ok) {
    throw new Error(`Persistent database read failed (${response.status}).`);
  }

  const rows = (await response.json()) as SupabaseStateRow[];
  return rows[0] ?? null;
}

async function createSupabaseState(state: Database): Promise<void> {
  const config = supabaseStateConfig();
  if (!config) return;

  const response = await fetch(`${config.url}/rest/v1/urpn_app_state?on_conflict=id`, {
    method: 'POST',
    headers: {
      ...supabaseHeaders(config),
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify({ id: SUPABASE_STATE_ID, revision: 0, state }),
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Persistent database initialization failed (${response.status}).`);
  }
}

async function commitSupabaseState(state: Database, expectedRevision: number): Promise<boolean> {
  const config = supabaseStateConfig();
  if (!config) return false;

  const response = await fetch(`${config.url}/rest/v1/rpc/urpn_commit_state`, {
    method: 'POST',
    headers: supabaseHeaders(config),
    body: JSON.stringify({ p_state: state, p_expected_revision: expectedRevision }),
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Persistent database write failed (${response.status}).`);
  }
  return (await response.json()) === true;
}

async function mutateSupabaseState<T>(mutator: (db: Database) => T | Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    await ensureSeeded();
    const current = await readSupabaseState();
    if (!current) continue;

    const draft = JSON.parse(JSON.stringify(current.state)) as Database;
    const result = await mutator(draft);
    if (await commitSupabaseState(draft, current.revision)) return result;
  }

  throw new Error('Persistent database update conflicted too many times.');
}

async function exists(file: string): Promise<boolean> {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

function buildSeed(): Database {
  const now = new Date();
  const iso = now.toISOString();
  const demoEnabled = process.env.NODE_ENV !== 'production' && process.env.SHOW_DEMO_LOGIN !== 'false';

  const staffId = 'usr_demo_grace';
  const memberId = 'usr_demo_member';

  const ministers = COURSES.find((course) => course.slug === 'ministers');
  const workforce = COURSES.find((course) => course.slug === 'workforce-training');
  const completedAt = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString();

  const staffProgress: LessonProgress[] = ministers
    ? getAllLessons(ministers).slice(0, 2).map((lesson, index) => {
        const lessonCompletedAt = new Date(
          now.getTime() - 1000 * 60 * 60 * 24 * (5 - index)
        ).toISOString();
        return {
          userId: staffId,
          courseId: ministers.slug,
          lessonId: lesson.id,
          positionSeconds: lesson.media?.durationSeconds ?? 0,
          completedAt: lessonCompletedAt,
          updatedAt: lessonCompletedAt,
        };
      })
    : [];

  const workforceProgress: LessonProgress[] = workforce
    ? getAllLessons(workforce).slice(0, 2).map((lesson, index) => ({
        userId: memberId,
        courseId: workforce.slug,
        lessonId: lesson.id,
        positionSeconds: index === 0 ? lesson.media?.durationSeconds ?? 0 : 15,
        completedAt: index === 0 ? completedAt : null,
        updatedAt: completedAt,
      }))
    : [];

  const enrollments: Enrollment[] = [
    ...(ministers
      ? [{
          id: 'enr_demo_ministers',
          userId: staffId,
          courseId: ministers.slug,
          enrolledAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 9).toISOString(),
          conditionsAcceptedAt: null,
        }]
      : []),
    ...(workforce
      ? [{
          id: 'enr_demo_workforce',
          userId: memberId,
          courseId: workforce.slug,
          enrolledAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4).toISOString(),
          conditionsAcceptedAt: completedAt,
        }]
      : []),
  ];

  return {
    version: 1,
    seededAt: iso,
    users: demoEnabled
      ? [
          {
            id: staffId,
            name: 'Grace Adeyemi',
            email: 'worker@urpn.org',
            phone: '+234 801 234 5678',
            passwordHash: hashPasswordSync('urpn2026'),
            role: 'worker',
            createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 12).toISOString(),
          },
          {
            id: memberId,
            name: 'Daniel Okoro',
            email: 'member@urpn.org',
            phone: '+234 802 345 6789',
            passwordHash: hashPasswordSync('member2026'),
            role: 'workforce',
            createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4).toISOString(),
          },
        ]
      : [],
    enrollments: demoEnabled ? enrollments : [],
    progress: demoEnabled ? [...staffProgress, ...workforceProgress] : [],
    attempts: [],
    certificates: [],
  };
}

async function writeDb(db: Database): Promise<void> {
  const dir = getDataDir();
  await fs.mkdir(dir, { recursive: true });
  const target = getDbPath();
  const temp = path.join(dir, `.${DB_FILENAME}.${process.pid}.${randomBytes(4).toString('hex')}.tmp`);
  await fs.writeFile(temp, JSON.stringify(db, null, 2), 'utf8');
  await fs.rename(temp, target);
}

async function ensureSeeded(): Promise<void> {
  if (isSupabaseStateConfigured()) {
    if (await readSupabaseState()) return;
    if (!seedPromise) {
      seedPromise = (async () => {
        if (await readSupabaseState()) return;
        await createSupabaseState(buildSeed());
      })();
    }
    try {
      await seedPromise;
    } catch (error) {
      seedPromise = null;
      throw error;
    }
    return;
  }

  if (await exists(getDbPath())) return;
  if (!seedPromise) {
    seedPromise = (async () => {
      // Re-check after acquiring the promise: another request may have seeded.
      if (await exists(getDbPath())) return;
      await writeDb(buildSeed());
    })();
  }
  try {
    await seedPromise;
  } catch (error) {
    seedPromise = null;
    throw error;
  }
}

export async function readDb(): Promise<Database> {
  await ensureSeeded();
  if (isSupabaseStateConfigured()) {
    const row = await readSupabaseState();
    if (!row) throw new Error('Persistent database state is missing.');
    return row.state;
  }
  const raw = await fs.readFile(getDbPath(), 'utf8');
  return JSON.parse(raw) as Database;
}

/**
 * Serialised read-modify-write. The callback receives a private copy of the
 * database; if it throws, nothing is written.
 */
export function mutateDb<T>(mutator: (db: Database) => T | Promise<T>): Promise<T> {
  const run = writeQueue.then(async () => {
    if (isSupabaseStateConfigured()) return mutateSupabaseState(mutator);
    await ensureSeeded();
    const db = await readDb();
    const result = await mutator(db);
    await writeDb(db);
    return result;
  });

  // Keep the chain alive even when a mutation rejects.
  writeQueue = run.then(
    () => undefined,
    () => undefined
  );

  return run;
}

/** Ensures the data directory exists (used for the auth secret). */
export function ensureDataDir(): string {
  const dir = getDataDir();
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function newId(prefix: string): string {
  return `${prefix}_${randomUUID().replace(/-/g, '').slice(0, 20)}`;
}
