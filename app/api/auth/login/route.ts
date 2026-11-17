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
      { error: 'The portal is not ready yet. Please contact the URPN site administrator.' },
      { status: 503 }
    );
  }

  let body: { email?: string; password?: string; portalType?: 'worker' | 'workforce' };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const emailOrIdentifier = (body.email ?? '').trim().toLowerCase();
  const password = body.password ?? '';

  if (!emailOrIdentifier || !password) {
    return NextResponse.json({ error: 'Email or username and password are required.' }, { status: 400 });
  }

  const limit = rateLimit(clientKey(request, 'login', emailOrIdentifier));
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait a few minutes and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  const db = await readDb();
  const user = db.users.find((candidate) => {
    const candEmail = candidate.email.toLowerCase();
    return (
      candEmail === emailOrIdentifier ||
      candEmail === `${emailOrIdentifier}@urpn.org` ||
      (emailOrIdentifier === 'uniquerevivalprayernetwork' &&
        (candidate.id === 'usr_admin' || candidate.role === 'admin' || candEmail.includes('uniquerevivalprayernetwork')))
    );
  });
  const demoAccount = user?.id === 'usr_demo_grace' || user?.id === 'usr_demo_member';
  if (
    !user ||
    (process.env.NODE_ENV === 'production' && demoAccount) ||
    !(await verifyPassword(password, user.passwordHash))
  ) {
    return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });
  }

  const portalType = body.portalType === 'workforce' ? 'workforce' : 'worker';

  if (user.role !== 'admin' && (portalType === 'workforce') !== (user.role === 'workforce')) {
    return NextResponse.json(
      { error: 'This account belongs to the other portal. Use the correct sign-in page.' },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ user: toPublicUser(user) });
  response.cookies.set(SESSION_COOKIE, createSessionToken(user.id), sessionCookieOptions);
  return response;
}
