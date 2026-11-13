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
        <header className="rounded-3xl border border-line bg-surface p-7 sm:p-12 lg:p-16" data-reveal>
          <h1 className="text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] text-cream-50 sm:text-[46px] lg:text-[54px]">
            Who are we?
          </h1>
          <p className="mt-6 text-[15px] leading-[1.75] text-cream-400 sm:text-[16px]">
            This session is divided into four streams, namely
          </p>
          <ol className="mt-4 list-[lower-alpha] space-y-2 pl-5 text-[14px] text-cream-300">
            <li>The mandate</li>
            <li>The vison</li>
            <li>The mission</li>
            <li>Tenets and beliefs</li>
          </ol>
        </header>

        <section className="mt-8 rounded-2xl border border-line/70 bg-surface p-7 sm:p-10" data-reveal>
          <h2 className="text-[26px] font-semibold text-cream-50 sm:text-[34px]">The Mandate</h2>
          <p className="mt-4 max-w-4xl text-[16px] leading-[1.8] text-cream-300 sm:text-[19px]">
            Reviving people, territories and spheres back to their original ordination such that they operate from that standpoint, by the prophetic and apostolic spirit of Elijah, through intercession and the Word of God.
          </p>
        </section>

        <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
          <MandateSection />
        </div>

        <section className="mt-8 rounded-2xl border border-line bg-surface p-7 sm:p-10" data-reveal>
          <h2 className="text-[26px] font-semibold text-cream-50 sm:text-[34px]">Our Tenets and Beliefs</h2>
          <p className="mt-4 max-w-4xl text-[14px] leading-[1.8] text-cream-300">
            These things formulate our beliefs and faith in Christ Jesus. Generally, we believe on the sacrifice, resurrection and finished work of Jesus on the cross and on these bases we also believe in the following
          </p>
          <ul className="mt-6 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {TENETS.map((tenet) => (
              <li key={tenet} className="flex gap-3 text-[13px] leading-relaxed text-cream-300">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                <span>{tenet}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-2xl border border-line bg-surface p-7 sm:p-10" data-reveal>
          <h2 className="text-[26px] font-semibold text-cream-50 sm:text-[34px]">
            A. MEMBERSHIP/INCLUSION REQUIREMENTS
          </h2>
          <h3 className="mt-6 text-[17px] font-semibold text-gold-300">
            A.I: CRITERIA FOR BECOMING A WORKFORCE
          </h3>
          <ol className="mt-4 space-y-3">
            {WORKFORCE_CRITERIA.map((criterion, index) => (
              <li key={criterion} className="flex gap-3 text-[14px] leading-relaxed text-cream-300">
                <span className="font-mono text-[11px] text-cream-500">{index + 1}.</span>
                <span>{criterion}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
