import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Calendar,
  Flame,
  MapPin,
  Mic,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { MeetingSchedule } from '@/components/MeetingSchedule';

export const metadata: Metadata = {
  title: 'Gatherings & Schedules · Unique Revival Prayer Network',
  description:
    'Join our daily weekday prayers, Weekly Furnace, Intensify vigil, third-weekend Kingdomite, and annual August Convergence in Lokoja, Kogi State and online.',
};

export default function GatheringsPage() {
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
              <span className="mono-label text-gold-300">Gatherings · Prayer Altars</span>
            </div>

            <h1 className="mt-4 text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] text-cream-50 sm:text-[46px] lg:text-[54px]">
              The Altar of Prayer.
              <span className="block text-cream-500">Where territories are shifted.</span>
            </h1>

            <p className="mt-6 text-[15px] leading-[1.75] text-cream-400 sm:text-[16px]">
              URPN is a prayer network before it is anything else. Join us for daily weekday prayers, The Weekly Furnace, Intensify vigil, Kingdomite every third weekend, and annual Convergence in August. Add dates directly to your Google Calendar.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/workforce" className="btn btn-primary">
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Become a worker
              </Link>
              <Link href="/testimony" className="btn btn-secondary">
                <Mic className="h-4 w-4" aria-hidden="true" />
                Share a testimony
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================================ SCHEDULE COMPONENT */}
        <div className="mt-14 overflow-hidden rounded-2xl border border-line bg-surface">
          <MeetingSchedule />
        </div>

        {/* ============================================================ LOCATION CARD */}
        <section className="mt-14 rounded-2xl border border-line bg-surface/60 p-7 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="mono-label !text-gold-300">Physical Locations</span>
              <h3 className="mt-2 text-[22px] font-semibold text-cream-50">
                Where We Meet in Lokoja
              </h3>
              <p className="mt-1 text-sm text-cream-400">
                Kingdomite is hosted at St. Luke&apos;s Anglican Church, Adankolo. Weekly and daily prayers take place at the URPN Family House.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-line bg-canvas px-4 py-3 text-xs text-cream-300">
                <MapPin className="h-4 w-4 text-gold-400" />
                <span>Lokoja, Kogi State · Nigeria</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
