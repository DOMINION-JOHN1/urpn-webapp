import Link from 'next/link';
import { ArrowUpRight, Award, BookOpen, Timer } from 'lucide-react';
import type { DashboardCourse } from '@/lib/server/learning';
import { EnrollButton } from './EnrollButton';

function statusFor(course: DashboardCourse): {
  label: string;
  className: string;
} {
  if (course.certificate) {
    return {
      label: 'Certified',
      className: 'border-gold-400/30 bg-gold-400/10 text-gold-300',
    };
  }
  if (course.attempt && course.attempt.status !== 'in_progress') {
    return {
      label: 'Attempt used',
      className: 'border-line bg-canvas text-cream-500',
    };
  }
  if (course.attempt?.status === 'in_progress') {
    return {
      label: 'Exam open',
      className: 'border-gold-400/30 bg-gold-400/10 text-gold-300',
    };
  }
  if (course.percent === 100) {
    return {
      label: 'Exam ready',
      className: 'border-gold-400/30 bg-gold-400/10 text-gold-300',
    };
  }
  if (course.enrolled) {
    return {
      label: 'In progress',
      className: 'border-line bg-canvas text-cream-300',
    };
  }
  return {
    label: 'Not started',
    className: 'border-line bg-canvas text-cream-500',
  };
}

export function TrackCard({ course }: { course: DashboardCourse }) {
  const status = statusFor(course);
  const inspectionHref = `/portal/courses/${course.course.slug}`;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="mono-label !text-[9px]">{course.course.code}</span>
        <span
          className={`rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <h3 className="mt-5 text-[19px] font-semibold leading-tight tracking-[-0.02em] text-cream-50">
        {course.course.shortTitle}
      </h3>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-cream-400">
        {course.course.tagline}
      </p>

      <div className="mt-5">
        <div className="flex items-center justify-between text-[10.5px] text-cream-500">
          <span className="font-mono uppercase tracking-[0.1em]">Progress</span>
          <span>{course.percent}%</span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-canvas">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${course.percent}%` }}
          />
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-line-soft pt-4 text-[11.5px]">
        <div className="flex items-center gap-1.5 text-cream-400">
          <BookOpen className="h-3.5 w-3.5 text-cream-600" aria-hidden="true" />
          <span>
            {course.completedCount}/{course.totalLessons} lessons
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-cream-400">
          <Timer className="h-3.5 w-3.5 text-cream-600" aria-hidden="true" />
          <span>{course.course.exam.durationMinutes} min exam</span>
        </div>
      </dl>

      <div className="mt-auto pt-5">
        {course.certificate ? (
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/portal/certificates/${course.certificate.code}`}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-gold-300 hover:text-gold-200"
            >
              <Award className="h-3.5 w-3.5" aria-hidden="true" />
              View certificate
            </Link>
            <Link
              href={inspectionHref}
              className="text-[12px] text-cream-500 transition-colors hover:text-cream-50"
            >
              Review
            </Link>
          </div>
        ) : course.enrolled ? (
          course.attempt ? (
            <Link
              href={
                course.attempt.status === 'in_progress'
                  ? `/portal/courses/${course.course.slug}/exam`
                  : `/portal/courses/${course.course.slug}/exam/result/${course.attempt.id}`
              }
              className="btn btn-secondary btn-sm w-full"
            >
              {course.attempt.status === 'in_progress' ? 'Resume exam' : 'View result'}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          ) : (
            <Link href={inspectionHref} className="btn btn-secondary btn-sm">
              {course.percent === 100 ? 'Go to exam' : 'Continue'}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )
        ) : (
          <EnrollButton
            courseId={course.course.slug}
            courseSlug={course.course.slug}
            label="Start course"
            className="btn btn-primary btn-sm w-full"
          />
        )}
      </div>
    </article>
  );
}
