import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/server/auth';
import { startExamAttempt } from '@/lib/server/learning';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 });
  }

  let body: { courseId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const result = await startExamAttempt(user.id, body.courseId ?? '');
  if (!result.ok) {
    const status = result.error === 'not_found' ? 404 : 409;
    return NextResponse.json(
      {
        error:
          result.error === 'not_enrolled'
            ? 'Start the course before taking the exam.'
            : result.error === 'incomplete'
              ? 'Finish every lesson to unlock the final exam.'
              : result.error === 'already_attempted'
                ? 'You have already used your one attempt for this exam.'
                : 'Course not found.',
        code: result.error,
        missingLessons: result.missingLessons,
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
