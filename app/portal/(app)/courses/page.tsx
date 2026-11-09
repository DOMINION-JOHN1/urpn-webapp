import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Award, BookOpen, Timer } from 'lucide-react';
import { requireUser } from '@/lib/server/auth';
import { getDashboardData } from '@/lib/server/learning';
import { EnrollButton } from '@/components/portal/EnrollButton';
import { getCourseDurationLabel, getLessonCount } from '@/lib/courses';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'My training' };

export default async function CoursesPage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);

  return (
    <div>
      <p className="mono-label text-gold-300">My training</p>
      <h1 className="mt-2 text-[30px] font-semibold leading-[1.1] tracking-[-0.04em] text-cream-50 sm:text-[36px]">
        Three tracks. One mandate.
      </h1>
      <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-cream-400">
        Begin where you are. Finish every lesson to unlock the final exam. Each track allows one
        timed attempt and issues a verifiable certificate on passing.
      </p>

      <div className="mt-8 space-y-3">
        {data.courses.map((entry, index) => {
          const { course } = entry;
          const status = entry.certificate
            ? { label: 'Certified', className: 'border-gold-400/30 bg-gold-400/10 text-gold-300' }
            : entry.percent === 100
              ? { label: 'Exam ready', className: 'border-gold-400/30 bg-gold-400/10 text-gold-300' }
              : entry.enrolled
                ? { label: 'In progress', className: 'border-line bg-canvas text-cream-300' }
                : { label: 'Not started', className: 'border-line bg-canvas text-cream-500' };

          return (
            <article
              key={course.slug}
              className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-cream-600">
                      0{index + 1} · {course.code}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.1em] ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <h2 className="mt-3 text-[21px] font-semibold leading-tight tracking-[-0.025em] text-cream-50">
                    {course.title}
                  </h2>
                  <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-cream-400">
                    {course.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-cream-500">
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                      {getLessonCount(course)} lessons · {course.modules.length} modules
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Timer className="h-3.5 w-3.5" aria-hidden="true" />
                      {course.exam.durationMinutes} min exam · {course.exam.passMark}% to pass
                    </span>
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.1em]">
                      {getCourseDurationLabel(course)} · {course.weeks} weeks
                    </span>
                  </div>
                </div>

                <div className="w-full shrink-0 lg:w-64">
                  <div className="flex items-center justify-between text-[10.5px] text-cream-500">
                    <span className="font-mono uppercase tracking-[0.1em]">Progress</span>
                    <span>
                      {entry.completedCount}/{entry.totalLessons}
                    </span>
                  </div>
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-canvas">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${entry.percent}%` }}
                    />
                  </div>

                  <div className="mt-4">
                    {entry.certificate ? (
                      <Link
                        href={`/portal/certificates/${entry.certificate.code}`}
                        className="btn btn-secondary btn-sm w-full"
                      >
                        <Award className="h-3.5 w-3.5" aria-hidden="true" />
                        View certificate
                      </Link>
                    ) : entry.enrolled ? (
                      <Link
                        href={`/portal/courses/${course.slug}`}
                        className="btn btn-primary btn-sm w-full"
                      >
                        {entry.percent === 100 ? 'Go to final exam' : 'Continue track'}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    ) : (
                      <EnrollButton
                        courseId={course.slug}
                        courseSlug={course.slug}
                        label="Start track"
                        className="btn btn-primary btn-sm w-full"
                      />
                    )}

                    {entry.attempt?.status === 'submitted' && !entry.certificate && (
                      <Link
                        href={`/portal/courses/${course.slug}/exam/result/${entry.attempt.id}`}
                        className="mt-2 flex items-center justify-center gap-1 text-[11px] text-cream-500 hover:text-cream-50"
                      >
                        View attempt result
                        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-line bg-canvas/50 p-4">
        <p className="text-[11.5px] leading-relaxed text-cream-500">
          <span className="text-cream-300">A note on the exam:</span> the timer starts when you
          begin, the tab cannot be left without closing the attempt, and only one attempt is
          allowed per track. Make sure you have a quiet 25–35 minutes before you start.
        </p>
      </div>
    </div>
  );
}
