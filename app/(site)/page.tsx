import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Headphones,
  Lock,
  Mic,
  MonitorPlay,
  Play,
  Timer,
  Award,
} from 'lucide-react';
import {
  COURSES,
  formatLessonDuration,
  getCourseDurationLabel,
  getLesson,
  getLessonCount,
} from '@/lib/courses';
import { MandateSection } from '@/components/MandateSection';
import { MeetingSchedule } from '@/components/MeetingSchedule';
import { MinistryGallery } from '@/components/MinistryGallery';

const PILLARS = [
  {
    number: '01',
    title: 'Revival fire',
    body: 'A burning altar kept aflame — pursuing the presence of God until nations feel His weight.',
  },
  {
    number: '02',
    title: 'Prophetic intercession',
    body: 'Standing in the gap by the spirit of Elijah, praying heaven’s blueprint over people and territories.',
  },
  {
    number: '03',
    title: 'Kingdom restoration',
    body: 'Restoring people, families, and spheres back to their original divine ordination.',
  },
];

const FEATURES = [
  {
    icon: MonitorPlay,
    title: 'Streamed, never loose files',
    body: 'Video and audio play inside the portal through an authenticated stream. Nothing is offered as a download.',
  },
  {
    icon: CheckCircle2,
    title: 'Progress that follows you',
    body: 'Every lesson, position, and completed step is remembered — on your phone, tablet, or computer.',
  },
  {
    icon: Timer,
    title: 'One attempt. Timed.',
    body: 'The final exam starts when you are ready. Leave the tab and it closes, exactly as it would in a room.',
  },
  {
    icon: Award,
    title: 'A certificate that verifies',
    body: 'Pass the exam and receive a certificate with its own verification code you can share.',
  },
];

