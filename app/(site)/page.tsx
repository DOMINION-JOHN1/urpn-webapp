import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Mic } from 'lucide-react';
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
      <section className="relative isolate overflow-hidden border-b border-line sm:min-h-[700px] lg:min-h-[740px]">
        <div className="relative aspect-[1.96] w-full sm:absolute sm:inset-0 sm:aspect-auto">
          <Image
            src="/images/urpn-community.png"
            alt="The URPN family gathered together at Testaments Saviours"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-canvas sm:bg-gradient-to-r sm:from-canvas/95 sm:via-canvas/75 sm:to-canvas/20"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-canvas/80 to-transparent sm:block"
        />

        <div className="container-page relative z-10 -mt-8 pb-12 pt-4 sm:mt-0 sm:flex sm:min-h-[700px] sm:items-center sm:pb-0 sm:pt-28 lg:min-h-[740px] lg:pt-32">
          <div className="max-w-[650px] animate-fade-in" data-reveal>
            <div className="mb-6 flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              <span className="mono-label text-gold-300">URPN · Prophetic prayer network</span>
            </div>

            <h1 className="text-[34px] font-semibold leading-[1.03] tracking-[-0.045em] text-cream-50 sm:text-[48px] lg:text-[60px]">
              Restore the blueprint.
              <span className="block text-cream-200">Kindle the fire.</span>
              <span className="block text-cream-200">Reach the territories.</span>
            </h1>

            <p className="mt-6 max-w-[490px] text-[15px] leading-[1.72] text-cream-200/90">
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

            <p className="mt-7 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-cream-200/75">
              Prophetic prayer altars
              <span className="mx-2 text-line-strong">·</span>
              Apostolic restoration
              <span className="mx-2 text-line-strong">·</span>
              Weekly gatherings
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================== MANDATE */}
      <section id="mandate" className="scroll-mt-24">
        <div className="container-page py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20" data-reveal>
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

          <div className="mt-14 grid gap-8 border-t border-line-soft pt-10 md:grid-cols-3 md:gap-10" data-reveal>
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
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center" data-reveal>
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
