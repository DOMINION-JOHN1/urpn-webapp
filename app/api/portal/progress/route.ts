import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/server/auth';
import { recordLessonProgress } from '@/lib/server/learning';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 });
  }

  let body: {
    courseId?: string;
    lessonId?: string;
    positionSeconds?: number;
    markComplete?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (!body.courseId || !body.lessonId) {
    return NextResponse.json({ error: 'Missing course or lesson.' }, { status: 400 });
  }

  const result = await recordLessonProgress({
    userId: user.id,
    courseSlug: body.courseId,
    lessonId: body.lessonId,
    positionSeconds: Number(body.positionSeconds ?? 0),
    markComplete: Boolean(body.markComplete),
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
