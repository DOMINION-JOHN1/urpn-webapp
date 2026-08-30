import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, MapPin } from 'lucide-react';
import { UrpnLogo } from './UrpnLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-gold-500/15 bg-ink-950/70 py-14 px-4 mt-10">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-7">
        <Link href="/" className="inline-block">
          <UrpnLogo size="lg" showWordmark />
        </Link>

        <div className="rule-gold w-40" />

        <p className="font-display italic text-cream-200 text-xl sm:text-2xl max-w-xl mx-auto leading-relaxed">
          “And they overcame him by the blood of the Lamb, and by the word of their testimony.”
          <span className="block font-sans not-italic text-xs font-semibold tracking-[0.2em] text-gold-400 mt-3 uppercase">
            Revelation 12:11
          </span>
        </p>

        {/* Quick links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-cream-300">
          <Link href="/" className="hover:text-gold-300 transition">Home</Link>
          <Link href="/#mandate" className="hover:text-gold-300 transition">The Ministry</Link>
          <Link href="/#gatherings" className="hover:text-gold-300 transition">Gatherings</Link>
          <Link href="/testimony" className="hover:text-gold-300 transition">Share Testimony</Link>
        </nav>

        <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-cream-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-gold-500" />
            <span>Handled with pastoral confidentiality</span>
          </span>
          <span className="hidden sm:inline text-bronze-600">•</span>
          <span className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-gold-500" />
            <span>Reviewed with prayer and care</span>
          </span>
        </div>

        <div className="pt-5 border-t border-white/5 w-full text-xs text-cream-500 leading-relaxed">
          © {new Date().getFullYear()} URPN — Unique Revival Prayer Network. Restoring People,
          Families, Spheres &amp; Territories.
        </div>
      </div>
    </footer>
  );
};
