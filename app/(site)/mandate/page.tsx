import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Flame,
  Users,
  MapPin,
  Layers,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { MandateSection } from '@/components/MandateSection';

export const metadata: Metadata = {
  title: 'Who are we? · The Mandate · URPN',
  description:
    'Reviving people, territories and spheres back to their original ordination such that they operate from that standpoint, by the prophetic and apostolic spirit of Elijah, through intercession and the Word of God.',
};

const MANDATE_SPHERES = [
  {
    icon: Users,
    badge: 'Realm 01',
    title: 'People',
    description:
      'Personal recovery, spiritual awakening, and aligning individuals back to the original ordination God declared over their lives.',
  },
  {
    icon: MapPin,
    badge: 'Realm 02',
    title: 'Territories',
    description:
      'Establishing persistent prayer altars, gatekeeping cities, and breaking territorial strongholds to reclaim land for Christ.',
  },
  {
    icon: Layers,
    badge: 'Realm 03',
    title: 'Spheres',
    description:
      'Apostolic influence across family, marketplace, government, education, and culture with divine excellence.',
  },
];

const TENETS = [
  {
    title: 'Sacrifice',
    desc: 'Sacrificial living to please God and be of true help to men.',
  },
  {
    title: 'Kingdom Service',
    desc: 'Faithful service rendered to God and man for the Kingdom.',
  },
  {
    title: 'Intercession',
    desc: 'Relentless prayer, intercession, and persistent supplication.',
  },
  {
    title: 'The Prophetic',
    desc: 'Hearing God accurately and declaring His counsel into atmospheres.',
  },
  {
    title: 'Spiritual Authority',
    desc: 'Submission to the authority of God in and through men (spiritual and covenant parenting).',
  },
  {
    title: 'Covenant Giving',
    desc: 'Tithing, giving, and receiving in covenant faithfulness.',
  },
  {
    title: 'Supremacy of God’s Will',
    desc: 'Yielding all personal agendas to the sovereign will of God.',
  },
  {
    title: 'Oneness & Unity',
    desc: 'Walking in unity of heart, doctrine, and singular purpose.',
  },
  {
    title: 'Timing & Seasons',
    desc: 'Discerning spiritual clocks, prophetic kairos, and divine shifts.',
  },
  {
    title: 'Honour Practice',
    desc: 'Living with high honour toward God, spiritual leaders, and brethren.',
  },
  {
    title: 'Excellence',
    desc: 'Executing all Kingdom assignments with the highest quality and spirit.',
  },
  {
    title: 'Prosperity',
    desc: 'Holistic abundance in spirit, soul, body, and resources.',
  },
  {
    title: 'Restoration & Deliverance',
    desc: 'Setting captives free and reclaiming lost inheritances.',
  },
  {
    title: 'Holy Spirit Manifestations',
    desc: 'Operating in the raw demonstrations, gifts, and fruits of the Holy Ghost.',
  },
];

const WORKFORCE_CRITERIA = [
  {
    step: '01',
    title: 'Saved in Christ',
    desc: 'One who is born again and truly believes in the Lord Jesus Christ.',
  },
  {
    step: '02',
    title: 'Belief in the Mandate',
    desc: 'Must wholeheartedly believe in the mandate, vision, and spiritual blueprint of URPN.',
  },
  {
    step: '03',
    title: 'Discipline & Submission',
    desc: 'Submit to the spiritual laws, discipline, order, and covenant demands of URPN.',
  },
  {
    step: '04',
    title: 'Kingdom Ambassador',
    desc: 'Represent Christ and URPN with integrity wherever you find yourself.',
  },
  {
    step: '05',
    title: 'Certified Training',
    desc: 'Complete our systematic workforce formation training curriculum and be certified.',
  },
];

