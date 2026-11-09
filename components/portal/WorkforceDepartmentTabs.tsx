'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  Camera,
  Check,
  CheckCircle2,
  Cpu,
  Headphones,
  HeartHandshake,
  Music,
  ShieldCheck,
  Sparkles,
  Timer,
  Users,
  Baby,
  ArrowRight,
  Clock,
  Layers,
} from 'lucide-react';
import type { Course } from '@/lib/courses';
import { getLessonCount, getCourseDurationLabel } from '@/lib/courses';

const ICONS: Record<string, React.ElementType> = {
  media: Camera,
  technical: Cpu,
  ushering: Users,
  protocol: ShieldCheck,
  choir: Music,
  welfare: HeartHandshake,
  children: Baby,
};

interface CourseStatusInfo {
  courseSlug: string;
  isEnrolled: boolean;
  isCertified: boolean;
  certificateCode?: string;
  percent?: number;
}

interface Props {
  courses: Course[];
  statusMap: Record<string, CourseStatusInfo>;
}

export function WorkforceDepartmentTabs({ courses, statusMap }: Props) {
  const [activeSlug, setActiveSlug] = useState<string>('all');

  const selectedCourse = courses.find((c) => c.slug === activeSlug);

  return (
    <div>
      {/* ---------------------------------------------------- TAB BUTTONS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveSlug('all')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium transition-all shrink-0 border ${
            activeSlug === 'all'
              ? 'border-accent bg-accent text-accent-ink font-semibold shadow-sm'
              : 'border-line bg-surface text-cream-300 hover:border-line-strong hover:text-cream-50'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>All Departments</span>
          <span className="ml-1 rounded-full bg-black/20 px-1.5 py-0.2 font-mono text-[10px]">
            {courses.length}
          </span>
        </button>

        {courses.map((course) => {
          const Icon = ICONS[course.slug] || Sparkles;
          const status = statusMap[course.slug];
          const isSelected = activeSlug === course.slug;

          return (
            <button
              key={course.slug}
              type="button"
              onClick={() => setActiveSlug(course.slug)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all shrink-0 border ${
                isSelected
                  ? 'border-gold-400 bg-gold-400/15 text-gold-200 font-semibold shadow-sm'
                  : 'border-line bg-surface text-cream-400 hover:border-line-strong hover:text-cream-50'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{course.shortTitle}</span>
              {status?.isCertified ? (
                <span className="flex h-1.5 w-1.5 rounded-full bg-gold-400" title="Certified" />
              ) : status?.isEnrolled ? (
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" title="Enrolled" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* ---------------------------------------------------- SINGLE DEPARTMENT TAB VIEW */}
      {selectedCourse && (
        <div className="mt-6 rounded-3xl border border-line bg-surface p-6 sm:p-10 transition-all animate-fade-in">
          {(() => {
            const Icon = ICONS[selectedCourse.slug] || Sparkles;
            const status = statusMap[selectedCourse.slug];
            const isCertified = Boolean(status?.isCertified);
            const isEnrolled = Boolean(status?.isEnrolled);

            return (
              <div>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-line bg-canvas text-gold-300">
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-cream-400">
                          {selectedCourse.code}
                        </span>
                        {isCertified && (
                          <span className="flex items-center gap-1 rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-0.5 text-[10px] text-gold-300 font-medium">
                            <Award className="h-3 w-3" />
                            Certified
                          </span>
                        )}
                        {isEnrolled && !isCertified && (
                          <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] text-emerald-300 font-medium">
                            <CheckCircle2 className="h-3 w-3" />
                            Enrolled ({status?.percent ?? 0}%)
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 text-[26px] font-semibold tracking-[-0.03em] text-cream-50 sm:text-[32px]">
                        {selectedCourse.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-gold-300/90">{selectedCourse.tagline}</p>
                    </div>
                  </div>

                  <div className="shrink-0 sm:text-right">
                    {isCertified ? (
                      <Link
                        href={`/portal/certificates/${status!.certificateCode}`}
                        className="btn btn-secondary"
                      >
                        <Award className="h-4 w-4 text-gold-400" />
                        View Certificate
                      </Link>
                    ) : (
                      <Link
                        href={`/portal/courses/${selectedCourse.slug}`}
                        className="btn btn-primary"
                      >
                        {isEnrolled ? 'Continue Course' : 'Join Department & Review Conditions'}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>

                <p className="mt-6 max-w-3xl text-[14.5px] leading-relaxed text-cream-400">
                  {selectedCourse.description}
                </p>

                {/* Quick stats */}
                <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-line-soft py-4 text-xs text-cream-400">
                  <span className="flex items-center gap-1.5">
                    <Headphones className="h-4 w-4 text-accent" />
                    <strong>{getLessonCount(selectedCourse)} audio lessons</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-gold-400" />
                    <span>Duration: {getCourseDurationLabel(selectedCourse)}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Timer className="h-4 w-4 text-cream-400" />
                    <span>{selectedCourse.exam.durationMinutes}-minute timed exam</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-gold-400" />
                    <span>Pass mark: {selectedCourse.exam.passMark}%</span>
                  </span>
                </div>

                {/* Two Column details: Conditions & Syllabus */}
                <div className="mt-8 grid gap-8 lg:grid-cols-2">
                  {/* Left: Conditions */}
                  <div className="rounded-2xl border border-line-soft bg-canvas/40 p-6">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-gold-400" />
                      <h4 className="text-sm font-semibold text-cream-50">
                        Conditions to Join ({selectedCourse.conditions.length} Requirements)
                      </h4>
                    </div>
                    <p className="mt-1 text-xs text-cream-500">
                      You must acknowledge these requirements before beginning the course.
                    </p>

                    <ul className="mt-4 space-y-2.5">
                      {selectedCourse.conditions.map((condition, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs leading-relaxed text-cream-300">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-gold-400">
                            <Check className="h-2.5 w-2.5" />
                          </span>
                          <span>{condition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Audio Syllabus & Outcomes */}
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-line-soft bg-canvas/40 p-6">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-accent" />
                        <h4 className="text-sm font-semibold text-cream-50">Audio Lessons Syllabus</h4>
                      </div>
                      <div className="mt-4 space-y-3">
                        {selectedCourse.modules.map((m) => (
                          <div key={m.id} className="rounded-xl border border-line bg-surface/50 p-3.5">
                            <p className="font-mono text-[9px] uppercase tracking-wider text-gold-400">
                              Week {m.week} · {m.title}
                            </p>
                            {m.lessons.map((l) => (
                              <div key={l.id} className="mt-2 flex items-center justify-between text-xs">
                                <span className="font-medium text-cream-200">{l.title}</span>
                                <span className="font-mono text-[10px] text-cream-500">
                                  {l.estimatedMinutes} min
                                </span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-line-soft bg-canvas/40 p-5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-cream-400">
                        Outcomes for Service
                      </h4>
                      <ul className="mt-2.5 space-y-1.5 text-xs text-cream-400">
                        {selectedCourse.outcomes.map((outcome, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="h-1 w-1 rounded-full bg-accent mt-1.5 shrink-0" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-line-soft pt-6">
                  <button
                    type="button"
                    onClick={() => setActiveSlug('all')}
                    className="text-xs text-cream-500 hover:text-cream-200 underline-offset-4 hover:underline"
                  >
                    ← Back to all departments
                  </button>

                  <Link
                    href={`/portal/courses/${selectedCourse.slug}`}
                    className="btn btn-primary"
                  >
                    {isEnrolled ? 'Open Course Player' : 'Proceed to Join Department'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ---------------------------------------------------- ALL DEPARTMENTS GRID VIEW */}
      {activeSlug === 'all' && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
          {courses.map((course) => {
            const Icon = ICONS[course.slug] || Sparkles;
            const status = statusMap[course.slug];
            const isCertified = Boolean(status?.isCertified);
            const isEnrolled = Boolean(status?.isEnrolled);

            return (
              <article
                key={course.slug}
                className="group flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 transition-all hover:border-line-strong hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-canvas text-gold-300">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveSlug(course.slug)}
                        className="rounded-full border border-line/70 px-2 py-0.5 text-[9px] text-cream-400 hover:text-gold-300 hover:border-gold-400/50 transition-colors"
                      >
                        Tab view
                      </button>
                      <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-cream-400">
                        {course.code}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-5 text-[20px] font-semibold leading-snug tracking-[-0.02em] text-cream-50">
                    {course.shortTitle} Department
                  </h3>
                  <p className="mt-1 text-[12px] font-medium text-gold-300/90">{course.tagline}</p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-cream-400 line-clamp-3">
                    {course.description}
                  </p>

                  <div className="mt-5 rounded-xl border border-line-soft bg-canvas/50 p-3.5">
                    <p className="mono-label !text-[8.5px] text-gold-300">Conditions to join</p>
                    <p className="mt-1 text-[11.5px] font-medium text-cream-200">
                      {course.conditions.length} requirements to accept before enrolling
                    </p>
                    <ul className="mt-2 space-y-1 text-[11px] text-cream-400">
                      {course.conditions.slice(0, 2).map((c, i) => (
                        <li key={i} className="line-clamp-1 flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-gold-400 shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                      {course.conditions.length > 2 && (
                        <li className="text-[10px] text-cream-500">
                          +{course.conditions.length - 2} more conditions inside
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-cream-500">
                    <span className="inline-flex items-center gap-1">
                      <Headphones className="h-3 w-3" />
                      {getLessonCount(course)} audio lessons
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      {course.exam.durationMinutes} min exam
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {course.exam.passMark}% pass mark
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 border-t border-line-soft pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveSlug(course.slug)}
                    className="btn btn-secondary btn-sm flex-1 text-xs"
                  >
                    View Tab
                  </button>
                  {isCertified ? (
                    <Link
                      href={`/portal/certificates/${status!.certificateCode}`}
                      className="btn btn-secondary btn-sm flex-1 text-xs"
                    >
                      <Award className="h-3.5 w-3.5 text-gold-400" />
                      Certificate
                    </Link>
                  ) : (
                    <Link
                      href={`/portal/courses/${course.slug}`}
                      className="btn btn-primary btn-sm flex-1 text-xs"
                    >
                      {isEnrolled ? 'Continue' : 'Join'}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

