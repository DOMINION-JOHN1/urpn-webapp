import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ensureDataDir, readDb } from './db';
import type { PublicUser, StoredUser } from './types';

export const SESSION_COOKIE = 'urpn_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

interface SessionPayload {
  uid: string;
  exp: number;
  v: 1;
}

function loadSecret(): string {
  if (process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 32) {
    return process.env.AUTH_SECRET;
  }
  if (process.env.AUTH_SECRET) {
    console.warn(
      '[auth] AUTH_SECRET is shorter than 32 characters; falling back to the local secret file. Set a strong secret before deploying.'
    );
  }

  // Local fallback: a secret persisted beside the database. Set AUTH_SECRET in
  // production so sessions survive redeploys and multiple instances.
  const file = path.join(ensureDataDir(), '.auth-secret');
  try {
    const existing = fs.readFileSync(file, 'utf8').trim();
    if (existing.length >= 32) return existing;
  } catch {
    // Fall through and create one.
  }
  const secret = randomBytes(48).toString('hex');
  fs.writeFileSync(file, secret, { mode: 0o600 });
  return secret;
}

let cachedSecret: string | null = null;

function secret(): string {
  if (!cachedSecret) cachedSecret = loadSecret();
  return cachedSecret;
}

function base64url(input: string | Buffer): string {
  return Buffer.from(input).toString('base64url');
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

export function createSessionToken(userId: string): string {
  const payload: SessionPayload = {
    uid: userId,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
    v: 1,
  };
  const encoded = base64url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  const given = Buffer.from(signature);
  const want = Buffer.from(expected);
  if (given.length !== want.length || !timingSafeEqual(given, want)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (payload.v !== 1 || !payload.uid) return null;
    if (typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now()) return null;
    return payload.uid;
  } catch {
    return null;
  }
}

export function toPublicUser(user: StoredUser): PublicUser {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

export async function getSessionUser(): Promise<PublicUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const userId = verifySessionToken(token);
  if (!userId) return null;
  const db = await readDb();
  const user = db.users.find((candidate) => candidate.id === userId);
  return user ? toPublicUser(user) : null;
}

export async function requireUser(): Promise<PublicUser> {
  const user = await getSessionUser();
  if (!user) redirect('/portal/login');
  return user;
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_MAX_AGE,
};
