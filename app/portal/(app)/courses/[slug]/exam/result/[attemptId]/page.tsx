import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Lock,
  RotateCcw,
  X,
  XCircle,
} from 'lucide-react';
import { requireUser } from '@/lib/server/auth';
import { getAttemptForUser } from '@/lib/server/learning';
import { getExamDefinition } from '@/lib/exam-bank';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Exam result',
};

const REASON_COPY: Record<string, string> = {
  tab_left: 'This attempt was closed automatically because you left the exam tab.',
  time_expired: 'The timer ran out before you submitted, so the exam closed automatically.',
  submitted: 'You submitted this attempt before the timer expired.',
};

function formatDate(value: string) {
  return new Date(value).toLocaleString('en-GB', {
    timeZone: 'Africa/Lagos',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function ExamResultPage({
  params,
}: {
  params: { slug: string; attemptId: string };
}) {
  const user = await requireUser();
  const result = await getAttemptForUser(user.id, params.attemptId);
  if (!result) notFound();
  const { attempt, course, certificate, correct, total } = result;

  if (course.slug !== params.slug) notFound();
  if (attempt.status === 'in_progress') {
    redirect(`/portal/courses/${course.slug}/exam`);
  }

  const score = attempt.score ?? 0;
  const passed = Boolean(attempt.passed && certificate);
  const unanswered = attempt.questionIds.filter(
    (id) => typeof attempt.answers?.[id] !== 'number'
  ).length;

  const questions = getExamDefinition(course.slug).questions.filter((question) =>
    attempt.questionIds.includes(question.id)
  );

  return (
    <div>
      <Link
        href={`/portal/courses/${course.slug}`}
        className="inline-flex items-center gap-1.5 text-[11.5px] text-cream-500 transition-colors hover:text-cream-50"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        {course.shortTitle}
      </Link>

      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface">
        <div
          className={`h-px w-full ${
            passed
              ? 'bg-gradient-to-r from-gold-500/70 via-gold-500/20 to-transparent'
              : 'bg-gradient-to-r from-red-500/50 via-red-500/10 to-transparent'
          }`}
        />
        <div className="flex flex-col gap-8 p-5 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div
              className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(${passed ? '#D8B56F' : '#F87171'} ${score}%, #232527 0)`,
              }}
              role="img"
              aria-label={`Score ${score} percent`}
            >
              <div className="flex h-[86px] w-[86px] flex-col items-center justify-center rounded-full bg-surface">
                <span className="text-2xl font-semibold tracking-[-0.03em] text-cream-50">
                  {score}%
                </span>
                <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-cream-500">
                  {passed ? 'Passed' : 'Score'}
                </span>
              </div>
            </div>

            <div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] ${
                  passed
                    ? 'border-gold-400/30 bg-gold-400/10 text-gold-300'
                    : 'border-red-900/60 bg-red-950/40 text-red-200'
                }`}
              >
                {passed ? (
                  <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <XCircle className="h-3 w-3" aria-hidden="true" />
                )}
                {passed ? 'Passed' : 'Not passed'}
              </span>
              <h1 className="mt-3 text-[27px] font-semibold leading-[1.12] tracking-[-0.04em] text-cream-50 sm:text-[34px]">
                {passed ? 'You passed.' : 'Not this time.'}
              </h1>
              <p className="mt-2 max-w-md text-[12.5px] leading-relaxed text-cream-400">
                {passed
                  ? `You have completed the ${course.title} and met the ${course.exam.passMark}% pass mark.`
                  : `The pass mark for ${course.title} is ${course.exam.passMark}%. You scored ${score}%.`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 lg:w-64">
            <div className="rounded-lg border border-line bg-canvas/50 p-3">
              <p className="mono-label !text-[8px]">Correct</p>
              <p className="mt-1 text-[16px] font-semibold text-cream-50">
                {correct}
                <span className="text-[11px] font-normal text-cream-600">/{total}</span>
              </p>
            </div>
            <div className="rounded-lg border border-line bg-canvas/50 p-3">
              <p className="mono-label !text-[8px]">Blank</p>
              <p className="mt-1 text-[16px] font-semibold text-cream-50">{unanswered}</p>
            </div>
            <div className="rounded-lg border border-line bg-canvas/50 p-3">
              <p className="mono-label !text-[8px]">Attempt</p>
              <p className="mt-1 text-[16px] font-semibold text-cream-50">1/1</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-line-soft px-5 py-3.5 text-[11px] text-cream-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            Completed {attempt.submittedAt ? formatDate(attempt.submittedAt) : '—'}
          </span>
          <span>{attempt.reason ? REASON_COPY[attempt.reason] : ''}</span>
        </div>
      </div>

      {passed && certificate ? (
        <div className="mt-5 flex flex-col gap-5 rounded-2xl border border-gold-500/25 bg-gold-500/[0.05] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-gold-300">
              <Award className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[15px] font-medium text-cream-50">Your certificate is ready.</p>
              <p className="mt-1 font-mono text-[10.5px] text-cream-400">
                {certificate.code} · issued {formatDate(certificate.issuedAt)}
              </p>
            </div>
          </div>
          <Link
            href={`/portal/certificates/${certificate.code}`}
            className="btn btn-primary shrink-0"
          >
            Open certificate
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-5 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-canvas text-cream-500">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[15px] font-medium text-cream-50">This attempt has been used.</p>
              <p className="mt-1 max-w-lg text-[12px] leading-relaxed text-cream-400">
                Each track allows one attempt. If you believe there was a technical problem,
                contact the URPN training desk with your attempt reference.
              </p>
              <p className="mt-2 font-mono text-[9.5px] text-cream-600">
                Attempt reference: {attempt.id}
              </p>
            </div>
          </div>
          <Link href="/portal/courses" className="btn btn-secondary shrink-0">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            My training
          </Link>
        </div>
      )}

      <details className="group mt-6 rounded-2xl border border-line bg-surface">
        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4">
          <div>
            <p className="mono-label">Review</p>
            <p className="mt-1 text-[13px] text-cream-200">
              See every question, your answer, and the explanation.
            </p>
          </div>
          <ChevronDown
            className="h-4 w-4 text-cream-500 transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <ol className="divide-y divide-line-soft border-t border-line-soft">
          {questions.map((question, index) => {
            const given = attempt.answers?.[question.id];
            const isCorrect = given === question.answer;
            return (
              <li key={question.id} className="px-5 py-5">
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-[10px] ${
                      isCorrect
                        ? 'border-gold-400/30 bg-gold-400/10 text-gold-300'
                        : 'border-red-900/50 bg-red-950/30 text-red-300'
                    }`}
                  >
                    {isCorrect ? (
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium leading-relaxed text-cream-50">
                      {index + 1}. {question.prompt}
                    </p>
                    <div className="mt-3 space-y-1.5">
                      {question.options.map((option, optionIndex) => {
                        const isAnswer = optionIndex === question.answer;
                        const isGiven = optionIndex === given;
                        return (
                          <p
                            key={option}
                            className={`rounded-lg border px-3 py-2 text-[11.5px] leading-relaxed ${
                              isAnswer
                                ? 'border-gold-500/30 bg-gold-500/[0.05] text-cream-200'
                                : isGiven
                                  ? 'border-red-900/50 bg-red-950/20 text-red-200'
                                  : 'border-line-soft text-cream-500'
                            }`}
                          >
                            <span className="mr-2 font-mono text-[9px] text-cream-600">
                              {String.fromCharCode(65 + optionIndex)}
                            </span>
                            {option}
                            {isAnswer && (
                              <span className="ml-2 font-mono text-[8.5px] uppercase tracking-[0.1em] text-gold-300">
                                Correct
                              </span>
                            )}
                            {isGiven && !isAnswer && (
                              <span className="ml-2 font-mono text-[8.5px] uppercase tracking-[0.1em] text-red-300">
                                Your answer
                              </span>
                            )}
                          </p>
                        );
                      })}
                    </div>
                    <p className="mt-3 border-l border-line pl-3 text-[11px] leading-relaxed text-cream-400">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </details>
    </div>
  );
}
