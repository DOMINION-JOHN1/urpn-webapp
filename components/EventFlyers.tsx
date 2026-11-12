import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const FLYERS = [
  { src: '/flyers/furnace-experience.jpg', title: 'Furnace Experience' },
  { src: '/flyers/mount-zion-building-project.jpg', title: 'Mount Zion Building Project' },
  { src: '/flyers/mount-zion-phase-two.jpg', title: 'Mount Zion Building Project · Phase Two' },
  { src: '/flyers/intensify.jpg', title: 'Intensify' },
  { src: '/flyers/12-hours-prayer-stretch.jpg', title: '12 Hours Prayer Stretch' },
  { src: '/flyers/for-the-testimony-3.jpg', title: 'For the Testimony 3' },
  { src: '/flyers/testaments-revival.jpg', title: 'Testaments Revival' },
];

export function EventFlyers() {
  return (
    <section className="mt-14 border-t border-line-soft pt-12" aria-labelledby="flyers-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-reveal>
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-gold-500/70" />
            <span className="mono-label text-gold-300">From the URPN family</span>
          </div>
          <h2 id="flyers-title" className="mt-4 text-[28px] font-semibold tracking-[-0.035em] text-cream-50 sm:text-[34px]">
            Flyers &amp; announcements
          </h2>
        </div>
        <p className="max-w-sm text-[13px] leading-relaxed text-cream-400">
          Event and ministry notices from the house. Select a flyer to view it full size.
        </p>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {FLYERS.map((flyer, index) => (
          <a
            key={flyer.src}
            href={flyer.src}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${flyer.title} flyer in a new tab`}
            className="group rounded-xl border border-line bg-surface p-2.5 transition-colors duration-300 hover:border-gold-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
            data-reveal
            style={
              { '--reveal-delay': `${index * 55}ms` } as CSSProperties & {
                '--reveal-delay': string;
              }
            }
          >
            <span className="relative block aspect-[4/5] overflow-hidden rounded-lg bg-canvas">
              <Image
                src={flyer.src}
                alt={flyer.title}
                fill
                sizes="(max-width: 640px) 48vw, (max-width: 1024px) 31vw, 24vw"
                className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </span>
            <span className="flex min-h-10 items-center justify-between gap-2 px-1 pt-2 text-[11px] font-medium leading-snug text-cream-200 group-hover:text-cream-50">
              <span>{flyer.title}</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 shrink-0 text-cream-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
