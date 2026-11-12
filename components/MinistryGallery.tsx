'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';

interface GatheringPhoto {
  src: string;
  alt: string;
  tag: string;
  caption: string;
}

const PHOTOS: GatheringPhoto[] = [
  {
    src: '/images/recent-worship.jpeg',
    alt: 'A woman lifting her hand during worship',
    tag: 'Worship',
    caption: 'A heart lifted in praise',
  },
  {
    src: '/gallery/gathering-worship.jpeg',
    alt: 'Members gathered together during worship',
    tag: 'Gathering',
    caption: 'All generations at the altar',
  },
  {
    src: '/gallery/altar-moment.jpeg',
    alt: 'A member in a quiet moment of prayer',
    tag: 'Prayer',
    caption: 'Seeking God together',
  },
  {
    src: '/gallery/congregation-prayer.jpeg',
    alt: 'Congregants sharing a moment of prayer',
    tag: 'Intercession',
    caption: 'Standing together in prayer',
  },
  {
    src: '/gallery/choir-worship.jpeg',
    alt: 'Choir members singing during a church service',
    tag: 'Choir',
    caption: 'Serving through song',
  },
  {
    src: '/gallery/praise-leader.jpeg',
    alt: 'A worship leader sharing the message at a gathering',
    tag: 'Praise',
    caption: 'Leading the room in worship',
  },
  {
    src: '/images/recent-gathering.jpeg',
    alt: 'The congregation gathered for a URPN meeting',
    tag: 'Fellowship',
    caption: 'The family gathered around the Word',
  },
  {
    src: '/gallery/family-gathering.jpeg',
    alt: 'A family sharing a moment at a church gathering',
    tag: 'Family',
    caption: 'Faith across generations',
  },
  {
    src: '/gallery/service-audience.jpeg',
    alt: 'Members seated together during a church service',
    tag: 'Gathering',
    caption: 'A house full of worship',
  },
  {
    src: '/gallery/choir-service.jpeg',
    alt: 'Singers worshipping together at a service',
    tag: 'Choir',
    caption: 'One voice in praise',
  },
  {
    src: '/gallery/congregation-worship.jpeg',
    alt: 'Congregants lifting their hands together',
    tag: 'Worship',
    caption: 'Hands lifted together',
  },
  {
    src: '/gallery/prayer-ministry.jpeg',
    alt: 'A minister praying with members of the congregation',
    tag: 'Prayer',
    caption: 'Personal ministry and encouragement',
  },
  {
    src: '/gallery/altar-prayer.jpeg',
    alt: 'Prayer ministry taking place at the altar',
    tag: 'Prayer',
    caption: 'A moment of altar ministry',
  },
  {
    src: '/gallery/personal-prayer.jpeg',
    alt: 'A church member receives prayer from a minister',
    tag: 'Intercession',
    caption: 'Making room for prayer',
  },
  {
    src: '/gallery/testaments-prayer.jpeg',
    alt: 'Members gathered in prayer at a revival meeting',
    tag: 'Revival',
    caption: 'The ministry of prayer',
  },
  {
    src: '/gallery/preaching-bw.jpeg',
    alt: 'A minister preaching at a church gathering',
    tag: 'The Word',
    caption: 'Sharing the message',
  },
  {
    src: '/gallery/intercession-bw.jpeg',
    alt: 'A member spending a quiet moment in prayer',
    tag: 'Intercession',
    caption: 'Quiet moments before God',
  },
  {
    src: '/gallery/community-care.jpeg',
    alt: 'URPN members sharing food and fellowship',
    tag: 'Community',
    caption: 'Serving one another beyond the service',
  },
  {
    src: '/gallery/preaching-closeup.jpeg',
    alt: 'A preacher sharing the gospel at a gathering',
    tag: 'The Word',
    caption: 'Preaching the gospel',
  },
  {
    src: '/images/recent-prayer.jpeg',
    alt: 'A member receiving prayer during ministry',
    tag: 'Prayer',
    caption: 'A ministry moment at the altar',
  },
];

export function MinistryGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [pausedByPointer, setPausedByPointer] = useState(false);
  const [inView, setInView] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = carouselRef.current;
    if (!element || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setAutoPlay(!preference.matches);
    syncPreference();
    preference.addEventListener('change', syncPreference);
    return () => preference.removeEventListener('change', syncPreference);
  }, []);

  useEffect(() => {
    if (!autoPlay || pausedByPointer || !inView) return;

    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        setActiveIndex((index) => (index + 1) % PHOTOS.length);
      }
    }, 5000);

    return () => window.clearInterval(timer);
  }, [autoPlay, pausedByPointer, inView]);

  const showPrevious = () => {
    setActiveIndex((index) => (index - 1 + PHOTOS.length) % PHOTOS.length);
  };

  const showNext = () => {
    setActiveIndex((index) => (index + 1) % PHOTOS.length);
  };

  const activePhoto = PHOTOS[activeIndex];

  return (
    <section className="border-b border-line" aria-labelledby="gallery-title">
      <div className="container-page py-16 sm:py-20">
        <div className="mb-9 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between" data-reveal>
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-gold-500/70" />
              <span className="mono-label text-gold-300">Life at URPN</span>
            </div>
            <h2 id="gallery-title" className="mt-5 max-w-[18ch] text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] text-cream-50 sm:text-[42px]">
              One family, many moments.
            </h2>
          </div>
          <p className="max-w-sm text-[13.5px] leading-relaxed text-cream-400">
            Worship, prayer, teaching, and care from the life of our church family.
          </p>
        </div>

        <div
          className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12"
          data-reveal
          ref={carouselRef}
          role="group"
          aria-roledescription="carousel"
          aria-label="Photos from URPN gatherings"
          onMouseEnter={() => setPausedByPointer(true)}
          onMouseLeave={() => setPausedByPointer(false)}
          onFocusCapture={() => setPausedByPointer(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setPausedByPointer(false);
            }
          }}
        >
          <div className="overflow-hidden rounded-2xl border border-line bg-surface">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              aria-live="off"
            >
              {PHOTOS.map((photo, index) => (
                <figure
                  key={photo.src}
                  className="relative aspect-square w-full flex-none bg-canvas"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${PHOTOS.length}`}
                  aria-hidden={index !== activeIndex}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    loading={index === activeIndex ? 'eager' : 'lazy'}
                    sizes="(max-width: 768px) 100vw, 58vw"
                    className="object-contain"
                  />
                </figure>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="mono-label text-gold-300">{activePhoto.tag}</p>
            <h3 className="mt-3 text-[24px] font-semibold leading-tight tracking-[-0.03em] text-cream-50 sm:text-[30px]">
              {activePhoto.caption}
            </h3>
            <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-cream-400">
              Moments from our gatherings as we worship, grow, and serve together.
            </p>

            <div className="mt-7 flex items-center justify-between gap-3 border-t border-line-soft pt-5">
              <span className="font-mono text-[11px] tracking-[0.12em] text-cream-500" aria-live="off">
                {String(activeIndex + 1).padStart(2, '0')} / {String(PHOTOS.length).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAutoPlay((playing) => !playing)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-cream-300 transition-colors hover:border-line-strong hover:text-cream-50"
                  aria-label={autoPlay ? 'Pause photo slideshow' : 'Play photo slideshow'}
                  title={autoPlay ? 'Pause slideshow' : 'Play slideshow'}
                >
                  {autoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={showPrevious}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-cream-300 transition-colors hover:border-line-strong hover:text-cream-50"
                  aria-label="Previous photo"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-cream-300 transition-colors hover:border-line-strong hover:text-cream-50"
                  aria-label="Next photo"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
