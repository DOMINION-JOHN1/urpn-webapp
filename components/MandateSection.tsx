import React from 'react';
import { Compass, Target, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const VISION = [
  {
    title: 'Divine Recovery & Restoration',
    desc: 'To see a recovery, restoration and revival of people, territories and spheres in their original ordination.',
  },
  {
    title: 'Conformed to the Blueprint',
    desc: 'To see a generation who looks like God and what He said about them (blueprints) and are God’s agents wherever they find themselves.',
  },
  {
    title: 'Unshakeable Core Mandate',
    desc: 'Expanding across cities and territories while remaining rooted in this core apostolic ordination.',
  },
];

const MISSION = [
  {
    title: 'Restoring Original Blueprints',
    desc: 'To strive for the restoration of God’s original blueprints in families, spheres, and territories through prophetic intercession and the seasoned Word of God.',
  },
  {
    title: 'Discipling a Generation',
    desc: 'To disciple and prepare “a generation” to be usable by God and active agents of God’s Kingdom through prayer and the Word.',
  },
];

interface MandateSectionProps {
  contained?: boolean;
}

export function MandateSection({ contained = false }: MandateSectionProps) {
  const content = (
    <section aria-label="Vision and mission" className="w-full">
      <div className="grid gap-5 md:grid-cols-2" data-reveal>
        {/* ============================================== VISION CARD */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 shadow-sm transition-[border-color,transform] duration-200 hover:border-line-strong sm:p-8">
          <div>
            {/* Top row: Squircle icon + category pill */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-raised text-accent">
                  <Compass className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="mono-label text-gold-400">Pillar 02</span>
                  <h3 className="text-[20px] font-semibold text-cream-50 sm:text-[24px]">Our Vision</h3>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line-soft bg-surface-raised px-2.5 py-1 text-[11px] font-medium text-cream-300">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Blueprint
              </span>
            </div>

            <p className="mt-4 text-[13.5px] leading-relaxed text-cream-400">
              The overarching picture of what God is establishing in our generation through this network:
            </p>

            <ul className="mt-5 space-y-3.5">
              {VISION.map((item, index) => (
                <li
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl border border-line/60 bg-surface-raised/40 p-3.5 transition-colors hover:border-line"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-center font-mono text-[10px] font-semibold text-accent">
                    0{index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-medium text-cream-100">{item.title}</p>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-cream-400">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-line-soft pt-4 text-[12px] text-cream-500">
            <span>Aligned with divine ordination</span>
            <span className="font-mono text-[11px] text-accent">Revival Altars</span>
          </div>
        </div>

        {/* ============================================== MISSION CARD */}
        <div className="group relative flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 shadow-sm transition-[border-color,transform] duration-200 hover:border-line-strong sm:p-8">
          <div>
            {/* Top row: Squircle icon + category pill */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-raised text-accent">
                  <Target className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="mono-label text-gold-400">Pillar 03</span>
                  <h3 className="text-[20px] font-semibold text-cream-50 sm:text-[24px]">Our Mission</h3>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line-soft bg-surface-raised px-2.5 py-1 text-[11px] font-medium text-cream-300">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                Execution
              </span>
            </div>

            <p className="mt-4 text-[13.5px] leading-relaxed text-cream-400">
              The operational mandate and daily assignment we carry out across every sphere:
            </p>

            <ul className="mt-5 space-y-3.5">
              {MISSION.map((item, index) => (
                <li
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl border border-line/60 bg-surface-raised/40 p-3.5 transition-colors hover:border-line"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-center font-mono text-[10px] font-semibold text-gold-400">
                    0{index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-medium text-cream-100">{item.title}</p>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-cream-400">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-xl border border-line-soft bg-surface-soft p-3.5 text-[12px] leading-relaxed text-cream-400">
              <p className="flex items-center gap-2 font-medium text-cream-200">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-accent" />
                Territory-Adaptive Mission:
              </p>
              <p className="mt-1">
                Our specific outreach operations may expand depending on the territory we enter; however, the above remain our primary foundational mission.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-line-soft pt-4 text-[12px] text-cream-500">
            <span>Intercession & Seasoned Word</span>
            <span className="font-mono text-[11px] text-gold-400">Apostolic Order</span>
          </div>
        </div>
      </div>
    </section>
  );

  if (contained) {
    return <div className="container-page">{content}</div>;
  }

  return content;
}
