import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Award, Printer } from 'lucide-react';
import { requireUser } from '@/lib/server/auth';
import { listCertificatesForUser } from '@/lib/server/learning';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Certificates' };

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', {
    timeZone: 'Africa/Lagos',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function CertificatesPage() {
  const user = await requireUser();
  const certificates = await listCertificatesForUser(user.id);

  return (
    <div>
      <p className="mono-label text-gold-300">Certificates</p>
      <h1 className="mt-2 text-[30px] font-semibold leading-[1.1] tracking-[-0.04em] text-cream-50 sm:text-[36px]">
        Your certificates.
      </h1>
      <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-cream-400">
        Every certificate carries a unique code and a public verification link. Print it, save it
        as a PDF, or share the code with anyone who needs to confirm it.
      </p>

      {certificates.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-surface px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-line bg-canvas text-cream-500">
            <Award className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-[18px] font-medium text-cream-50">No certificate yet.</h2>
          <p className="mx-auto mt-2 max-w-sm text-[12.5px] leading-relaxed text-cream-400">
            Complete a training track and pass its final exam. Your certificate will appear here
            automatically.
          </p>
          <Link href="/portal/courses" className="btn btn-primary mt-5">
            Go to my training
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="mt-7 space-y-3">
          {certificates.map(({ certificate, course }) => (
            <article
              key={certificate.id}
              className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/[0.06] text-gold-300">
                    <Award className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="mono-label text-gold-300 !text-[8.5px]">Certificate of completion</p>
                    <h2 className="mt-1.5 text-[18px] font-semibold tracking-[-0.02em] text-cream-50">
                      {course?.title ?? 'URPN training'}
                    </h2>
                    <p className="mt-1 font-mono text-[10px] text-cream-500">
                      {certificate.code} · {formatDate(certificate.issuedAt)} · {certificate.score}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:shrink-0">
                  <Link
                    href={`/verify/${certificate.code}`}
                    className="btn btn-secondary btn-sm"
                    target="_blank"
                  >
                    Verify
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  <Link
                    href={`/portal/certificates/${certificate.code}`}
                    className="btn btn-primary btn-sm"
                  >
                    <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                    Open
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