export default function MandatePage() {
  return (
    <div className="w-full pb-20 pt-8 sm:pb-28 sm:pt-12">
      <div className="container-page">
        {/* ==================================================== HEADER */}
        <header className="mb-8 px-1 sm:mb-10" data-reveal>
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="mono-label text-gold-400">URPN Blueprint & Foundational Pillars</span>
          </div>
          <h1 className="mt-3 text-[34px] font-semibold leading-[1.06] tracking-[-0.04em] text-cream-50 sm:text-[46px] lg:text-[54px]">
            Who are we?
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-cream-400 sm:text-[16px]">
            Our spiritual ordination, core mission, tenets of faith, and the biblical blueprint of the Unique Revival Prayer Network.
          </p>
        </header>

        {/* ==================================================== THE MANDATE HERO CARD */}
        <section
          aria-labelledby="mandate-card-title"
          className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-sm sm:rounded-3xl sm:p-10"
          data-reveal
        >
          {/* Subtle warm sand background glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/[0.06] blur-3xl"
          />

          {/* Top row: Squircle icon + Title + Relaystack-style active badge */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-raised text-accent shadow-sm">
                <Flame className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <span className="mono-label text-gold-400">Pillar 01 · Divine Ordination</span>
                <h2 id="mandate-card-title" className="text-[24px] font-semibold text-cream-50 sm:text-[30px]">
                  The Mandate
                </h2>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5 text-[11.5px] font-medium text-accent">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span>Apostolic Order</span>
            </div>
          </div>

          {/* Central Prophetic Statement — High contrast, crystal legible */}
          <div className="relative z-10 mt-6 rounded-xl border-l-2 border-accent bg-surface-raised/70 p-5 sm:p-7">
            <p className="text-[17px] font-medium leading-[1.7] text-cream-50 sm:text-[21px] sm:leading-[1.65]">
              “Reviving people, territories and spheres back to their original ordination such that they operate from that standpoint, by the prophetic and apostolic spirit of Elijah, through intercession and the Word of God.”
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-[12px] text-cream-400">
              <span className="flex items-center gap-1.5 text-accent font-medium">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                The Spirit of Elijah
              </span>
              <span className="text-line-strong">·</span>
              <span>Intercession & Seasoned Revelation</span>
            </div>
          </div>

          {/* 3 Spheres Mini-Cards (Relaystack-inspired cards for mobile & desktop) */}
          <div className="relative z-10 mt-6 grid gap-3.5 sm:grid-cols-3">
            {MANDATE_SPHERES.map((sphere) => {
              const Icon = sphere.icon;
              return (
                <div
                  key={sphere.title}
                  className="group rounded-xl border border-line/75 bg-surface-soft/60 p-4 transition-all duration-200 hover:border-line hover:bg-surface-raised"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface text-accent">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-[9.5px] uppercase tracking-wider text-cream-500">
                      {sphere.badge}
                    </span>
                  </div>
                  <h3 className="mt-3 text-[15px] font-semibold text-cream-100">{sphere.title}</h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-cream-400">{sphere.description}</p>
                </div>
              );
            })}
          </div>

          {/* Bottom execution tags */}
          <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-4 text-[12px] text-cream-500">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-gold-400">Two Instruments:</span>
              <span className="rounded-md border border-line px-2 py-0.5 text-[11px] text-cream-300">
                Prophetic Intercession
              </span>
              <span className="rounded-md border border-line px-2 py-0.5 text-[11px] text-cream-300">
                The Word of God
              </span>
            </div>
            <span className="font-mono text-[11px] text-cream-500">Malachi 4:5-6</span>
          </div>
        </section>

        {/* ==================================================== VISION & MISSION */}
        <div className="mt-6 sm:mt-8">
          <MandateSection />
        </div>

        {/* ==================================================== TENETS AND BELIEFS */}
        <section
          aria-labelledby="tenets-title"
          className="mt-6 rounded-2xl border border-line bg-surface p-6 shadow-sm sm:mt-8 sm:rounded-3xl sm:p-9"
          data-reveal
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-raised text-accent">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <span className="mono-label text-gold-400">Pillar 04 · Doctrinal Foundations</span>
                <h2 id="tenets-title" className="text-[22px] font-semibold text-cream-50 sm:text-[28px]">
                  Our Tenets and Beliefs
                </h2>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line-soft bg-surface-raised px-2.5 py-1 text-[11px] font-medium text-cream-300">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              14 Core Tenets
            </span>
          </div>

          <p className="mt-4 max-w-3xl text-[14px] leading-relaxed text-cream-400">
            These truths formulate our beliefs and faith in Christ Jesus. We stand unreservedly upon the sacrifice, resurrection, and finished work of Jesus Christ on the cross, and upon this foundation we affirm:
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {TENETS.map((tenet, index) => (
              <div
                key={tenet.title}
                className="group flex items-start gap-3 rounded-xl border border-line/60 bg-surface-raised/40 p-3.5 transition-colors duration-200 hover:border-line hover:bg-surface-raised"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-center font-mono text-[10.5px] font-semibold text-accent">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[13.5px] font-medium text-cream-100">{tenet.title}</h3>
                  <p className="mt-0.5 text-[12.5px] leading-relaxed text-cream-400">{tenet.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================== WORKFORCE INCLUSION */}
        <section
          aria-labelledby="workforce-criteria-title"
          className="mt-6 rounded-2xl border border-line bg-surface p-6 shadow-sm sm:mt-8 sm:rounded-3xl sm:p-9"
          data-reveal
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-raised text-accent">
                <Award className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <span className="mono-label text-gold-400">Pillar 05 · Workforce Covenant</span>
                <h2 id="workforce-criteria-title" className="text-[22px] font-semibold text-cream-50 sm:text-[28px]">
                  Membership & Inclusion Requirements
                </h2>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line-soft bg-surface-raised px-2.5 py-1 text-[11px] font-medium text-cream-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              5-Step Pathway
            </span>
          </div>

          <p className="mt-4 max-w-3xl text-[14px] leading-relaxed text-cream-400">
            Criteria for becoming an active workforce minister within the Unique Revival Prayer Network:
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {WORKFORCE_CRITERIA.map((criterion) => (
              <div
                key={criterion.step}
                className="flex flex-col justify-between rounded-xl border border-line/60 bg-surface-raised/40 p-4 transition-colors duration-200 hover:border-line hover:bg-surface-raised"
              >
                <div>
                  <span className="font-mono text-[11px] font-semibold text-accent">
                    STEP {criterion.step}
                  </span>
                  <h3 className="mt-2 text-[14px] font-semibold text-cream-100">{criterion.title}</h3>
                  <p className="mt-1 text-[12px] leading-relaxed text-cream-400">{criterion.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action CTA Card */}
          <div className="mt-6 flex flex-col gap-4 rounded-xl border border-line bg-surface-soft p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[14px] font-semibold text-cream-50">Called to serve in the workforce?</p>
              <p className="text-[12.5px] text-cream-400">
                Enroll in the worker training school, complete the formation track, and receive your ministry certification.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Link href="/workforce" className="btn btn-primary btn-sm w-full sm:w-auto">
                Become a worker
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link href="/portal/login" className="btn btn-secondary btn-sm w-full sm:w-auto">
                Staff portal sign in 🔒
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
