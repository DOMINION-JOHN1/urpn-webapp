import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Check, Lock } from 'lucide-react';
import { requireUser } from '@/lib/server/auth';
import { getCourseOverview } from '@/lib/server/learning';
import { getAllLessons, getCourse, getLessonCount } from '@/lib/courses';
import { ExamExperience } from '@/components/portal/ExamExperience';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const course = getCourse(params.slug);
  return { title: course ? `${course.shortTitle} final exam` : 'Final exam' };
}

export default async function ExamPage({ params }: { params: { slug: string } }) {
  const user = await requireUser();
  const course = getCourse(params.slug);
  if (!course) notFound();

  const overview = await getCourseOverview(user.id, course);
  if (!overview.enrolled) redirect(`/portal/courses/${course.slug}`);

  if (overview.certificate) {
    redirect(`/portal/certificates/${overview.certificate.code}`);
  }

  if (overview.attempt && overview.attempt.status !== 'in_progress') {
    redirect(`/portal/courses/${course.slug}/exam/result/${overview.attempt.id}`);
  }

  const complete = overview.percent === 100 && overview.completedCount === getLessonCount(course);

  if (!complete) {
    const remaining = getAllLessons(course).filter(
      (lesson) => !overview.completedLessonIds.includes(lesson.id)
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

        <div className="mx-auto mt-10 max-w-lg text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface text-cream-500">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mono-label mt-5">Final exam locked</p>
          <h1 className="mt-3 text-[28px] font-semibold leading-[1.15] tracking-[-0.035em] text-cream-50 sm:text-[34px]">
            Finish the track first.
          </h1>
          <p className="mt-3 text-[13.5px] leading-relaxed text-cream-400">
            The exam opens when every lesson is complete. You have{' '}
            <strong className="text-cream-100">{remaining.length}</strong>{' '}
            {remaining.length === 1 ? 'lesson' : 'lessons'} left in {course.title}.
          </p>

          <div className="mt-7 overflow-hidden rounded-2xl border border-line bg-surface text-left">
            <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
              <p className="mono-label !text-[8.5px]">Remaining lessons</p>
              <span className="font-mono text-[9.5px] text-cream-500">
                {overview.completedCount}/{overview.totalLessons} complete
              </span>
            </div>
            <ul className="divide-y divide-line-soft">
              {remaining.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    href={`/portal/courses/${course.slug}/lessons/${lesson.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-[12.5px] text-cream-300 transition-colors hover:bg-cream-50/[0.025] hover:text-cream-50"
                  >
                    <span className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-cream-600" aria-hidden="true" />
                      {lesson.title}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-cream-600">
                      {lesson.resourceUrl && lesson.estimatedMinutes === 0
                        ? 'Course material'
                        : lesson.kind}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link href={`/portal/courses/${course.slug}`} className="btn btn-primary mt-6">
            Back to the course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ExamExperience
      course={{
        slug: course.slug,
        title: course.title,
        shortTitle: course.shortTitle,
        code: course.code,
        questionCount: course.exam.questionCount,
        durationMinutes: course.exam.durationMinutes,
        passMark: course.exam.passMark,
        lessonCount: overview.totalLessons,
      }}
      hasOpenAttempt={overview.attempt?.status === 'in_progress'}
    />
  );
}
