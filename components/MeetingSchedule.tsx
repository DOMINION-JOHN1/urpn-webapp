'use client';

import React, { useState } from 'react';
import {
  Calendar,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Download,
  Flame,
  MapPin,
  Moon,
  Sun,
  X,
  Zap,
} from 'lucide-react';

interface MeetingEvent {
  id: string;
  title: string;
  category: string;
  scheduleLabel: string;
  timeDisplay: string;
  description: string;
  location: string;
  icon: React.ReactNode;
  googleCalendarUrl: string;
  icsData: {
    title: string;
    description: string;
    location: string;
    startHour: string;
    endHour: string;
    recurrenceRule: string;
  };
}

const MEETINGS: MeetingEvent[] = [
  {
    id: 'kingdomite',
    title: 'Monthly Kingdomite',
    category: 'Flagship gathering',
    scheduleLabel: 'Every 3rd weekend',
    timeDisplay: '3rd Friday & Saturday (WAT)',
    description:
      'The flagship monthly URPN gathering — two days of apostolic impartation, prophetic intercession, and territorial alignment over Kogi State and beyond.',
    location: "St. Luke's Anglican Church, Adankolo",
    icon: <Flame className="h-4 w-4" />,
    googleCalendarUrl:
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=URPN+Monthly+Kingdomite&details=Flagship+monthly+URPN+gathering+at+St.+Luke%27s+Anglican+Church%2C+Adankolo.+Friday+4PM+%7C+Saturday+9AM+%26+4PM.&location=St.+Luke%27s+Anglican+Church%2C+Adankolo&recur=RRULE:FREQ=MONTHLY;BYDAY=3FR',
    icsData: {
      title: 'URPN Monthly Kingdomite',
      description:
        'Flagship monthly URPN gathering. Friday 4PM | Saturday 9AM & 4PM. Apostolic impartation and prophetic intercession.',
      location: "St. Luke's Anglican Church, Adankolo",
      startHour: '160000',
      endHour: '200000',
      recurrenceRule: 'FREQ=MONTHLY;BYDAY=3FR',
    },
  },
  {
    id: 'weekly-furnace',
    title: 'The Weekly Furnace',
    category: 'Weekly fire service',
    scheduleLabel: 'Every Thursday · 4:00 PM',
    timeDisplay: 'Thursdays 4:00 PM (WAT)',
    description:
      'A burning altar every Thursday at the URPN Family House. Intense prayer, prophetic fire, and the living Word.',
    location: 'URPN Family House',
    icon: <Flame className="h-4 w-4" />,
    googleCalendarUrl:
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=URPN+The+Weekly+Furnace&details=Weekly+Furnace+prayer+and+prophetic+fire+at+URPN+Family+House+%284PM%29.+Every+Thursday.&location=URPN+Family+House&recur=RRULE:FREQ=WEEKLY;BYDAY=TH',
    icsData: {
      title: 'URPN The Weekly Furnace',
      description:
        'The Weekly Furnace — prayer and prophetic fire at URPN Family House (4PM). Every Thursday.',
      location: 'URPN Family House',
      startHour: '160000',
      endHour: '180000',
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=TH',
    },
  },
  {
    id: 'daily-prayers',
    title: 'Daily Weekday Prayers',
    category: 'Daily corporate prayer',
    scheduleLabel: 'Every weekday · 4:00 PM',
    timeDisplay: 'Monday – Friday 4:00 PM (WAT)',
    description:
      'A daily afternoon prayer altar at the URPN Family House. The altar is kept burning — intercession, prophetic decrees, and restoring God’s blueprints.',
    location: 'URPN Family House',
    icon: <Sun className="h-4 w-4" />,
    googleCalendarUrl:
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=URPN+Daily+Weekday+Prayers&details=Daily+corporate+afternoon+prayer+altar+at+URPN+Family+House+%284PM%29.&location=URPN+Family+House&recur=RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',
    icsData: {
      title: 'URPN Daily Weekday Prayers',
      description: 'Daily afternoon prayer altar at URPN Family House (4PM). Monday to Friday.',
      location: 'URPN Family House',
      startHour: '160000',
      endHour: '170000',
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',
    },
  },
  {
    id: 'convergence',
    title: 'Convergence',
    category: 'Annual gathering',
    scheduleLabel: 'Once a year · Every August',
    timeDisplay: 'Annual gathering in August (WAT)',
    description:
      'A once-a-year apostolic convergence in August for deep alignment, impartation, and territorial commissioning.',
    location: 'URPN Family House',
    icon: <Zap className="h-4 w-4" />,
    googleCalendarUrl:
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=URPN+Convergence&details=URPN+annual+Convergence+gathering+in+August.&location=URPN+Family+House&recur=RRULE:FREQ=YEARLY;BYMONTH=8',
    icsData: {
      title: 'URPN Convergence',
      description:
        'URPN annual Convergence gathering in August.',
      location: 'URPN Family House',
      startHour: '090000',
      endHour: '170000',
      recurrenceRule: 'FREQ=YEARLY;BYMONTH=8',
    },
  },
  {
    id: 'intensify-vigil',
    title: 'Intensify — Workers’ Vigil',
    category: 'Monthly night vigil',
    scheduleLabel: '2nd Friday · 10:00 PM onwards',
    timeDisplay: '2nd Friday — from 10:00 PM (WAT)',
    description:
      'The workers’ prayer vigil — “Intensify.” Dedicated to equipping and empowering God’s agents, burning the altar through the night.',
    location: 'URPN Family House',
    icon: <Moon className="h-4 w-4" />,
    googleCalendarUrl:
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=URPN+Intensify+Workers%27+Vigil&details=Workers%27+night+prayer+vigil+%22Intensify%22+at+URPN+Family+House.+2nd+Friday+of+every+month+from+10PM.&location=URPN+Family+House&recur=RRULE:FREQ=MONTHLY;BYDAY=2FR',
    icsData: {
      title: "URPN Intensify — Workers' Vigil",
      description:
        "Workers' night prayer vigil 'Intensify' at URPN Family House. 2nd Friday of every month from 10PM.",
      location: 'URPN Family House',
      startHour: '220000',
      endHour: '040000',
      recurrenceRule: 'FREQ=MONTHLY;BYDAY=2FR',
    },
  },
];

