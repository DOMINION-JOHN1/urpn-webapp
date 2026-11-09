import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight,
  Flame,
  Globe2,
  HeartHandshake,
  Mic,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { MandateSection } from '@/components/MandateSection';

export const metadata: Metadata = {
  title: 'The Mandate · Unique Revival Prayer Network',
  description:
    'Discover the apostolic mandate of URPN: restoring people, families, spheres, and territories back to their original divine blueprint and ordination.',
};

const PILLARS = [
  {
    number: '01',
    title: 'Revival fire',
    summary: 'A burning altar kept aflame night and day.',
    body: 'We pursue the presence of God until whole territories feel His weight. Revival is not an emotional season; it is heaven’s government taking over the hearts of men.',
    icon: Flame,
  },
  {
    number: '02',
    title: 'Prophetic intercession',
    summary: 'Standing in the gap by the spirit of Elijah.',
    body: 'The intercessor stands between heaven and a people, holding Scripture in one hand and their need in the other. We pray heaven’s blueprint into existence before strategy is deployed.',
    icon: ShieldCheck,
  },
  {
    number: '03',
    title: 'Kingdom restoration',
    summary: 'Restoring spheres to their divine ordination.',
    body: 'Families, market places, schools, and city gates restored to God’s original intention. Restoration is not merely repair — it is an uncompromising return to blueprint.',
    icon: Globe2,
  },
];

const SCRIPTURES = [
  {
    ref: 'Jeremiah 1:10',
    text: 'See, I have this day set thee over the nations and over the kingdoms, to root out, and to pull down, and to destroy, and to throw down, to build, and to plant.',
  },
  {
    ref: 'Ezekiel 22:30',
    text: 'And I sought for a man among them, that should make up the hedge, and stand in the gap before me for the land, that I should not destroy it: but I found none.',
  },
  {
    ref: 'Leviticus 6:13',
    text: 'The fire shall ever be burning upon the altar; it shall never go out.',
  },
];

export default function MandatePage() {
  return (
    <div className="w-full pb-20 pt-8 sm:pb-28 sm:pt-12">
      <div className="container-page">
        {/* ============================================================ HERO */}
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-7 sm:p-12 lg:p-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(750px_400px_at_90%_0%,rgba(176,91,168,0.14),transparent_70%)]"
          />

          <div className="relative max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="mono-label text-gold-300">The Apostolic Mandate · URPN</span>
            </div>

            <h1 className="mt-4 text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] text-cream-50 sm:text-[46px] lg:text-[54px]">
              Restoration is not repair.
              <span className="block text-cream-500">It is a return to blueprint.</span>
            </h1>

            <p className="mt-6 text-[15px] leading-[1.75] text-cream-400 sm:text-[16px]">
              Unique Revival Prayer Network (URPN) is a prophetic altar and apostolic mandate commissioned to recover God’s original divine design for people, families, spheres of influence, and territories across the earth.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/workforce" className="btn btn-primary">
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Become a worker
              </Link>
              <Link href="/gatherings" className="btn btn-secondary">
                View gathering schedules
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================================ THE MANDATE QUOTE */}
        <section className="mt-14 rounded-2xl border border-gold-500/30 bg-gold-500/[0.04] p-7 sm:p-12">
          <span className="mono-label !text-gold-300">The Commission</span>
          <blockquote className="mt-4 border-l-2 border-gold-400 pl-6 text-[22px] font-medium leading-[1.45] tracking-[-0.02em] text-cream-50 sm:text-[28px]">
            “Restoring people, territories, and spheres back to their original divine ordination, such that they operate from that standpoint.”
          </blockquote>
          <p className="mt-4 pl-6 text-sm text-cream-400">
            Before a builder lays the first stone, he consults an architectural design. Before a broken life or territory is restored, heaven consults an original divine blueprint. We are called to that blueprint.
          </p>
        </section>

        {/* ============================================================ THREE PILLARS */}
        <section className="mt-16">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-gold-500/70" />
            <span className="mono-label text-gold-300">Our Foundation</span>
          </div>
          <h2 className="mt-3 text-[26px] font-semibold text-cream-50 sm:text-[34px]">
            The Three Pillars of the Mandate
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.number}
                  className="rounded-2xl border border-line bg-surface p-6 sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-canvas text-gold-300">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs text-cream-600">{pillar.number}</span>
                  </div>
                  <h3 className="mt-5 text-[18px] font-semibold text-cream-50">{pillar.title}</h3>
                  <p className="mt-1 text-xs font-medium text-gold-300/80">{pillar.summary}</p>
                  <p className="mt-3 text-[13px] leading-relaxed text-cream-400">{pillar.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================ SCRIPTURAL ANCHORS */}
        <section className="mt-16">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-gold-500/70" />
            <span className="mono-label text-gold-300">Biblical Authority</span>
          </div>
          <h2 className="mt-3 text-[26px] font-semibold text-cream-50 sm:text-[34px]">
            Anchored in the Living Word
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {SCRIPTURES.map((item) => (
              <div
                key={item.ref}
                className="rounded-2xl border border-line bg-surface/50 p-6"
              >
                <p className="font-mono text-xs font-semibold text-gold-400">{item.ref}</p>
                <p className="mt-3 font-serif text-[14px] italic leading-relaxed text-cream-300">
                  “{item.text}”
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ VISION & MISSION COMPONENT */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-line bg-surface">
          <MandateSection />
        </div>

        {/* ============================================================ CALL TO ACTION */}
        <section className="mt-16 rounded-2xl border border-line bg-surface/60 p-8 sm:p-12 text-center">
          <h3 className="text-[24px] font-semibold text-cream-50 sm:text-[30px]">
            Ready to stand in your divine ordination?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-cream-400">
            URPN trains and deploys workers across seven ministry departments: Media, Technical, Ushering, Protocol, Choir, Welfare, and Children.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/workforce" className="btn btn-primary">
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Become a worker
            </Link>
            <Link href="/testimony" className="btn btn-secondary">
              <Mic className="h-4 w-4" aria-hidden="true" />
              Share a testimony
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
