import { mkdirSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomBytes, randomUUID } from 'node:crypto';
import type { Database, Enrollment, LessonProgress } from './types';
import { hashPasswordSync } from './password';
import { COURSES, getAllLessons } from '../courses';

/**
 * A deliberately small JSON-backed store so the portal runs with zero external
 * services. Writes are serialised in-process and committed atomically.
 *
 * Production note: on platforms with an ephemeral filesystem (e.g. Vercel's
 * serverless functions), point URPN_DATA_DIR at a persistent volume or replace
 * this module with your database of choice. All reads/writes go through
 * `readDb` / `mutateDb`, so the rest of the app does not need to change.
 */

const DB_FILENAME = 'urpn-db.json';

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
  const demoEnabled = process.env.SHOW_DEMO_LOGIN !== 'false';

  const staffId = 'usr_demo_grace';
  const memberId = 'usr_demo_member';

  const ministers = COURSES.find((course) => course.slug === 'ministers')!;
  const media = COURSES.find((course) => course.slug === 'media')!;
  const staffLessons = getAllLessons(ministers);
  const mediaLessons = getAllLessons(media);

  const staffProgress: LessonProgress[] = staffLessons.slice(0, 2).map((lesson, index) => {
    const completedAt = new Date(
      now.getTime() - 1000 * 60 * 60 * 24 * (5 - index)
    ).toISOString();
    return {
      userId: staffId,
      courseId: ministers.slug,
      lessonId: lesson.id,
      positionSeconds: lesson.media?.durationSeconds ?? 0,
      completedAt,
      updatedAt: completedAt,
    };
  });

  const firstMediaLesson = mediaLessons[0];
  const secondMediaLesson = mediaLessons[1];
  const completedAt = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString();
  const mediaProgress: LessonProgress[] = [
    {
      userId: memberId,
      courseId: media.slug,
      lessonId: firstMediaLesson.id,
      positionSeconds: firstMediaLesson.media?.durationSeconds ?? 0,
      completedAt,
      updatedAt: completedAt,
    },
    {
      userId: memberId,
      courseId: media.slug,
      lessonId: secondMediaLesson.id,
      positionSeconds: 15,
      completedAt: null,
      updatedAt: completedAt,
    },
  ];

  const enrollments: Enrollment[] = [
    {
      id: 'enr_demo_ministers',
      userId: staffId,
      courseId: ministers.slug,
      enrolledAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 9).toISOString(),
      conditionsAcceptedAt: null,
    },
    {
      id: 'enr_demo_media',
      userId: memberId,
      courseId: media.slug,
      enrolledAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4).toISOString(),
      conditionsAcceptedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    },
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
    progress: demoEnabled ? [...staffProgress, ...mediaProgress] : [],
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
  if (await exists(getDbPath())) return;
  if (!seedPromise) {
    seedPromise = (async () => {
      // Re-check after acquiring the promise: another request may have seeded.
      if (await exists(getDbPath())) return;
      await writeDb(buildSeed());
    })();
  }
  await seedPromise;
}

export async function readDb(): Promise<Database> {
  await ensureSeeded();
  const raw = await fs.readFile(getDbPath(), 'utf8');
  return JSON.parse(raw) as Database;
}

/**
 * Serialised read-modify-write. The callback receives a private copy of the
 * database; if it throws, nothing is written.
 */
export function mutateDb<T>(mutator: (db: Database) => T | Promise<T>): Promise<T> {
  const run = writeQueue.then(async () => {
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
