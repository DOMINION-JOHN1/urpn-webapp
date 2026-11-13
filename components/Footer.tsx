import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { UrpnLogo } from './UrpnLogo';
import { InstallAppButton } from './InstallAppButton';

const EXPLORE = [
  { href: '/mandate', label: 'The mandate' },
  { href: '/gatherings', label: 'Gatherings' },
  { href: '/giving', label: 'Giving' },
  { href: '/testimony', label: 'Share a testimony' },
];

const CONNECT = [
  { href: '/workforce', label: 'Become a worker' },
  { href: '/verify', label: 'Verify a certificate' },
  { href: '/install', label: 'Install mobile app' },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="container-page py-14 md:py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" aria-label="URPN home">
              <UrpnLogo size="md" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream-400">
              A prophetic altar of intercession and formation — restoring people, families,
              spheres, and territories to their original divine ordination.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs text-cream-500">
              <MapPin className="h-3.5 w-3.5 text-cream-500" aria-hidden="true" />
              <span>Lokoja, Kogi State · Nigeria</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-5 md:grid-cols-2">
            <div>
              <p className="mono-label mb-4">Explore</p>
              <ul className="space-y-3">
                {EXPLORE.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream-400 transition-colors hover:text-cream-50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mono-label mb-4">Connect</p>
              <ul className="space-y-3">
                {CONNECT.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream-400 transition-colors hover:text-cream-50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="mono-label mb-4">The app</p>
            <p className="mb-4 text-sm leading-relaxed text-cream-400">
              Install the URPN app on your phone. Gatherings, prayer schedules, and testimonies
              stay in sync.
            </p>
            <InstallAppButton variant="secondary" label="Install app" className="w-full" />
            <div className="mt-3">
              <Link
                href="/install"
                className="inline-flex items-center gap-1.5 text-xs text-cream-500 transition-colors hover:text-cream-50"
              >
                Installation guide
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line-soft pt-6 text-xs text-cream-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} URPN — Unique Revival Prayer Network.</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold-600">
            Restore · Equip · Deploy
          </p>
        </div>
      </div>
    </footer>
  );
}
