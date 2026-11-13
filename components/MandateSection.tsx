import React from 'react';

const VISION = [
  'To see a recovery, restoration and revival of people, territories and spheres in their original ordination.',
  'To see a generation who looks like God and what he said about them (blueprints) and are God’s agents where ever they find themselves.',
  'It may increase depending on the location however remain a core value.',
];

const MISSION = [
  'To strive for the restoration of God’s original blueprints in families, spheres, territories through prophetic intercession/seasoned word of God.',
  'To disciple/prepare “a generation” to be usable by God and agents of God’s kingdom through prayer/word.',
];

export function MandateSection() {
  return (
    <section aria-label="Vision and mission">
      <div className="grid gap-5 md:grid-cols-2" data-reveal>
        <div className="rounded-2xl bg-sky-500/[0.07] p-6 sm:p-8">
          <h2 className="text-[24px] font-semibold text-cream-50 sm:text-[30px]">Our Vision</h2>
          <ul className="mt-4 space-y-3">
            {VISION.map((item) => (
              <li key={item} className="flex gap-3 text-[13.5px] leading-relaxed text-cream-300">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-emerald-500/[0.07] p-6 sm:p-8">
          <h2 className="text-[24px] font-semibold text-cream-50 sm:text-[30px]">Our Mission</h2>
          <ul className="mt-4 space-y-3">
            {MISSION.map((item) => (
              <li key={item} className="flex gap-3 text-[13.5px] leading-relaxed text-cream-300">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-emerald-500/20 pt-3 text-[12.5px] leading-relaxed text-cream-400">
            Our missions may be more depending on the territory we find ourselves. However, the above are the basic/core mission
          </p>
        </div>
      </div>
    </section>
  );
}
