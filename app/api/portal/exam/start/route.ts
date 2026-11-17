import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/server/auth';
import { startExamAttempt } from '@/lib/server/learning';
import { canAccessCourse, getCourse } from '@/lib/courses';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 });
  }
  let body: { courseId?: string; moduleId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const course = getCourse(body.courseId ?? '');
  if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
  if (!canAccessCourse(user.role, course)) {
    return NextResponse.json({ error: 'This course is not available in your portal.' }, { status: 403 });
  }

  const result = await startExamAttempt(user.id, course.slug, body.moduleId);
  if (!result.ok) {
    const status = result.error === 'not_found' ? 404 : result.error === 'locked' ? 429 : 409;
    return NextResponse.json(
      {
        error:
          result.error === 'not_enrolled'
            ? 'Start the course before taking the exam.'
            : result.error === 'incomplete'
              ? body.moduleId
                ? 'Finish this module and all earlier module exams to unlock this exam.'
                : 'Finish every lesson and all module exams to unlock the final exam.'
              : result.error === 'locked'
                ? 'This module exam is locked for 24 hours after three failed attempts.'
                : result.error === 'already_passed'
                  ? 'You have already passed this module exam.'
              : result.error === 'already_attempted'
                ? 'You have already used your one attempt for this exam.'
                : 'Course not found.',
        code: result.error,
        missingLessons: result.missingLessons,
        lockedUntil: result.lockedUntil,
        attempt: result.attempt,
      },
      { status }
    );
  }

  return NextResponse.json({
    attempt: result.attempt,
    questions: result.questions,
    remainingSeconds: result.remainingSeconds,
    resumed: result.resumed,
  });
}
