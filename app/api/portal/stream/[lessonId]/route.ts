import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getSessionUser } from '@/lib/server/auth';
import { isEnrolled } from '@/lib/server/learning';
import { canAccessCourse, extractDriveFileId, getCourse, getLesson } from '@/lib/courses';
import { getGoogleAuth } from '@/lib/google/auth';
import { isGoogleConfigured } from '@/lib/config';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MEDIA_ROOT = path.join(process.cwd(), 'media');

function privateHeaders(
  contentType: string,
  contentLength?: number,
  filename?: string,
  asDownload = false
): HeadersInit {
  const disposition = asDownload && filename
    ? `attachment; filename="${filename.replace(/[^a-zA-Z0-9_.-]/g, '_')}"`
    : 'inline';
  const headers: Record<string, string> = {
    'Content-Type': contentType,
    'Cache-Control': asDownload ? 'private, max-age=3600' : 'private, no-store, no-cache, must-revalidate, max-age=0',
    Pragma: 'no-cache',
    'Content-Disposition': disposition,
    'X-Content-Type-Options': 'nosniff',
    'Accept-Ranges': 'bytes',
  };
  if (typeof contentLength === 'number') headers['Content-Length'] = String(contentLength);
  return headers;
}

export async function GET(
  request: Request,
  { params }: { params: { lessonId: string } }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const isDownload = url.searchParams.get('download') === '1';
  const courseSlug = url.searchParams.get('course') ?? '';
  const course = getCourse(courseSlug);
  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }
  if (!canAccessCourse(user.role, course)) {
    return NextResponse.json({ error: 'This course is not available in your portal.' }, { status: 403 });
  }

  const found = getLesson(course, params.lessonId);
  if (!found || !found.lesson.media) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  if (!(await isEnrolled(user.id, course.slug))) {
    return NextResponse.json({ error: 'Enrollment required' }, { status: 403 });
  }

  const media = found.lesson.media;
  const contentType = media.mime || 'audio/mp4';
  const range = request.headers.get('range');
  const safeFilename = `${params.lessonId}.m4a`;

  // 1. Google Drive Audio Streaming & Download
  const driveFileId = media.driveFileId || extractDriveFileId(media.driveUrl || media.file);
  if (driveFileId) {
    try {
      if (isGoogleConfigured()) {
        const auth = getGoogleAuth();
        const drive = google.drive({ version: 'v3', auth });
        const driveStream = await drive.files.get(
          { fileId: driveFileId, alt: 'media', supportsAllDrives: true },
          { responseType: 'stream' }
        );
        return new Response(Readable.toWeb(driveStream.data as Readable) as unknown as ReadableStream, {
          status: 200,
          headers: privateHeaders(contentType, undefined, safeFilename, isDownload),
        });
      }

      // Public sharing link fallback for Google Drive
      const driveFetch = await fetch(
        `https://drive.google.com/uc?export=download&id=${driveFileId}`,
        {
          headers: range ? { Range: range } : undefined,
        }
      );
      if (driveFetch.ok && driveFetch.body) {
        return new Response(driveFetch.body, {
          status: driveFetch.status === 206 ? 206 : 200,
          headers: privateHeaders(
            driveFetch.headers.get('content-type') || contentType,
            Number(driveFetch.headers.get('content-length')) || undefined,
            safeFilename,
            isDownload
          ),
        });
      }
    } catch (driveErr) {
      console.warn('[Stream] Google Drive stream failed, falling back:', driveErr);
    }
  }

  // 2. Direct remote audio URL proxy
  if (media.audioUrl) {
    try {
      const remoteRes = await fetch(media.audioUrl, {
        headers: range ? { Range: range } : undefined,
      });
      if (remoteRes.ok && remoteRes.body) {
        return new Response(remoteRes.body, {
          status: remoteRes.status === 206 ? 206 : 200,
          headers: privateHeaders(
            remoteRes.headers.get('content-type') || contentType,
            Number(remoteRes.headers.get('content-length')) || undefined,
            safeFilename,
            isDownload
          ),
        });
      }
    } catch (urlErr) {
      console.warn('[Stream] Remote audio fetch failed:', urlErr);
    }
  }

  // 3. Local file in media/ (with graceful demo fallback so playback/download never breaks)
  let fileName = media.file ? path.basename(media.file) : '';
  let filePath = fileName ? path.join(MEDIA_ROOT, fileName) : '';
  let stat;

  try {
    if (filePath) stat = await fs.stat(filePath);
  } catch {
    stat = undefined;
  }

  if (!stat || !stat.isFile()) {
    // Demo audio fallback for unuploaded lesson files
    const fallbackNames = ['ministers-word.m4a', 'foundation-altar.m4a', 'pastors-structure.m4a'];
    for (const fb of fallbackNames) {
      const fbPath = path.join(MEDIA_ROOT, fb);
      try {
        const fbStat = await fs.stat(fbPath);
        if (fbStat.isFile()) {
          filePath = fbPath;
          stat = fbStat;
          break;
        }
      } catch {
        continue;
      }
    }
  }

  if (!stat || !stat.isFile()) {
    return NextResponse.json(
      { error: 'This lesson media has not been uploaded yet.' },
      { status: 404 }
    );
  }

  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (!match) {
      return new Response(null, {
        status: 416,
        headers: { 'Content-Range': `bytes */${stat.size}` },
      });
    }
    let start = match[1] ? Number(match[1]) : 0;
    let end = match[2] ? Number(match[2]) : stat.size - 1;
    if (!match[1] && match[2]) {
      start = Math.max(0, stat.size - Number(match[2]));
      end = stat.size - 1;
    }
    if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= stat.size) {
      return new Response(null, {
        status: 416,
        headers: { 'Content-Range': `bytes */${stat.size}` },
      });
    }
    end = Math.min(end, stat.size - 1);
    const stream = createReadStream(filePath, { start, end });
    return new Response(Readable.toWeb(stream) as unknown as ReadableStream, {
      status: 206,
      headers: {
        ...privateHeaders(contentType, end - start + 1, safeFilename, isDownload),
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      },
    });
  }

  const stream = createReadStream(filePath);
  return new Response(Readable.toWeb(stream) as unknown as ReadableStream, {
    status: 200,
    headers: privateHeaders(contentType, stat.size, safeFilename, isDownload),
  });
}

export async function HEAD(
  _request: Request,
  { params }: { params: { lessonId: string } }
) {
  const user = await getSessionUser();
  if (!user) return new Response(null, { status: 401 });
  const courseSlug = new URL(_request.url).searchParams.get('course') ?? '';
  const course = getCourse(courseSlug);
  if (!course) return new Response(null, { status: 404 });
  const found = getLesson(course, params.lessonId);
  if (!found?.lesson.media) return new Response(null, { status: 404 });
  if (!(await isEnrolled(user.id, course.slug))) return new Response(null, { status: 403 });
  return new Response(null, {
    status: 200,
    headers: privateHeaders(found.lesson.media.mime || 'audio/mp4'),
  });
}
