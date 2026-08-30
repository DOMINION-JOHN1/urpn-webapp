import React from 'react';
import Image from 'next/image';

interface Shot {
  src: string;
  alt: string;
  caption: string;
  tag: string;
  className: string;
}

const SHOTS: Shot[] = [
  {
    src: '/images/urpn-worship.png',
    alt: 'Congregation lifting hands in worship',
    caption: 'An atmosphere of surrender and praise',
    tag: 'Worship',
    className: 'md:col-span-2 md:row-span-2',
  },
  {
    src: '/images/ministry-prayer.jpg',
    alt: 'A man kneeling in earnest prayer',
    caption: 'Travailing at the altar',
    tag: 'Intercession',
    className: '',
  },
  {
    src: '/images/ministry-encounter.jpg',
    alt: 'A moment of ministry and personal encounter',
    caption: 'Personal encounter and deliverance',
    tag: 'Encounter',
    className: '',
  },
  {
    src: '/images/ministry-worship.jpg',
    alt: 'Hands raised across the congregation',
    caption: 'One voice, lifted together',
    tag: 'Praise',
    className: '',
  },
  {
    src: '/images/ministry-praise.jpg',
    alt: 'Heartfelt praise and thanksgiving',
    caption: 'Tears of thanksgiving',
    tag: 'Revival',
    className: '',
  },
  {
    src: '/images/urpn-community.png',
    alt: 'The URPN church family gathered together',
    caption: 'Convergence — one family in Christ',
    tag: 'Family',
    className: 'md:col-span-2',
  },
];

export const MinistryGallery: React.FC = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-20 md:my-28">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
        <span className="inline-block font-cinzel text-xs sm:text-sm font-semibold tracking-[0.28em] uppercase text-gold-400">
          The Life of the Altar
        </span>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-cream-100 leading-[1.05]">
          Where Heaven Meets a{' '}
          <span className="text-gold-sheen">Hungry Generation</span>
        </h2>
        <div className="rule-gold w-28 mx-auto" />
        <p className="text-cream-400 text-base sm:text-lg leading-relaxed font-light">
          Moments from our gatherings — worship, intercession, and encounter as God restores
          people, families, and territories.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[150px] sm:auto-rows-[190px] md:auto-rows-[200px] gap-3 sm:gap-4">
        {SHOTS.map((shot) => (
          <figure
            key={shot.src}
            className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gold-500/15 shadow-elevate ${shot.className}`}
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-2xl sm:rounded-3xl" />
            <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300 mb-1">
                {shot.tag}
              </span>
              <p className="text-cream-100 text-sm sm:text-base font-medium leading-snug drop-shadow">
                {shot.caption}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};
