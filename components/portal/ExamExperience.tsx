'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  Lock,
  Timer,
  X,
} from 'lucide-react';

interface Question {
  id: string;
  prompt: string;
  options: string[];
}

interface AttemptPayload {
  attempt: {
    id: string;
    expiresAt: string;
    startedAt: string;
  };
  questions: Question[];
  remainingSeconds: number;
  resumed?: boolean;
}

interface ExamExperienceProps {
  course: {
    slug: string;
    title: string;
    shortTitle: string;
    code: string;
    questionCount: number;
    durationMinutes: number;
    passMark: number;
    lessonCount: number;
  };
  hasOpenAttempt: boolean;
}

type Mode = 'intro' | 'answering' | 'closed' | 'submitting' | 'error';

function clock(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function ExamExperience({ course, hasOpenAttempt }: ExamExperienceProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('intro');
  const [understood, setUnderstood] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AttemptPayload | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [closeReason, setCloseReason] = useState<'tab_left' | 'time_expired' | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const answersRef = useRef<Record<string, number>>({});
  const submittingRef = useRef(false);
  const questions = data?.questions ?? [];
  const answeredCount = useMemo(
    () => questions.filter((question) => typeof answers[question.id] === 'number').length,
    [answers, questions]
  );

  const start = useCallback(async () => {
    setStarting(true);
    setError(null);
    try {
      const response = await fetch('/api/portal/exam/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.slug }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (payload.code === 'already_attempted' && payload.attempt?.id) {
          router.replace(
            `/portal/courses/${course.slug}/exam/result/${payload.attempt.id}`
          );
          return;
        }
        throw new Error(payload.error || 'Could not start the exam.');
      }

      setData(payload as AttemptPayload);
      setSecondsLeft(
        payload.remainingSeconds ??
          Math.max(0, Math.ceil((Date.parse(payload.attempt.expiresAt) - Date.now()) / 1000))
      );
      answersRef.current = {};
      setAnswers({});
      setCurrent(0);
      setMode('answering');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start the exam.');
      setStarting(false);
    }
  }, [course.slug, router]);

  const submit = useCallback(
    async (reason: 'submitted' | 'tab_left' | 'time_expired') => {
      if (!data || submittingRef.current) return;
      submittingRef.current = true;
      setSubmitError(null);
      if (reason === 'tab_left') {
        setCloseReason('tab_left');
        setMode('closed');
      } else if (reason === 'time_expired') {
        setCloseReason('time_expired');
        setMode('submitting');
      } else {
        setMode('submitting');
      }

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 20000);

      try {
        const response = await fetch('/api/portal/exam/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attemptId: data.attempt.id,
            answers: answersRef.current,
            reason,
          }),
          keepalive: true,
          signal: controller.signal,
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || 'Could not submit your exam.');
        }
        router.replace(`/portal/courses/${course.slug}/exam/result/${data.attempt.id}`);
        router.refresh();
      } catch (err) {
        submittingRef.current = false;
        setSubmitError(
          err instanceof DOMException && err.name === 'AbortError'
            ? 'The connection timed out. Your attempt is closed — retry the submission.'
            : err instanceof Error
              ? err.message
              : 'Could not submit your exam.'
        );
        setMode('error');
      } finally {
        window.clearTimeout(timeout);
      }
    },
    [course.slug, data, router]
  );

  // Countdown
  useEffect(() => {
    if (!data || mode !== 'answering') return;
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.ceil((Date.parse(data.attempt.expiresAt) - Date.now()) / 1000)
      );
      setSecondsLeft(remaining);
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [data, mode]);

  useEffect(() => {
    if (mode === 'answering' && secondsLeft === 0 && data) {
      void submit('time_expired');
    }
  }, [secondsLeft, mode, data, submit]);

  // Leaving the tab closes the attempt immediately.
  useEffect(() => {
    if (!data || mode !== 'answering') return;

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') void submit('tab_left');
    };
    const onPageHide = () => {
      if (!submittingRef.current) void submit('tab_left');
    };
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    const onCopy = (event: ClipboardEvent) => event.preventDefault();
    const onContextMenu = (event: MouseEvent) => event.preventDefault();

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('beforeunload', onBeforeUnload);
    document.addEventListener('copy', onCopy);
    document.addEventListener('paste', onCopy);
    document.addEventListener('contextmenu', onContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('paste', onCopy);
      document.removeEventListener('contextmenu', onContextMenu);
    };
  }, [data, mode, submit]);

  // Block browser back/swipe-back from slipping away without closing the exam.
  useEffect(() => {
    if (!data || mode !== 'answering') return;
    window.history.pushState({ urpnExam: true }, '', window.location.href);
    const onPop = () => {
      void submit('tab_left');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [data, mode, submit]);

  const choose = (questionId: string, optionIndex: number) => {
    const next = { ...answersRef.current, [questionId]: optionIndex };
    answersRef.current = next;
    setAnswers(next);
  };

  const question = questions[current];
  const lowTime = secondsLeft <= 120;

  /* ------------------------------------------------------------------ intro */
  if (mode === 'intro') {
    return (
      <div>
        <button
          type="button"
          onClick={() => router.push(`/portal/courses/${course.slug}`)}
          className="inline-flex items-center gap-1.5 text-[11.5px] text-cream-500 transition-colors hover:text-cream-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {course.shortTitle}
        </button>

        <div className="mt-5 flex items-center gap-3">
          <span className="h-px w-6 bg-gold-500/70" />
          <span className="mono-label text-gold-300">Final exam</span>
        </div>
        <h1 className="mt-4 text-[30px] font-semibold leading-[1.1] tracking-[-0.04em] text-cream-50 sm:text-[38px]">
          {course.shortTitle} final exam.
        </h1>
        <p className="mt-3 max-w-xl text-[13.5px] leading-[1.75] text-cream-400">
          You have completed the lessons. This is the examination for the {course.title}. Read the
          rules carefully — there is only one attempt.
        </p>

        {hasOpenAttempt && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-gold-400/30 bg-gold-400/[0.06] p-4">
            <Timer className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
            <div>
              <p className="text-[13px] font-medium text-cream-100">
                You have an exam in progress.
              </p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-cream-400">
                Resume it below. The timer has continued running since the attempt started, and
                leaving this tab will close it.
              </p>
            </div>
          </div>
        )}

        <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
          {[
            { label: 'Questions', value: String(course.questionCount) },
            { label: 'Time limit', value: `${course.durationMinutes} min` },
            { label: 'Attempts', value: '1' },
            { label: 'Pass mark', value: `${course.passMark}%` },
          ].map((item) => (
            <div key={item.label} className="bg-surface p-4">
              <p className="mono-label !text-[8.5px]">{item.label}</p>
              <p className="mt-1.5 text-[18px] font-semibold tracking-[-0.02em] text-cream-50">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <p className="flex items-center gap-2 text-[13px] font-medium text-cream-50">
            <AlertTriangle className="h-4 w-4 text-gold-300" aria-hidden="true" />
            Before you begin
          </p>
          <ul className="mt-4 space-y-3 text-[12.5px] leading-relaxed text-cream-400">
            <li className="flex gap-2.5">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-cream-500" />
              The timer starts as soon as you press <strong className="text-cream-200">Start exam</strong>.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-cream-500" />
              <span>
                <strong className="text-cream-200">Do not leave this tab.</strong> Switching tabs,
                minimising the window, or opening another app closes and submits your exam
                automatically.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-cream-500" />
              One attempt only. There is no retake and no reset.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-cream-500" />
              When time runs out your saved answers are submitted automatically.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-cream-500" />
              A stable internet connection is required. Your answers are sent at submission.
            </li>
          </ul>
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-canvas/50 p-4">
          <input
            type="checkbox"
            checked={understood}
            onChange={(event) => setUnderstood(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-line bg-canvas accent-accent"
          />
          <span className="text-[12px] leading-relaxed text-cream-300">
            I understand the rules. I have a quiet place, a stable connection, and I am ready to
            use my only attempt.
          </span>
        </label>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-900/60 bg-red-950/40 p-3.5 text-xs text-red-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={start}
            disabled={!understood || starting}
            className="btn btn-primary"
          >
            {starting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Timer className="h-4 w-4" aria-hidden="true" />
            )}
            {hasOpenAttempt ? 'Resume exam' : 'Start exam'}
          </button>
          <p className="flex items-center gap-1.5 text-[11px] text-cream-500">
            <Lock className="h-3 w-3" aria-hidden="true" />
            The exam closes if you leave the tab.
          </p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------- active / closing */
  if (!data || !question) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 text-center">
        <Loader2 className="mx-auto h-5 w-5 animate-spin text-accent" />
        <p className="mt-3 text-sm text-cream-300">Preparing your exam…</p>
      </div>
    );
  }

  const isClosing = mode === 'closed' || mode === 'submitting';

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-canvas">
      <header className="sticky top-0 z-10 border-b border-line bg-canvas/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="hidden h-6 w-6 shrink-0 items-center justify-center rounded border border-line font-mono text-[9px] text-accent sm:flex">
              U
            </span>
            <div className="min-w-0">
              <p className="truncate font-mono text-[9px] uppercase tracking-[0.14em] text-cream-500">
                {course.code} · Final exam
              </p>
              <p className="truncate text-[12px] text-cream-200">{course.title}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[9.5px] text-cream-500 md:flex">
              <ShieldDot />
              Do not leave this tab
            </span>
            <span
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[12px] tabular-nums ${
                lowTime
                  ? 'border-red-800/60 bg-red-950/50 text-red-200'
                  : 'border-line bg-surface text-cream-100'
              }`}
              role="timer"
              aria-label={`${secondsLeft} seconds remaining`}
            >
              <Timer className="h-3.5 w-3.5" aria-hidden="true" />
              {clock(secondsLeft)}
            </span>
          </div>
        </div>
        <div className="h-0.5 w-full bg-surface">
          <div
            className={`h-full transition-all ${lowTime ? 'bg-red-400' : 'bg-accent'}`}
            style={{
              width: `${Math.max(0, Math.min(100, (secondsLeft / (course.durationMinutes * 60)) * 100))}%`,
            }}
          />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-5 sm:px-6 sm:pt-7">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-500">
            Question {current + 1} of {questions.length}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream-500">
            {answeredCount} answered
          </p>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>

        <div className="mt-5 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_210px]">
          <div className="min-w-0">
            <div className="w-full min-w-0 rounded-2xl border border-line bg-surface p-5 sm:p-7">
              <p className="mono-label !text-[9px]">Question {current + 1}</p>
              <h2 className="mt-3 text-[18px] font-medium leading-[1.5] tracking-[-0.02em] text-cream-50 sm:text-[20px]">
                {question.prompt}
              </h2>

              <fieldset className="mt-6 min-w-0 space-y-2.5" disabled={isClosing}>
                <legend className="sr-only">{question.prompt}</legend>
                {question.options.map((option, index) => {
                  const selected = answers[question.id] === index;
                  const letter = String.fromCharCode(65 + index);
                  return (
                    <label
                      key={option}
                      className={`flex w-full min-w-0 cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                        selected
                          ? 'border-accent/50 bg-accent/[0.06]'
                          : 'border-line bg-canvas/40 hover:border-line-strong'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={index}
                        checked={selected}
                        onChange={() => choose(question.id, index)}
                        className="sr-only"
                      />
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-[10px] ${
                          selected
                            ? 'border-accent/50 bg-accent text-accent-ink'
                            : 'border-line bg-canvas text-cream-500'
                        }`}
                      >
                        {selected ? <Check className="h-3.5 w-3.5" /> : letter}
                      </span>
                      <span className="min-w-0 break-words text-[13px] leading-relaxed text-cream-200">{option}</span>
                    </label>
                  );
                })}
              </fieldset>
            </div>

            <div className="mt-4 flex w-full items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrent((value) => Math.max(0, value - 1))}
                disabled={current === 0 || isClosing}
                className="btn btn-secondary btn-sm disabled:opacity-40"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Previous
              </button>

              {current === questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setConfirmOpen(true)}
                  disabled={isClosing}
                  className="btn btn-primary btn-sm"
                >
                  Review &amp; submit
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrent((value) => Math.min(questions.length - 1, value + 1))}
                  disabled={isClosing}
                  className="btn btn-primary btn-sm"
                >
                  Next question
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Mobile jump bar */}
            <div className="mt-5 flex max-w-full gap-1.5 overflow-x-auto pb-1 lg:hidden">
              {questions.map((item, index) => {
                const answered = typeof answers[item.id] === 'number';
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrent(index)}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border font-mono text-[10px] ${
                      index === current
                        ? 'border-accent/50 bg-accent/10 text-accent'
                        : answered
                          ? 'border-line bg-surface text-cream-200'
                          : 'border-line bg-canvas text-cream-600'
                    }`}
                    aria-label={`Question ${index + 1}${answered ? ', answered' : ''}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-xl border border-line bg-surface p-4">
              <p className="mono-label !text-[8.5px]">Questions</p>
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {questions.map((item, index) => {
                  const answered = typeof answers[item.id] === 'number';
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCurrent(index)}
                      className={`flex h-8 items-center justify-center rounded-md border font-mono text-[10px] transition-colors ${
                        index === current
                          ? 'border-accent/60 bg-accent/10 text-accent'
                          : answered
                            ? 'border-line bg-canvas text-cream-200'
                            : 'border-line bg-canvas text-cream-600'
                      }`}
                      aria-label={`Question ${index + 1}${answered ? ', answered' : ''}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 space-y-1.5 border-t border-line-soft pt-3 text-[10px] text-cream-500">
                <p className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-sm bg-accent/40" /> Current / answered
                </p>
                <p className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-sm border border-line" /> Unanswered
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                disabled={isClosing}
                className="btn btn-primary btn-sm mt-4 w-full"
              >
                Submit exam
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Confirm submit */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mono-label">Submit exam</p>
                <h3 className="mt-2 text-lg font-semibold text-cream-50">Are you sure?</h3>
              </div>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-full border border-line p-1.5 text-cream-400 hover:text-cream-50"
                aria-label="Keep working"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-cream-400">
              You have answered <strong className="text-cream-100">{answeredCount}</strong> of{' '}
              {questions.length} questions.
              {answeredCount < questions.length && (
                <>
                  {' '}
                  <span className="text-gold-300">
                    {questions.length - answeredCount} will be marked unanswered.
                  </span>
                </>
              )}{' '}
              You cannot retake this exam.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="btn btn-secondary flex-1"
              >
                Keep working
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmOpen(false);
                  void submit('submitted');
                }}
                className="btn btn-primary flex-1"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Closing / submitting overlay */}
      {(isClosing || mode === 'error') && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-canvas/95 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 text-center">
            {mode === 'error' ? (
              <>
                <AlertCircle className="mx-auto h-7 w-7 text-red-300" />
                <h2 className="mt-3 text-lg font-semibold text-cream-50">Submission failed</h2>
                <p className="mt-2 text-[12.5px] leading-relaxed text-cream-400">
                  {submitError ?? 'Your answers could not be submitted.'} Your attempt is closed;
                  retry the submission below.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitError(null);
                    void submit(closeReason ?? 'time_expired');
                  }}
                  className="btn btn-primary mt-5 w-full"
                >
                  Retry submission
                </button>
              </>
            ) : (
              <>
                {mode === 'closed' ? (
                  <Lock className="mx-auto h-7 w-7 text-gold-300" />
                ) : (
                  <Loader2 className="mx-auto h-7 w-7 animate-spin text-accent" />
                )}
                <h2 className="mt-3 text-lg font-semibold text-cream-50">
                  {mode === 'closed' ? 'Exam closed' : 'Submitting your exam'}
                </h2>
                <p className="mt-2 text-[12.5px] leading-relaxed text-cream-400">
                  {mode === 'closed'
                    ? 'You left the exam tab, so your attempt has been closed and is being submitted.'
                    : 'Your answers are on their way. Please keep this page open.'}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-cream-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Preparing your result…
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ShieldDot() {
  return <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />;
}
