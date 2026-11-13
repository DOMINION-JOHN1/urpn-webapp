import { NextResponse } from 'next/server';
import { isSupabaseStateConfigured, mutateDb, newId } from '@/lib/server/db';
import { hashPassword } from '@/lib/server/password';
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
  toPublicUser,
} from '@/lib/server/auth';
import { clientKey, rateLimit } from '@/lib/server/rate-limit';
import type { StoredUser } from '@/lib/server/types';

export const dynamic = 'force-dynamic';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (
    process.env.VERCEL === '1' &&
    (!isSupabaseStateConfigured() || !process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32)
  ) {
    return NextResponse.json(
      {
        error:
          'Account creation is not available yet. The site administrator needs to finish the secure account setup.',
      },
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

  if (!EMAIL_PATTERN.test(email) || email.length > 160) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (password.length < 8 || password.length > 200) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters.' },
      { status: 400 }
    );
  }

  const limit = rateLimit(clientKey(request, 'register', email), 5, 30 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait a little and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const passwordHash = await hashPassword(password);

    const result = await mutateDb((db) => {
      if (db.users.some((candidate) => candidate.email.toLowerCase() === email)) {
        return { ok: false as const, error: 'An account with that email already exists.' };
      }

      const user: StoredUser = {
        id: newId('usr'),
        name: '',
        email,
        phone: '',
        passwordHash,
        // Public registration is for the open workforce pathway only. Staff
        // worker-portal accounts are provisioned by the office.
        role: 'workforce',
        createdAt: new Date().toISOString(),
      };
      db.users.push(user);
      return { ok: true as const, user };
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    const response = NextResponse.json({ user: toPublicUser(result.user) }, { status: 201 });
    response.cookies.set(
      SESSION_COOKIE,
      createSessionToken(result.user.id),
      sessionCookieOptions
    );
    return response;
  } catch (error) {
    console.error('[auth/register] Account creation failed.', error);
    return NextResponse.json(
      { error: 'We could not save your account right now. Please try again shortly.' },
      { status: 503 }
    );
  }
}
