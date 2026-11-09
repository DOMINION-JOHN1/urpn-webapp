'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Download, Menu, X } from 'lucide-react';
import { UrpnLogo } from './UrpnLogo';
import { ThemeToggle } from './ThemeToggle';

const NAV_LINKS = [
  { href: '/mandate', label: 'Mandate' },
  { href: '/gatherings', label: 'Gatherings' },
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
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-xl">
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label="URPN home" className="shrink-0" onClick={() => setOpen(false)}>
          <UrpnLogo size="md" />
        </Link>

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
            Staff portal 🔒
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
          className="fixed inset-x-0 top-[72px] z-40 h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-canvas px-5 pb-10 pt-6 md:hidden"
        >
          <nav className="flex flex-col" aria-label="Mobile navigation">
            {NAV_LINKS.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-line-soft py-4 text-lg font-medium text-cream-100"
              >
                <span>{link.label}</span>
                <span className="mono-label text-cream-500">0{index + 1}</span>
              </Link>
            ))}
          </nav>
          <Link href="/workforce" onClick={() => setOpen(false)} className="btn btn-primary mt-6 w-full">
            Become a worker
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/portal/login"
            onClick={() => setOpen(false)}
            className="btn btn-secondary mt-2 w-full"
          >
            Staff portal 🔒
          </Link>
          <Link
            href="/install"
            onClick={() => setOpen(false)}
            className="btn btn-secondary mt-2 w-full"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Install app
          </Link>
          <p className="mt-6 text-center text-xs leading-relaxed text-cream-500">
            Workforce formation for every department member.
            <br />
            Install the portal from your browser menu.
          </p>
        </div>
      )}
    </header>
  );
}
