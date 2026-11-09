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
    className: 'col-span-2 row-span-2',
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
    className: 'col-span-2 md:col-span-4',
  },
];

export function MinistryGallery() {
  return (
    <section className="border-b border-line">
      <div className="container-page py-16 sm:py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-gold-500/70" />
              <span className="mono-label text-gold-300">The life of the altar</span>
            </div>
            <h2 className="mt-5 max-w-[18ch] text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] text-cream-50 sm:text-[42px]">
              Where heaven meets a hungry generation.
            </h2>
          </div>
          <p className="max-w-sm text-[13.5px] leading-relaxed text-cream-400">
            Moments from our gatherings — worship, intercession, and encounter as God restores
            people, families, and territories.
          </p>
        </div>

        <div className="mt-10 grid auto-rows-[150px] grid-cols-2 gap-2.5 sm:auto-rows-[190px] md:grid-cols-4">
          {SHOTS.map((shot) => (
            <figure
              key={shot.src}
              className={`group relative overflow-hidden rounded-xl border border-line ${shot.className}`}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#E7C98C]">
                  {shot.tag}
                </span>
                <p className="mt-1 text-[13px] font-medium leading-snug text-white">
                  {shot.caption}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
