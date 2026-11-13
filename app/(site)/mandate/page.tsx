import React from 'react';
import type { Metadata } from 'next';
import { MandateSection } from '@/components/MandateSection';

export const metadata: Metadata = {
  title: 'Who are we? · URPN',
  description:
    'Reviving people, territories and spheres back to their original ordination such that they operate from that standpoint, by the prophetic and apostolic spirit of Elijah, through intercession and the Word of God.',
};

const TENETS = [
  'Sacrifice; that is a sacrificial leaving to please God and be of help to men.',
  'Service to God and man for the Kingdom.',
  'Prayer, intercession and supplication.',
  'The prophetic.',
  'Submission to the authority of God in/through men (spiritual and covenant parenting).',
  'Tithing giving and receiving.',
  'The supremacy of the will of God.',
  'Oneness and unity of heart and purpose.',
  'Spiritual timing and seasons.',
  'Honour practice.',
  'Excellence.',
  'Prosperity.',
  'Restoration and deliverance.',
  'Manifestations of the Holy Spirit.',
];

const WORKFORCE_CRITERIA = [
  'One who is saved and believe in Jesus Christ',
  'Must believe in the mandate and vision of URPN',
  'Submit to the laws, discipline and demands of URPN',
  'To be an ambassador of URPN anywhere he or she finds herself',
  'Attend our workforce training and be certified',
];

export default function MandatePage() {
  return (
    <div className="w-full pb-20 pt-8 sm:pb-28 sm:pt-12">
      <div className="container-page">
        <header className="mb-7 px-1 sm:mb-9" data-reveal>
          <h1 className="text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] text-cream-50 sm:text-[46px] lg:text-[54px]">
            Who are we?
          </h1>
        </header>

        <section className="rounded-2xl bg-accent-strong p-6 text-white shadow-[0_18px_48px_-32px_rgba(110,21,88,0.65)] sm:p-9" data-reveal>
          <h2 className="text-[25px] font-semibold text-white sm:text-[32px]">The Mandate</h2>
          <p className="mt-4 max-w-4xl border-l-2 border-white/35 pl-4 text-[16px] leading-[1.75] text-white/90 sm:text-[19px]">
            Reviving people, territories and spheres back to their original ordination such that they operate from that standpoint, by the prophetic and apostolic spirit of Elijah, through intercession and the Word of God.
          </p>
        </section>

        <div className="mt-5">
          <MandateSection />
        </div>

        <section className="mt-5 rounded-2xl bg-violet-500/[0.07] p-6 sm:p-9" data-reveal>
          <h2 className="text-[26px] font-semibold text-cream-50 sm:text-[34px]">Our Tenets and Beliefs</h2>
          <p className="mt-3 max-w-4xl text-[14px] leading-[1.75] text-cream-300">
            These things formulate our beliefs and faith in Christ Jesus. Generally, we believe on the sacrifice, resurrection and finished work of Jesus on the cross and on these bases we also believe in the following
          </p>
          <ul className="mt-5 grid gap-x-10 gap-y-2.5 sm:grid-cols-2">
            {TENETS.map((tenet) => (
              <li key={tenet} className="flex gap-3 text-[13px] leading-relaxed text-cream-300">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                <span>{tenet}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-5 rounded-2xl bg-orange-500/[0.07] p-6 sm:p-9" data-reveal>
          <h2 className="text-[23px] font-semibold leading-tight text-cream-50 sm:text-[30px]">
            Membership/Inclusion Requirements
          </h2>
          <h3 className="mt-5 text-[16px] font-semibold text-cream-200">
            Criteria for becoming a workforce
          </h3>
          <ol className="mt-3 space-y-2.5">
            {WORKFORCE_CRITERIA.map((criterion, index) => (
              <li key={criterion} className="flex gap-3 text-[14px] leading-relaxed text-cream-300">
                <span className="font-mono text-[11px] text-accent">{index + 1}.</span>
                <span>{criterion}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
