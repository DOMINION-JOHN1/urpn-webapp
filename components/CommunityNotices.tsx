import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const NOTICES = [
  {
    src: '/flyers/mount-zion-building-project.jpg',
    title: 'Mount Zion Building Project · Support & Partnership',
  },
  {
    src: '/flyers/mount-zion-phase-two.jpg',
    title: 'Mount Zion Building Project · Land Purchase',
  },
];

export function CommunityNotices() {
  return (
    <section className="mt-14 border-t border-line-soft pt-12" aria-labelledby="notices-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-reveal>
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-gold-500/70" />
            <span className="mono-label text-gold-300">More from the URPN family</span>
          </div>
          <h2 id="notices-title" className="mt-4 text-[28px] font-semibold tracking-[-0.035em] text-cream-50 sm:text-[34px]">
            Community notices
          </h2>
        </div>
        <p className="max-w-sm text-[13px] leading-relaxed text-cream-400">
          Support the Mount Zion Building Project. Select a notice to view the details full size.
        </p>
      </div>

      <div className="mt-7 grid max-w-3xl grid-cols-2 gap-4">
        {NOTICES.map((flyer, index) => (
          <a
            key={flyer.src}
            href={flyer.src}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${flyer.title} notice in a new tab`}
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
                sizes="(max-width: 640px) 48vw, 360px"
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
