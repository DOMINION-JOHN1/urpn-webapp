import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const FLYERS = [
  {
    src: '/flyers/mount-zion-building-project.jpg',
    title: 'Mount Zion Building Project · Support & Partnership',
  },
  {
    src: '/flyers/mount-zion-phase-two.jpg',
    title: 'Mount Zion Building Project · Land Purchase',
  },
];

export function GivingProject() {
  return (
    <section className="container-page py-14 sm:py-20" aria-labelledby="giving-title">
      <div className="max-w-3xl" data-reveal>
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-gold-500/70" aria-hidden="true" />
          <span className="mono-label text-gold-300">Giving · Mount Zion</span>
        </div>
        <h1 id="giving-title" className="mt-5 text-[36px] font-semibold leading-[1.08] tracking-[-0.04em] text-cream-50 sm:text-[52px]">
          The Mount Zion Building Project
        </h1>
        <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-cream-300 sm:text-lg">
          Phase 1 is the purchase of 20 plots of land. The land-purchase flyer lists a ₦50 million
          project goal. The flyers below share the support, partnership, and land-purchase details.
        </p>
      </div>

      <div className="mt-9 grid max-w-5xl gap-5 md:grid-cols-2">
        {FLYERS.map((flyer, index) => (
          <a
            key={flyer.src}
            href={flyer.src}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${flyer.title} flyer in a new tab`}
            className="group overflow-hidden rounded-2xl bg-surface shadow-[0_12px_34px_-28px_rgba(40,20,35,0.4)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
            data-reveal
            style={
              { '--reveal-delay': `${index * 55}ms` } as CSSProperties & {
                '--reveal-delay': string;
              }
            }
          >
            <span className="relative block aspect-[4/5] overflow-hidden bg-canvas">
              <Image
                src={flyer.src}
                alt={flyer.title}
                fill
                sizes="(max-width: 767px) 100vw, 640px"
                className="object-contain transition-transform duration-500 group-hover:scale-[1.015]"
              />
            </span>
            <span className="flex min-h-16 items-center justify-between gap-4 px-5 py-3 text-sm font-medium leading-snug text-cream-200 group-hover:text-cream-50">
              <span>{flyer.title}</span>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-gold-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