export default function HomePage() {
  return (
    <div className="w-full">
      {/* ============================================================ HERO */}
      <section className="relative isolate overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(760px_420px_at_82%_-8%,rgba(176,91,168,0.13),transparent_70%)]"
        />

        <div className="container-page grid items-center gap-14 pb-16 pt-14 sm:pb-20 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-24 lg:pt-24">
          <div className="animate-fade-in">
            <div className="mb-6 flex items-center gap-2.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold-400" />
              </span>
              <span className="mono-label text-gold-300">URPN · Prophetic prayer network</span>
            </div>

            <h1 className="text-[32px] font-semibold leading-[1.05] tracking-[-0.045em] text-cream-50 sm:text-[44px] lg:text-[52px]">
              Restore the blueprint.
              <span className="block text-cream-500">Equip the worker.</span>
              <span className="block text-cream-500">Reach the territories.</span>
            </h1>

            <p className="mt-7 max-w-[470px] text-[15px] leading-[1.72] text-cream-400">
              URPN is a prophetic prayer network raising workers, ministers, and pastors into
              their original divine ordination — through intercession, the Word, and training
              that follows you into the field.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/portal" className="btn btn-primary w-full sm:w-auto">
                Enter the worker portal
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/#mandate" className="btn btn-secondary w-full sm:w-auto">
                Explore the mandate
              </Link>
            </div>

            <p className="mt-7 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-cream-500">
              Worker access
              <span className="mx-2 text-line-strong">·</span>
              Three training tracks
              <span className="mx-2 text-line-strong">·</span>
              Installable on mobile
            </p>
          </div>

          {/* Portal preview */}
          <div className="mx-auto w-full max-w-[460px] lg:mx-0">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-x-6 top-8 h-full rounded-2xl border border-line-soft bg-surface/40"
              />
            <div
              aria-hidden="true"
              className="absolute inset-x-3 top-4 h-full rounded-2xl border border-line/70 bg-surface/70"
            />

            <div className="relative rounded-2xl border border-line bg-surface p-4 shadow-[0_40px_100px_-50px_rgba(0,0,0,0.95)] sm:p-5">
              <div className="flex items-center justify-between gap-3 border-b border-line-soft pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span className="mono-label !text-[9.5px]">Worker portal</span>
                </div>
                <span className="flex items-center gap-1.5 rounded-full border border-line bg-canvas/60 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-cream-400">
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  Preview
                </span>
              </div>

              <div className="pt-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[15px] font-medium text-cream-50">URPN Foundation Class</p>
                    <p className="mt-1 text-xs text-cream-500">Week 3 · The Worker</p>
                  </div>
                  <span className="font-mono text-[11px] text-cream-400">5 / 8</span>
                </div>

                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-canvas">
                  <div className="h-full w-[62%] rounded-full bg-accent" />
                </div>

                <div className="mt-5 rounded-xl border border-line bg-canvas/60 p-3.5">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="mono-label !text-[9px]">Next lesson</p>
                      <p className="mt-1 truncate text-[13.5px] font-medium text-cream-50">
                        Serving with a clean heart
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-cream-500">
                        <MonitorPlay className="h-3 w-3" aria-hidden="true" />
                        Video · {formatLessonDuration(getLesson(COURSES[0], 'foundation-serving')!.lesson)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-line-soft bg-canvas/40 px-3 py-2.5">
                    <p className="mono-label !text-[8.5px]">Lessons</p>
                    <p className="mt-1 text-[13px] text-cream-200">5 completed</p>
                  </div>
                  <div className="rounded-lg border border-line-soft bg-canvas/40 px-3 py-2.5">
                    <p className="mono-label !text-[8.5px]">Exam</p>
                    <p className="mt-1 text-[13px] text-cream-200">Locked · 3 left</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line-soft pt-4">
                  <span className="mono-label !text-[9px]">Continue your track</span>
                  <ArrowRight className="h-4 w-4 text-accent" aria-hidden="true" />
                </div>
              </div>
            </div>

            </div>
            <p className="relative z-10 mt-10 text-center font-mono text-[9.5px] uppercase tracking-[0.18em] text-cream-500">
              A look inside the worker portal
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================== MANDATE */}
      <section id="mandate" className="scroll-mt-24">
        <div className="container-page py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-gold-500/70" />
                <span className="mono-label text-gold-300">The apostolic mandate</span>
              </div>
              <h2 className="mt-5 max-w-[15ch] text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] text-cream-50 sm:text-[42px]">
                Restoration is not repair.
                <span className="block text-cream-500">It is a return to blueprint.</span>
              </h2>
              <p className="mt-6 max-w-md text-[14.5px] leading-[1.75] text-cream-400">
                Before a life is rebuilt, heaven consults a design. URPN exists to recover
                God’s original intention for people, families, spheres, and territories — and
                to form the workers who will carry it.
              </p>
            </div>

            <figure className="lg:pt-10">
              <blockquote className="border-l border-gold-500/50 pl-6 text-[21px] font-medium leading-[1.5] tracking-[-0.02em] text-cream-100 sm:text-[24px]">
                “Restoring people, territories, and spheres back to their original ordination,
                such that they operate from that standpoint.”
              </blockquote>
              <figcaption className="mt-5 pl-6 font-mono text-[10px] uppercase tracking-[0.18em] text-cream-500">
                The apostolic mandate of URPN
              </figcaption>
            </figure>
          </div>

          <div className="mt-14 grid gap-8 border-t border-line-soft pt-10 md:grid-cols-3 md:gap-10">
            {PILLARS.map((pillar) => (
              <div key={pillar.number}>
                <span className="mono-label text-cream-600">{pillar.number}</span>
                <h3 className="mt-3 text-[17px] font-medium text-cream-50">{pillar.title}</h3>
                <p className="mt-2 text-left text-[13.5px] leading-relaxed text-cream-400">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== TRAINING */}
      <section id="training" className="scroll-mt-24 border-y border-line bg-canvas-deep/40">
        <div className="container-page py-16 sm:py-20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-gold-500/70" />
                <span className="mono-label text-gold-300">Worker training</span>
              </div>
              <h2 className="mt-5 text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] text-cream-50 sm:text-[42px]">
                Three tracks.
                <span className="text-cream-500"> One mandate.</span>
              </h2>
            </div>
            <p className="max-w-sm text-[13.5px] leading-relaxed text-cream-400">
              Start where you are. Each track is built from short streamed lessons, a timed
              one-attempt exam, and a verifiable certificate.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {COURSES.map((course, index) => (
              <article
                key={course.slug}
                className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-line-strong sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="mono-label">Track 0{index + 1}</span>
                  <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-cream-400">
                    {getCourseDurationLabel(course)}
                  </span>
                </div>

                <h3 className="mt-7 text-[22px] font-semibold leading-tight tracking-[-0.02em] text-cream-50">
                  {course.shortTitle}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-cream-400">
                  {course.tagline}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-line-soft pt-4">
                  <div>
                    <p className="mono-label !text-[9px]">Lessons</p>
                    <p className="mt-1 flex items-center gap-1.5 text-[13px] text-cream-200">
                      <BookOpen className="h-3.5 w-3.5 text-cream-500" aria-hidden="true" />
                      {getLessonCount(course)}
                    </p>
                  </div>
                  <div>
                    <p className="mono-label !text-[9px]">Final exam</p>
                    <p className="mt-1 flex items-center gap-1.5 text-[13px] text-cream-200">
                      <Timer className="h-3.5 w-3.5 text-cream-500" aria-hidden="true" />
                      {course.exam.durationMinutes} min
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-line-soft pt-4">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-cream-500">
                    {course.code}
                  </span>
                  <Link
                    href={`/portal/courses/${course.slug}`}
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-cream-50 transition-colors group-hover:text-accent"
                  >
                    Open track
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11.5px] text-cream-500">
            <span className="flex items-center gap-2">
              <Headphones className="h-3.5 w-3.5 text-cream-500" aria-hidden="true" />
              Audio and video
            </span>
            <span className="flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-cream-500" aria-hidden="true" />
              Stream only — no downloads
            </span>
            <span className="flex items-center gap-2">
              <Award className="h-3.5 w-3.5 text-cream-500" aria-hidden="true" />
              Certificate on passing
            </span>
          </div>
        </div>
      </section>

      {/* ==================================================== HOW IT WORKS */}
      <section className="border-b border-line">
        <div className="container-page grid gap-12 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-gold-500/70" />
              <span className="mono-label text-gold-300">Supervised formation</span>
            </div>
            <h2 className="mt-5 max-w-[14ch] text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] text-cream-50 sm:text-[42px]">
              Work at your pace.
              <span className="block text-cream-500">Stay accountable.</span>
            </h2>
            <p className="mt-6 max-w-md text-[14.5px] leading-[1.75] text-cream-400">
              The portal is not a video library. It is a formation path. Lessons track
              themselves, the exam opens only when the work is done, and your certificate
              carries a code anyone can verify.
            </p>
            <Link href="/portal/login" className="btn btn-secondary mt-8">
              Sign in to the portal
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="bg-surface p-5 sm:p-6">
                <feature.icon className="h-5 w-5 text-accent" aria-hidden="true" />
                <h3 className="mt-4 text-[14.5px] font-medium text-cream-50">{feature.title}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-cream-400">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== VISION & MISSION */}
      <MandateSection />

      {/* ==================================================== GATHERINGS */}
      <div id="gatherings" className="scroll-mt-24 border-y border-line">
        <MeetingSchedule />
      </div>

      {/* ==================================================== GALLERY */}
      <MinistryGallery />

      {/* ==================================================== TESTIMONY CTA */}
      <section className="container-page pb-20 pt-4 sm:pb-24">
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-gold-500/70" />
                <span className="mono-label text-gold-300">Give God the glory</span>
              </div>
              <h2 className="mt-4 max-w-[22ch] text-[28px] font-semibold leading-[1.1] tracking-[-0.035em] text-cream-50 sm:text-[36px]">
                Has God done something wonderful?
              </h2>
              <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-cream-400">
                Record a short voice or video testimony, or write it down. Your story could
                strengthen someone’s faith and become a memorial of His wonders.
              </p>
            </div>
            <Link href="/testimony" className="btn btn-primary w-full lg:w-auto">
              <Mic className="h-4 w-4" aria-hidden="true" />
              Share your testimony
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
