import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RevealObserver } from '@/components/RevealObserver';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <RevealObserver />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
