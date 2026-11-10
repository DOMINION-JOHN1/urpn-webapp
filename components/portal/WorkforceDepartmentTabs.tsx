'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Cpu,
  Camera,
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
  Palette,
  Megaphone,
  Flame,
  MessageSquare,
  Bus,
  Stethoscope,
  Shield,
  Library,
  Clapperboard,
} from 'lucide-react';
import type { Department } from '@/lib/courses';

const ICONS: Record<string, React.ElementType> = {
  aesthetics: Palette,
  pr: Megaphone,
  protocol: ShieldCheck,
  ushering: Users,
  technical: Cpu,
  media: Camera,
  choir: Music,
  welfare: HeartHandshake,
  prayer: Flame,
  counseling: MessageSquare,
  transport: Bus,
  medical: Stethoscope,
  security: Shield,
  children: Baby,
  publications: Library,
  drama: Clapperboard,
};

interface TrainingModuleSummary {
  id: string;
  week: number;
  title: string;
  summary: string;
}

interface TrainingSummary {
  slug: string;
  weeks: number;
  lessonCount: number;
  durationLabel: string;
  passMark: number;
  examMinutes: number;
  outcomes: string[];
  modules: TrainingModuleSummary[];
}

interface TrainingStatus {
  isEnrolled: boolean;
  isCertified: boolean;
  certificateCode?: string;
  percent: number;
}

interface Props {
  departments: Department[];
  training: TrainingSummary;
  status: TrainingStatus;
}

