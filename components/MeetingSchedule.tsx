import React from 'react';
import Image from 'next/image';
import { CalendarPlus, Clock, Flame, Moon, Sun, Zap } from 'lucide-react';

interface MeetingEvent {
  title: string;
  poster?: string;
  schedule?: string;
  location?: string;
  icon: React.ReactNode;
}

const MEETINGS: MeetingEvent[] = [
  {
    title: 'Monthly Kingdomite',
    poster: '/flyers/for-the-testimony-3.jpg',
    schedule:
      'Monthly Kingdomite on the third Friday at 4:00 pm, Saturday 9:00 am and 4:00 pm at ST Luke’s Anglican Church, Adankolo',
    location: 'ST Luke’s Anglican Church, Adankolo',
    icon: <Flame className="h-7 w-7" />,
  },
  {
    title: 'The Weekly Furnace',
    poster: '/flyers/furnace-experience.jpg',
    schedule:
      'Every Thursday of the month aside the week of Kingdomite at 4:00 pm at the URPN Family House',
    location: 'URPN Family House',
    icon: <Flame className="h-7 w-7" />,
  },
  {
    title: 'Daily weekday Prayers',
    schedule: 'Daily weekday Prayers 4:00 pm at the URPN Family House',
    location: 'URPN Family House',
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

function calendarUrl(meeting: MeetingEvent) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: meeting.title,
    details: meeting.schedule ?? meeting.title,
  });
  if (meeting.location) params.set('location', meeting.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

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
            className="event-card group relative flex h-full min-h-[380px] flex-col overflow-hidden rounded-[24px] bg-surface shadow-[0_10px_34px_-28px_rgba(40,20,35,0.35)] transition-shadow duration-300 ease-out hover:shadow-[0_24px_58px_-38px_rgba(110,21,88,0.2)]"
            data-reveal
            style={{ '--reveal-delay': `${index * 45}ms` } as React.CSSProperties & { '--reveal-delay': string }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-5 top-0 z-10 h-px origin-left scale-x-0 bg-accent/60 transition-transform duration-500 group-hover:scale-x-100 group-focus-within:scale-x-100 motion-reduce:transition-none"
            />
            <div className="relative isolate flex h-[240px] items-center justify-center overflow-hidden bg-canvas sm:h-[260px]">
              {meeting.poster ? (
                <Image
                  src={meeting.poster}
                  alt={`${meeting.title} event flyer`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface/80 text-gold-300 shadow-sm">
                  {meeting.icon}
                </span>
              )}
            </div>

            <div className="flex flex-1 items-start gap-3 p-5 pb-3 sm:p-6 sm:pb-3">
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
            <div className="px-5 pb-5 sm:px-6 sm:pb-6">
              <a
                href={calendarUrl(meeting)}
                target="_blank"
                rel="noreferrer"
                className="group/calendar inline-flex items-center gap-2 rounded-md bg-canvas px-3.5 py-2 text-xs font-medium text-cream-200 transition-colors hover:bg-accent/10 hover:text-cream-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                aria-label={`Add ${meeting.title} to Google Calendar`}
              >
                <CalendarPlus className="h-4 w-4 text-accent transition-transform duration-300 group-hover/calendar:scale-110 motion-reduce:transition-none" aria-hidden="true" />
                Add to calendar
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
