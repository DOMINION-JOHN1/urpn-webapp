import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, HandHeart, Sprout, ArrowRight, Mic, Quote } from 'lucide-react';
import { MandateSection } from '@/components/MandateSection';
import { MeetingSchedule } from '@/components/MeetingSchedule';
import { MinistryGallery } from '@/components/MinistryGallery';
import { HeroBackdrop } from '@/components/HeroBackdrop';

const PILLARS = [
  {
    icon: Flame,
    title: 'Revival Fire',
    body: 'A burning altar kept aflame — pursuing the presence of God until nations feel His weight.',
  },
  {
    icon: HandHeart,
    title: 'Prophetic Intercession',
    body: 'Standing in the gap by the spirit of Elijah, praying heaven’s blueprint over people and territories.',
  },
  {
    icon: Sprout,
    title: 'Kingdom Restoration',
    body: 'Restoring people, families, and spheres back to their original divine ordination.',
  },
];

export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* ============================= HERO ============================= */}
      <section className="relative isolate w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Cinematic background */}
        <div className="absolute inset-0 -z-10">
          <HeroBackdrop />
        </div>

        <div className="max-w-4xl mx-auto text-center px-5 py-20 space-y-8 animate-fade-in">
          {/* Emblem */}
          <div className="flex justify-center">
            <span className="relative h-24 w-24 sm:h-28 sm:w-28 animate-float-slow">
              <Image
                src="/urpn-logo-mark.png"
                alt="URPN emblem"
                fill
                sizes="112px"
                priority
                className="object-contain drop-shadow-[0_4px_30px_rgba(237,165,30,0.45)]"
              />
            </span>
          </div>

          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-4">
            <span className="hidden sm:block h-px w-12 bg-gradient-to-r from-transparent to-gold-500/70" />
            <span className="font-cinzel text-[11px] sm:text-sm font-semibold tracking-[0.28em] uppercase text-gold-300">
              Unique Revival Prayer Network
            </span>
            <span className="hidden sm:block h-px w-12 bg-gradient-to-l from-transparent to-gold-500/70" />
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-cream-50 leading-[1.02] tracking-tight">
            Restoring People, Families
            <span className="block text-gold-sheen">Spheres &amp; Territories</span>
          </h1>

          {/* Subtitle */}
          <p className="text-cream-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            A prophetic altar of intercession and fire — raising a generation that looks like God
            and carries His original blueprint into every sphere of life.
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#gatherings"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gold-sheen bg-[length:200%_auto] hover:bg-right text-ink-950 font-semibold text-base shadow-glow-gold-lg transition-all duration-500 hover:scale-[1.03] active:scale-95"
            >
              <span>Join Our Gatherings</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/testimony"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl border border-gold-400/40 bg-white/[0.04] hover:bg-white/[0.08] text-cream-100 font-medium text-base backdrop-blur-sm transition hover:scale-[1.02] active:scale-95"
            >
              <Mic className="w-5 h-5 text-gold-300" />
              <span>Share Your Testimony</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ MANDATE QUOTE STRIP ============ */}
      <section className="w-full max-w-4xl mx-auto px-5 py-16 md:py-20 text-center">
        <Quote className="w-9 h-9 text-gold-500/60 mx-auto mb-6" />
        <p className="font-display text-2xl sm:text-3xl md:text-4xl italic font-medium text-cream-100 leading-snug">
          “Restoring people, territories, and spheres back to their original ordination, such that
          they operate from that standpoint.”
        </p>
        <p className="mt-6 font-cinzel text-xs sm:text-sm tracking-[0.24em] uppercase text-bronze-300">
          The Apostolic Mandate of URPN
        </p>
      </section>

      {/* ============ THREE PILLARS ============ */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="group panel rounded-3xl p-8 text-center hover:border-gold-500/40 transition-colors duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gold-500/20 to-royal-600/20 border border-gold-500/30 flex items-center justify-center text-gold-300 group-hover:scale-110 transition-transform duration-300">
                <p.icon className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-cream-100 mb-3">{p.title}</h3>
              <p className="text-cream-400 text-sm leading-relaxed font-light">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ MINISTRY PHOTO GALLERY ============ */}
      <MinistryGallery />

      {/* ============ MANDATE / VISION / MISSION ============ */}
      <div id="mandate" className="w-full scroll-mt-24">
        <MandateSection />
      </div>

      {/* ============ MEETING SCHEDULE ============ */}
      <div id="gatherings" className="w-full scroll-mt-24">
        <MeetingSchedule />
      </div>

      {/* ============ TESTIMONY INVITATION ============ */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-20 md:my-24">
        <div className="relative overflow-hidden rounded-[2rem] border border-gold-500/25 shadow-elevate">
          <Image
            src="/images/ministry-praise.jpg"
            alt="Thanksgiving and praise"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-royal-950/70" />
          <div className="relative z-10 p-9 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left max-w-xl">
              <span className="font-cinzel text-xs tracking-[0.24em] uppercase text-gold-300">
                Give God the Glory
              </span>
              <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-cream-50 mt-3 leading-tight">
                Has God done something wonderful?
              </h3>
              <p className="text-cream-300 mt-4 text-base sm:text-lg font-light leading-relaxed">
                Your story could strengthen someone’s faith. Record a short voice or video
                testimony — it only takes a couple of minutes.
              </p>
            </div>
            <Link
              href="/testimony"
              className="shrink-0 flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gold-sheen bg-[length:200%_auto] hover:bg-right text-ink-950 font-semibold text-base shadow-glow-gold-lg transition-all duration-500 hover:scale-[1.03] active:scale-95"
            >
              <Mic className="w-5 h-5" />
              <span>Share Your Testimony</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
