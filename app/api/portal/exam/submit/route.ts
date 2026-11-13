import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/server/auth';
import { getAttemptForUser, submitExamAttempt } from '@/lib/server/learning';
import { canAccessCourse } from '@/lib/courses';
import type { SubmitReason } from '@/lib/server/types';

export const dynamic = 'force-dynamic';

const REASONS: SubmitReason[] = ['submitted', 'tab_left', 'time_expired'];

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 });
  }

  let body: {
    attemptId?: string;
    answers?: Record<string, number>;
    reason?: string;
  };
  try {
    const raw = await request.text();
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (!body.attemptId) {
    return NextResponse.json({ error: 'Missing attempt.' }, { status: 400 });
  }

  const attempt = await getAttemptForUser(user.id, body.attemptId);
  if (!attempt) return NextResponse.json({ error: 'Attempt not found.' }, { status: 404 });
  if (!canAccessCourse(user.role, attempt.course)) {
    return NextResponse.json({ error: 'This course is not available in your portal.' }, { status: 403 });
  }

  const reason = REASONS.includes(body.reason as SubmitReason)
    ? (body.reason as SubmitReason)
    : 'submitted';

  const result = await submitExamAttempt({
    userId: user.id,
    attemptId: body.attemptId,
    answers: body.answers ?? {},
    reason,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? 'Could not submit.' }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    attempt: result.attempt,
    certificate: result.certificate,
    correct: result.correct,
    total: result.total,
    unanswered: result.unanswered,
    alreadySubmitted: result.alreadySubmitted ?? false,
  });
}
