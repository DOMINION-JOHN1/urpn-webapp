'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CalendarPlus,
  CheckCircle2,
  Bell,
  Download,
  Flame,
  Moon,
  Sun,
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
  accentColor: string;
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
    category: 'Flagship Gathering',
    scheduleLabel: '3rd Friday (4 PM) • 3rd Saturday (9 AM & 4 PM)',
    timeDisplay: 'Friday 4:00 PM  |  Saturday 9:00 AM & 4:00 PM',
    description:
      'The flagship monthly URPN gathering. Two days of apostolic impartation, prophetic intercession, and territorial alignment over Kogi State and beyond.',
    location: "St. Luke's Anglican Church, Adankolo",
    icon: <Flame className="w-6 h-6" />,
    accentColor: 'gold',
    googleCalendarUrl:
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=URPN+Monthly+Kingdomite&details=Flagship+monthly+URPN+gathering+at+St.+Luke%27s+Anglican+Church%2C+Adankolo.+Friday+4PM+%7C+Saturday+9AM+%26+4PM.&location=St.+Luke%27s+Anglican+Church%2C+Adankolo&recur=RRULE:FREQ=MONTHLY;BYDAY=3FR',
    icsData: {
      title: 'URPN Monthly Kingdomite',
      description: 'Flagship monthly URPN gathering. Friday 4PM | Saturday 9AM & 4PM. Apostolic impartation and prophetic intercession.',
      location: "St. Luke's Anglican Church, Adankolo",
      startHour: '160000',
      endHour: '200000',
      recurrenceRule: 'FREQ=MONTHLY;BYDAY=3FR',
    },
  },
  {
    id: 'weekly-furnace',
    title: 'The Weekly Furnace',
    category: 'Weekly Fire Service',
    scheduleLabel: 'Every Thursday (non-Kingdomite weeks) at 4:00 PM',
    timeDisplay: 'Thursdays 4:00 PM (WAT)',
    description:
      'A burning altar every Thursday of the month except during Kingdomite week. Intense prayer, prophetic fire, and the living Word at the URPN Family House.',
    location: 'URPN Family House',
    icon: <Flame className="w-6 h-6" />,
    accentColor: 'bronze',
    googleCalendarUrl:
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=URPN+The+Weekly+Furnace&details=Weekly+Furnace+prayer+and+prophetic+fire+at+URPN+Family+House+%284PM%29.+Every+Thursday+except+Kingdomite+week.&location=URPN+Family+House&recur=RRULE:FREQ=WEEKLY;BYDAY=TH',
    icsData: {
      title: 'URPN The Weekly Furnace',
      description: 'The Weekly Furnace — prayer and prophetic fire at URPN Family House (4PM). Every Thursday except Kingdomite week.',
      location: 'URPN Family House',
      startHour: '160000',
      endHour: '180000',
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=TH',
    },
  },
  {
    id: 'daily-prayers',
    title: 'Daily Weekday Prayers',
    category: 'Daily Corporate Prayer',
    scheduleLabel: 'Every Weekday (Mon – Fri) at 4:00 PM',
    timeDisplay: 'Monday – Friday 4:00 PM (WAT)',
    description:
      'A daily afternoon prayer altar at the URPN Family House. The altar is kept burning — intercession, prophetic decrees, and restoring God’s original blueprints across families and territories.',
    location: 'URPN Family House',
    icon: <Sun className="w-6 h-6" />,
    accentColor: 'gold',
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
    id: 'prayer-stretch',
    title: '12-Hour Prayer Stretch',
    category: 'Monthly Prayer Marathon',
    scheduleLabel: '4th Saturday of Every Month',
    timeDisplay: '4th Saturday — 6:00 AM to 6:00 PM (WAT)',
    description:
      'A full 12-hour prayer marathon on the fourth Saturday of every month. Intense intercession, territorial warfare, and apostolic decrees for breakthrough over families, spheres, and territories.',
    location: 'URPN Family House',
    icon: <Zap className="w-6 h-6" />,
    accentColor: 'royal',
    googleCalendarUrl:
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=URPN+12-Hour+Prayer+Stretch&details=12-hour+prayer+marathon+at+URPN+Family+House.+6AM+to+6PM+on+the+4th+Saturday+of+every+month.&location=URPN+Family+House&recur=RRULE:FREQ=MONTHLY;BYDAY=4SA',
    icsData: {
      title: 'URPN 12-Hour Prayer Stretch',
      description: '12-hour prayer marathon at URPN Family House. 6AM to 6PM on the 4th Saturday of every month.',
      location: 'URPN Family House',
      startHour: '060000',
      endHour: '180000',
      recurrenceRule: 'FREQ=MONTHLY;BYDAY=4SA',
    },
  },
  {
    id: 'intensify-vigil',
    title: 'Intensify — Workers’ Vigil',
    category: 'Monthly Night Vigil',
    scheduleLabel: '2nd Friday of Every Month',
    timeDisplay: '2nd Friday — 10:00 PM onwards (WAT)',
    description:
      'The workers’ prayer vigil — “Intensify.” Dedicated to equipping and empowering God’s agents, burning the altar through the night on the second Friday of every month.',
    location: 'URPN Family House',
    icon: <Moon className="w-6 h-6" />,
    accentColor: 'royal',
    googleCalendarUrl:
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=URPN+Intensify+Workers%27+Vigil&details=Workers%27+night+prayer+vigil+%22Intensify%22+at+URPN+Family+House.+2nd+Friday+of+every+month+from+10PM.&location=URPN+Family+House&recur=RRULE:FREQ=MONTHLY;BYDAY=2FR',
    icsData: {
      title: "URPN Intensify — Workers' Vigil",
      description: "Workers' night prayer vigil 'Intensify' at URPN Family House. 2nd Friday of every month from 10PM.",
      location: 'URPN Family House',
      startHour: '220000',
      endHour: '040000',
      recurrenceRule: 'FREQ=MONTHLY;BYDAY=2FR',
    },
  },
];

