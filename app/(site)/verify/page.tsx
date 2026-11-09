import React from 'react';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Verify a certificate',
  description: 'Confirm that a URPN training certificate is genuine.',
};

export default function VerifyIndexPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const rawCode = searchParams.code;
  const code = typeof rawCode === 'string' ? rawCode.trim() : '';
  if (code) redirect(`/verify/${encodeURIComponent(code.toUpperCase())}`);

  return (
    <div className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-gold-500/70" />
          <span className="mono-label text-gold-300">Certificate registry</span>
        </div>
        <h1 className="mt-5 text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] text-cream-50 sm:text-[42px]">
          Verify a certificate.
        </h1>
        <p className="mt-4 text-[13.5px] leading-[1.75] text-cream-400">
          Every URPN certificate carries a unique code. Enter it below to confirm the holder,
          the training track, and the date of issue.
        </p>

        <form action="/verify" method="get" className="mt-8">
          <label htmlFor="code" className="mb-1.5 block text-xs text-cream-300">
            Certificate code
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="code"
              name="code"
              type="text"
              required
              placeholder="URPN-XXXX-XXXX"
              className="field font-mono uppercase tracking-[0.06em]"
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" className="btn btn-primary shrink-0">
              Verify
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </form>

        <div className="mt-8 flex items-start gap-3 rounded-xl border border-line bg-surface p-4">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
          <p className="text-[11.5px] leading-relaxed text-cream-400">
            Verification is read-only and public. No account is required. If a code cannot be
            found, contact the URPN training desk before accepting the certificate.
          </p>
        </div>
      </div>
    </div>
  );
}
