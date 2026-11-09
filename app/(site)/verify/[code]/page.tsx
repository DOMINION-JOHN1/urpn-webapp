import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, BadgeCheck, ShieldAlert } from 'lucide-react';
import { getCertificateByCode } from '@/lib/server/learning';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { code: string };
}): Promise<Metadata> {
  return { title: `Verify ${params.code.toUpperCase()}` };
}

function longDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', {
    timeZone: 'Africa/Lagos',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function VerifyCertificatePage({
  params,
}: {
  params: { code: string };
}) {
  const code = decodeURIComponent(params.code).toUpperCase();
  const result = await getCertificateByCode(code);

  return (
    <div className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-lg">
        <Link
          href="/verify"
          className="inline-flex items-center gap-1.5 text-[11.5px] text-cream-500 transition-colors hover:text-cream-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Verify another certificate
        </Link>

        {result ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-gold-500/25 bg-surface">
            <div className="h-px w-full bg-gradient-to-r from-gold-500/70 via-gold-500/20 to-transparent" />
            <div className="p-6 sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/[0.07] text-gold-300">
                <BadgeCheck className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mono-label mt-5 !text-gold-300">Valid certificate</p>
              <h1 className="mt-2 text-[26px] font-semibold leading-[1.15] tracking-[-0.035em] text-cream-50 sm:text-[30px]">
                This certificate is genuine.
              </h1>
              <p className="mt-2 text-[12.5px] leading-relaxed text-cream-400">
                Issued by the Unique Revival Prayer Network training desk.
              </p>

              <dl className="mt-6 divide-y divide-line-soft border-y border-line-soft">
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="mono-label !text-[8.5px]">Holder</dt>
                  <dd className="text-right text-[13px] font-medium text-cream-50">
                    {result.name}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="mono-label !text-[8.5px]">Track</dt>
                  <dd className="text-right text-[13px] text-cream-200">
                    {result.course?.title ?? 'URPN training'}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="mono-label !text-[8.5px]">Issued</dt>
                  <dd className="text-right text-[13px] text-cream-200">
                    {longDate(result.certificate.issuedAt)}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="mono-label !text-[8.5px]">Final score</dt>
                  <dd className="text-right text-[13px] text-cream-200">
                    {result.certificate.score}%
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="mono-label !text-[8.5px]">Code</dt>
                  <dd className="text-right font-mono text-[11px] text-cream-300">
                    {result.certificate.code}
                  </dd>
                </div>
              </dl>

              <p className="mt-5 rounded-lg border border-line-soft bg-canvas/50 p-3 text-[10.5px] leading-relaxed text-cream-500">
                Verification confirms that this code exists in the URPN registry. If the details
                above do not match the certificate presented to you, contact the training desk.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-red-900/50 bg-surface p-6 sm:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-red-900/50 bg-red-950/30 text-red-300">
              <ShieldAlert className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="mono-label mt-5 !text-red-300">Not found</p>
            <h1 className="mt-2 text-[26px] font-semibold leading-[1.15] tracking-[-0.035em] text-cream-50 sm:text-[30px]">
              We could not verify this code.
            </h1>
            <p className="mt-2 text-[12.5px] leading-relaxed text-cream-400">
              Check the code carefully — it follows the format{' '}
              <span className="font-mono text-cream-200">URPN-XXXX-XXXX</span>. If the code is
              correct and still not found, please contact the URPN training desk.
            </p>
            <p className="mt-4 rounded-lg border border-line bg-canvas/50 p-3 font-mono text-[11px] text-cream-400">
              {code}
            </p>
            <Link href="/verify" className="btn btn-secondary mt-5">
              Try another code
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
