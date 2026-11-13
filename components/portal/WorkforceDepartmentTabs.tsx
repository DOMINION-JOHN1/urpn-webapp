'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Check,
  CheckCircle2,
  Cpu,
  Camera,
  HeartHandshake,
  Music,
  ShieldCheck,
  Sparkles,
  Users,
  Baby,
  ArrowLeft,
  ArrowRight,
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

interface TrainingSummary {
  slug: string;
  outcomes: string[];
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
  isAuthenticated: boolean;
}

export function WorkforceDepartmentTabs({ departments, training, status, isAuthenticated }: Props) {
  const [activeSlug, setActiveSlug] = useState<string>('all');

  const selected = departments.find((d) => d.slug === activeSlug);

  const courseHref = `/portal/courses/${training.slug}`;
  const startHref = isAuthenticated
    ? courseHref
    : `/workforce/register?next=${encodeURIComponent(courseHref)}`;
  const certificateHref = status.certificateCode
    ? `/portal/certificates/${status.certificateCode}`
    : courseHref;

  // A single shared course, so the call-to-action is the same everywhere.
  const PrimaryCta = ({ className = 'btn btn-primary' }: { className?: string }) =>
    status.isCertified ? (
      <Link href={certificateHref} className={className}>
        <Award className="h-4 w-4 text-gold-400" />
        View Certificate
      </Link>
    ) : (
      <Link href={startHref} className={className}>
        {status.isEnrolled
          ? 'Continue the course'
          : isAuthenticated
            ? 'Start the course'
            : 'Create account'}
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

  return (
    <div>
      {/* ---------------------------------------------------- SINGLE DEPARTMENT VIEW */}
      {selected && (
        <div className="mt-6 rounded-3xl border border-line bg-surface p-6 sm:p-10 transition-all animate-fade-in">
          {(() => {
            const Icon = ICONS[selected.slug] || Sparkles;
            return (
              <div>
                <button
                  type="button"
                  onClick={() => setActiveSlug('all')}
                  className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-cream-400 transition-colors hover:text-cream-50"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  All departments
                </button>
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
                      Every department completes the same workforce training before certification.
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
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((department, index) => {
              const Icon = ICONS[department.slug] || Sparkles;

              return (
                <article
                  key={department.slug}
                  className="group relative flex min-h-[330px] flex-col overflow-hidden rounded-[22px] border border-line bg-surface p-5 transition-[transform,border-color,background-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-gold-500/35 hover:bg-surface-raised hover:shadow-[0_24px_55px_-34px_rgba(216,181,111,0.4)] sm:p-6"
                  data-reveal
                  style={{ '--reveal-delay': `${index * 35}ms` } as React.CSSProperties & { '--reveal-delay': string }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-canvas text-gold-300 transition-[transform,border-color,background-color] duration-300 group-hover:scale-105 group-hover:border-gold-500/35 group-hover:bg-gold-500/10">
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
                    <p className="mt-2 text-[12.5px] leading-relaxed text-cream-400 line-clamp-2">
                      {department.description}
                    </p>

                    <div className="mt-auto pt-5">
                      <div className="rounded-xl border border-line-soft bg-canvas/50 px-4 py-3.5 transition-colors duration-300 group-hover:border-gold-500/20 group-hover:bg-gold-500/[0.035]">
                        <div className="flex items-center justify-between gap-3">
                          <p className="mono-label !text-[8.5px] text-gold-300">Joining requirements</p>
                          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[9px] text-cream-300">
                            {department.conditions.length}
                          </span>
                        </div>
                        {department.conditions[0] && (
                          <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-cream-400">
                            {department.conditions[0]}
                          </p>
                        )}
                        {department.conditions.length > 1 && (
                          <p className="mt-1 text-[10px] text-cream-500">
                            +{department.conditions.length - 1} more in department details
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 border-t border-line-soft pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveSlug(department.slug)}
                      className="btn btn-secondary btn-sm flex-1 text-xs transition-transform duration-200 hover:scale-[1.02]"
                    >
                      View details
                    </button>
                    <Link href={startHref} className="group/start btn btn-primary btn-sm flex-1 text-xs transition-transform duration-200 hover:scale-[1.02]">
                      {status.isCertified ? 'Certificate' : status.isEnrolled ? 'Continue' : 'Start'}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/start:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

        </>
      )}
    </div>
  );
}
