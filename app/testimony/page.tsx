import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { TestimonyForm } from '@/components/TestimonyForm';

export const metadata: Metadata = {
  title: 'Share Your Testimony · URPN',
  description:
    'Record a short voice or video testimony of what God has done. Your story could strengthen someone’s faith.',
};

export default function TestimonyPage() {
  return (
    <div className="w-full min-h-screen py-14 md:py-20 px-4 sm:px-6 flex flex-col items-center">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10 space-y-5 animate-fade-in">
        <div className="flex justify-center">
          <span className="relative h-16 w-16">
            <Image src="/urpn-logo-mark.png" alt="URPN emblem" fill sizes="64px" className="object-contain drop-shadow-[0_2px_16px_rgba(237,165,30,0.4)]" />
          </span>
        </div>

        <span className="inline-block font-cinzel text-xs sm:text-sm font-semibold tracking-[0.26em] uppercase text-gold-400">
          Give God the Glory
        </span>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-cream-50 leading-[1.05]">
          Share Your Testimony
        </h1>

        <div className="rule-gold w-24 mx-auto" />

        <p className="text-cream-300 text-base sm:text-lg leading-relaxed font-light">
          Speak from your heart about what God has done. Your story could encourage someone else and
          build a memorial of His wonders.
        </p>
      </div>

      {/* Form */}
      <div className="w-full relative z-10">
        <TestimonyForm />
      </div>
    </div>
  );
}
