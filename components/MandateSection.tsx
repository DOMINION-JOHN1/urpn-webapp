import React from 'react';

const VISION = [
  'A recovery, restoration, and revival of people, territories, and spheres in their original divine ordination.',
  'A generation who looks like God and what He said about them — walking as His agents wherever they are found.',
  'A people anchored in kingdom values while expanding territorial impact across the nations.',
];

const MISSION = [
  'To restore God’s original blueprints in families, spheres, and territories through prophetic intercession and the seasoned word of God.',
  'To disciple and prepare a generation to be usable by God and deployable as agents of His kingdom.',
  'To advance the mandate according to the spiritual and territorial needs of every region we occupy.',
];

export function MandateSection() {
  return (
    <section className="border-b border-line">
      <div className="container-page py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-gold-500/70" />
              <span className="mono-label text-gold-300">Vision &amp; mission</span>
            </div>
            <h2 className="mt-5 max-w-[15ch] text-[30px] font-semibold leading-[1.1] tracking-[-0.035em] text-cream-50 sm:text-[36px]">
              A people who look like God.
            </h2>
            <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed text-cream-400">
              We are not building a crowd. We are forming a generation that carries heaven’s
              original intention into every sphere it occupies.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
            <div>
              <p className="mono-label border-b border-line-soft pb-3">What we see</p>
              <ul className="mt-5 space-y-5">
                {VISION.map((item, index) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-0.5 font-mono text-[10px] text-cream-600">
                      0{index + 1}
                    </span>
                    <p className="text-[13px] leading-relaxed text-cream-300">{item}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mono-label border-b border-line-soft pb-3">How we build</p>
              <ul className="mt-5 space-y-5">
                {MISSION.map((item, index) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-0.5 font-mono text-[10px] text-cream-600">
                      0{index + 1}
                    </span>
                    <p className="text-[13px] leading-relaxed text-cream-300">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