export function MeetingSchedule() {
  const [rsvpModalEvent, setRsvpModalEvent] = useState<MeetingEvent | null>(null);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpContact, setRsvpContact] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const downloadIcsFile = (event: MeetingEvent) => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dtStamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//URPN//Church Meeting Schedule//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:urpn-${event.id}-${Date.now()}@urpn.org`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART;TZID=Africa/Lagos:20260901T${event.icsData.startHour}`,
      `DTEND;TZID=Africa/Lagos:20260901T${event.icsData.endHour}`,
      `RRULE:${event.icsData.recurrenceRule}`,
      `SUMMARY:${event.icsData.title}`,
      `DESCRIPTION:${event.icsData.description}`,
      `LOCATION:${event.icsData.location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `urpn-${event.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRsvpSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!rsvpName.trim()) return;
    setRsvpSubmitted(true);
  };

  const openRsvp = (event: MeetingEvent) => {
    setRsvpModalEvent(event);
    setRsvpName('');
    setRsvpContact('');
    setRsvpSubmitted(false);
  };

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between" data-reveal>
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-gold-500/70" />
            <span className="mono-label text-gold-300">Days of meeting</span>
          </div>
          <h2 className="mt-5 text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] text-cream-50 sm:text-[42px]">
            Come and encounter God.
          </h2>
        </div>
        <div className="max-w-sm">
          <p className="text-[13.5px] leading-relaxed text-cream-400">
            The altar is kept burning through the week. Add any gathering to your calendar so
            you never miss a moment.
          </p>
          <p className="mono-label mt-3 !text-[9px]">All times WAT · Lokoja, Nigeria</p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-6">
        {MEETINGS.map((meeting, index) => (
          <article
            key={meeting.id}
            className={`flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-line-strong ${
              index < 2 ? 'md:col-span-3' : 'md:col-span-2'
            }`}
            data-reveal
            style={
              { '--reveal-delay': `${index * 65}ms` } as React.CSSProperties & {
                '--reveal-delay': string;
              }
            }
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-canvas text-gold-300">
                {meeting.icon}
              </span>
              <span className="text-right font-mono text-[9px] uppercase leading-4 tracking-[0.12em] text-cream-500">
                {meeting.category}
              </span>
            </div>

            <h3 className="mt-5 text-[18px] font-semibold leading-snug tracking-[-0.02em] text-cream-50">
              {meeting.title}
            </h3>
            <p className="mt-2 text-[12.5px] leading-relaxed text-cream-400">
              {meeting.description}
            </p>

            <div className="mt-5 space-y-2.5 border-t border-line-soft pt-4">
              <div className="flex items-start gap-2 text-[12px] text-cream-300">
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cream-500" aria-hidden="true" />
                <span>{meeting.scheduleLabel}</span>
              </div>
              <div className="flex items-start gap-2 text-[12px] text-cream-400">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cream-500" aria-hidden="true" />
                <span>{meeting.location}</span>
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 pt-5">
              <button
                type="button"
                onClick={() => openRsvp(meeting)}
                className="text-[12px] font-medium text-cream-300 transition-colors hover:text-cream-50"
              >
                RSVP
              </button>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => downloadIcsFile(meeting)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-cream-400 transition-colors hover:border-line-strong hover:text-cream-50"
                  title="Download .ics for Apple Calendar or Outlook"
                  aria-label={`Download ${meeting.title} calendar file`}
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <a
                  href={meeting.googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  <CalendarPlus className="h-3.5 w-3.5" aria-hidden="true" />
                  Add
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {rsvpModalEvent && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="RSVP for a gathering"
        >
          <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-5 shadow-2xl sm:p-6">
            {!rsvpSubmitted ? (
              <form onSubmit={handleRsvpSubmit}>
                <div className="flex items-start justify-between gap-4 border-b border-line-soft pb-4">
                  <div>
                    <p className="mono-label flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                      RSVP
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-cream-50">
                      {rsvpModalEvent.title}
                    </h3>
                    <p className="mt-1 text-xs text-cream-400">{rsvpModalEvent.timeDisplay}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRsvpModalEvent(null)}
                    className="rounded-full border border-line p-2 text-cream-400 hover:text-cream-50"
                    aria-label="Close RSVP"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-cream-400">
                  Leave your details and the URPN team will send you a reminder before the
                  gathering.
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <label htmlFor="rsvp-name" className="mb-1.5 block text-xs text-cream-300">
                      Your name *
                    </label>
                    <input
                      id="rsvp-name"
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(event) => setRsvpName(event.target.value)}
                      placeholder="e.g. Sister Grace"
                      className="field"
                    />
                  </div>
                  <div>
                    <label htmlFor="rsvp-contact" className="mb-1.5 block text-xs text-cream-300">
                      Email or phone (optional)
                    </label>
                    <input
                      id="rsvp-contact"
                      type="text"
                      value={rsvpContact}
                      onChange={(event) => setRsvpContact(event.target.value)}
                      placeholder="grace@example.com or +234 801..."
                      className="field"
                    />
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpModalEvent(null)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary flex-1">
                    Confirm RSVP
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-2 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300">
                  <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-xl font-semibold text-cream-50">You’re expected.</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-400">
                  We look forward to fellowshipping with you,{' '}
                  <strong className="text-cream-100">{rsvpName}</strong>. Add the gathering to
                  your calendar:
                </p>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <a
                    href={rsvpModalEvent.googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary flex-1"
                  >
                    <CalendarPlus className="h-4 w-4" aria-hidden="true" />
                    Google Calendar
                  </a>
                  <button
                    type="button"
                    onClick={() => downloadIcsFile(rsvpModalEvent)}
                    className="btn btn-secondary flex-1"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Apple / Outlook
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setRsvpModalEvent(null)}
                  className="mt-4 text-xs text-cream-500 hover:text-cream-50"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
