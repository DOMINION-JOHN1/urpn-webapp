'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Loader2,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

interface Props {
  courseSlug: string;
  courseTitle: string;
  conditions: string[];
  enrolled: boolean;
  conditionsAcceptedAt?: string | null;
}

export function DepartmentConditionsAcceptance({
  courseSlug,
  courseTitle,
  conditions,
  enrolled,
  conditionsAcceptedAt,
}: Props) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  if (conditions.length === 0) return null;

  const handleAccept = async () => {
    if (!agreed) {
      setError('Please check the box to confirm you accept the department conditions.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/portal/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: courseSlug, acceptConditions: true }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Could not enroll in department.');
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not enroll in department.');
      setLoading(false);
    }
  };

  const formattedDate = conditionsAcceptedAt
    ? new Date(conditionsAcceptedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  // If already enrolled and conditions accepted
  if (enrolled) {
    return (
      <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.04] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="mono-label !text-emerald-400">Enrolled &amp; Verified</span>
                {formattedDate && (
                  <span className="font-mono text-[10px] text-cream-500">
                    · Accepted {formattedDate}
                  </span>
                )}
              </div>
              <h2 className="mt-1 text-[16px] font-semibold text-cream-50">
                Department conditions acknowledged
              </h2>
              <p className="mt-0.5 text-[12.5px] leading-relaxed text-cream-400">
                You are enrolled in the {courseTitle}. Complete every lesson below to unlock your final exam and receive your certificate.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex shrink-0 items-center gap-1.5 self-start text-[11.5px] font-medium text-cream-400 transition-colors hover:text-cream-50 sm:self-center"
          >
            <span>{expanded ? 'Hide conditions' : 'Review conditions'}</span>
            {expanded ? (
              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
        </div>

        {expanded && (
          <div className="mt-5 border-t border-emerald-500/15 pt-4">
            <p className="mono-label mb-3 !text-[9.5px]">Agreed standards &amp; requirements</p>
            <ul className="space-y-2">
              {conditions.map((condition, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-cream-300"
                >
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                  </span>
                  <span>{condition}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Not enrolled yet: show conditions checklist + accept checkbox + start button
  return (
    <div className="rounded-2xl border border-gold-500/30 bg-surface p-6 sm:p-7 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/10 text-gold-300">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <span className="mono-label !text-gold-300">Step 1 · Department Standards</span>
          <h2 className="mt-0.5 text-[18px] font-semibold text-cream-50">
            Conditions to join the {courseTitle}
          </h2>
        </div>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-cream-300">
        Every department worker represents the altar and the house. Please read the requirements below carefully. Accepting these conditions unlocks the training lessons.
      </p>

      <div className="mt-5 space-y-2.5 rounded-xl border border-line bg-canvas/60 p-4 sm:p-5">
        {conditions.map((condition, index) => (
          <div key={index} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 font-mono text-[10px] font-medium text-gold-300">
              {index + 1}
            </span>
            <p className="text-[13px] leading-relaxed text-cream-200">{condition}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-line-soft pt-5">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (error) setError(null);
            }}
            disabled={loading}
            className="mt-1 h-4 w-4 rounded border-line bg-canvas text-gold-500 focus:ring-gold-500/30 accent-gold-500"
          />
          <span className="text-[13px] leading-relaxed text-cream-200">
            I have read and confirm that I meet and agree to uphold all conditions required to join the{' '}
            <strong className="text-cream-50 font-medium">{courseTitle}</strong>.
          </span>
        </label>

        {error && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11.5px] text-cream-500">
            Accepting will enroll your profile and unlock all lessons immediately.
          </p>
          <button
            type="button"
            onClick={handleAccept}
            disabled={!agreed || loading}
            className="btn btn-primary shrink-0 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Enrolling…
              </>
            ) : (
              <>
                Accept conditions &amp; begin course
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

