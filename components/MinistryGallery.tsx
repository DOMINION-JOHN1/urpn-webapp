'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
  const [visibleCount, setVisibleCount] = useState(1);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const lastIndex = Math.max(0, PHOTOS.length - visibleCount);

  useEffect(() => {
    const updateVisibleCount = () => {
      setVisibleCount(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, lastIndex));
  }, [lastIndex]);

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
        setActiveIndex((index) => (index >= lastIndex ? 0 : index + 1));
      }
    }, 5000);

    return () => window.clearInterval(timer);
  }, [autoPlay, pausedByPointer, inView, lastIndex]);

  const showPrevious = () => {
    setActiveIndex((index) => (index === 0 ? lastIndex : index - 1));
  };

  const showNext = () => {
    setActiveIndex((index) => (index >= lastIndex ? 0 : index + 1));
  };

  const visibleEnd = Math.min(activeIndex + visibleCount, PHOTOS.length);

  return (
    <section aria-labelledby="gallery-title">
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
        </div>

        <div
          className="overflow-hidden"
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
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const distance = event.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(distance) > 40) {
              if (distance < 0) showNext();
              else showPrevious();
            }
            touchStartX.current = null;
          }}
        >
          <div className="overflow-hidden" aria-live="off">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none"
              style={{
                width: `${(PHOTOS.length / visibleCount) * 100}%`,
                transform: `translateX(-${(activeIndex * 100) / PHOTOS.length}%)`,
              }}
            >
              {PHOTOS.map((photo, index) => (
                <figure
                  key={photo.src}
                  className="min-w-0"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${PHOTOS.length}`}
                  aria-hidden={index < activeIndex || index >= visibleEnd}
                  style={{ flex: `0 0 ${100 / PHOTOS.length}%`, paddingInline: '8px' }}
                >
                  <div className="overflow-hidden rounded-2xl bg-surface shadow-[0_12px_34px_-28px_rgba(40,20,35,0.4)]">
                    <div className="relative aspect-[4/3] bg-canvas">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        loading={index < visibleEnd && index >= activeIndex ? 'eager' : 'lazy'}
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        className="object-contain"
                      />
                    </div>
                    <figcaption className="min-h-[76px] px-4 py-3 sm:px-5">
                      <p className="mono-label !text-[9px] text-gold-300">{photo.tag}</p>
                      <p className="mt-1 text-[13px] font-medium leading-snug text-cream-100">
                        {photo.caption}
                      </p>
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 pt-2">
            <span className="font-mono text-[11px] tracking-[0.12em] text-cream-500" aria-live="off">
              {String(activeIndex + 1).padStart(2, '0')}–{String(visibleEnd).padStart(2, '0')} / {String(PHOTOS.length).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={showPrevious}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-cream-300 transition-colors hover:bg-gold-500/10 hover:text-cream-50"
                aria-label="Previous photos"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={showNext}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-cream-300 transition-colors hover:bg-gold-500/10 hover:text-cream-50"
                aria-label="Next photos"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
