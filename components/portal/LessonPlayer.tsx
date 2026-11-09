'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  Download,
  Headphones,
  History,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Save,
  ShieldCheck,
  Volume2,
  VolumeX,
} from 'lucide-react';

export interface PlayerLesson {
  id: string;
  title: string;
  kind: 'video' | 'audio' | 'reading';
  summary: string;
  estimatedMinutes: number;
  mediaUrl?: string;
  mime?: string;
  durationSeconds?: number;
  poster?: string;
  body?: string[];
  keyPoints?: string[];
  scripture?: { reference: string; text: string };
}

interface LessonPlayerProps {
  courseSlug: string;
  courseTitle: string;
  lesson: PlayerLesson;
  initialPosition: number;
  initiallyCompleted: boolean;
  initialNotes?: string;
  allNotes?: Record<string, string>;
  allLessons?: { id: string; title: string }[];
  /** How many lessons were already completed when the page was server-rendered */
  initialCompletedCount?: number;
  /** Total lessons in the course */
  totalLessons?: number;
  nextHref?: string;
  nextTitle?: string;
  previousHref?: string;
  previousTitle?: string;
  userEmail: string;
}

function clock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function LessonPlayer({
  courseSlug,
  courseTitle,
  lesson,
  initialPosition,
  initiallyCompleted,
  initialNotes,
  allNotes,
  allLessons,
  initialCompletedCount = 0,
  totalLessons = 0,
  nextHref,
  nextTitle,
  previousHref,
  previousTitle,
  userEmail,
}: LessonPlayerProps) {
  const router = useRouter();
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
  const completedRef = useRef(initiallyCompleted);
  const inFlightRef = useRef(false);
  const lastReportRef = useRef(0);

  const [completed, setCompleted] = useState(initiallyCompleted);
  const [completedCount, setCompletedCount] = useState(initialCompletedCount);
  const [justCompletedToast, setJustCompletedToast] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(lesson.durationSeconds ?? 0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [mediaError, setMediaError] = useState(false);
  const [resumed, setResumed] = useState(false);
  const [marking, setMarking] = useState(false);
  const [notes, setNotes] = useState(initialNotes || '');
  const [savingNotes, setSavingNotes] = useState(false);
  const [savedNotes, setSavedNotes] = useState(false);
  const [showPastNotes, setShowPastNotes] = useState(false);

  const pastNotesList = useMemo(() => {
    if (!allNotes || !allLessons) return [];
    return allLessons
      .filter((l) => l.id !== lesson.id && allNotes[l.id] && allNotes[l.id].trim().length > 0)
      .map((l) => ({
        id: l.id,
        title: l.title,
        text: allNotes[l.id],
      }));
  }, [allNotes, allLessons, lesson.id]);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await fetch('/api/portal/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: courseSlug,
          lessonId: lesson.id,
          notes,
        }),
      });
      setSavedNotes(true);
      setTimeout(() => setSavedNotes(false), 3000);
    } catch (err) {
      console.warn('Failed to save notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  const markCompleteNow = async () => {
    setMarking(true);
    const media = mediaRef.current;
    const pos = media ? media.currentTime : currentTime;
    await report(pos, true);
    setMarking(false);
  };

  const report = useCallback(
    async (position: number, markComplete = false) => {
      if (completedRef.current && !markComplete) return;
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      setSaveState('saving');
      try {
        const response = await fetch('/api/portal/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId: courseSlug,
            lessonId: lesson.id,
            positionSeconds: Math.max(0, Math.round(position)),
            markComplete,
          }),
          keepalive: true,
        });
        if (!response.ok) throw new Error('save failed');
        const data = (await response.json()) as { completed?: boolean };
        lastReportRef.current = Date.now();
        if (data.completed) {
          const wasCompleted = completedRef.current;
          completedRef.current = true;
          setCompleted(true);
          if (!wasCompleted) {
            setCompletedCount((prev) => prev + 1);
            setJustCompletedToast(true);
          }
          router.refresh();
        }
        setSaveState('saved');
      } catch {
        setSaveState('error');
      } finally {
        inFlightRef.current = false;
      }
    },
    [courseSlug, lesson.id, router]
  );

  const handleTimeUpdate = () => {
    const media = mediaRef.current;
    if (!media) return;
    setCurrentTime(media.currentTime);
    const total = media.duration || duration;
    if (!completedRef.current && total > 0) {
      if (media.currentTime / total >= 0.9) {
        void report(media.currentTime, true);
      } else if (Date.now() - lastReportRef.current > 12000) {
        lastReportRef.current = Date.now();
        void report(media.currentTime);
      }
    }
  };

  const handleLoadedMetadata = () => {
    const media = mediaRef.current;
    if (!media) return;
    const total = Number.isFinite(media.duration) ? media.duration : lesson.durationSeconds ?? 0;
    setDuration(total);
    if (!initiallyCompleted && initialPosition > 3 && initialPosition < total - 3) {
      media.currentTime = initialPosition;
      setCurrentTime(initialPosition);
      setResumed(true);
    }
  };

  const handleEnded = () => {
    setPlaying(false);
    const media = mediaRef.current;
    void report(media?.currentTime ?? duration, true);
  };

  // Save the position when the page is hidden or unmounted.
  useEffect(() => {
    const saveBeacon = () => {
      const media = mediaRef.current;
      if (!media || completedRef.current || media.currentTime < 3) return;
      try {
        const payload = JSON.stringify({
          courseId: courseSlug,
          lessonId: lesson.id,
          positionSeconds: Math.round(media.currentTime),
        });
        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            '/api/portal/progress',
            new Blob([payload], { type: 'application/json' })
          );
        }
      } catch {
        // Best effort only.
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') saveBeacon();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', saveBeacon);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', saveBeacon);
      saveBeacon();
    };
  }, [courseSlug, lesson.id]);

  const togglePlay = async () => {
    const media = mediaRef.current;
    if (!media) return;
    if (media.paused) {
      try {
        await media.play();
      } catch {
        setMediaError(true);
      }
    } else {
      media.pause();
    }
  };

  const skip = (delta: number) => {
    const media = mediaRef.current;
    if (!media) return;
    media.currentTime = Math.min(
      Math.max(0, media.currentTime + delta),
      media.duration || duration
    );
    setCurrentTime(media.currentTime);
  };

  const seek = (value: number) => {
    const media = mediaRef.current;
    if (!media) return;
    media.currentTime = value;
    setCurrentTime(value);
  };

  const toggleMute = () => {
    const media = mediaRef.current;
    if (!media) return;
    media.muted = !media.muted;
    setMuted(media.muted);
  };

  const markReadingComplete = async () => {
    setMarking(true);
    await report(0, true);
    setMarking(false);
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const waves = useMemo(
    () =>
      Array.from({ length: 52 }, (_, index) => {
        const value = Math.abs(Math.sin(index * 1.37) * 0.55 + Math.sin(index * 0.61) * 0.35);
        return 18 + Math.round(value * 72);
      }),
    []
  );

  return (
    <div>
      {/* Media */}
      {lesson.kind === 'video' && (
        <div
          className="relative overflow-hidden rounded-xl border border-line bg-black"
          onContextMenu={(event) => event.preventDefault()}
        >
          {mediaError ? (
            <div className="flex aspect-video w-full flex-col items-center justify-center px-6 text-center">
              <AlertCircle className="h-6 w-6 text-cream-500" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-cream-200">
                This lesson is not available right now.
              </p>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-cream-500">
                Check your connection and try again. If the problem continues, contact the
                training desk.
              </p>
            </div>
          ) : (
            <video
              ref={(element) => {
                mediaRef.current = element;
              }}
              src={lesson.mediaUrl}
              poster={lesson.poster}
              controls
              playsInline
              preload="metadata"
              controlsList="nodownload noplaybackrate noremoteplayback"
              disablePictureInPicture
              onContextMenu={(event) => event.preventDefault()}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setPlaying(true)}
              onPause={() => {
                setPlaying(false);
                const media = mediaRef.current;
                if (media) void report(media.currentTime);
              }}
              onEnded={handleEnded}
              onError={() => setMediaError(true)}
              className="aspect-video w-full bg-black"
            >
              Your browser does not support video playback.
            </video>
          )}

          <span className="pointer-events-none absolute right-3 top-3 select-none rounded bg-black/45 px-2 py-1 font-mono text-[8.5px] tracking-[0.08em] text-white/45 backdrop-blur-sm">
            {userEmail}
          </span>
        </div>
      )}

      {lesson.kind === 'audio' && (
        <div
          className="overflow-hidden rounded-xl border border-line bg-surface"
          onContextMenu={(event) => event.preventDefault()}
        >
          <div className="relative border-b border-line-soft bg-canvas/50 px-5 py-5">
            <span className="pointer-events-none absolute right-3 top-3 select-none font-mono text-[8.5px] tracking-[0.08em] text-cream-600">
              {userEmail}
            </span>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-gold-300">
                  <Headphones className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="mono-label !text-[9px]">Audio teaching</p>
                  <p className="mt-1 truncate text-[14px] font-medium text-cream-50">{lesson.title}</p>
                </div>
              </div>

              {lesson.mediaUrl && (
                <a
                  href={`${lesson.mediaUrl}&download=1`}
                  download
                  className="btn btn-secondary btn-sm shrink-0 gap-1.5 text-xs"
                  title="Download audio file to listen offline"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download audio</span>
                </a>
              )}
            </div>

            <div className="mt-5 flex h-12 items-end gap-[3px]" aria-hidden="true">
              {waves.map((height, index) => {
                const active = (index / waves.length) * 100 <= progressPercent;
                return (
                  <span
                    key={index}
                    className={`flex-1 rounded-full transition-colors ${
                      active ? 'bg-gold-400' : 'bg-line-strong'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>

            <audio
              ref={(element) => {
                mediaRef.current = element;
              }}
              src={lesson.mediaUrl}
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setPlaying(true)}
              onPause={() => {
                setPlaying(false);
                const media = mediaRef.current;
                if (media) void report(media.currentTime);
              }}
              onEnded={handleEnded}
              onError={() => setMediaError(true)}
              className="hidden"
            />
          </div>

          <div className="px-5 py-4">
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.1}
              value={Math.min(currentTime, duration || 1)}
              onChange={(event) => seek(Number(event.target.value))}
              className="w-full accent-accent"
              aria-label="Seek audio"
            />
            <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-cream-500">
              <span>{clock(currentTime)}</span>
              <span>{clock(duration)}</span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => skip(-15)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-cream-400 hover:bg-cream-50/[0.04] hover:text-cream-50"
                  aria-label="Back 15 seconds"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-ink transition-colors hover:bg-accent-hover"
                  aria-label={playing ? 'Pause audio' : 'Play audio'}
                >
                  {playing ? (
                    <Pause className="h-5 w-5 fill-current" />
                  ) : (
                    <Play className="ml-0.5 h-5 w-5 fill-current" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => skip(15)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-cream-400 hover:bg-cream-50/[0.04] hover:text-cream-50"
                  aria-label="Forward 15 seconds"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={toggleMute}
                className="flex h-9 w-9 items-center justify-center rounded-full text-cream-400 hover:bg-cream-50/[0.04] hover:text-cream-50"
                aria-label={muted ? 'Unmute audio' : 'Mute audio'}
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>

            {mediaError && (
              <p className="mt-3 text-xs text-red-300">
                This audio is not available right now. Please try again later.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Reading */}
      {lesson.kind === 'reading' && (
        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          <div className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-3.5">
            <span className="mono-label flex items-center gap-2 !text-[9px]">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              Reading
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-cream-500">
              {lesson.estimatedMinutes} min read
            </span>
          </div>
          <div className="prose-urpn px-5 py-6 sm:px-7 sm:py-8">
            {lesson.body?.map((paragraph) => <p key={paragraph.slice(0, 24)}>{paragraph}</p>)}
          </div>
        </div>
      )}

      {/* Save state */}
      {lesson.kind !== 'reading' && (
        <div className="mt-2.5 flex items-center justify-between gap-3 text-[10.5px] text-cream-500">
          <span className="inline-flex items-center gap-1.5">
            {saveState === 'saving' ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                Saving progress…
              </>
            ) : saveState === 'error' ? (
              <>
                <AlertCircle className="h-3 w-3 text-red-400" aria-hidden="true" />
                Progress could not be saved — check your connection.
              </>
            ) : saveState === 'saved' ? (
              <>
                <Check className="h-3 w-3 text-accent" aria-hidden="true" />
                Progress saved
              </>
            ) : resumed ? (
              <>Resumed where you left off</>
            ) : (
              <>Progress saves automatically</>
            )}
          </span>
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            <Download className="h-3 w-3 text-gold-400" aria-hidden="true" />
            Listen or download
          </span>
        </div>
      )}

      {/* Universal Mark As Complete Section */}
      <div className="mt-5">
        {/* Animated celebration toast when newly marked complete */}
        {justCompletedToast && (
          <div className="mb-3 flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-500/15 p-3 text-xs text-emerald-300 animate-fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Progress updated! <strong>{completedCount} / {totalLessons}</strong> lessons completed ({totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0}%)</span>
            </span>
            <button
              type="button"
              onClick={() => setJustCompletedToast(false)}
              className="text-[10px] text-emerald-400 hover:text-emerald-200"
            >
              Dismiss
            </button>
          </div>
        )}

        {completed ? (
          <div className="flex flex-col gap-3 rounded-xl border border-gold-400/25 bg-gold-400/[0.05] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-gold-300 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[12.5px] font-semibold text-cream-50 flex items-center gap-2">
                  <span>Lesson complete!</span>
                  {totalLessons > 0 && (
                    <span className="font-mono text-[10px] text-gold-400 font-normal">
                      ({completedCount}/{totalLessons} done)
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-cream-400">
                  {nextTitle
                    ? `Next unlocked: ${nextTitle}`
                    : 'All lessons complete! Head to the Final Exam.'}
                </p>
              </div>
            </div>
            {nextHref ? (
              <Link href={nextHref} className="btn btn-primary btn-sm shrink-0">
                <span>Next: {nextTitle ?? 'Next topic'}</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            ) : (
              <Link href={`/portal/courses/${courseSlug}`} className="btn btn-primary btn-sm shrink-0">
                <span>Go to Final Exam</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-cream-500 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[12.5px] font-semibold text-cream-50">
                  Finished this teaching?
                </p>
                <p className="text-[11px] text-cream-400">
                  Mark as complete to unlock the next audio or course topic.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={markCompleteNow}
              disabled={marking}
              className="btn btn-primary btn-sm shrink-0"
            >
              {marking ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>Mark as complete &amp; unlock next</span>
            </button>
          </div>
        )}
      </div>

      {/* Class Notes (Study Notes) */}
      <div className="mt-6 rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold text-cream-50">Class Notes</h3>
          </div>
          {savedNotes && (
            <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-400">
              <Check className="h-3 w-3" /> Notes saved
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-cream-500">
          Record what the Spirit is teaching you during this session…
        </p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Record what the Spirit is teaching you..."
          rows={4}
          className="field mt-3 resize-y font-sans text-xs leading-relaxed"
        />

        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowPastNotes(!showPastNotes)}
            className="btn btn-secondary btn-sm gap-1.5 text-xs text-cream-300"
          >
            <History className="h-3.5 w-3.5" />
            <span>{showPastNotes ? 'Hide Past Notes' : 'Past Notes'}</span>
          </button>
          <button
            type="button"
            onClick={handleSaveNotes}
            disabled={savingNotes}
            className="btn btn-primary btn-sm gap-1.5"
          >
            {savingNotes ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>Save</span>
          </button>
        </div>

        {/* Past Notes collapsible drawer matching Image 2 */}
        {showPastNotes && (
          <div className="mt-4 rounded-xl border border-line-soft bg-canvas/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <History className="h-3.5 w-3.5 text-gold-400" />
              <h4 className="text-xs font-semibold text-cream-100 uppercase tracking-wider font-mono">
                Your Past Notes in this Track
              </h4>
            </div>

            {pastNotesList.length === 0 ? (
              <p className="text-xs text-cream-500 italic py-1">
                No notes from other lessons found yet. As you record notes in other sessions, they will be archived here.
              </p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {pastNotesList.map((item) => (
                  <div key={item.id} className="rounded-lg border border-line bg-surface/80 p-3">
                    <p className="font-medium text-xs text-cream-100">{item.title}</p>
                    <p className="mt-1 text-xs text-cream-300 whitespace-pre-wrap leading-relaxed font-sans">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scripture + key points */}
      {(lesson.scripture || lesson.keyPoints?.length) && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {lesson.scripture && (
            <figure className="rounded-xl border border-line bg-surface p-5">
              <p className="mono-label !text-[9px]">Scripture</p>
              <blockquote className="mt-3 text-[14px] leading-[1.7] text-cream-200">
                “{lesson.scripture.text}”
              </blockquote>
              <figcaption className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-cream-500">
                {lesson.scripture.reference}
              </figcaption>
            </figure>
          )}
          {lesson.keyPoints && lesson.keyPoints.length > 0 && (
            <div className="rounded-xl border border-line bg-surface p-5">
              <p className="mono-label !text-[9px]">Remember this</p>
              <ul className="mt-3 space-y-2.5">
                {lesson.keyPoints.map((point) => (
                  <li key={point} className="flex gap-2 text-[12px] leading-relaxed text-cream-300">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-300" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Prev / next */}
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-line-soft pt-5">
        {previousHref ? (
          <Link
            href={previousHref}
            className="group flex min-w-0 items-center gap-2 text-[11.5px] text-cream-400 transition-colors hover:text-cream-50"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0">
              <span className="mono-label block !text-[8.5px]">Previous</span>
              <span className="block max-w-[180px] truncate">{previousTitle}</span>
            </span>
          </Link>
        ) : (
          <Link
            href={`/portal/courses/${courseSlug}`}
            className="text-[11.5px] text-cream-400 transition-colors hover:text-cream-50"
          >
            ← Back to {courseTitle}
          </Link>
        )}
        {nextHref && (
          <Link
            href={nextHref}
            className="flex min-w-0 items-center gap-2 text-right text-[11.5px] text-cream-400 transition-colors hover:text-cream-50"
          >
            <span className="min-w-0">
              <span className="mono-label block !text-[8.5px]">Next</span>
              <span className="block max-w-[180px] truncate">{nextTitle}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}
