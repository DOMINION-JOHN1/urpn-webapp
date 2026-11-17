import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Check, Lock } from 'lucide-react';
import { requireUser } from '@/lib/server/auth';
import { getCourseOverview } from '@/lib/server/learning';
import {
  canAccessCourse,
  getAllLessons,
  getCourse,
  isModuleExamUnlocked,
} from '@/lib/courses';
import { ExamExperience } from '@/components/portal/ExamExperience';
import { getModuleExamDefinition } from '@/lib/module-exam-bank';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const course = getCourse(params.slug);
  return { title: course ? `${course.shortTitle} exam` : 'Exam' };
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('en-GB', {
    timeZone: 'Africa/Lagos',
    dateStyle: 'full',
    timeStyle: 'short',
  });
}

export default async function ExamPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { moduleId?: string };
}) {
  const user = await requireUser();
  const course = getCourse(params.slug);
  if (!course) notFound();
  if (!canAccessCourse(user.role, course)) {
    redirect(user.role === 'workforce' ? '/workforce' : '/portal');
  }

  const overview = await getCourseOverview(user.id, course);
  if (!overview.enrolled) redirect(`/portal/courses/${course.slug}`);

  if (overview.certificate) {
    redirect(`/portal/certificates/${overview.certificate.code}`);
  }

  const moduleId = searchParams?.moduleId;
  if (moduleId) {
    const module = course.modules.find((entry) => entry.id === moduleId);
    if (!module?.exam || !getModuleExamDefinition(moduleId)) notFound();
    const moduleStatus = overview.moduleExamStatuses[moduleId];
    if (moduleStatus?.passed) {
      if (moduleStatus.attemptId) {
        redirect(`/portal/courses/${course.slug}/exam/result/${moduleStatus.attemptId}`);
      }
      redirect(`/portal/courses/${course.slug}`);
    }

    if (moduleStatus?.lockedUntil && Date.parse(moduleStatus.lockedUntil) > Date.now()) {
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
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/[0.06] text-gold-300">
              <Lock className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="mono-label mt-5 !text-gold-300">Module exam locked</p>
            <h1 className="mt-3 text-[28px] font-semibold leading-[1.15] tracking-[-0.035em] text-cream-50 sm:text-[34px]">
              Review {module.title} while you wait.
            </h1>
            <p className="mt-3 text-[13.5px] leading-relaxed text-cream-400">
              After three failed attempts, this exam pauses for 24 hours. Go through the module
              again, then return after {formatDate(moduleStatus.lockedUntil)} to retry with a new
              question set.
            </p>
            <Link
              href={`/portal/courses/${course.slug}#module-${module.id}`}
              className="btn btn-secondary mt-6"
            >
              Review this module
            </Link>
          </div>
        </div>
      );
    }

    const moduleUnlocked = isModuleExamUnlocked(
      course,
      moduleId,
      overview.completedLessonIds,
      overview.passedModuleExamIds
    );
    if (!moduleUnlocked) {
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
            <p className="mono-label mt-5">Module exam locked</p>
            <h1 className="mt-3 text-[28px] font-semibold leading-[1.15] tracking-[-0.035em] text-cream-50 sm:text-[34px]">
              Complete the module first.
            </h1>
            <p className="mt-3 text-[13.5px] leading-relaxed text-cream-400">
              Finish {module.title} and pass any earlier module exams before starting this
              assessment.
            </p>
            <Link
              href={`/portal/courses/${course.slug}#module-${module.id}`}
              className="btn btn-primary mt-6"
            >
              Return to {module.title}
            </Link>
          </div>
        </div>
      );
    }

    return (
      <ExamExperience
        moduleId={module.id}
        examTitle={module.title}
        course={{
          slug: course.slug,
          title: course.title,
          shortTitle: course.shortTitle,
          code: course.code,
          questionCount: module.exam.questionCount,
          durationMinutes: module.exam.durationMinutes,
          passMark: module.exam.passMark,
          lessonCount: module.lessons.length,
        }}
        hasOpenAttempt={moduleStatus?.attemptStatus === 'in_progress'}
      />
    );
  }

  if (overview.attempt && overview.attempt.status !== 'in_progress') {
    redirect(`/portal/courses/${course.slug}/exam/result/${overview.attempt.id}`);
  }

  const complete = overview.examUnlocked;

  if (!complete) {
    const remaining = getAllLessons(course).filter(
      (lesson) => !overview.completedLessonIds.includes(lesson.id)
    );
    const pendingModule = course.modules.find(
      (module) => module.exam && !overview.moduleExamStatuses[module.id]?.passed
    );
    const pendingModuleIndex = pendingModule
      ? course.modules.findIndex((module) => module.id === pendingModule.id)
      : -1;
    const remainingBeforePendingModule = pendingModule
      ? course.modules
          .slice(0, pendingModuleIndex + 1)
          .flatMap((module) => module.lessons)
          .filter((lesson) => !overview.completedLessonIds.includes(lesson.id))
      : remaining;
    const pendingModuleUnlocked = pendingModule
      ? isModuleExamUnlocked(
          course,
          pendingModule.id,
          overview.completedLessonIds,
          overview.passedModuleExamIds
        )
      : false;

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
            {pendingModule
              ? pendingModuleUnlocked
                ? 'Pass the module exam first.'
                : 'Complete the module first.'
              : 'Finish the track first.'}
          </h1>
          <p className="mt-3 text-[13.5px] leading-relaxed text-cream-400">
            {pendingModule ? (
              pendingModuleUnlocked ? (
                <>Pass {pendingModule.title} to unlock the lessons that follow and continue toward the final exam.</>
              ) : (
                <>Complete the remaining lessons in {pendingModule.title}, then pass its module exam to continue.</>
              )
            ) : remaining.length > 0 ? (
              <>The final exam opens when every lesson is complete. You have{' '}
                <strong className="text-cream-100">{remaining.length}</strong>{' '}
                {remaining.length === 1 ? 'lesson' : 'lessons'} left in {course.title}.</>
            ) : (
              <>Pass every required module exam before starting the {course.title} final exam.</>
            )}
          </p>

          {remainingBeforePendingModule.length > 0 && <div className="mt-7 overflow-hidden rounded-2xl border border-line bg-surface text-left">
            <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
              <p className="mono-label !text-[8.5px]">
                {pendingModule ? `${pendingModule.title} lessons` : 'Remaining lessons'}
              </p>
              <span className="font-mono text-[9.5px] text-cream-500">
                {remainingBeforePendingModule.length} left
              </span>
            </div>
            <ul className="divide-y divide-line-soft">
              {remainingBeforePendingModule.map((lesson) => (
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
          </div>}

          {pendingModule && pendingModuleUnlocked && (
            <Link
              href={`/portal/courses/${course.slug}/exam?moduleId=${pendingModule.id}`}
              className="btn btn-secondary mt-6"
            >
              {`Open ${pendingModule.title} exam`}
            </Link>
          )}

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
