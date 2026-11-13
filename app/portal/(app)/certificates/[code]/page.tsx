import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { requireUser } from '@/lib/server/auth';
import { getCertificateForUser } from '@/lib/server/learning';
import { hasCompleteProfile } from '@/lib/server/profile';
import { CertificateActions } from '@/components/portal/CertificateActions';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { code: string };
}): Promise<Metadata> {
  return { title: `Certificate ${params.code}` };
}

function longDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', {
    timeZone: 'Africa/Lagos',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function CertificatePage({ params }: { params: { code: string } }) {
  const user = await requireUser();
  const result = await getCertificateForUser(user.id, params.code);
  if (!result) notFound();
  const { certificate, course } = result;
  const profileComplete = hasCompleteProfile(user);

  const headerStore = headers();
  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host') ?? 'urpn.org';
  const protocol = headerStore.get('x-forwarded-proto') ?? (host.includes('localhost') ? 'http' : 'https');
  const verifyUrl = `${protocol}://${host}/verify/${certificate.code}`;
  const issued = longDate(certificate.issuedAt);
  const year = new Date(certificate.issuedAt).getFullYear();
  const avatarUrl = user.avatarPath
    ? `/api/portal/profile/avatar?v=${encodeURIComponent(user.avatarPath.split('/').pop() ?? '')}`
    : null;

  return (
    <div className="print-page mx-auto max-w-4xl">
      <div className="print-hide">
        <Link
          href="/portal/certificates"
          className="inline-flex items-center gap-1.5 text-[11.5px] text-cream-500 transition-colors hover:text-cream-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Certificates
        </Link>

        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mono-label text-gold-300">Certificate</p>
            <h1 className="mt-2 text-[26px] font-semibold leading-[1.12] tracking-[-0.035em] text-cream-50 sm:text-[32px]">
              {course?.title ?? 'URPN training'}
            </h1>
            <p className="mt-1.5 font-mono text-[10.5px] text-cream-500">
              {certificate.code} · Issued {issued}
            </p>
          </div>
          <CertificateActions
            verifyUrl={verifyUrl}
            fullName={result.name}
            courseTitle={course?.title ?? 'URPN Training Track'}
            issued={issued}
            score={certificate.score}
            year={year}
            code={certificate.code}
            avatarUrl={avatarUrl}
            profileComplete={profileComplete}
          />
        </div>
      </div>

      <div className="print-certificate relative mt-6 overflow-hidden border border-gold-400/50 bg-[#F7F3E8] text-[#191815] shadow-[0_30px_80px_-50px_rgba(0,0,0,0.8)]">
        <div className="pointer-events-none absolute inset-3 border border-gold-500/25" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-gold-500/15" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full border border-gold-500/10" />

        <div className="relative px-6 py-9 sm:px-12 sm:py-12">
          <div className="text-center">
            <span className="relative mx-auto block h-14 w-14">
              <Image
                src="/brand/urpn-mark.png"
                alt="URPN emblem"
                fill
                sizes="56px"
                className="object-contain"
              />
            </span>
            <p className="mt-3 font-semibold tracking-[0.34em] text-[#2A261C]">URPN</p>
            <p className="mt-1 font-mono text-[7.5px] uppercase tracking-[0.26em] text-[#6B614D]">
              Unique Revival Prayer Network
            </p>
          </div>

          <div className="mx-auto mt-6 h-px w-2/3 bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />

          <div className="mt-7 text-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#7A6A4A]">
              Certificate of completion
            </p>
            <p className="mt-6 font-serif text-[12px] italic text-[#6B614D]">
              This is to certify that
            </p>
            <span className="relative mx-auto mt-3 block h-20 w-20 overflow-hidden rounded-full border border-gold-500/50 bg-white/70">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Certificate recipient portrait"
                  fill
                  sizes="80px"
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full items-center justify-center font-semibold text-[#6A1557]">
                  {result.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'URPN'}
                </span>
              )}
            </span>
            <h2
              className="mx-auto mt-3 max-w-2xl text-[30px] leading-tight text-[#1F1C14] sm:text-[42px]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {result.name || 'Complete profile to add your name'}
            </h2>
            <p className="mx-auto mt-4 max-w-lg font-serif text-[12px] leading-relaxed text-[#6B614D]">
              has successfully completed all lessons, readings, and the timed final examination of
              the
            </p>
            <h3
              className="mx-auto mt-3 max-w-2xl text-[19px] leading-snug text-[#1F1C14] sm:text-[24px]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {course?.title ?? 'URPN Training Track'}
            </h3>
            <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[#7A6A4A]">
              Final score · {certificate.score}% · Passed
            </p>
          </div>

          <div className="mt-9 grid items-end gap-6 sm:grid-cols-3">
            <div className="text-center sm:text-left">
              <p className="font-mono text-[7.5px] uppercase tracking-[0.2em] text-[#8A7B5C]">
                Issued
              </p>
              <p className="mt-1 text-[11px] text-[#3B3527]">{issued}</p>
            </div>

            <div className="mx-auto flex h-20 w-20 flex-col items-center justify-center rounded-full border border-gold-500/50 text-center">
              <span className="font-mono text-[6.5px] uppercase tracking-[0.18em] text-[#7A6A4A]">
                Verified
              </span>
              <span className="mt-0.5 font-semibold text-[#2A261C]">URPN</span>
              <span className="font-mono text-[7px] tracking-[0.1em] text-[#7A6A4A]">{year}</span>
            </div>

            <div className="text-center sm:text-right">
              <p className="font-serif text-[11px] italic text-[#3B3527]">Training Desk</p>
              <div className="mt-1 ml-auto h-px w-32 bg-[#B9A882]" />
              <p className="mt-1 font-mono text-[6.5px] uppercase tracking-[0.18em] text-[#8A7B5C]">
                Authorised signature
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-1 border-t border-gold-500/20 pt-4 text-center font-mono text-[7.5px] uppercase tracking-[0.14em] text-[#8A7B5C] sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <span>Certificate code · {certificate.code}</span>
            <span className="break-all">Verify at {verifyUrl}</span>
          </div>
        </div>
      </div>

      <p className="print-hide mt-4 text-center text-[11px] leading-relaxed text-cream-500">
        Use <span className="text-cream-300">Print / save as PDF</span> and choose “Save as PDF”.
        For best results, select landscape orientation and enable background graphics.
      </p>
    </div>
  );
}
