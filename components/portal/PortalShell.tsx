'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Award,
  BookOpen,
  GraduationCap,
  LayoutGrid,
  Globe,
  ArrowUpRight,
  Users,
} from 'lucide-react';
import { UrpnLogo } from '@/components/UrpnLogo';
import { InstallAppButton } from '@/components/InstallAppButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SignOutButton } from './SignOutButton';
import type { PublicUser } from '@/lib/server/types';

interface PortalShellProps {
  user: PublicUser;
  children: React.ReactNode;
}

const LEADERSHIP_TRACKS = [
  { href: '/portal/courses/ministers', label: 'Ministers Training', code: '201' },
  { href: '/portal/courses/pastors', label: 'Pastors Training', code: '301' },
];

const WORKFORCE_TRACKS = [
  { href: '/portal/courses/aesthetics', label: 'Aesthetics', code: 'AES' },
  { href: '/portal/courses/pr', label: 'Public Relations', code: 'PR' },
  { href: '/portal/courses/protocol', label: 'Protocol', code: 'PRO' },
  { href: '/portal/courses/ushering', label: 'Ushering', code: 'USH' },
  { href: '/portal/courses/technical', label: 'Technical', code: 'TEC' },
  { href: '/portal/courses/media', label: 'Media', code: 'MED' },
  { href: '/portal/courses/choir', label: 'Choir / Worship', code: 'CHO' },
  { href: '/portal/courses/welfare', label: 'Welfare', code: 'WEL' },
  { href: '/portal/courses/prayer', label: 'Prayer', code: 'PRA' },
  { href: '/portal/courses/counseling', label: 'Counseling', code: 'CNS' },
  { href: '/portal/courses/transport', label: 'Transport', code: 'TRN' },
  { href: '/portal/courses/medical', label: 'Medical', code: 'MED' },
  { href: '/portal/courses/security', label: 'Security', code: 'SEC' },
  { href: '/portal/courses/children', label: 'Children/Teens', code: 'CHI' },
  { href: '/portal/courses/publications', label: 'Publications & Academic', code: 'PUB' },
  { href: '/portal/courses/drama', label: 'Drama & Demonstration', code: 'DRM' },
];

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function isActive(pathname: string, href: string, exact: boolean) {
  if (href === '/') return pathname === '/';
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function PortalShell({ user, children }: PortalShellProps) {
  const pathname = usePathname();
  const isWorkforce = user.role === 'workforce';

  const tracks = isWorkforce ? WORKFORCE_TRACKS : LEADERSHIP_TRACKS;
  const tracksTitle = isWorkforce ? 'Departments' : 'Leadership tracks';

  const primaryNav = isWorkforce
    ? [
        { href: '/workforce', label: 'Workforce Hub', icon: LayoutGrid, exact: true },
        { href: '/portal/courses', label: 'Departments', icon: GraduationCap, exact: false },
        { href: '/portal/certificates', label: 'Certificates', icon: Award, exact: false },
      ]
    : [
        { href: '/portal', label: 'Overview', icon: LayoutGrid, exact: true },
        { href: '/portal/courses', label: 'Leadership tracks', icon: GraduationCap, exact: false },
        { href: '/portal/monitor', label: 'Progress Monitor', icon: Users, exact: false },
        { href: '/portal/certificates', label: 'Certificates', icon: Award, exact: false },
      ];

  const mobileNav = [
    { href: isWorkforce ? '/workforce' : '/portal', label: 'Overview', icon: LayoutGrid, exact: true },
    { href: '/portal/courses', label: isWorkforce ? 'Departments' : 'Training', icon: BookOpen, exact: false },
    ...(!isWorkforce ? [{ href: '/portal/monitor', label: 'Monitor', icon: Users, exact: false }] : []),
    { href: '/portal/certificates', label: 'Certificates', icon: Award, exact: false },
    { href: '/', label: 'Website', icon: Globe, exact: false },
  ];

  return (
    <div className="portal-root min-h-[100dvh] bg-canvas lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      {/* ---------------------------------------------------------- sidebar */}
      <aside className="sticky top-0 hidden h-[100dvh] flex-col border-r border-line bg-canvas-deep/50 px-4 py-5 lg:flex">
        <Link href={isWorkforce ? '/workforce' : '/portal'} aria-label="URPN portal home" className="px-2">
          <UrpnLogo size="sm" />
        </Link>

        <nav className="mt-8" aria-label="Portal">
          <p className="mono-label px-3 !text-[9px]">Workspace</p>
          <ul className="mt-2 space-y-0.5">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href, item.exact);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors ${
                      active
                        ? 'bg-cream-50/[0.06] text-cream-50'
                        : 'text-cream-400 hover:bg-cream-50/[0.03] hover:text-cream-50'
                    }`}
                  >
                    <item.icon
                      className={`h-4 w-4 ${active ? 'text-accent' : 'text-cream-500'}`}
                      aria-hidden="true"
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <nav className="mt-7" aria-label="Training tracks">
          <p className="mono-label px-3 !text-[9px]">{tracksTitle}</p>
          <ul className="mt-2 space-y-0.5">
            {tracks.map((track) => {
              const active = pathname.startsWith(track.href);
              return (
                <li key={track.href}>
                  <Link
                    href={track.href}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-[13px] transition-colors ${
                      active
                        ? 'bg-cream-50/[0.06] text-cream-50'
                        : 'text-cream-400 hover:bg-cream-50/[0.03] hover:text-cream-50'
                    }`}
                  >
                    <span>{track.label}</span>
                    <span className="font-mono text-[9px] tracking-[0.1em] text-cream-600">
                      {track.code}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto space-y-3 pt-6">
          <div className="flex items-center gap-2">
            <InstallAppButton variant="secondary" label="Install app" className="flex-1 !text-[12px]" />
            <ThemeToggle />
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-[12.5px] text-cream-400 transition-colors hover:bg-cream-50/[0.04] hover:text-cream-50"
          >
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            Back to website
            <ArrowUpRight className="ml-auto h-3 w-3" aria-hidden="true" />
          </Link>

          <div className="rounded-xl border border-line bg-surface/60 p-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-[11px] text-accent">
                {initials(user.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12.5px] font-medium text-cream-50">{user.name}</p>
                <p className="truncate text-[10.5px] text-cream-500">{user.email}</p>
              </div>
            </div>
            <div className="mt-2 border-t border-line-soft pt-1">
              <SignOutButton />
            </div>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- main */}
      <div className="flex min-h-[100dvh] min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-canvas/90 px-4 backdrop-blur-lg lg:hidden">
          <Link href="/portal" aria-label="URPN portal home">
            <UrpnLogo size="sm" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 font-mono text-[10px] text-accent">
              {initials(user.name)}
            </span>
            <ThemeToggle className="h-8 w-8" />
            <SignOutButton compact />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1080px] flex-1 px-4 pb-24 pt-6 sm:px-6 sm:pt-8 lg:px-10 lg:pb-14 lg:pt-10">
          {children}
        </main>
      </div>

      {/* -------------------------------------------------------- mobile nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas-deep/95 backdrop-blur-xl lg:hidden"
        aria-label="Portal mobile navigation"
      >
        <div className="safe-bottom mx-auto grid max-w-md grid-cols-4 px-2 pt-1.5">
          {mobileNav.map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 rounded-lg py-1.5 text-[9.5px] font-medium transition-colors ${
                  active ? 'text-accent' : 'text-cream-500 hover:text-cream-200'
                }`}
              >
                <item.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
