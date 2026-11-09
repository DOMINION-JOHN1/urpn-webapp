'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Video,
  Mic,
  PenLine,
  RefreshCw,
} from 'lucide-react';
import { MediaRecorderComponent, MediaType } from './MediaRecorderComponent';

type ShareMode = 'record' | 'write';

const MAX_TEXT_LENGTH = 8000;

interface SubmissionResponse {
  success: boolean;
  message?: string;
  submission_id?: string;
  media_type?: 'audio' | 'video' | 'text';
  drive_url?: string;
  transcript?: string;
  submitted_at?: string;
  error?: string;
}

export const TestimonyForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [consent, setConsent] = useState<boolean>(true);

  const [mode, setMode] = useState<ShareMode>('record');
  const [text, setText] = useState<string>('');
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>('audio');
  const [durationSeconds, setDurationSeconds] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionStep, setSubmissionStep] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<SubmissionResponse | null>(null);

  const handleRecordingComplete = (blob: Blob, type: MediaType, duration: number) => {
    setMediaBlob(blob);
    setMediaType(type);
    setDurationSeconds(duration);
    setSubmitError(null);
  };

  const handleResetRecording = () => {
    setMediaBlob(null);
    setDurationSeconds(0);
    setSubmitError(null);
  };

  const hasContent = mode === 'write' ? text.trim().length > 0 : !!mediaBlob;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!name.trim()) {
      setSubmitError('Please enter your name.');
      return;
    }
    if (mode === 'write' && !text.trim()) {
      setSubmitError('Please write your testimony before submitting.');
      return;
    }
    if (mode === 'record' && !mediaBlob) {
      setSubmitError('Please record your testimony before submitting.');
      return;
    }
    if (!consent) {
      setSubmitError('Please tick the box to let our team receive your testimony.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStep('Sending your testimony…');

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      if (contact.trim()) formData.append('contact', contact.trim());

      if (mode === 'write') {
        formData.append('mediaType', 'text');
        formData.append('text', text.trim());
      } else {
        formData.append('mediaType', mediaType);
        formData.append('duration', durationSeconds.toString());
        const file = new File([mediaBlob as Blob], 'testimony.webm', {
          type: (mediaBlob as Blob).type || (mediaType === 'video' ? 'video/webm' : 'audio/webm'),
        });
        formData.append('media', file);
      }

      const progressTimer = setTimeout(() => {
        setSubmissionStep('Almost done…');
      }, 2000);

      const response = await fetch('/api/testimonies', { method: 'POST', body: formData });
      clearTimeout(progressTimer);

      const data: SubmissionResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'We couldn’t submit your testimony right now. Please try again.');
      }

      setSubmitSuccess(data);
      setIsSubmitting(false);

      try {
        confetti({
          particleCount: 110,
          spread: 82,
          origin: { y: 0.6 },
          colors: ['#B05BA8', '#C894CB', '#D8B56F', '#FFFFFF', '#6A1557'],
        });
      } catch (_) {}
    } catch (err: any) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
      setSubmitError(err.message || 'We couldn’t submit your testimony right now. Please try again.');
    }
  };

  const handleStartAnother = () => {
    setName('');
    setContact('');
    setText('');
    setMode('record');
    setMediaBlob(null);
    setDurationSeconds(0);
    setSubmitSuccess(null);
    setSubmitError(null);
  };

  // ---------------------------- SUCCESS ----------------------------
  if (submitSuccess) {
    const kind = submitSuccess.media_type || (mode === 'write' ? 'text' : mediaType);
    return (
      <div className="w-full max-w-xl mx-auto rounded-2xl border border-line bg-surface p-7 text-center flex flex-col items-center sm:p-10">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10">
          <CheckCircle2 className="w-10 h-10 text-gold-300" />
        </div>

        <span className="mono-label mb-2 !text-gold-300">
          Received with Joy
        </span>
        <h2 className="mb-3 text-2xl font-semibold tracking-[-0.03em] text-cream-50 sm:text-3xl">
          Thank You for Sharing
        </h2>
        <p className="mb-7 max-w-md text-sm leading-relaxed text-cream-400">
          Your testimony has been received, <strong className="text-gold-300">{name}</strong>. It
          will encourage and strengthen our church family.
        </p>

        <div className="mb-8 w-full space-y-3 rounded-xl border border-line bg-canvas/50 p-4 text-left">
          <div className="flex items-center justify-between border-b border-line-soft pb-2 text-xs">
            <span className="text-cream-500 font-medium">Reference</span>
            <span className="rounded bg-canvas px-2 py-0.5 font-mono text-gold-300">
              #{submitSuccess.submission_id}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-cream-500 font-medium">Format</span>
            <span className="text-cream-200 font-semibold capitalize flex items-center gap-1.5">
              {kind === 'video' ? (
                <Video className="w-3.5 h-3.5 text-gold-400" />
              ) : kind === 'text' ? (
                <PenLine className="w-3.5 h-3.5 text-gold-400" />
              ) : (
                <Mic className="w-3.5 h-3.5 text-gold-400" />
              )}
              {kind === 'text' ? 'Written' : kind} testimony
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStartAnother}
          className="btn btn-primary"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Share Another Testimony</span>
        </button>
      </div>
    );
  }

  // ---------------------------- FORM ----------------------------
  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-line bg-surface p-5 sm:p-8 md:p-9">
      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Step 1 */}
        <div className="space-y-4">
          <StepHeader n={1} title="Your Details" hint="So our team knows who to celebrate with." />

          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-cream-300 mb-1.5">
              Full Name <span className="text-gold-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cream-600">
                <User className="w-4 h-4" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. David Adeyemi"
                disabled={isSubmitting}
                required
                className="field pl-10 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact" className="block text-xs font-semibold text-cream-300 mb-1.5">
              Email or Phone <span className="text-cream-600 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cream-600">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="contact"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="david@example.com or +234 801 234 5678"
                disabled={isSubmitting}
                className="field pl-10 disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="space-y-4 pt-1">
          <StepHeader n={2} title="Share Your Story" hint="Write it out, or record your voice or video — whatever you prefer." />

          {/* Write vs Record toggle */}
          <div className="mx-auto flex w-full max-w-xs items-center gap-1 rounded-full border border-line bg-canvas p-1">
            <button
              type="button"
              onClick={() => { setMode('write'); setSubmitError(null); }}
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                mode === 'write'
                  ? 'bg-accent text-accent-ink'
                  : 'text-cream-400 hover:text-cream-100 hover:bg-cream-50/5'
              }`}
            >
              <PenLine className="w-4 h-4" />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('record'); setSubmitError(null); }}
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                mode === 'record'
                  ? 'bg-accent text-accent-ink'
                  : 'text-cream-400 hover:text-cream-100 hover:bg-cream-50/5'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Record</span>
            </button>
          </div>

          {mode === 'write' ? (
            <div>
              <textarea
                value={text}
                onChange={(e) => { setText(e.target.value); setSubmitError(null); }}
                disabled={isSubmitting}
                rows={7}
                maxLength={MAX_TEXT_LENGTH}
                placeholder="Write your testimony here — share what God has done in your life…"
                className="field min-h-[168px] resize-y py-3 leading-relaxed disabled:opacity-50"
              />
              <div className="flex justify-end mt-1.5">
                <span className="text-[11px] text-cream-500">
                  {text.length.toLocaleString()} / {MAX_TEXT_LENGTH.toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <MediaRecorderComponent
              onRecordingComplete={handleRecordingComplete}
              onReset={handleResetRecording}
              disabled={isSubmitting}
              maxAudioSeconds={600}
              maxVideoSeconds={420}
            />
          )}
        </div>

        {/* Step 3 */}
        <div className="space-y-4 pt-1">
          <div className="flex items-start gap-3 rounded-xl border border-line-soft bg-canvas/50 p-4">
            <input
              id="consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              disabled={isSubmitting}
              className="mt-0.5 h-4 w-4 cursor-pointer rounded border-line bg-canvas accent-accent"
            />
            <label htmlFor="consent" className="text-xs text-cream-400 leading-relaxed cursor-pointer">
              By submitting, I understand that my testimony and details will be received and reviewed
              by the URPN pastoral team.
            </label>
          </div>

          {submitError && (
            <div className="p-4 bg-red-950/50 border border-red-800/60 rounded-2xl text-red-200 text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block text-red-300">We couldn’t submit that:</span>
                <span>{submitError}</span>
              </div>
            </div>
          )}

          {isSubmitting && (
            <div className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/[0.06] p-4">
              <Loader2 className="w-5 h-5 text-gold-300 animate-spin shrink-0" />
              <div className="flex-1 text-xs">
                <span className="font-bold text-gold-300 block">Please wait…</span>
                <span className="text-cream-300">{submissionStep}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !consent || !hasContent}
            className="btn btn-primary w-full py-4 text-[15px] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending…</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit My Testimony</span>
              </>
            )}
          </button>

          {!hasContent && (
            <p className="text-center text-[11px] text-cream-500 font-medium">
              {mode === 'write'
                ? 'Write your testimony above to enable submission.'
                : 'Record your testimony in Step 2 to enable submission.'}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

const StepHeader: React.FC<{ n: number; title: string; hint: string }> = ({ n, title, hint }) => (
  <div className="border-b border-line-soft pb-3">
    <h3 className="flex items-center gap-2.5 text-sm font-medium text-cream-50">
      <span className="flex h-6 w-6 items-center justify-center rounded-md border border-line bg-canvas font-mono text-[10px] text-accent">
        {n}
      </span>
      <span>{title}</span>
    </h3>
    <p className="mt-1.5 pl-[34px] text-xs leading-relaxed text-cream-500">{hint}</p>
  </div>
);
