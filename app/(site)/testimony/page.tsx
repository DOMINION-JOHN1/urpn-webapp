import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { TestimonyForm } from '@/components/TestimonyForm';

export const metadata: Metadata = {
  title: 'Share your testimony · URPN',
  description: 'Share your testimony with URPN.',
};

export default function TestimonyPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <header className="max-w-2xl" data-reveal>
        <h1 className="text-[38px] font-semibold leading-[1.05] tracking-[-0.04em] text-cream-50 sm:text-[52px]">
          Share your testimony.
        </h1>
      </header>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
        <aside className="lg:sticky lg:top-28 lg:pt-7" data-reveal>
          <blockquote className="border-l-2 border-accent/55 pl-5 text-[20px] font-medium leading-[1.55] tracking-[-0.02em] text-cream-100 sm:text-[23px]">
            “And they overcame him by the blood of the Lamb, and by the word of their testimony.”
          </blockquote>
          <p className="mt-4 pl-5 font-mono text-[10px] uppercase tracking-[0.18em] text-cream-500">
            Revelation 12:11
          </p>
        </aside>

        <div
          className="w-full"
          data-reveal
          style={{ '--reveal-delay': '70ms' } as CSSProperties & { '--reveal-delay': string }}
        >
          <TestimonyForm />
        </div>
      </div>
    </div>
  );
}
