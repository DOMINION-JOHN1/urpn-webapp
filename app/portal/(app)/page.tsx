import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  MonitorPlay,
  Play,
  Smartphone,
  Timer,
} from 'lucide-react';
import { requireUser } from '@/lib/server/auth';
import { getDashboardData } from '@/lib/server/learning';
import { TrackCard } from '@/components/portal/TrackCard';
import { InstallAppButton } from '@/components/InstallAppButton';
import { formatLessonDuration, lessonKindLabel } from '@/lib/courses';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Overview' };

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', {
    timeZone: 'Africa/Lagos',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default async function PortalDashboardPage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);
  const firstName = user.name.split(' ')[0] || user.name;

  const examReady = data.courses.find(
    (course) => course.enrolled && course.percent === 100 && !course.attempt && !course.certificate
  );
  const openAttempt = data.courses.find(
    (course) => course.attempt?.status === 'in_progress'
  );
  const usedAttempt = data.courses.find(
    (course) =>
      course.enrolled &&
      course.attempt &&
      course.attempt.status !== 'in_progress' &&
      !course.certificate
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mono-label text-gold-300">Overview</p>
          <h1 className="mt-2 text-[30px] font-semibold leading-[1.1] tracking-[-0.04em] text-cream-50 sm:text-[36px]">
            Welcome back, {firstName}.
          </h1>
          <p className="mt-2 text-[13.5px] text-cream-400">
            Your formation, progress, and certificates — all in one place.
          </p>
        </div>
        <Link href="/portal/courses" className="btn btn-secondary btn-sm hidden sm:inline-flex">
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          Browse courses
        </Link>
      </div>

      {/* Summary */}
      <div className="mt-8 grid grid-cols-3 divide-x divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="p-4 sm:p-5">
          <p className="mono-label !text-[9px]">Courses</p>
          <p className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-cream-50">
            {data.enrolledCount}
            <span className="ml-1 font-mono text-[11px] font-normal text-cream-600">
              / {data.courses.length}
            </span>
          </p>
          <p className="mt-1 text-[10.5px] text-cream-500">enrolled</p>
        </div>
        <div className="p-4 sm:p-5">
          <p className="mono-label !text-[9px]">Lessons</p>
          <p className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-cream-50">
            {data.lessonsCompleted}
          </p>
          <p className="mt-1 text-[10.5px] text-cream-500">completed</p>
        </div>
        <div className="p-4 sm:p-5">
          <p className="mono-label !text-[9px]">Certificates</p>
          <p className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-cream-50">
            {data.certificates.length}
          </p>
          <p className="mt-1 text-[10.5px] text-cream-500">earned</p>
        </div>
      </div>

      {/* Continue / next action */}
      {data.continueLesson ? (
        <section className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="h-px w-full bg-gradient-to-r from-accent/60 via-accent/10 to-transparent" />
          <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-accent" />
                <p className="mono-label !text-[9px]">Continue where you left off</p>
              </div>
              <h2 className="mt-2.5 text-[20px] font-semibold leading-tight tracking-[-0.025em] text-cream-50 sm:text-[23px]">
                {data.continueLesson.lesson.title}
              </h2>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-cream-400">
                <span>{data.continueLesson.course.shortTitle}</span>
                <span className="text-line-strong">·</span>
                <span>
                  Lesson {data.continueLesson.index + 1} of {data.continueLesson.total}
                </span>
                <span className="text-line-strong">·</span>
                <span className="inline-flex items-center gap-1">
                  {data.continueLesson.lesson.kind === 'reading' ? (
                    <BookOpen className="h-3 w-3" aria-hidden="true" />
                  ) : (
                    <MonitorPlay className="h-3 w-3" aria-hidden="true" />
                  )}
                  {lessonKindLabel(data.continueLesson.lesson.kind)} ·{' '}
                  {formatLessonDuration(data.continueLesson.lesson)}
                </span>
              </p>
            </div>
            <Link
              href={`/portal/courses/${data.continueLesson.course.slug}/lessons/${data.continueLesson.lesson.id}`}
              className="btn btn-primary shrink-0"
            >
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              Resume lesson
            </Link>
          </div>
        </section>
      ) : openAttempt ? (
        <section className="mt-5 rounded-2xl border border-gold-400/30 bg-surface p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mono-label flex items-center gap-2 !text-gold-300">
                <Timer className="h-3.5 w-3.5" aria-hidden="true" />
                Exam in progress
              </p>
              <h2 className="mt-2 text-[20px] font-semibold text-cream-50">
                {openAttempt.course.shortTitle} — final exam is still open
              </h2>
              <p className="mt-1 text-[12.5px] text-cream-400">
                Return before the timer runs out. Leaving the tab closes the attempt.
              </p>
            </div>
            <Link
              href={`/portal/courses/${openAttempt.course.slug}/exam`}
              className="btn btn-primary shrink-0"
            >
              Resume exam
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      ) : examReady ? (
        <section className="mt-5 rounded-2xl border border-gold-500/25 bg-gold-500/[0.05] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mono-label !text-gold-300">Exam ready</p>
              <h2 className="mt-2 text-[20px] font-semibold text-cream-50">
                You have finished every lesson in {examReady.course.shortTitle}.
              </h2>
              <p className="mt-1 text-[12.5px] text-cream-400">
                {examReady.course.exam.questionCount} questions ·{' '}
                {examReady.course.exam.durationMinutes} minutes · one attempt.
              </p>
            </div>
            <Link
              href={`/portal/courses/${examReady.course.slug}/exam`}
              className="btn btn-primary shrink-0"
            >
              Start final exam
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      ) : usedAttempt && usedAttempt.attempt ? (
        <section className="mt-5 rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mono-label">Attempt used</p>
              <h2 className="mt-2 text-[20px] font-semibold text-cream-50">
                {usedAttempt.course.shortTitle} — exam attempt completed.
              </h2>
              <p className="mt-1 max-w-xl text-[12.5px] leading-relaxed text-cream-400">
                You scored {usedAttempt.attempt.score ?? 0}%. Each track allows one attempt.
                {usedAttempt.attempt.reason === 'tab_left'
                  ? ' This attempt closed because the exam tab was left.'
                  : ''}
              </p>
            </div>
            <Link
              href={`/portal/courses/${usedAttempt.course.slug}/exam/result/${usedAttempt.attempt.id}`}
              className="btn btn-secondary shrink-0"
            >
              View attempt result
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      ) : data.certificates.length > 0 ? (
        <section className="mt-5 rounded-2xl border border-gold-500/25 bg-surface p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400/10 text-gold-300">
                <Award className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-[18px] font-semibold text-cream-50">Your certificate is ready.</h2>
                <p className="mt-1 text-[12.5px] text-cream-400">
                  {data.certificates[0].course?.title} · issued{' '}
                  {formatDate(data.certificates[0].certificate.issuedAt)}
                </p>
              </div>
            </div>
            <Link
              href={`/portal/certificates/${data.certificates[0].certificate.code}`}
              className="btn btn-secondary shrink-0"
            >
              View certificate
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      ) : (
        <section className="mt-5 rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mono-label">Begin here</p>
              <h2 className="mt-2 text-[20px] font-semibold text-cream-50">
                {user.role === 'workforce'
                  ? 'Join a Ministry Department.'
                  : 'Start with In-House Ministers Training.'}
              </h2>
              <p className="mt-1 text-[12.5px] text-cream-400">
                {user.role === 'workforce'
                  ? 'Review department conditions, listen to the audio modules, and earn your certificate.'
                  : 'Carrying the mantle, guarding the altar, and ministering with character.'}
              </p>
            </div>
            <Link
              href={user.role === 'workforce' ? '/workforce' : '/portal/courses/ministers'}
              className="btn btn-primary shrink-0"
            >
              {user.role === 'workforce' ? 'Explore departments' : 'Open Ministers Training'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {/* Tracks */}
      <section className="mt-9">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="mono-label">Your learning</p>
            <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.025em] text-cream-50">
              {user.role === 'workforce' ? 'Your courses' : 'Formation path'}
            </h2>
          </div>
          <Link
            href="/portal/courses"
            className="text-[12px] text-cream-400 transition-colors hover:text-cream-50 sm:hidden"
          >
            View all
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.courses.map((course) => (
            <TrackCard key={course.course.slug} course={course} />
          ))}
        </div>
      </section>

      {/* Certificates */}
      {data.certificates.length > 0 && (
        <section className="mt-9">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="mono-label">Certificates</p>
              <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.025em] text-cream-50">
                Earned
              </h2>
            </div>
            <Link
              href="/portal/certificates"
              className="text-[12px] text-cream-400 transition-colors hover:text-cream-50"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {data.certificates.map(({ certificate, course }) => (
              <Link
                key={certificate.code}
                href={`/portal/certificates/${certificate.code}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface px-4 py-3.5 transition-colors hover:border-line-strong"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gold-400/25 bg-gold-400/[0.06] text-gold-300">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-cream-50">
                      {course?.title ?? 'URPN training'}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-cream-500">
                      {certificate.code} · {formatDate(certificate.issuedAt)}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-cream-500" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Install */}
      <section className="mt-9 flex flex-col gap-5 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-canvas text-accent">
            <Smartphone className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-[14.5px] font-medium text-cream-50">Take the portal with you.</h2>
            <p className="mt-1 max-w-md text-[12px] leading-relaxed text-cream-400">
              Install URPN on your phone for a full-screen app experience. Lessons and progress
              stay in sync.
            </p>
          </div>
        </div>
        <InstallAppButton variant="secondary" label="Install app" className="shrink-0" />
      </section>
    </div>
  );
}
