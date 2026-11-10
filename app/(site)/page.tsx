import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Flame,
  MapPin,
  Mic,
  Sparkles,
} from 'lucide-react';
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
              <span className="block text-cream-500">Kindle the fire.</span>
              <span className="block text-cream-500">Reach the territories.</span>
            </h1>

            <p className="mt-7 max-w-[470px] text-[15px] leading-[1.72] text-cream-400">
              URPN is a prophetic prayer network restoring people, families, spheres, and territories back to their original divine ordination through relentless intercession, apostolic teaching, and the manifest presence of God.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/testimony" className="btn btn-primary w-full sm:w-auto">
                <Mic className="h-4 w-4" aria-hidden="true" />
                Share your testimony
              </Link>
              <Link href="/gatherings" className="btn btn-secondary w-full sm:w-auto">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Join our gatherings
              </Link>
            </div>

            <p className="mt-7 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-cream-500">
              Prophetic prayer altars
              <span className="mx-2 text-line-strong">·</span>
              Apostolic restoration
              <span className="mx-2 text-line-strong">·</span>
              Weekly gatherings
            </p>
          </div>

          {/* Spiritual Mandate & Altar Preview Card */}
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

              <div className="relative rounded-2xl border border-line bg-surface p-6 shadow-[0_40px_100px_-50px_rgba(0,0,0,0.95)] sm:p-7">
                <div className="flex items-center justify-between gap-3 border-b border-line-soft pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
                    <span className="mono-label !text-[9.5px]">Apostolic Altar</span>
                  </div>
                  <span className="rounded-full border border-line bg-canvas/60 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-gold-300">
                    Weekly Altars
                  </span>
                </div>

                <div className="pt-5 space-y-4">
                  <div>
                    <h3 className="text-[17px] font-semibold text-cream-50 leading-snug">
                      “Restoring people, territories, and spheres back to their original ordination.”
                    </h3>
                    <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-cream-500">
                      The Mandate of URPN
                    </p>
                  </div>

                  <p className="border-t border-line-soft pt-3 text-[12.5px] leading-relaxed text-cream-400">
                    Join daily weekday prayers, The Weekly Furnace, Intensify vigil, Kingdomite
                    gatherings, and our annual Convergence.
                  </p>

                  <div className="pt-2">
                    <Link
                      href="/gatherings"
                      className="flex items-center justify-between text-xs font-medium text-gold-300 hover:text-gold-200 transition-colors"
                    >
                      <span>View gathering locations &amp; schedule</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
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
                God’s original intention for people, families, spheres, and territories — standing
                in the gap until the original design is restored.
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

      {/* ==================================================== VISION & MISSION */}
      <MandateSection />

      {/* ==================================================== GATHERINGS */}
      <div id="gatherings" className="scroll-mt-24 border-y border-line">
        <MeetingSchedule />
      </div>

      {/* ==================================================== GALLERY */}
      <MinistryGallery />

      {/* ==================================================== TESTIMONY CTA */}
      <section className="container-page pb-20 pt-8 sm:pb-24">
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
