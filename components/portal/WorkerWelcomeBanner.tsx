import React from 'react';
import Image from 'next/image';

export function WorkerWelcomeBanner() {
  return (
    <section className="relative isolate mb-7 min-h-[190px] overflow-hidden rounded-2xl border border-line sm:min-h-[230px]">
      <Image
        src="/images/urpn-community.webp"
        alt="URPN workers gathered together at Testaments Saviours"
        fill
        sizes="(max-width: 1024px) 100vw, 80vw"
        className="-z-20 object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/45 to-black/10"
      />
      <div className="relative z-10 flex min-h-[190px] max-w-xl flex-col justify-end p-5 sm:min-h-[230px] sm:p-7">
        <p className="mono-label text-gold-300">URPN · One worker community</p>
        <h2 className="mt-2 text-[24px] font-semibold leading-tight tracking-[-0.035em] text-white sm:text-[30px]">
          Serving together. Restoring together.
        </h2>
        <p className="mt-2 max-w-md text-[12px] leading-relaxed text-white/80 sm:text-[13px]">
          Carry the altar into your department, your community, and every sphere God has entrusted to you.
        </p>
      </div>
    </section>
  );
}
