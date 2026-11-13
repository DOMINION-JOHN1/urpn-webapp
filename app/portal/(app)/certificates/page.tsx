import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Award, Printer } from 'lucide-react';
import { requireUser } from '@/lib/server/auth';
import { getDashboardData } from '@/lib/server/learning';
import { LockedCertificatePreview } from '@/components/portal/LockedCertificatePreview';

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
  const data = await getDashboardData(user.id);
  const certificates = data.certificates;
  const lockedCourses = data.courses.filter((entry) => !entry.certificate);

  return (
    <div>
      <p className="mono-label text-gold-300">Certificates</p>
      <h1 className="mt-2 text-[30px] font-semibold leading-[1.1] tracking-[-0.04em] text-cream-50 sm:text-[36px]">
        Your certificates.
      </h1>

      {certificates.length > 0 && (
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

      {lockedCourses.length > 0 && (
        <section className="mt-9">
          <div>
            <h2 className="text-[20px] font-semibold tracking-[-0.025em] text-cream-50">
              Certificate previews
            </h2>
            <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-cream-400">
              Blurred previews unlock when you finish a course and pass its final exam.
            </p>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {lockedCourses.map((entry) => (
              <LockedCertificatePreview
                key={entry.course.slug}
                title={entry.course.title}
                courseHref={`/portal/courses/${entry.course.slug}`}
                progress={entry.percent}
                enrolled={entry.enrolled}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
