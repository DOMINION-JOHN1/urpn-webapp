'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Download, Menu, X } from 'lucide-react';
import { UrpnLogo } from './UrpnLogo';
import { ThemeToggle } from './ThemeToggle';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/mandate', label: 'Mandate' },
  { href: '/gatherings', label: 'Gatherings' },
  { href: '/giving', label: 'Giving' },
  { href: '/testimony', label: 'Testimony' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas">
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <div className="shrink-0">
          <UrpnLogo size="md" />
        </div>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[13.5px] font-medium transition-colors ${
                pathname === link.href
                  ? 'text-cream-50'
                  : 'text-cream-400 hover:text-cream-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/workforce" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Become a worker
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/portal/login"
            className="btn btn-secondary btn-sm hidden sm:inline-flex"
            title="In-house staff and leadership portal"
          >
            Staff sign in 🔒
          </Link>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-cream-200 transition-colors hover:border-line-strong hover:text-cream-50 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-[72px] z-40 flex h-[calc(100dvh-72px)] flex-col justify-between overflow-y-auto border-t border-line bg-canvas px-5 pb-8 pt-5 md:hidden"
        >
          <div>
            <div className="flex items-center justify-between pb-2">
              <span className="mono-label text-gold-400">Navigation</span>
              <span className="font-mono text-[10px] text-cream-500">{NAV_LINKS.length} Sections</span>
            </div>
            <nav className="flex flex-col space-y-1.5 pt-2" aria-label="Mobile navigation">
              {NAV_LINKS.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-xl border p-3.5 text-[15px] font-medium transition-colors ${
                      isActive
                        ? 'border-accent/40 bg-surface-raised text-cream-50 shadow-sm'
                        : 'border-line/70 bg-surface/60 text-cream-200 hover:border-line hover:text-cream-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md border border-line bg-surface text-center font-mono text-[10px] text-accent">
                        0{index + 1}
                      </span>
                      <span>{link.label}</span>
                    </div>
                    {isActive && (
                      <span className="flex h-2 w-2 rounded-full bg-accent" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 border-t border-line-soft pt-4">
              <span className="mono-label text-gold-400">Workforce & Portal</span>
              <div className="mt-3 space-y-2">
                <Link
                  href="/workforce"
                  onClick={() => setOpen(false)}
                  className="btn btn-primary w-full justify-between"
                >
                  <span>Become a worker</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/portal/login"
                  onClick={() => setOpen(false)}
                  className="btn btn-secondary w-full justify-between"
                >
                  <span>Staff portal sign in</span>
                  <span className="text-[12px]">🔒</span>
                </Link>
                <Link
                  href="/install"
                  onClick={() => setOpen(false)}
                  className="btn btn-secondary w-full justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Install app
                  </span>
                  <span className="font-mono text-[10px] text-cream-500">PWA</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-line bg-surface-soft/80 p-3.5 text-center text-xs leading-relaxed text-cream-400">
            <div className="flex items-center justify-center gap-2 font-medium text-cream-200">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>Unique Revival Prayer Network</span>
            </div>
            <p className="mt-1 text-[11px] text-cream-500">
              Lokoja, Kogi State · Restoring the original divine ordination
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
