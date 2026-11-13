import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/server/auth';
import { recordLessonProgress } from '@/lib/server/learning';
import { canAccessCourse, getCourse } from '@/lib/courses';

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
    notes?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (!body.courseId || !body.lessonId) {
    return NextResponse.json({ error: 'Missing course or lesson.' }, { status: 400 });
  }
  const course = getCourse(body.courseId);
  if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
  if (!canAccessCourse(user.role, course)) {
    return NextResponse.json({ error: 'This course is not available in your portal.' }, { status: 403 });
  }

  const result = await recordLessonProgress({
    userId: user.id,
    courseSlug: body.courseId,
    lessonId: body.lessonId,
    positionSeconds: Number(body.positionSeconds ?? 0),
    markComplete: Boolean(body.markComplete),
    notes: typeof body.notes === 'string' ? body.notes : undefined,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
