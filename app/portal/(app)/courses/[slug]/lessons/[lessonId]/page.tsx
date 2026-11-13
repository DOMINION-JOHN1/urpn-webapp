import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronDown,
  Headphones,
  Lock,
  MonitorPlay,
} from 'lucide-react';
import { requireUser } from '@/lib/server/auth';
import {
  getCourseOverview,
  getFirstUnlockedIncompleteLesson,
  isLessonUnlocked,
} from '@/lib/server/learning';
import {
  formatLessonDuration,
  getAllLessons,
  getCourse,
  getLesson,
  lessonKindLabel,
} from '@/lib/courses';
import { LessonPlayer } from '@/components/portal/LessonPlayer';
import { CurriculumAccordion } from '@/components/portal/CurriculumAccordion';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string; lessonId: string };
}): Promise<Metadata> {
  const course = getCourse(params.slug);
  const found = course ? getLesson(course, params.lessonId) : undefined;
  return { title: found ? found.lesson.title : 'Lesson' };
}

function KindIcon({ kind }: { kind: 'video' | 'audio' | 'reading' }) {
  if (kind === 'video') return <MonitorPlay className="h-3.5 w-3.5" aria-hidden="true" />;
  if (kind === 'audio') return <Headphones className="h-3.5 w-3.5" aria-hidden="true" />;
  return <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />;
}

export default async function LessonPage({
  params,
}: {
  params: { slug: string; lessonId: string };
}) {
  const user = await requireUser();
  const course = getCourse(params.slug);
  if (!course) notFound();
  const found = getLesson(course, params.lessonId);
  if (!found) notFound();

  const overview = await getCourseOverview(user.id, course);
  if (!overview.enrolled) redirect(`/portal/courses/${course.slug}`);

  // Strict sequential lock enforcement:
  // If this lesson is locked, redirect to first incomplete unlocked lesson
  if (!isLessonUnlocked(course, overview.completedLessonIds, params.lessonId)) {
    const firstUnlocked = getFirstUnlockedIncompleteLesson(course, overview.completedLessonIds);
    redirect(
      firstUnlocked
        ? `/portal/courses/${course.slug}/lessons/${firstUnlocked.id}`
        : `/portal/courses/${course.slug}`
    );
  }

  const { lesson, module, index } = found;
  const lessons = getAllLessons(course);
  const previous = index > 0 ? lessons[index - 1] : null;
  const next = index < lessons.length - 1 ? lessons[index + 1] : null;
  const completed = new Set(overview.completedLessonIds);
  const isComplete = completed.has(lesson.id);

  const lessonHref = (id: string) => `/portal/courses/${course.slug}/lessons/${id}`;

  return (
    <div>
      {/* Top breadcrumbs */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-cream-500">
        <Link
          href={`/portal/courses/${course.slug}`}
          className="inline-flex items-center gap-1.5 transition-colors hover:text-cream-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {course.shortTitle}
        </Link>
        <span className="text-line-strong">/</span>
        <span>
          Lesson {index + 1} of {lessons.length}
        </span>
        <span className="text-line-strong">/</span>
        <span className="text-cream-400">{module.title}</span>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {/* Breadcrumb pill matching Image 2 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-accent font-medium">
              {module.title} / {lesson.title}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.1em] text-cream-400">
              <KindIcon kind={lesson.kind} />
              {lesson.resourceUrl && lesson.estimatedMinutes === 0
                ? 'Course material'
                : lessonKindLabel(lesson.kind)}
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-cream-600">
              {formatLessonDuration(lesson)}
            </span>
            {isComplete && (
              <span className="inline-flex items-center gap-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-emerald-400">
                <Check className="h-3 w-3" />
                Completed
              </span>
            )}
          </div>
          <h1 className="mt-2.5 max-w-3xl text-[26px] font-semibold leading-[1.15] tracking-[-0.035em] text-cream-50 sm:text-[32px]">
            {lesson.title}
          </h1>
          {lesson.summary && (
            <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-cream-400">
              {lesson.summary}
            </p>
          )}
        </div>

        <div className="shrink-0 text-left sm:text-right">
          <p className="mono-label !text-[8.5px]">Track progress</p>
          <p className="mt-1 font-mono text-[13px] text-cream-200">
            {overview.completedCount} / {lessons.length} completed
          </p>
          <div className="mt-2 h-1 w-32 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${overview.percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mobile curriculum */}
      <details className="group mt-5 rounded-xl border border-line bg-surface lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[12px] font-medium text-cream-200">
          <span>
            Course library <span className="text-cream-500">({overview.completedCount}/{lessons.length} complete)</span>
          </span>
          <ChevronDown
            className="h-4 w-4 text-cream-500 transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="max-h-96 overflow-y-auto border-t border-line-soft p-3">
          <CurriculumAccordion
            course={course}
            completedLessonIds={overview.completedLessonIds}
            activeLessonId={lesson.id}
            enrolled={overview.enrolled}
            compact
            showHeader={false}
          />
        </div>
      </details>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_310px]">
        <div className="min-w-0">
          <LessonPlayer
            courseSlug={course.slug}
            courseTitle={course.shortTitle}
            lesson={{
              id: lesson.id,
              title: lesson.title,
              kind: lesson.kind,
              summary: lesson.summary,
              estimatedMinutes: lesson.estimatedMinutes,
              resourceUrl: lesson.resourceUrl,
              resourceLabel: lesson.resourceLabel,
              mediaUrl: lesson.media
                ? `/api/portal/stream/${lesson.id}?course=${course.slug}`
                : undefined,
              mime: lesson.media?.mime,
              durationSeconds: lesson.media?.durationSeconds,
              poster: lesson.media?.poster,
              body: lesson.body,
              keyPoints: lesson.keyPoints,
              scripture: lesson.scripture,
            }}
            initialPosition={overview.positions[lesson.id] ?? 0}
            initiallyCompleted={isComplete}
            initialNotes={overview.notes[lesson.id]}
            allNotes={overview.notes}
            allLessons={lessons.map((l) => ({ id: l.id, title: l.title }))}
            initialCompletedCount={overview.completedCount}
            totalLessons={lessons.length}
            nextHref={next ? lessonHref(next.id) : undefined}
            nextTitle={next?.title}
            previousHref={previous ? lessonHref(previous.id) : undefined}
            previousTitle={previous?.title}
            userEmail={user.email}
          />
        </div>

        {/* Sidebar matching Image 1 & Image 2 */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between border-b border-line-soft pb-3">
              <Link
                href={`/portal/courses/${course.slug}`}
                className="text-[12px] font-semibold text-cream-50 hover:text-accent transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="h-3 w-3" />
                {course.shortTitle}
              </Link>
              <span className="font-mono text-[9.5px] text-cream-400">
                {overview.completedCount}/{lessons.length}
              </span>
            </div>

            <div className="mt-3 max-h-[calc(100dvh-200px)] overflow-y-auto pr-1">
              <CurriculumAccordion
                course={course}
                completedLessonIds={overview.completedLessonIds}
                activeLessonId={lesson.id}
                enrolled={overview.enrolled}
                compact
                showHeader={false}
              />
            </div>

            <Link
              href={`/portal/courses/${course.slug}`}
              className="mt-3 block border-t border-line-soft pt-3 text-[11px] text-cream-500 transition-colors hover:text-cream-50 text-center font-mono"
            >
              Course overview &amp; exam →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
