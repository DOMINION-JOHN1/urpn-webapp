import fs from 'node:fs/promises';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { getDataDir } from './db';

const BUCKET = 'worker-avatars';

export type ProfilePhotoMime = 'image/jpeg' | 'image/png' | 'image/webp';

const EXTENSION: Record<ProfilePhotoMime, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function storageConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const apiKey = secretKey || serviceRoleKey;
  if (!url || !apiKey) return null;
  return { url, apiKey, bearerToken: secretKey ? null : serviceRoleKey };
}

function headers(apiKey: string, bearerToken: string | null, contentType?: string): HeadersInit {
  return {
    apikey: apiKey,
    ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
    ...(contentType ? { 'Content-Type': contentType } : {}),
  };
}

function encodedPath(value: string): string {
  return value.split('/').map(encodeURIComponent).join('/');
}

function validatePath(userId: string, avatarPath: string): string[] {
  const parts = avatarPath.split('/');
  if (
    parts.length !== 2 ||
    parts[0] !== userId ||
    !/^avatar-[a-z0-9-]+\.(jpg|png|webp)$/.test(parts[1])
  ) {
    throw new Error('Invalid profile photo path.');
  }
  return parts;
}

function localPath(userId: string, avatarPath: string): string {
  const parts = validatePath(userId, avatarPath);
  return path.join(getDataDir(), 'avatars', ...parts);
}

export async function saveProfilePhoto(
  userId: string,
  bytes: Uint8Array,
  mimeType: ProfilePhotoMime
): Promise<string> {
  const filename = `avatar-${Date.now()}-${randomBytes(4).toString('hex')}.${EXTENSION[mimeType]}`;
  const avatarPath = `${userId}/${filename}`;
  const config = storageConfig();

  if (config) {
    const response = await fetch(
      `${config.url}/storage/v1/object/${BUCKET}/${encodedPath(avatarPath)}`,
      {
        method: 'POST',
        headers: {
          ...headers(config.apiKey, config.bearerToken, mimeType),
          'x-upsert': 'true',
          'cache-control': '3600',
        },
        body: Buffer.from(bytes),
        cache: 'no-store',
      }
    );
    if (!response.ok) throw new Error(`Profile photo upload failed (${response.status}).`);
    return avatarPath;
  }

  const destination = localPath(userId, avatarPath);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, bytes);
  return avatarPath;
}

export async function readProfilePhoto(
  userId: string,
  avatarPath: string
): Promise<Uint8Array | null> {
  validatePath(userId, avatarPath);
  const config = storageConfig();
  if (config) {
    const response = await fetch(
      `${config.url}/storage/v1/object/${BUCKET}/${encodedPath(avatarPath)}`,
      {
        headers: headers(config.apiKey, config.bearerToken),
        cache: 'no-store',
      }
    );
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Profile photo read failed (${response.status}).`);
    return new Uint8Array(await response.arrayBuffer());
  }

  try {
    return new Uint8Array(await fs.readFile(localPath(userId, avatarPath)));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
}

export async function deleteProfilePhoto(userId: string, avatarPath: string): Promise<void> {
  validatePath(userId, avatarPath);
  const config = storageConfig();
  if (config) {
    await fetch(`${config.url}/storage/v1/object/${BUCKET}`, {
      method: 'DELETE',
      headers: headers(config.apiKey, config.bearerToken, 'application/json'),
      body: JSON.stringify({ prefixes: [avatarPath] }),
      cache: 'no-store',
    });
    return;
  }

  await fs.rm(localPath(userId, avatarPath), { force: true });
}
