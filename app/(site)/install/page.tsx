import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Monitor,
  Share,
  ShieldCheck,
  Smartphone,
  TabletSmartphone,
} from 'lucide-react';
import { InstallAppButton } from '@/components/InstallAppButton';

export const metadata: Metadata = {
  title: 'Install the app',
  description:
    'Install the URPN worker portal on your phone or computer. No app store required — lessons, progress, exams, and certificates in a full-screen app.',
};

const PLATFORMS = [
  {
    icon: Smartphone,
    title: 'iPhone & iPad',
    subtitle: 'Safari',
    steps: [
      'Open this website in Safari.',
      'Tap the Share button in the toolbar.',
      'Choose “Add to Home Screen”, then tap Add.',
    ],
  },
  {
    icon: TabletSmartphone,
    title: 'Android',
    subtitle: 'Chrome',
    steps: [
      'Open this website in Chrome.',
      'Tap the three-dot menu in the top-right corner.',
      'Choose “Install app” or “Add to Home screen”.',
    ],
  },
  {
    icon: Monitor,
    title: 'Desktop',
    subtitle: 'Chrome, Edge, Brave',
    steps: [
      'Open the portal in your browser.',
      'Look for the install icon in the address bar.',
      'Click Install and open URPN like any desktop app.',
    ],
  },
];

const REASONS = [
  {
    icon: Download,
    title: 'No app store',
    body: 'Install directly from the browser in seconds — no download, no store account, no update queue.',
  },
  {
    icon: TabletSmartphone,
    title: 'Full-screen experience',
    body: 'The portal opens without browser chrome, with a proper app icon and a mobile tab bar.',
  },
  {
    icon: CheckCircle2,
    title: 'Progress stays in sync',
    body: 'Your lessons, exam attempt, and certificate are tied to your account, not the device.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by design',
    body: 'Video and audio stream inside the signed-in app. The app shell never caches your private portal data.',
  },
];

export default function InstallPage() {
  return (
    <div className="container-page py-14 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-gold-500/70" />
            <span className="mono-label text-gold-300">The URPN app</span>
          </div>
          <h1 className="mt-5 text-[38px] font-semibold leading-[1.05] tracking-[-0.045em] text-cream-50 sm:text-[52px]">
            Take the portal with you.
          </h1>
          <p className="mt-5 max-w-lg text-[14.5px] leading-[1.75] text-cream-400">
            Install URPN on your phone, tablet, or computer. It opens full screen, keeps your
            training one tap away, and still streams every lesson securely inside the app.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <InstallAppButton variant="primary" label="Install URPN" className="w-full sm:w-auto" />
            <Link href="/portal" className="btn btn-secondary w-full sm:w-auto">
              Open worker portal
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <p className="mt-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-cream-500">
            No app store
            <span className="mx-2 text-line-strong">·</span>
            Free installation
            <span className="mx-2 text-line-strong">·</span>
            iOS, Android, desktop
          </p>
        </div>

        <div>
          <div className="rounded-2xl border border-line bg-surface p-5 shadow-[0_40px_100px_-50px_rgba(0,0,0,0.35)] sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-line-soft pb-4">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="mono-label !text-[9.5px]">URPN on your home screen</span>
              </div>
              <span className="rounded-full border border-line bg-canvas/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-cream-400">
                Installable
              </span>
            </div>

            <div className="mt-5 flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-gold-500/25 bg-gold-500/[0.06] text-gold-300">
                <Download className="h-6 w-6" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[16px] font-medium text-cream-50">URPN Worker Portal</p>
                <p className="mt-1 text-[12px] leading-relaxed text-cream-400">
                  Foundation, Ministers, and Pastors training — with your progress, exam, and
                  certificates.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-line-soft bg-canvas/40 px-3 py-2.5">
                <p className="mono-label !text-[8.5px]">Works offline</p>
                <p className="mt-1 text-[12px] text-cream-200">Shell + fallback</p>
              </div>
              <div className="rounded-lg border border-line-soft bg-canvas/40 px-3 py-2.5">
                <p className="mono-label !text-[8.5px]">Lessons</p>
                <p className="mt-1 text-[12px] text-cream-200">Streamed securely</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-line-soft pt-4">
              <span className="mono-label !text-[9px]">Add to home screen</span>
              <Share className="h-4 w-4 text-accent" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-4 text-center font-mono text-[9.5px] uppercase tracking-[0.18em] text-cream-500">
            One tap from the home screen
          </p>
        </div>
      </div>

      <div className="mt-14 border-t border-line-soft pt-12">
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-gold-500/70" />
          <span className="mono-label text-gold-300">How to install</span>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {PLATFORMS.map((platform) => (
            <div
              key={platform.title}
              className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-canvas text-accent">
                  <platform.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-[15px] font-medium text-cream-50">{platform.title}</h2>
                  <p className="mono-label !text-[8.5px]">{platform.subtitle}</p>
                </div>
              </div>
              <ol className="mt-5 space-y-3">
                {platform.steps.map((step, index) => (
                  <li key={step} className="flex gap-2.5 text-[12px] leading-relaxed text-cream-400">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line bg-canvas font-mono text-[9px] text-gold-300">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map((reason) => (
          <div key={reason.title} className="bg-surface p-5">
            <reason.icon className="h-5 w-5 text-gold-300" aria-hidden="true" />
            <h3 className="mt-4 text-[13.5px] font-medium text-cream-50">{reason.title}</h3>
            <p className="mt-2 text-[11.5px] leading-relaxed text-cream-400">{reason.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-[11.5px] leading-relaxed text-cream-500">
        Already installed?{' '}
        <Link href="/portal" className="text-accent transition-colors hover:text-accent-hover">
          Open the worker portal
        </Link>
        . On iPhone and iPad, installation must be done from Safari.
      </p>
    </div>
  );
}
