import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/server/auth';
import { mutateDb } from '@/lib/server/db';
import {
  deleteProfilePhoto,
  readProfilePhoto,
  saveProfilePhoto,
  type ProfilePhotoMime,
} from '@/lib/server/profile-photo';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 4 * 1024 * 1024;

function detectMime(bytes: Uint8Array): ProfilePhotoMime | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'image/png';
  }
  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
    String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
  ) {
    return 'image/webp';
  }
  return null;
}

export async function GET() {
  const user = await getSessionUser();
  if (!user?.avatarPath || !user.avatarMimeType) {
    return new Response(null, { status: 404, headers: { 'Cache-Control': 'private, no-store' } });
  }

  try {
    const photo = await readProfilePhoto(user.id, user.avatarPath);
    if (!photo) return new Response(null, { status: 404 });
    return new Response(Buffer.from(photo), {
      headers: {
        'Content-Type': user.avatarMimeType,
        'Content-Length': String(photo.byteLength),
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; sandbox",
      },
    });
  } catch (error) {
    console.error('[profile/avatar] Read failed.', error);
    return new Response(null, { status: 503, headers: { 'Cache-Control': 'private, no-store' } });
  }
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Please sign in to upload a profile photo.' }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Choose a valid image file.' }, { status: 400 });
  }

  const file = form.get('avatar');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'Choose a profile photo to upload.' }, { status: 400 });
  }
  if (file.size < 1 || file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'The photo must be smaller than 4 MB.' }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mimeType = detectMime(bytes);
  if (!mimeType || (file.type && mimeType !== file.type)) {
    return NextResponse.json({ error: 'Use a JPG, PNG, or WebP image.' }, { status: 400 });
  }

  let avatarPath: string;
  try {
    avatarPath = await saveProfilePhoto(user.id, bytes, mimeType);
    const previousPath = user.avatarPath;
    const updated = await mutateDb((db) => {
      const entry = db.users.find((candidate) => candidate.id === user.id);
      if (!entry) return false;
      entry.avatarPath = avatarPath;
      entry.avatarMimeType = mimeType;
      return true;
    });

    if (!updated) {
      await deleteProfilePhoto(user.id, avatarPath);
      return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
    }
    if (previousPath && previousPath !== avatarPath) {
      await deleteProfilePhoto(user.id, previousPath).catch(() => undefined);
    }
    return NextResponse.json({ avatarPath });
  } catch (error) {
    console.error('[profile/avatar] Upload failed.', error);
    return NextResponse.json({ error: 'We could not upload that photo. Please try again.' }, { status: 503 });
  }
}
