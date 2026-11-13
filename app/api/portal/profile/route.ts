import { NextResponse } from 'next/server';
import { getSessionUser, toPublicUser } from '@/lib/server/auth';
import { mutateDb } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

const BIRTHDAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export async function PATCH(request: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ error: 'Please sign in to update your profile.' }, { status: 401 });
  }

  let body: { name?: string; birthday?: string; address?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name = (body.name ?? '').trim().replace(/\s+/g, ' ');
  const birthday = (body.birthday ?? '').trim();
  const address = (body.address ?? '').trim().replace(/\s+/g, ' ');

  if (name.length < 2 || name.length > 100) {
    return NextResponse.json({ error: 'Enter your full name (2–100 characters).' }, { status: 400 });
  }
  if (!BIRTHDAY_PATTERN.test(birthday)) {
    return NextResponse.json({ error: 'Enter your birthday.' }, { status: 400 });
  }
  const date = new Date(`${birthday}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== birthday || date > new Date()) {
    return NextResponse.json({ error: 'Enter a valid birthday.' }, { status: 400 });
  }
  if (address.length < 5 || address.length > 300) {
    return NextResponse.json({ error: 'Enter your address (5–300 characters).' }, { status: 400 });
  }

  try {
    const updatedUser = await mutateDb((db) => {
      const user = db.users.find((entry) => entry.id === sessionUser.id);
      if (!user) return null;
      user.name = name;
      user.birthday = birthday;
      user.address = address;
      return toPublicUser(user);
    });

    if (!updatedUser) return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('[profile] Update failed.', error);
    return NextResponse.json({ error: 'We could not save your profile. Please try again.' }, { status: 503 });
  }
}
