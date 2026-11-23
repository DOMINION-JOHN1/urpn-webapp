import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, ShieldAlert } from 'lucide-react';

export default function VerifyCertificateNotFound() {
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
          <Link href="/verify" className="btn btn-secondary mt-5">
            Try another code
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
