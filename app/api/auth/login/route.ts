import { NextResponse } from 'next/server';
import { readDb } from '@/lib/server/db';
import { verifyPassword } from '@/lib/server/password';
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
  toPublicUser,
} from '@/lib/server/auth';
import { clientKey, rateLimit } from '@/lib/server/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const email = (body.email ?? '').trim().toLowerCase();
  const password = body.password ?? '';

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const limit = rateLimit(clientKey(request, 'login', email));
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait a few minutes and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  const db = await readDb();
  const user = db.users.find((candidate) => candidate.email.toLowerCase() === email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });
  }

  const response = NextResponse.json({ user: toPublicUser(user) });
  response.cookies.set(SESSION_COOKIE, createSessionToken(user.id), sessionCookieOptions);
  return response;
}
