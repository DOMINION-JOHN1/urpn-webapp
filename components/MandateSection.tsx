import React from 'react';
import { Eye, Target, CheckCircle2, Flame } from 'lucide-react';

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

export const MandateSection: React.FC = () => {
  return (
    <section className="w-full max-w-6xl mx-auto my-20 md:my-28 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
        <span className="inline-block font-cinzel text-xs sm:text-sm font-semibold tracking-[0.28em] uppercase text-gold-400">
          Our Divine Blueprint
        </span>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-cream-100 leading-[1.05]">
          The Mandate, Vision &amp; Mission
        </h2>
        <div className="rule-gold w-28 mx-auto" />
      </div>

      {/* Mandate banner */}
      <div className="relative overflow-hidden rounded-[2rem] p-9 sm:p-14 mb-8 border border-gold-500/25 shadow-elevate bg-gradient-to-br from-royal-900 via-ink-900 to-bronze-900">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-royal-500/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-5">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-[11px] font-semibold uppercase tracking-[0.2em]">
            <Flame className="w-3.5 h-3.5" />
            The Apostolic Mandate
          </span>
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-cream-50 leading-snug">
            Restoring people, territory, and spheres back to their original ordination — such that
            they operate from that standpoint.
          </h3>
          <p className="text-bronze-200 text-sm sm:text-base font-light">
            By the prophetic and apostolic spirit of Elijah, intercession, and the seasoned word of
            God.
          </p>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MandateCard
          icon={<Eye className="w-6 h-6" />}
          eyebrow="What We See"
          title="Our Vision"
          items={VISION}
        />
        <MandateCard
          icon={<Target className="w-6 h-6" />}
          eyebrow="How We Build"
          title="Our Mission"
          items={MISSION}
        />
      </div>
    </section>
  );
};

const MandateCard: React.FC<{
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  items: string[];
}> = ({ icon, eyebrow, title, items }) => (
  <div className="panel rounded-[1.75rem] p-8 sm:p-10 hover:border-gold-500/40 transition-colors duration-300 flex flex-col">
    <div className="flex items-center gap-4 mb-7">
      <div className="w-13 h-13 p-3 rounded-2xl bg-gradient-to-br from-gold-500/20 to-royal-600/20 border border-gold-500/30 text-gold-300">
        {icon}
      </div>
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400 block">
          {eyebrow}
        </span>
        <h4 className="font-display text-3xl font-bold text-cream-100">{title}</h4>
      </div>
    </div>

    <ul className="space-y-4 flex-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-cream-300 text-[15px] leading-relaxed font-light">
          <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);
