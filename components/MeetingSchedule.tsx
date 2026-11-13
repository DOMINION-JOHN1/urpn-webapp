import React from 'react';
import Image from 'next/image';
import { Clock, Flame, Moon, Sun, Zap } from 'lucide-react';

interface MeetingEvent {
  title: string;
  poster?: string;
  schedule?: string;
  icon: React.ReactNode;
}

const MEETINGS: MeetingEvent[] = [
  {
    title: 'Monthly Kingdomite',
    poster: '/flyers/for-the-testimony-3.jpg',
    schedule:
      'Monthly Kingdomite on the third Friday at 4:00 pm, Saturday 9:00 am and 4:00 pm at ST Luke’s Anglican Church, Adankolo',
    icon: <Flame className="h-7 w-7" />,
  },
  {
    title: 'The Weekly Furnace',
    poster: '/flyers/furnace-experience.jpg',
    schedule:
      'Every Thursday of the month aside the week of Kingdomite at 4:00 pm at the URPN Family House',
    icon: <Flame className="h-7 w-7" />,
  },
  {
    title: 'Daily weekday Prayers',
    schedule: 'Daily weekday Prayers 4:00 pm at the URPN Family House',
    icon: <Sun className="h-7 w-7" />,
  },
  {
    title: 'Convergence',
    poster: '/flyers/testaments-revival.jpg',
    icon: <Zap className="h-7 w-7" />,
  },
  {
    title: 'Intensify (Workers’ vigil)',
    poster: '/flyers/intensify.jpg',
    schedule: 'Intensify (Workers’ vigil); second Fridays of every month.',
    icon: <Moon className="h-7 w-7" />,
  },
  {
    title: '12 hours prayer stretch',
    poster: '/flyers/12-hours-prayer-stretch.jpg',
    schedule: '12 hours prayer stretch every fourth Saturday of the Month',
    icon: <Clock className="h-7 w-7" />,
  },
];

export function MeetingSchedule() {
  return (
    <section className="container-page py-16 sm:py-20" aria-labelledby="meeting-schedule-title">
      <div className="mb-9 flex items-center gap-3" data-reveal>
        <span className="h-px w-6 bg-gold-500/70" aria-hidden="true" />
        <h2 id="meeting-schedule-title" className="mono-label text-gold-300">
          DAYS OF MEETING
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {MEETINGS.map((meeting, index) => (
          <article
            key={meeting.title}
            className="group relative flex h-full min-h-[380px] flex-col overflow-hidden rounded-[24px] border border-line bg-surface transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-[0_24px_58px_-38px_rgba(216,181,111,0.4)]"
            data-reveal
            style={{ '--reveal-delay': `${index * 45}ms` } as React.CSSProperties & { '--reveal-delay': string }}
          >
            <div className="relative isolate flex h-[240px] items-center justify-center overflow-hidden border-b border-line-soft bg-canvas sm:h-[260px]">
              {meeting.poster ? (
                <Image
                  src={meeting.poster}
                  alt={`${meeting.title} event flyer`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-500/25 bg-surface/80 text-gold-300">
                  {meeting.icon}
                </span>
              )}
            </div>

            <div className="flex flex-1 items-start gap-3 p-5 sm:p-6">
              <Clock className="mt-1 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
              <div>
                <h3 className="text-[18px] font-semibold leading-snug tracking-[-0.025em] text-cream-50">
                  {meeting.title}
                </h3>
                {meeting.schedule && (
                  <p className="mt-2 text-[12.5px] leading-relaxed text-cream-300">
                    {meeting.schedule}
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
