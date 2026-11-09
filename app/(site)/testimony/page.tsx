import React from 'react';
import { Metadata } from 'next';
import { Heart, ShieldCheck, Mic, Video, PenLine } from 'lucide-react';
import { TestimonyForm } from '@/components/TestimonyForm';

export const metadata: Metadata = {
  title: 'Share your testimony',
  description:
    'Record a short voice or video testimony, or write it down. Your story could strengthen someone’s faith.',
};

export default function TestimonyPage() {
  return (
    <div className="container-page py-14 sm:py-20">
      <div className="max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-gold-500/70" />
          <span className="mono-label text-gold-300">Give God the glory</span>
        </div>
        <h1 className="mt-5 text-[38px] font-semibold leading-[1.05] tracking-[-0.04em] text-cream-50 sm:text-[52px]">
          Share your testimony.
        </h1>
        <p className="mt-5 max-w-xl text-[14.5px] leading-[1.75] text-cream-400">
          Speak from your heart about what God has done. Your story could encourage someone
          else and become a memorial of His wonders.
        </p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <aside className="lg:pt-2">
          <blockquote className="border-l border-gold-500/50 pl-5 text-[19px] font-medium leading-[1.55] tracking-[-0.02em] text-cream-100 sm:text-[21px]">
            “And they overcame him by the blood of the Lamb, and by the word of their testimony.”
          </blockquote>
          <p className="mt-4 pl-5 font-mono text-[10px] uppercase tracking-[0.18em] text-cream-500">
            Revelation 12:11
          </p>

          <div className="mt-9 space-y-4">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
              <div>
                <p className="text-[13px] font-medium text-cream-100">
                  Handled with pastoral confidentiality
                </p>
                <p className="mt-1 text-xs leading-relaxed text-cream-500">
                  Your testimony is received by the URPN pastoral team and reviewed with prayer
                  and care.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Heart className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
              <div>
                <p className="text-[13px] font-medium text-cream-100">No account needed</p>
                <p className="mt-1 text-xs leading-relaxed text-cream-500">
                  Record in your browser or write it down. It only takes a couple of minutes.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-9 border-t border-line-soft pt-5">
            <p className="mono-label mb-3">Ways to share</p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11px] text-cream-300">
                <Mic className="h-3 w-3" aria-hidden="true" />
                Voice
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11px] text-cream-300">
                <Video className="h-3 w-3" aria-hidden="true" />
                Video
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11px] text-cream-300">
                <PenLine className="h-3 w-3" aria-hidden="true" />
                Written
              </span>
            </div>
          </div>
        </aside>

        <div className="w-full">
          <TestimonyForm />
        </div>
      </div>
    </div>
  );
}
