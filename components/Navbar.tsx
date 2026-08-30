'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mic, Menu, X } from 'lucide-react';
import { UrpnLogo } from './UrpnLogo';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'The Ministry', href: '/#mandate' },
  { label: 'Gatherings', href: '/#gatherings' },
];

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold-500/15 bg-ink-900/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="URPN home">
          <UrpnLogo size="md" showWordmark />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-cream-300 hover:text-gold-300 transition px-4 py-2 rounded-lg hover:bg-white/5 tracking-wide"
            >
              {l.label}
            </Link>
          ))}

          <Link
            href="/testimony"
            className="ml-3 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-sheen bg-[length:200%_auto] hover:bg-right text-ink-950 font-semibold text-sm shadow-glow-gold transition-all duration-500 hover:scale-[1.03] active:scale-95"
          >
            <Mic className="w-4 h-4" />
            <span>Share Testimony</span>
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="md:hidden p-2.5 rounded-xl border border-gold-500/25 bg-white/5 text-cream-200"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-gold-500/15 bg-ink-900/95 backdrop-blur-2xl px-4 py-4 space-y-1.5 animate-fade-in">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-cream-200 hover:bg-white/5 hover:text-gold-300 transition tracking-wide"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/testimony"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 mt-2 py-3.5 rounded-xl bg-gold-sheen text-ink-950 font-semibold text-sm shadow-glow-gold"
          >
            <Mic className="w-4 h-4" />
            <span>Share Your Testimony</span>
          </Link>
        </div>
      )}
    </header>
  );
};
