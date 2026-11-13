import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Check,
  Circle,
  Clock3,
  Headphones,
  Lock,
  MonitorPlay,
  Timer,
} from 'lucide-react';
import { requireUser } from '@/lib/server/auth';
import { getCourseOverview } from '@/lib/server/learning';
import {
  formatLessonDuration,
  getCourse,
  getLessonCount,
  lessonKindLabel,
  WORKFORCE_DEPARTMENTS,
} from '@/lib/courses';
import { EnrollButton } from '@/components/portal/EnrollButton';
import { DepartmentConditionsAcceptance } from '@/components/portal/DepartmentConditionsAcceptance';
import { CurriculumAccordion } from '@/components/portal/CurriculumAccordion';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const course = getCourse(params.slug);
  return { title: course ? course.title : 'Training track' };
}

function LessonIcon({ kind }: { kind: 'video' | 'audio' | 'reading' }) {
  if (kind === 'video') return <MonitorPlay className="h-4 w-4" aria-hidden="true" />;
  if (kind === 'audio') return <Headphones className="h-4 w-4" aria-hidden="true" />;
  return <BookOpen className="h-4 w-4" aria-hidden="true" />;
}

export default async function CourseOverviewPage({
  params,
}: {
  params: { slug: string };
}) {
  const user = await requireUser();
  const course = getCourse(params.slug);
  if (!course) {
    const isWorkforceDepartment = WORKFORCE_DEPARTMENTS.some(
      (department) => department.slug === params.slug
    );
    if (isWorkforceDepartment && user.role === 'workforce') {
      redirect('/portal/courses/workforce-training');
    }
    notFound();
  }

  const overview = await getCourseOverview(user.id, course);
  const total = getLessonCount(course);
  const completed = new Set(overview.completedLessonIds);
  const nextId = overview.nextLesson?.id ?? null;
  const attempt = overview.attempt;
  const certificate = overview.certificate;
  const examAvailable = overview.enrolled && overview.percent === 100;

  const examCard = certificate ? (
    <div className="rounded-2xl border border-gold-500/25 bg-gold-500/[0.05] p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400/10 text-gold-300">
        <Award className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="mono-label mt-4 !text-gold-300">Certified</p>
      <p className="mt-2 text-[15px] font-medium text-cream-50">You passed this track.</p>
      <p className="mt-1 font-mono text-[10.5px] text-cream-400">
        {certificate.code} · {certificate.score}%
      </p>
      <Link
        href={`/portal/certificates/${certificate.code}`}
        className="btn btn-primary btn-sm mt-4 w-full"
      >
        View certificate
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  ) : attempt && attempt.status === 'in_progress' ? (
    <div className="rounded-2xl border border-gold-400/30 bg-surface p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400/10 text-gold-300">
        <Timer className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="mono-label mt-4 !text-gold-300">Exam in progress</p>
      <p className="mt-2 text-[15px] font-medium text-cream-50">Your timer is running.</p>
      <p className="mt-1 text-[11.5px] leading-relaxed text-cream-400">
        Return before it expires. Leaving the tab will close the attempt.
      </p>
      <Link
        href={`/portal/courses/${course.slug}/exam`}
        className="btn btn-primary btn-sm mt-4 w-full"
      >
        Resume exam
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  ) : attempt ? (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-cream-400">
        <Lock className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="mono-label mt-4">Attempt used</p>
      <p className="mt-2 text-[15px] font-medium text-cream-50">
        {attempt.passed ? 'Passed' : `Score: ${attempt.score ?? 0}%`}
      </p>
      <p className="mt-1 text-[11.5px] leading-relaxed text-cream-400">
        Only one attempt is allowed per track. Contact the training desk if you believe there is
        an error.
      </p>
      <Link
        href={`/portal/courses/${course.slug}/exam/result/${attempt.id}`}
        className="btn btn-secondary btn-sm mt-4 w-full"
      >
        View result
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  ) : examAvailable ? (
    <div className="rounded-2xl border border-gold-500/25 bg-gold-500/[0.05] p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400/10 text-gold-300">
        <Timer className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="mono-label mt-4 !text-gold-300">Unlocked</p>
      <p className="mt-2 text-[15px] font-medium text-cream-50">The final exam is ready.</p>
      <p className="mt-1 text-[11.5px] leading-relaxed text-cream-400">
        {course.exam.questionCount} questions · {course.exam.durationMinutes} minutes · one
        attempt · {course.exam.passMark}% to pass.
      </p>
      <Link
        href={`/portal/courses/${course.slug}/exam`}
        className="btn btn-primary btn-sm mt-4 w-full"
      >
        Review rules &amp; start
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  ) : (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-cream-500">
        <Lock className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="mono-label mt-4">Final exam</p>
      <p className="mt-2 text-[15px] font-medium text-cream-50">
        {overview.enrolled
          ? `${total - overview.completedCount} lesson${total - overview.completedCount === 1 ? '' : 's'} to unlock`
          : 'Start the track to unlock'}
      </p>
      <p className="mt-1 text-[11.5px] leading-relaxed text-cream-400">
        {course.exam.questionCount} questions · {course.exam.durationMinutes} minutes ·{' '}
        {course.exam.passMark}% to pass · one attempt.
      </p>
      <div className="mt-4 space-y-2 border-t border-line-soft pt-4 text-[11px] text-cream-500">
        <p className="flex items-center justify-between">
          <span>Questions</span>
          <span className="text-cream-300">{course.exam.questionCount}</span>
        </p>
        <p className="flex items-center justify-between">
          <span>Time limit</span>
          <span className="text-cream-300">{course.exam.durationMinutes} min</span>
        </p>
        <p className="flex items-center justify-between">
          <span>Attempts</span>
          <span className="text-cream-300">1</span>
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <Link
        href={course.track === 'workforce' ? '/workforce' : '/portal/courses'}
        className="inline-flex items-center gap-1.5 text-[11.5px] text-cream-500 transition-colors hover:text-cream-50"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        {course.track === 'workforce' ? 'Workforce departments' : 'All leadership tracks'}
      </Link>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="mono-label">{course.code}</span>
        {overview.enrolled ? (
          <span className="rounded-full border border-line bg-canvas px-2.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.1em] text-cream-400">
            {certificate
              ? 'Certified'
              : attempt
                ? attempt.status === 'in_progress'
                  ? 'Exam open'
                  : 'Attempt used'
                : overview.percent === 100
                  ? 'Exam ready'
                  : 'In progress'}
          </span>
        ) : (
          <span className="rounded-full border border-line bg-canvas px-2.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.1em] text-cream-500">
            Not started
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-[32px] font-semibold leading-[1.08] tracking-[-0.04em] text-cream-50 sm:text-[40px]">
            {course.title}
          </h1>
          <p className="mt-3 text-[13.5px] leading-[1.75] text-cream-400">{course.description}</p>
        </div>
        {overview.enrolled && !certificate && overview.nextLesson && (
          <Link
            href={`/portal/courses/${course.slug}/lessons/${overview.nextLesson.id}`}
            className="btn btn-primary shrink-0"
          >
            {overview.completedCount > 0 ? 'Continue track' : 'Begin first lesson'}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-line-soft py-3.5 text-[11px] text-cream-500">
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
          {course.weeks} weeks
        </span>
        <span className="inline-flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          {total} lessons
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Timer className="h-3.5 w-3.5" aria-hidden="true" />
          {course.exam.durationMinutes} min exam
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Award className="h-3.5 w-3.5" aria-hidden="true" />
          {course.exam.passMark}% pass mark
        </span>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-cream-600">
          {course.audience}
        </span>
      </div>

      {course.conditions.length > 0 && (
        <div className="mt-6">
          <DepartmentConditionsAcceptance
            courseSlug={course.slug}
            courseTitle={course.shortTitle}
            conditions={course.conditions}
            enrolled={overview.enrolled}
            conditionsAcceptedAt={overview.conditionsAcceptedAt}
          />
        </div>
      )}

      {!overview.enrolled && course.conditions.length === 0 && (
        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-accent/20 bg-accent/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[14px] font-medium text-cream-50">Start this track.</p>
            <p className="mt-1 text-[12px] leading-relaxed text-cream-400">
              Enrolling unlocks every lesson and saves your progress as you go.
            </p>
          </div>
          <EnrollButton
            courseId={course.slug}
            courseSlug={course.slug}
            label="Start this track"
            className="btn btn-primary shrink-0"
          />
        </div>
      )}

      <div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Curriculum accordion matching Image 1 (library pane) */}
        <div className="min-w-0">
          <CurriculumAccordion
            course={course}
            completedLessonIds={overview.completedLessonIds}
            enrolled={overview.enrolled}
            showHeader
          />
        </div>

        <aside className="min-w-0 space-y-3 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <p className="mono-label">Your progress</p>
              <span className="font-mono text-[10px] text-cream-300">{overview.percent}%</span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${overview.percent}%` }}
              />
            </div>
            <p className="mt-3 text-[11px] text-cream-500">
              {overview.completedCount} of {total} lessons complete
            </p>
            <dl className="mt-4 space-y-2 border-t border-line-soft pt-4 text-[11px]">
              <div className="flex items-center justify-between">
                <dt className="text-cream-500">Enrollment</dt>
                <dd className="text-cream-300">
                  {overview.enrolled ? 'Active' : 'Not started'}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-cream-500">Final exam</dt>
                <dd className="text-cream-300">
                  {certificate
                    ? 'Passed'
                    : attempt
                      ? attempt.status === 'in_progress'
                        ? 'In progress'
                        : 'Used'
                      : examAvailable
                        ? 'Unlocked'
                        : 'Locked'}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-cream-500">Certificate</dt>
                <dd className="text-cream-300">{certificate ? 'Issued' : 'Pending'}</dd>
              </div>
            </dl>
          </div>

          {examCard}

          <div className="rounded-2xl border border-line bg-canvas/40 p-5">
            <p className="mono-label">What you will gain</p>
            <ul className="mt-3 space-y-2.5">
              {course.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-2 text-[11.5px] leading-relaxed text-cream-400">
                  <Circle className="mt-1 h-1.5 w-1.5 shrink-0 fill-accent text-accent" aria-hidden="true" />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
