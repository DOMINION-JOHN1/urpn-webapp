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
  MonitorPlay,
} from 'lucide-react';
import { requireUser } from '@/lib/server/auth';
import { getCourseOverview } from '@/lib/server/learning';
import {
  formatLessonDuration,
  getAllLessons,
  getCourse,
  getLesson,
  lessonKindLabel,
} from '@/lib/courses';
import { LessonPlayer } from '@/components/portal/LessonPlayer';

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

  const { lesson, module, index } = found;
  const lessons = getAllLessons(course);
  const previous = index > 0 ? lessons[index - 1] : null;
  const next = index < lessons.length - 1 ? lessons[index + 1] : null;
  const completed = new Set(overview.completedLessonIds);
  const isComplete = completed.has(lesson.id);

  const lessonHref = (id: string) => `/portal/courses/${course.slug}/lessons/${id}`;

  const curriculum = (
    <div className="space-y-4">
      {course.modules.map((moduleItem) => (
        <div key={moduleItem.id}>
          <p className="mono-label !text-[8.5px]">
            Week {moduleItem.week} · {moduleItem.title}
          </p>
          <ul className="mt-2 space-y-0.5">
            {moduleItem.lessons.map((item) => {
              const active = item.id === lesson.id;
              const done = completed.has(item.id);
              return (
                <li key={item.id}>
                  <Link
                    href={lessonHref(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11.5px] transition-colors ${
                      active
                        ? 'bg-cream-50/[0.06] text-cream-50'
                        : done
                          ? 'text-cream-400 hover:bg-cream-50/[0.03] hover:text-cream-50'
                          : 'text-cream-300 hover:bg-cream-50/[0.03] hover:text-cream-50'
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${
                        done
                          ? 'bg-gold-400/10 text-gold-300'
                          : active
                            ? 'bg-canvas text-accent'
                            : 'text-cream-600'
                      }`}
                    >
                      {done ? <Check className="h-3 w-3" /> : <KindIcon kind={item.kind} />}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{item.title}</span>
                    <span className="font-mono text-[8.5px] text-cream-600">
                      {item.kind === 'reading' ? `${item.estimatedMinutes}m` : '›'}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <div>
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
        <span>{module.title}</span>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-cream-400">
              <KindIcon kind={lesson.kind} />
              {lessonKindLabel(lesson.kind)}
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-cream-600">
              {formatLessonDuration(lesson)}
            </span>
            {isComplete && (
              <span className="inline-flex items-center gap-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-gold-300">
                <Check className="h-3 w-3" />
                Completed
              </span>
            )}
          </div>
          <h1 className="mt-3 max-w-3xl text-[26px] font-semibold leading-[1.15] tracking-[-0.035em] text-cream-50 sm:text-[32px]">
            {lesson.title}
          </h1>
          <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-cream-400">
            {lesson.summary}
          </p>
        </div>
        <div className="shrink-0 text-left sm:text-right">
          <p className="mono-label !text-[8.5px]">Track progress</p>
          <p className="mt-1 font-mono text-[13px] text-cream-200">
            {overview.completedCount} / {lessons.length} lessons
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
            Course contents <span className="text-cream-500">({lessons.length} lessons)</span>
          </span>
          <ChevronDown
            className="h-4 w-4 text-cream-500 transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="max-h-80 overflow-y-auto border-t border-line-soft p-3">{curriculum}</div>
      </details>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_290px]">
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
            nextHref={next ? lessonHref(next.id) : undefined}
            nextTitle={next?.title}
            previousHref={previous ? lessonHref(previous.id) : undefined}
            previousTitle={previous?.title}
            userEmail={user.email}
          />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-6 rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between border-b border-line-soft pb-3">
              <p className="text-[12px] font-medium text-cream-50">{course.shortTitle}</p>
              <span className="font-mono text-[9.5px] text-cream-500">{overview.percent}%</span>
            </div>
            <div className="mt-3 max-h-[calc(100dvh-220px)] overflow-y-auto pr-1">
              {curriculum}
            </div>
            <Link
              href={`/portal/courses/${course.slug}`}
              className="mt-3 block border-t border-line-soft pt-3 text-[11px] text-cream-500 transition-colors hover:text-cream-50"
            >
              Course overview &amp; exam
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
