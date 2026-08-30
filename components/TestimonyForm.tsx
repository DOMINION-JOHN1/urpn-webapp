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
  RefreshCw,
} from 'lucide-react';
import { MediaRecorderComponent, MediaType } from './MediaRecorderComponent';

interface SubmissionResponse {
  success: boolean;
  message?: string;
  submission_id?: string;
  media_type?: 'audio' | 'video';
  drive_url?: string;
  transcript?: string;
  submitted_at?: string;
  error?: string;
}

export const TestimonyForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [consent, setConsent] = useState<boolean>(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!name.trim()) {
      setSubmitError('Please enter your name.');
      return;
    }
    if (!mediaBlob) {
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
      formData.append('mediaType', mediaType);
      formData.append('duration', durationSeconds.toString());

      const ext = 'webm';
      const file = new File([mediaBlob], `testimony.${ext}`, {
        type: mediaBlob.type || (mediaType === 'video' ? 'video/webm' : 'audio/webm'),
      });
      formData.append('media', file);

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
          colors: ['#EDA51E', '#F6C13B', '#7C3AED', '#C89B6F', '#FCF8F1'],
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
    setMediaBlob(null);
    setDurationSeconds(0);
    setSubmitSuccess(null);
    setSubmitError(null);
  };

  // ---------------------------- SUCCESS ----------------------------
  if (submitSuccess) {
    return (
      <div className="w-full max-w-xl mx-auto panel rounded-[1.75rem] p-8 sm:p-10 shadow-elevate text-center flex flex-col items-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-gold-500/20 to-royal-600/20 border border-gold-500/40 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-gold-300" />
        </div>

        <span className="font-cinzel text-xs font-semibold uppercase tracking-[0.22em] text-gold-400 mb-2">
          Received with Joy
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream-50 mb-3">
          Thank You for Sharing
        </h2>
        <p className="text-cream-300 text-base max-w-md leading-relaxed mb-7 font-light">
          Your testimony has been received, <strong className="text-gold-300">{name}</strong>. It
          will encourage and strengthen our church family.
        </p>

        <div className="w-full bg-ink-950/50 border border-white/8 rounded-2xl p-5 mb-8 text-left space-y-3">
          <div className="flex justify-between items-center text-xs pb-2 border-b border-white/8">
            <span className="text-cream-500 font-medium">Reference</span>
            <span className="font-mono font-bold text-gold-300 bg-ink-900 px-2 py-0.5 rounded">
              #{submitSuccess.submission_id}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs pb-2 border-b border-white/8">
            <span className="text-cream-500 font-medium">Format</span>
            <span className="text-cream-200 font-semibold capitalize flex items-center gap-1.5">
              {submitSuccess.media_type === 'video' ? (
                <Video className="w-3.5 h-3.5 text-gold-400" />
              ) : (
                <Mic className="w-3.5 h-3.5 text-gold-400" />
              )}
              {submitSuccess.media_type || mediaType} testimony
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-cream-500 font-medium">Received</span>
            <span className="text-cream-200 font-medium">
              {submitSuccess.submitted_at || new Date().toLocaleString()}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStartAnother}
          className="flex items-center gap-2 px-7 py-3.5 bg-gold-sheen text-ink-950 font-semibold text-sm rounded-xl shadow-glow-gold transition hover:scale-[1.03] active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Share Another Testimony</span>
        </button>
      </div>
    );
  }

  // ---------------------------- FORM ----------------------------
  return (
    <div className="w-full max-w-xl mx-auto panel rounded-[1.75rem] p-6 sm:p-8 md:p-10 shadow-elevate">
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
                className="w-full pl-10 pr-4 py-3.5 bg-ink-950/60 border border-white/10 rounded-xl text-cream-100 placeholder-cream-600 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/60 transition disabled:opacity-50"
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
                className="w-full pl-10 pr-4 py-3.5 bg-ink-950/60 border border-white/10 rounded-xl text-cream-100 placeholder-cream-600 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/60 transition disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="space-y-4 pt-1">
          <StepHeader n={2} title="Record Your Story" hint="Choose voice or video, then speak clearly from your heart." />
          <MediaRecorderComponent
            onRecordingComplete={handleRecordingComplete}
            onReset={handleResetRecording}
            disabled={isSubmitting}
            maxAudioSeconds={600}
            maxVideoSeconds={420}
          />
        </div>

        {/* Step 3 */}
        <div className="space-y-4 pt-1">
          <div className="p-4 rounded-2xl bg-ink-950/50 border border-white/8 flex items-start gap-3">
            <input
              id="consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              disabled={isSubmitting}
              className="mt-1 w-4 h-4 rounded border-white/20 text-gold-600 focus:ring-gold-500 bg-ink-900 cursor-pointer accent-gold-500"
            />
            <label htmlFor="consent" className="text-xs text-cream-400 leading-relaxed cursor-pointer">
              By submitting, I understand that my recording and details will be received and reviewed
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
            <div className="p-4 bg-gold-500/10 border border-gold-500/30 rounded-2xl flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-gold-300 animate-spin shrink-0" />
              <div className="flex-1 text-xs">
                <span className="font-bold text-gold-300 block">Please wait…</span>
                <span className="text-cream-300">{submissionStep}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !mediaBlob || !name.trim() || !consent}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gold-sheen bg-[length:200%_auto] hover:bg-right text-ink-950 font-semibold text-base rounded-2xl shadow-glow-gold transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
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

          {!mediaBlob && (
            <p className="text-center text-[11px] text-cream-500 font-medium">
              Record your testimony in Step 2 to enable submission.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

const StepHeader: React.FC<{ n: number; title: string; hint: string }> = ({ n, title, hint }) => (
  <div className="border-b border-white/8 pb-3">
    <h3 className="text-base font-bold text-cream-100 flex items-center gap-2.5 font-sans">
      <span className="w-7 h-7 rounded-full bg-gold-500/15 text-gold-300 border border-gold-500/40 text-xs flex items-center justify-center font-bold">
        {n}
      </span>
      <span>{title}</span>
    </h3>
    <p className="text-xs text-cream-500 mt-1.5 pl-[38px]">{hint}</p>
  </div>
);
