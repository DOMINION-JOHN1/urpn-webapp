import { NextResponse } from 'next/server';
import { isSupabaseStateConfigured, readDb } from '@/lib/server/db';
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
  if (
    process.env.VERCEL === '1' &&
    (!isSupabaseStateConfigured() || !process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32)
  ) {
    return NextResponse.json(
      { error: 'The worker portal is not ready yet. Please contact the URPN site administrator.' },
      { status: 503 }
    );
  }

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
  const demoAccount = user?.id === 'usr_demo_grace' || user?.id === 'usr_demo_member';
  if (
    !user ||
    (process.env.NODE_ENV === 'production' && demoAccount) ||
    !(await verifyPassword(password, user.passwordHash))
  ) {
    return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });
  }

  const response = NextResponse.json({ user: toPublicUser(user) });
  response.cookies.set(SESSION_COOKIE, createSessionToken(user.id), sessionCookieOptions);
  return response;
}
