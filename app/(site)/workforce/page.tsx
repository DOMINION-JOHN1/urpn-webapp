import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Award,
  BookOpen,
  Camera,
  CheckCircle2,
  Cpu,
  Headphones,
  HeartHandshake,
  Music,
  ShieldCheck,
  Sparkles,
  Timer,
  UserPlus,
  Users,
  Baby,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';
import { WORKFORCE_COURSES, getLessonCount, getCourseDurationLabel } from '@/lib/courses';
import { getSessionUser } from '@/lib/server/auth';
import { getDashboardData } from '@/lib/server/learning';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Join the Workforce · Unique Revival Prayer Network',
  description:
    'Step into your assignment. Join one of our 7 ministry departments: review conditions, complete the audio formation track, sit the timed exam, and earn your certificate to serve.',
};

const ICONS: Record<string, React.ElementType> = {
  media: Camera,
  technical: Cpu,
  ushering: Users,
  protocol: ShieldCheck,
  choir: Music,
  welfare: HeartHandshake,
  children: Baby,
};

export default async function WorkforceHubPage() {
  const user = await getSessionUser();
  const dashboard = user ? await getDashboardData(user.id) : null;

  return (
    <div className="w-full pb-20 pt-8 sm:pb-28 sm:pt-12">
      <div className="container-page">
        {/* ============================================================ HERO */}
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-7 sm:p-12 lg:p-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_350px_at_90%_0%,rgba(176,91,168,0.12),transparent_70%)]"
          />

          <div className="relative max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="mono-label text-gold-300">Open to all members &amp; volunteers</span>
            </div>

            <h1 className="mt-4 text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] text-cream-50 sm:text-[44px] lg:text-[50px]">
              Become a worker.
              <span className="block text-cream-500">Serve in your divine ordination.</span>
            </h1>

            <p className="mt-5 text-[15px] leading-[1.75] text-cream-400">
              URPN is raising men and women who carry the altar into their spheres. Choose a ministry department, review the conditions required to join, listen to the audio teaching, pass the exam, and receive your verified certificate to serve.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] px-4 py-2.5 text-xs text-cream-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>
                    Signed in as <strong className="font-semibold text-cream-50">{user.name}</strong>
                  </span>
                </div>
              ) : (
                <>
                  <Link href="/workforce/register" className="btn btn-primary">
                    <UserPlus className="h-4 w-4" aria-hidden="true" />
                    Create workforce account
                  </Link>
                  <Link href="/workforce/login" className="btn btn-secondary">
                    Sign in to continue
                  </Link>
                </>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line-soft pt-6 text-[11px] text-cream-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-gold-400" />
                Department conditions verified
              </span>
              <span className="flex items-center gap-1.5">
                <Headphones className="h-3.5 w-3.5 text-accent" />
                Audio-first stream (no downloads)
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-gold-400" />
                Verifiable certificate on passing
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ HOW IT WORKS */}
        <section className="mt-14">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-gold-500/70" />
            <span className="mono-label text-gold-300">How to join</span>
          </div>
          <h2 className="mt-3 text-[26px] font-semibold text-cream-50 sm:text-[32px]">
            Four steps to service in the house
          </h2>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <span className="font-mono text-xs text-gold-400">01</span>
              <h3 className="mt-2.5 text-[15px] font-medium text-cream-50">Create account</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-cream-400">
                Register with your name, email, and phone. No gatekeeping — open to every believer called to URPN.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <span className="font-mono text-xs text-gold-400">02</span>
              <h3 className="mt-2.5 text-[15px] font-medium text-cream-50">Review conditions</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-cream-400">
                Each department lists its spiritual and practical requirements. Review and accept the conditions to enroll.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <span className="font-mono text-xs text-gold-400">03</span>
              <h3 className="mt-2.5 text-[15px] font-medium text-cream-50">Listen to audios</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-cream-400">
                Stream the department audio teaching directly in your browser. Progress is saved as you listen.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <span className="font-mono text-xs text-gold-400">04</span>
              <h3 className="mt-2.5 text-[15px] font-medium text-cream-50">Sit exam &amp; certify</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-cream-400">
                Pass the timed 20-minute exam to unlock your official verified certificate with your name on it.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================ 7 DEPARTMENTS */}
        <section className="mt-16">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-gold-500/70" />
                <span className="mono-label text-gold-300">Choose a department</span>
              </div>
              <h2 className="mt-3 text-[26px] font-semibold text-cream-50 sm:text-[32px]">
                The Seven Ministry Departments
              </h2>
            </div>
            <p className="max-w-sm text-[12.5px] text-cream-400">
              Select any department to review its conditions and begin the audio course.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WORKFORCE_COURSES.map((course, index) => {
              const Icon = ICONS[course.slug] || Sparkles;
              const courseStatus = dashboard?.courses.find((c) => c.course.slug === course.slug);
              const isCertified = Boolean(courseStatus?.certificate);
              const isEnrolled = Boolean(courseStatus?.enrolled);

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
                      <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-cream-400">
                        {course.code}
                      </span>
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

                  <div className="mt-6 border-t border-line-soft pt-4">
                    {isCertified ? (
                      <Link
                        href={`/portal/certificates/${courseStatus!.certificate!.code}`}
                        className="btn btn-secondary btn-sm w-full"
                      >
                        <Award className="h-3.5 w-3.5 text-gold-400" />
                        View Certificate
                      </Link>
                    ) : (
                      <Link
                        href={`/portal/courses/${course.slug}`}
                        className="btn btn-primary btn-sm w-full"
                      >
                        {isEnrolled ? 'Continue Course' : 'View Conditions & Join'}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ============================================================ LOCK NOTICE ON WORKER PORTAL */}
        <section className="mt-16 rounded-2xl border border-line bg-surface/50 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <span className="mono-label text-gold-300">Church Staff &amp; Leadership</span>
              <h3 className="mt-1.5 text-[18px] font-semibold text-cream-50">
                Are you an in-house minister or pastor?
              </h3>
              <p className="mt-1 text-[12.5px] leading-relaxed text-cream-400">
                The original Worker Portal is reserved for in-house leadership formation tracks (Ministers Training &amp; Pastors Training). Access is provisioned directly by church administration.
              </p>
            </div>
            <Link href="/portal/login" className="btn btn-secondary shrink-0">
              Go to Worker Portal 🔒
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