export function WorkforceDepartmentTabs({ departments, training, status }: Props) {
  const [activeSlug, setActiveSlug] = useState<string>('all');

  const selected = departments.find((d) => d.slug === activeSlug);

  const startHref = `/portal/courses/${training.slug}`;
  const certificateHref = status.certificateCode
    ? `/portal/certificates/${status.certificateCode}`
    : startHref;

  // A single shared course, so the call-to-action is the same everywhere.
  const PrimaryCta = ({ className = 'btn btn-primary' }: { className?: string }) =>
    status.isCertified ? (
      <Link href={certificateHref} className={className}>
        <Award className="h-4 w-4 text-gold-400" />
        View Certificate
      </Link>
    ) : (
      <Link href={startHref} className={className}>
        {status.isEnrolled ? 'Continue the course' : 'Start the course'}
        <ArrowRight className="h-4 w-4" />
      </Link>
    );

  const StatusBadge = () =>
    status.isCertified ? (
      <span className="flex items-center gap-1 rounded-full border border-gold-500/30 bg-gold-500/10 px-2.5 py-0.5 text-[10px] text-gold-300 font-medium">
        <Award className="h-3 w-3" />
        Certified
      </span>
    ) : status.isEnrolled ? (
      <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] text-emerald-300 font-medium">
        <CheckCircle2 className="h-3 w-3" />
        Enrolled ({status.percent}%)
      </span>
    ) : null;

  const CurriculumCard = () => (
    <div className="rounded-2xl border border-line-soft bg-canvas/40 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-accent" />
          <h4 className="text-sm font-semibold text-cream-50">The training curriculum</h4>
        </div>
        <span className="rounded-full border border-gold-400/30 bg-gold-400/10 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gold-300">
          One course for every department
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 border-y border-line-soft py-3 text-xs text-cream-400">
        <span className="flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-accent" />
          <strong>{training.lessonCount} lessons</strong>
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-gold-400" />
          <span>
            {training.durationLabel} · {training.weeks} weeks
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <Timer className="h-4 w-4 text-cream-400" />
          <span>{training.examMinutes}-minute exam</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Award className="h-4 w-4 text-gold-400" />
          <span>Pass mark: {training.passMark}%</span>
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        {training.modules.map((m) => (
          <div
            key={m.id}
            className="flex flex-col gap-1 rounded-xl border border-line bg-surface/50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-2.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-gold-400 shrink-0 pt-0.5">
                Wk {m.week}
              </span>
              <span className="text-[13px] font-medium text-cream-100">{m.title}</span>
            </div>
            <span className="text-[11px] leading-relaxed text-cream-500 sm:text-right sm:max-w-xs">
              {m.summary}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {/* ---------------------------------------------------- DEPARTMENT SELECTOR */}
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
            {departments.length}
          </span>
        </button>

        {departments.map((department) => {
          const Icon = ICONS[department.slug] || Sparkles;
          const isSelected = activeSlug === department.slug;

          return (
            <button
              key={department.slug}
              type="button"
              onClick={() => setActiveSlug(department.slug)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all shrink-0 border ${
                isSelected
                  ? 'border-gold-400 bg-gold-400/15 text-gold-200 font-semibold shadow-sm'
                  : 'border-line bg-surface text-cream-400 hover:border-line-strong hover:text-cream-50'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{department.shortTitle}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------------------------------------------- SINGLE DEPARTMENT VIEW */}
      {selected && (
        <div className="mt-6 rounded-3xl border border-line bg-surface p-6 sm:p-10 transition-all animate-fade-in">
          {(() => {
            const Icon = ICONS[selected.slug] || Sparkles;
            return (
              <div>
                {/* Header */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-line bg-canvas text-gold-300 shadow-sm">
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-cream-400">
                          {selected.code}
                        </span>
                        <StatusBadge />
                      </div>
                      <h3 className="mt-2 text-[26px] font-semibold tracking-[-0.03em] text-cream-50 sm:text-[32px]">
                        {selected.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-gold-300/90">{selected.tagline}</p>
                      <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-cream-400">
                        {selected.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 sm:text-right">
                    <PrimaryCta />
                  </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                  {/* What's required to join */}
                  <div className="rounded-2xl border border-line-soft bg-canvas/40 p-6">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-gold-400" />
                      <h4 className="text-sm font-semibold text-cream-50">
                        What&apos;s required to join ({selected.conditions.length})
                      </h4>
                    </div>
                    <p className="mt-1 text-xs text-cream-500">
                      The requirements to serve in the {selected.shortTitle} department.
                    </p>
                    <ul className="mt-4 space-y-2.5">
                      {selected.conditions.map((condition, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs leading-relaxed text-cream-300"
                        >
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold-400/10 text-gold-400">
                            <Check className="h-2.5 w-2.5" />
                          </span>
                          <span>{condition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What you'll gain */}
                  <div className="rounded-2xl border border-line-soft bg-canvas/40 p-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-accent" />
                      <h4 className="text-sm font-semibold text-cream-50">What you&apos;ll gain</h4>
                    </div>
                    <p className="mt-1 text-xs text-cream-500">
                      Every department completes the same workforce training below.
                    </p>
                    <ul className="mt-4 space-y-2 text-xs text-cream-300">
                      {training.outcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Shared curriculum */}
                <div className="mt-6">
                  <CurriculumCard />
                </div>

                <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-gold-500/20 bg-gold-500/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[12px] leading-relaxed text-cream-300">
                    Accept the conditions, work through the lessons, then pass the timed exam to earn your workforce certificate.
                  </p>
                  <PrimaryCta className="btn btn-primary shrink-0" />
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ---------------------------------------------------- ALL DEPARTMENTS GRID VIEW */}
      {activeSlug === 'all' && (
        <>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
            {departments.map((department) => {
              const Icon = ICONS[department.slug] || Sparkles;

              return (
                <article
                  key={department.slug}
                  className="group flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 transition-all hover:border-line-strong hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-canvas text-gold-300">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-cream-400">
                        {department.code}
                      </span>
                    </div>

                    <h3 className="mt-5 text-[20px] font-semibold leading-snug tracking-[-0.02em] text-cream-50">
                      {department.shortTitle} Department
                    </h3>
                    <p className="mt-1 text-[12px] font-medium text-gold-300/90">{department.tagline}</p>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-cream-400 line-clamp-3">
                      {department.description}
                    </p>

                    <div className="mt-5 rounded-xl border border-line-soft bg-canvas/50 p-3.5">
                      <p className="mono-label !text-[8.5px] text-gold-300">What&apos;s required to join</p>
                      <p className="mt-1 text-[11.5px] font-medium text-cream-200">
                        {department.conditions.length} requirements to serve here
                      </p>
                      <ul className="mt-2 space-y-1 text-[11px] text-cream-400">
                        {department.conditions.slice(0, 2).map((c, i) => (
                          <li key={i} className="line-clamp-1 flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-gold-400 shrink-0" />
                            <span>{c}</span>
                          </li>
                        ))}
                        {department.conditions.length > 2 && (
                          <li className="text-[10px] text-cream-500">
                            +{department.conditions.length - 2} more requirements inside
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 border-t border-line-soft pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveSlug(department.slug)}
                      className="btn btn-secondary btn-sm flex-1 text-xs"
                    >
                      View details
                    </button>
                    <Link href={startHref} className="btn btn-primary btn-sm flex-1 text-xs">
                      {status.isCertified ? 'Certificate' : status.isEnrolled ? 'Continue' : 'Start'}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Shared curriculum shown once, below the grid */}
          <div className="mt-8 animate-fade-in">
            <CurriculumCard />
          </div>
        </>
      )}
    </div>
  );
}