const accentStyles: Record<string, { badge: string; icon: string; cal: string }> = {
  gold: {
    badge: 'bg-gold-500/12 text-gold-300 border-gold-500/30',
    icon: 'bg-gold-500/15 border-gold-500/30 text-gold-300',
    cal: 'from-gold-400 to-gold-600 hover:from-gold-300 hover:to-gold-500',
  },
  royal: {
    badge: 'bg-royal-500/15 text-royal-200 border-royal-400/30',
    icon: 'bg-royal-500/15 border-royal-400/30 text-royal-200',
    cal: 'from-royal-500 to-royal-700 hover:from-royal-400 hover:to-royal-600',
  },
  bronze: {
    badge: 'bg-bronze-500/15 text-bronze-200 border-bronze-400/30',
    icon: 'bg-bronze-500/15 border-bronze-400/30 text-bronze-200',
    cal: 'from-bronze-500 to-bronze-700 hover:from-bronze-400 hover:to-bronze-600',
  },
};

export const MeetingSchedule: React.FC = () => {
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

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    <section className="w-full max-w-6xl mx-auto my-20 md:my-28 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
        <span className="inline-block font-cinzel text-xs sm:text-sm font-semibold tracking-[0.28em] uppercase text-gold-400">
          Days of Meeting &amp; Fellowship
        </span>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-cream-100 leading-[1.05]">
          Come and Encounter God
        </h2>
        <div className="rule-gold w-28 mx-auto" />
        <p className="text-cream-400 text-base sm:text-lg leading-relaxed font-light">
          Add any gathering to your calendar so you never miss a moment at the altar.
        </p>
      </div>

      {/* 2 + 3 layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {MEETINGS.slice(0, 2).map((m) => (
          <MeetingCard key={m.id} meeting={m} accent={accentStyles[m.accentColor]} onRsvp={openRsvp} onDownload={downloadIcsFile} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MEETINGS.slice(2).map((m) => (
          <MeetingCard key={m.id} meeting={m} accent={accentStyles[m.accentColor]} onRsvp={openRsvp} onDownload={downloadIcsFile} />
        ))}
      </div>

      {/* RSVP Modal */}
      {rsvpModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md panel rounded-3xl p-6 sm:p-8 shadow-elevate text-cream-100">
            {!rsvpSubmitted ? (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-gold-300 text-xs font-semibold uppercase tracking-[0.18em]">
                    <Bell className="w-4 h-4" />
                    <span>RSVP</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRsvpModalEvent(null)}
                    className="text-cream-500 hover:text-cream-100 text-lg leading-none cursor-pointer"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <h4 className="font-display text-2xl font-bold mb-1">{rsvpModalEvent.title}</h4>
                  <p className="text-xs font-semibold text-gold-400">{rsvpModalEvent.scheduleLabel}</p>
                  <p className="text-xs text-cream-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" /> {rsvpModalEvent.location}
                  </p>
                </div>

                <p className="text-xs text-cream-400 leading-relaxed">
                  Leave your details and we’ll send you a reminder before the gathering.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-cream-300 mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="e.g. Sister Grace"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-ink-950/60 text-sm text-cream-100 placeholder-cream-600 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/60 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cream-300 mb-1.5">Email or Phone (optional)</label>
                  <input
                    type="text"
                    value={rsvpContact}
                    onChange={(e) => setRsvpContact(e.target.value)}
                    placeholder="grace@example.com or +234 801..."
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-ink-950/60 text-sm text-cream-100 placeholder-cream-600 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/60 outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setRsvpModalEvent(null)}
                    className="flex-1 py-2.5 border border-white/15 rounded-xl text-xs font-semibold text-cream-300 hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gold-sheen text-ink-950 font-semibold text-xs rounded-xl shadow-glow-gold hover:scale-[1.02] transition cursor-pointer"
                  >
                    Confirm RSVP
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-display text-2xl font-bold">You’re expected!</h4>
                <p className="text-xs text-cream-300">
                  We look forward to fellowshipping with you, <strong className="text-gold-300">{rsvpName}</strong>. Add it to your calendar:
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-1">
                  <a
                    href={rsvpModalEvent.googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gold-sheen text-ink-950 font-semibold text-xs rounded-xl shadow-glow-gold"
                  >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    <span>Google Calendar</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => downloadIcsFile(rsvpModalEvent)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 border border-white/15 rounded-xl text-xs font-semibold text-cream-200 hover:bg-white/5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-gold-400" />
                    <span>Apple / Outlook</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setRsvpModalEvent(null)}
                  className="mt-2 text-xs font-semibold text-cream-500 hover:text-cream-100 cursor-pointer"
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
};

interface MeetingCardProps {
  meeting: MeetingEvent;
  accent: { badge: string; icon: string; cal: string };
  onRsvp: (m: MeetingEvent) => void;
  onDownload: (m: MeetingEvent) => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, accent, onRsvp, onDownload }) => (
  <div className="panel rounded-[1.5rem] p-6 sm:p-7 hover:border-gold-500/40 transition-colors duration-300 flex flex-col justify-between group">
    <div>
      <div className="flex items-start justify-between gap-2 mb-4 pb-4 border-b border-white/10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${accent.icon}`}>
          {meeting.icon}
        </div>
        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border uppercase tracking-[0.14em] ${accent.badge} shrink-0 text-center leading-tight`}>
          {meeting.category}
        </span>
      </div>

      <h3 className="font-display text-2xl font-bold text-cream-100 leading-snug mb-2 group-hover:text-gold-300 transition-colors">
        {meeting.title}
      </h3>

      <p className="text-sm text-cream-400 leading-relaxed mb-5 font-light">{meeting.description}</p>
    </div>

    <div className="space-y-3">
      <div className="space-y-2 text-xs bg-ink-950/50 p-4 rounded-2xl border border-white/8">
        <div className="flex items-start gap-2 font-semibold text-cream-200">
          <Clock className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
          <span>{meeting.scheduleLabel}</span>
        </div>
        <div className="flex items-start gap-2 text-cream-400 pl-[22px]">
          <span className="font-medium">{meeting.timeDisplay}</span>
        </div>
        <div className="flex items-start gap-2 text-cream-400">
          <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
          <span>{meeting.location}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <a
          href={meeting.googleCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gradient-to-r ${accent.cal} text-white font-semibold text-xs rounded-xl shadow-md transition hover:scale-[1.02] active:scale-95`}
          title="Add to Google Calendar"
        >
          <CalendarPlus className="w-3.5 h-3.5" />
          <span>Add to Calendar</span>
        </a>

        <button
          type="button"
          onClick={() => onDownload(meeting)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 border border-white/15 bg-white/5 hover:bg-white/10 text-cream-200 font-semibold text-xs rounded-xl transition hover:scale-[1.02] active:scale-95 cursor-pointer"
          title="Download .ics for Apple Calendar / Outlook"
        >
          <Download className="w-3.5 h-3.5 text-gold-400" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onRsvp(meeting)}
        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-gold-400 hover:text-gold-300 hover:bg-gold-500/10 rounded-xl transition cursor-pointer"
      >
        <Bell className="w-3.5 h-3.5" />
        <span>RSVP &amp; Get Reminders</span>
      </button>
    </div>
  </div>
);
