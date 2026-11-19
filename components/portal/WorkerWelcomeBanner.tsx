import React from 'react';
import Image from 'next/image';

export function WorkerWelcomeBanner() {
  return (
    <section className="mb-7 grid overflow-hidden rounded-2xl border border-line bg-surface md:grid-cols-[0.85fr_1.15fr]">
      <div className="relative order-1 aspect-[1.96] bg-canvas-deep md:order-2 md:aspect-auto md:min-h-[340px]">
        <Image
          src="/images/urpn-community.webp"
          alt="URPN workers gathered together at Testaments Saviours"
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-contain"
        />
      </div>
      <div className="order-2 flex flex-col justify-center p-5 sm:p-7 md:order-1 md:p-9">
        <p className="mono-label text-gold-300">URPN · One worker community</p>
        <h2 className="mt-3 max-w-[16ch] text-[24px] font-semibold leading-tight tracking-[-0.035em] text-cream-50 sm:text-[30px]">
          Serving together. Restoring together.
        </h2>
        <p className="mt-3 max-w-md text-[12px] leading-relaxed text-cream-300 sm:text-[13px]">
          Carry the altar into your department, your community, and every sphere God has entrusted to you.
        </p>
      </div>
    </section>
  );
}
