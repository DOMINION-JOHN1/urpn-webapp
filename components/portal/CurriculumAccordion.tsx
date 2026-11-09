'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  ChevronDown,
  Headphones,
  Lock,
  Play,
  BookOpen,
  MonitorPlay,
} from 'lucide-react';
import type { Course, Lesson } from '@/lib/courses';
import { formatLessonDuration, getAllLessons } from '@/lib/courses';

interface Props {
  course: Course;
  completedLessonIds: string[];
  activeLessonId?: string;
  enrolled: boolean;
  compact?: boolean;
  showHeader?: boolean;
  className?: string;
}

export function CurriculumAccordion({
  course,
  completedLessonIds,
  activeLessonId,
  enrolled,
  compact = false,
  showHeader = true,
  className = '',
}: Props) {
  const allLessons = getAllLessons(course);
  const completedSet = new Set(completedLessonIds);

  // Compute sequential lock status for each lesson
  // Lesson 0 is unlocked. Lesson i is unlocked only if all preceding lessons are completed!
  const isUnlockedMap: Record<string, boolean> = {};
  allLessons.forEach((lesson, index) => {
    if (index === 0) {
      isUnlockedMap[lesson.id] = true;
    } else {
      const prevLesson = allLessons[index - 1];
      isUnlockedMap[lesson.id] = completedSet.has(prevLesson.id) && Boolean(isUnlockedMap[prevLesson.id]);
    }
  });

  // Determine initial open module state
  // Default open: module containing activeLessonId, or the first module with an incomplete unlocked lesson
  const initialOpenModules: Record<string, boolean> = {};
  let openedFirstActiveOrIncomplete = false;
  course.modules.forEach((mod, idx) => {
    const hasActive = mod.lessons.some((l) => l.id === activeLessonId);
    const hasIncompleteUnlocked = mod.lessons.some((l) => !completedSet.has(l.id) && isUnlockedMap[l.id]);

    if (hasActive) {
      initialOpenModules[mod.id] = true;
      openedFirstActiveOrIncomplete = true;
    } else if (!openedFirstActiveOrIncomplete && (hasIncompleteUnlocked || idx === 0)) {
      initialOpenModules[mod.id] = true;
      openedFirstActiveOrIncomplete = true;
    } else {
      initialOpenModules[mod.id] = false;
    }
  });

  const [openMap, setOpenMap] = useState<Record<string, boolean>>(initialOpenModules);

  const toggleModule = (id: string) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = allLessons.filter((l) => completedSet.has(l.id)).length;
  const remainingForExam = Math.max(0, allLessons.length - completedCount);
  const percent = allLessons.length ? Math.round((completedCount / allLessons.length) * 100) : 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* ----------------- Top Progress Bar matching Image 1 */}
      {showHeader && enrolled && (
        <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-cream-50">
                {completedCount} / {allLessons.length} completed
              </span>
              <span className="font-mono text-[10px] text-cream-500">({percent}%)</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-gold-400">
              <Lock className="h-3 w-3" />
              <span>
                {remainingForExam === 0
                  ? 'Final Exam unlocked!'
                  : `${remainingForExam} more to unlock Final Exam`}
              </span>
            </div>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {/* ----------------- Library Header */}
      <div className="flex items-center justify-between px-1">
        <span className="mono-label !text-[9.5px]">Library</span>
        <span className="font-mono text-[10.5px] text-cream-400 font-medium">
          {completedCount}/{allLessons.length}
        </span>
      </div>

      {/* ----------------- Modules List */}
      <div className="space-y-2.5">
        {course.modules.map((module, modIndex) => {
          const modCompleted = module.lessons.filter((l) => completedSet.has(l.id)).length;
          const isModComplete = modCompleted === module.lessons.length && module.lessons.length > 0;
          const isModUnlocked = module.lessons.some((l) => isUnlockedMap[l.id]);
          const isOpen = Boolean(openMap[module.id]);

          return (
            <div
              key={module.id}
              className={`overflow-hidden rounded-xl border transition-colors ${
                isOpen ? 'border-line bg-surface' : 'border-line-soft bg-surface/60 hover:bg-surface'
              }`}
            >
              {/* Module Header / Accordion trigger */}
              <button
                type="button"
                onClick={() => toggleModule(module.id)}
                className="flex w-full items-center justify-between px-3.5 py-3 text-left transition-colors hover:bg-cream-50/[0.02]"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-cream-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-gold-400 truncate">
                      <span>MODULE {modIndex + 1} · WEEK {module.week}</span>
                      {!isModUnlocked && enrolled && (
                        <Lock className="h-2.5 w-2.5 text-cream-500 inline" />
                      )}
                    </p>
                    <p className={`text-[12.5px] font-medium truncate ${isModUnlocked || !enrolled ? 'text-cream-100' : 'text-cream-400'}`}>
                      {module.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`font-mono text-[10px] ${
                      isModComplete
                        ? 'text-emerald-400'
                        : isModUnlocked
                          ? 'text-cream-400'
                          : 'text-cream-600'
                    }`}
                  >
                    {modCompleted}/{module.lessons.length}
                  </span>
                  {!isModUnlocked && enrolled && (
                    <Lock className="h-3 w-3 text-cream-600" />
                  )}
                </div>
              </button>

              {/* Module Lessons */}
              {isOpen && (
                <div className="border-t border-line-soft bg-canvas/40 px-2 py-1.5 space-y-1">
                  {module.lessons.map((lesson) => {
                    const isComplete = completedSet.has(lesson.id);
                    const isUnlocked = enrolled && Boolean(isUnlockedMap[lesson.id]);
                    const isActive = lesson.id === activeLessonId;

                    // If not enrolled or locked, disabled style matching screenshot
                    if (!enrolled || !isUnlocked) {
                      return (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs opacity-50 cursor-not-allowed select-none bg-surface/20"
                          title="Complete previous lesson to unlock this topic"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-cream-700/50 bg-canvas text-cream-600">
                              <Lock className="h-2.5 w-2.5" />
                            </span>
                            <span className="truncate text-cream-400 text-[12px]">{lesson.title}</span>
                          </div>
                          <span className="font-mono text-[9px] text-cream-600 shrink-0 flex items-center gap-1">
                            <Lock className="h-2.5 w-2.5" />
                            Locked
                          </span>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={lesson.id}
                        href={`/portal/courses/${course.slug}/lessons/${lesson.id}`}
                        className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors ${
                          isActive
                            ? 'bg-accent/15 text-accent font-medium shadow-sm'
                            : isComplete
                              ? 'text-cream-300 hover:bg-cream-50/[0.04] hover:text-cream-50'
                              : 'text-cream-100 hover:bg-cream-50/[0.04] font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                              isComplete
                                ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                                : isActive
                                  ? 'border border-accent/60 bg-accent/20 text-accent'
                                  : 'border border-cream-500/40 bg-transparent text-cream-400'
                            }`}
                          >
                            {isComplete ? (
                              <Check className="h-3 w-3 stroke-[2.5]" />
                            ) : isActive ? (
                              <Play className="h-2.5 w-2.5 fill-current ml-0.5" />
                            ) : (
                              <span className="h-1.5 w-1.5 rounded-full bg-cream-400/60" />
                            )}
                          </span>
                          <span className="truncate text-[12px]">{lesson.title}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-[9px] text-cream-500">
                            {formatLessonDuration(lesson)}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
