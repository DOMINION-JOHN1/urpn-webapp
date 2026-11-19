import React from 'react';
import Image from 'next/image';

export function WorkforceSignInVisual({ compact = false }: { compact?: boolean }) {
  return (
    <section
      aria-labelledby={compact ? undefined : 'workforce-visual-title'}
      aria-label={compact ? 'URPN community photos' : undefined}
    >
      {!compact && (
        <div className="mb-5">
          <p className="mono-label text-gold-300">One mission · many ways to serve</p>
          <h2 id="workforce-visual-title" className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.035em] text-cream-50 sm:text-[34px]">
            A community in motion.
          </h2>
          <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-cream-400">
            Grow in your calling, build with one another, and carry the altar into every sphere.
          </p>
        </div>
      )}
      <figure className={`relative isolate overflow-hidden rounded-2xl border border-line bg-canvas-deep ${compact ? 'aspect-[1.7] min-h-[190px]' : 'aspect-[1.9] min-h-[280px] sm:min-h-[330px]'}`}>
        <div className="workforce-sign-frame workforce-sign-frame-a absolute inset-0">
          <Image
            src="/images/urpn-community.webp"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-1 sm:p-2"
          />
        </div>
        <div className="workforce-sign-frame workforce-sign-frame-b absolute inset-0">
          <Image
            src="/images/urpn-worship.webp"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-1 sm:p-2"
          />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />
        <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 sm:p-5">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/85 sm:text-[10px]">
            Together in worship · Together in service
          </span>
          <span aria-hidden="true" className="flex h-2.5 w-2.5 shrink-0 rounded-full bg-gold-300 shadow-[0_0_14px_rgba(204,191,155,0.65)] motion-safe:animate-pulse" />
        </figcaption>
      </figure>
    </section>
  );
}
