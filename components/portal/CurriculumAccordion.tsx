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
import { formatLessonDuration, getAllLessons, isModuleExamUnlocked } from '@/lib/courses';

interface ModuleExamUiStatus {
  attemptId: string | null;
  attemptStatus: 'in_progress' | 'submitted' | 'expired' | null;
  score: number | null;
  passed: boolean;
  creditedByCertificate: boolean;
  attemptCount: number;
  lockedUntil: string | null;
}

interface Props {
  course: Course;
  completedLessonIds: string[];
  moduleExamStatuses?: Record<string, ModuleExamUiStatus>;
  activeLessonId?: string;
  enrolled: boolean;
  compact?: boolean;
  showHeader?: boolean;
  className?: string;
}

export function CurriculumAccordion({
  course,
  completedLessonIds,
  moduleExamStatuses = {},
  activeLessonId,
  enrolled,
  compact = false,
  showHeader = true,
  className = '',
}: Props) {
  const allLessons = getAllLessons(course);
  const completedSet = new Set(completedLessonIds);
  const passedModuleExamIds = Object.entries(moduleExamStatuses)
    .filter(([, status]) => status.passed)
    .map(([moduleId]) => moduleId);

  // Compute sequential lock status for each lesson, including module exam gates.
  const isUnlockedMap: Record<string, boolean> = {};
  let earlierModulesComplete = true;
  let earlierModuleExamsPassed = true;
  course.modules.forEach((module) => {
    let previousLessonComplete = true;
    const moduleUnlocked = earlierModulesComplete && earlierModuleExamsPassed;
    module.lessons.forEach((lesson) => {
      isUnlockedMap[lesson.id] = moduleUnlocked && previousLessonComplete;
      if (!completedSet.has(lesson.id)) previousLessonComplete = false;
    });
    if (!module.lessons.every((lesson) => completedSet.has(lesson.id))) {
      earlierModulesComplete = false;
    }
    if (module.exam && !passedModuleExamIds.includes(module.id)) {
      earlierModuleExamsPassed = false;
    }
  });

  // Determine initial open module state
  // Default open: module containing activeLessonId, or the first module with an incomplete unlocked lesson
  const initialOpenModules: Record<string, boolean> = {};
  let openedFirstActiveOrIncomplete = false;
  course.modules.forEach((mod, idx) => {
    const hasActive = mod.lessons.some((l) => l.id === activeLessonId);
    const hasIncompleteUnlocked = mod.lessons.some((l) => !completedSet.has(l.id) && isUnlockedMap[l.id]);
    const hasPendingExam = Boolean(
      mod.exam &&
      mod.lessons.every((lesson) => completedSet.has(lesson.id)) &&
      !moduleExamStatuses[mod.id]?.passed &&
      isModuleExamUnlocked(course, mod.id, completedLessonIds, passedModuleExamIds)
    );

    if (hasActive || hasPendingExam) {
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
  const remainingModuleExams = course.modules.filter(
    (module) => module.exam && !moduleExamStatuses[module.id]?.passed
  ).length;
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
                {remainingForExam === 0 && remainingModuleExams === 0
                  ? 'Final Exam unlocked!'
                  : remainingForExam > 0
                    ? `${remainingForExam} more lesson${remainingForExam === 1 ? '' : 's'} to unlock Final Exam`
                    : `${remainingModuleExams} module exam${remainingModuleExams === 1 ? '' : 's'} to unlock Final Exam`}
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
          const examStatus = moduleExamStatuses[module.id];
          const isModuleExamReady = Boolean(
            module.exam &&
            isModuleExamUnlocked(course, module.id, completedLessonIds, passedModuleExamIds)
          );
          const isLockedOut = Boolean(
            examStatus?.lockedUntil && Date.parse(examStatus.lockedUntil) > Date.now()
          );
          const isOpen = Boolean(openMap[module.id]);

          return (
            <div
              key={module.id}
              id={`module-${module.id}`}
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
                  {module.summary && (
                    <p className="px-2.5 py-2 text-[11px] leading-relaxed text-cream-400">
                      {module.summary}
                    </p>
                  )}
                  {module.lessons.map((lesson) => {
                    const isComplete = completedSet.has(lesson.id);
                    const isUnlocked = enrolled && Boolean(isUnlockedMap[lesson.id]);
                    const isActive = lesson.id === activeLessonId;

                    // If not enrolled or locked, disabled style matching screenshot
                    if (!enrolled || !isUnlocked) {
                      return (
                        <div
                          key={lesson.id}
                          className="flex items-start justify-between gap-3 rounded-lg px-2.5 py-2 text-xs opacity-50 cursor-not-allowed select-none bg-surface/20"
                          title="Complete previous lesson to unlock this topic"
                        >
                          <div className="flex min-w-0 items-start gap-2.5">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-cream-700/50 bg-canvas text-cream-600">
                              <Lock className="h-2.5 w-2.5" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-cream-400 text-[12px]">{lesson.title}</span>
                              {lesson.summary && (
                                <span className="mt-0.5 block text-[10px] leading-relaxed text-cream-600">
                                  {lesson.summary}
                                </span>
                              )}
                            </span>
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
                        className={`flex items-start justify-between gap-3 rounded-lg px-2.5 py-2 text-xs transition-colors ${
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
                          <span className="min-w-0">
                            <span className="block text-[12px]">{lesson.title}</span>
                            {lesson.summary && (
                              <span className="mt-0.5 block text-[10px] font-normal leading-relaxed text-cream-500">
                                {lesson.summary}
                              </span>
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-[9px] text-cream-500">
                            {formatLessonDuration(lesson)}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                  {module.exam && enrolled && (
                    <div className="mx-1 my-2 rounded-lg border border-line bg-surface/80 p-3">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="mono-label !text-[8px]">Module exam</p>
                          <p className="mt-1 text-[12px] font-medium text-cream-100">
                            {module.title}
                          </p>
                          <p className="mt-1 text-[10px] text-cream-500">
                            {module.exam.questionCount} questions · {module.exam.durationMinutes} min · {module.exam.passMark}% to pass
                          </p>
                          {examStatus?.passed ? (
                            <p className="mt-1 text-[10px] text-emerald-400">
                              {examStatus.creditedByCertificate ? 'Satisfied by your certificate' : `Passed${examStatus.score !== null ? ` · ${examStatus.score}%` : ''}`}
                            </p>
                          ) : !isModComplete ? (
                            <p className="mt-1 text-[10px] text-cream-500">Complete this module to unlock its exam.</p>
                          ) : !isModuleExamReady ? (
                            <p className="mt-1 text-[10px] text-cream-500">Pass earlier module exams to unlock this exam.</p>
                          ) : isLockedOut ? (
                            <p className="mt-1 text-[10px] leading-relaxed text-gold-300">
                              Locked until {new Date(examStatus!.lockedUntil!).toLocaleString('en-GB', { timeZone: 'Africa/Lagos', dateStyle: 'medium', timeStyle: 'short' })}. Review this module before retrying.
                            </p>
                          ) : null}
                        </div>
                        {examStatus?.passed && examStatus.attemptId ? (
                          <Link
                            href={`/portal/courses/${course.slug}/exam/result/${examStatus.attemptId}`}
                            className="btn btn-secondary btn-sm shrink-0"
                          >
                            View result
                          </Link>
                        ) : !examStatus?.passed && isModComplete && isModuleExamReady && !isLockedOut ? (
                          <Link
                            href={`/portal/courses/${course.slug}/exam?moduleId=${module.id}`}
                            className="btn btn-primary btn-sm shrink-0"
                          >
                            {examStatus?.attemptStatus === 'in_progress' ? 'Resume exam' : examStatus?.attemptCount ? 'Retake exam' : 'Start exam'}
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
