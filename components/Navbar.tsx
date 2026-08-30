import React from 'react';
import Link from 'next/link';
import { UrpnLogo } from './UrpnLogo';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold-500/15 bg-ink-900/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-center">
        <Link href="/testimony" className="flex items-center" aria-label="URPN — Unique Revival Prayer Network">
          <UrpnLogo size="md" showWordmark />
        </Link>
      </div>
    </header>
  );
};
