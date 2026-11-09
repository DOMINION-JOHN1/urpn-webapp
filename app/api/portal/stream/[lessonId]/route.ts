import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/server/auth';
import { isEnrolled } from '@/lib/server/learning';
import { getCourse, getLesson } from '@/lib/courses';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MEDIA_ROOT = path.join(process.cwd(), 'media');

function privateHeaders(contentType: string, contentLength?: number): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': contentType,
    'Cache-Control': 'private, no-store, no-cache, must-revalidate, max-age=0',
    Pragma: 'no-cache',
    'Content-Disposition': 'inline',
    'X-Content-Type-Options': 'nosniff',
    'Accept-Ranges': 'bytes',
    'Cross-Origin-Resource-Policy': 'same-origin',
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
  const courseSlug = url.searchParams.get('course') ?? '';
  const course = getCourse(courseSlug);
  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }

  const found = getLesson(course, params.lessonId);
  if (!found || !found.lesson.media) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  if (!(await isEnrolled(user.id, course.slug))) {
    return NextResponse.json({ error: 'Enrollment required' }, { status: 403 });
  }

  const fileName = path.basename(found.lesson.media.file);
  if (!/^[a-zA-Z0-9._-]+\.(mp4|m4a)$/.test(fileName)) {
    return NextResponse.json({ error: 'Invalid media' }, { status: 400 });
  }

  const filePath = path.join(MEDIA_ROOT, fileName);
  let stat;
  try {
    stat = await fs.stat(filePath);
  } catch {
    return NextResponse.json(
      { error: 'This lesson media has not been uploaded yet.' },
      { status: 404 }
    );
  }

  if (!stat.isFile()) {
    return NextResponse.json({ error: 'Invalid media' }, { status: 400 });
  }

  const range = request.headers.get('range');
  const contentType = found.lesson.media.mime;

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
        ...privateHeaders(contentType, end - start + 1),
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      },
    });
  }

  const stream = createReadStream(filePath);
  return new Response(Readable.toWeb(stream) as unknown as ReadableStream, {
    status: 200,
    headers: privateHeaders(contentType, stat.size),
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
    headers: privateHeaders(found.lesson.media.mime),
  });
}
