import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, CheckCircle2, Headphones, ShieldCheck, Award } from 'lucide-react';
import { getSessionUser } from '@/lib/server/auth';
import { UrpnLogo } from '@/components/UrpnLogo';
import { AuthForm } from '@/components/portal/AuthForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { WORKFORCE_COURSES } from '@/lib/courses';

export const metadata: Metadata = {
  title: 'Join the Workforce · Create Account',
  description: 'Create an account to join an official URPN ministry department.',
};

export const dynamic = 'force-dynamic';

export default async function WorkforceRegisterPage() {
  const user = await getSessionUser();
  if (user) redirect('/workforce');

  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-5 py-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Link href="/workforce" aria-label="URPN workforce">
            <UrpnLogo size="sm" />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/workforce"
              className="inline-flex items-center gap-1.5 text-xs text-cream-500 transition-colors hover:text-cream-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to departments
            </Link>
          </div>
        </div>

        <div className="flex flex-1 items-center py-10">
          <div className="mx-auto w-full max-w-sm lg:mx-0">
            <AuthForm
              initialMode="register"
              showDemo={false}
              nextPath="/workforce"
              portalType="workforce"
            />
          </div>
        </div>

        <p className="text-[10.5px] text-cream-600">
          © {new Date().getFullYear()} Unique Revival Prayer Network · Workforce Formation
        </p>
      </div>

      <aside className="relative hidden overflow-hidden border-l border-line bg-canvas-deep lg:flex lg:flex-col lg:justify-between lg:p-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_420px_at_80%_0%,rgba(176,91,168,0.13),transparent_70%)]"
        />

        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-gold-500/70" />
            <span className="mono-label text-gold-300">Join the workforce</span>
          </div>
          <h2 className="mt-6 max-w-[15ch] text-[38px] font-semibold leading-[1.06] tracking-[-0.045em] text-cream-50">
            Formed for service.
            <span className="block text-cream-500">Equipped for every good work.</span>
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream-400">
            Joining a department is simple: review conditions, listen to the audio teaching, sit the timed exam, and receive your verified certificate.
          </p>

          <div className="mt-8 space-y-px overflow-hidden rounded-xl border border-line bg-line">
            {WORKFORCE_COURSES.map((course, index) => (
              <div
                key={course.slug}
                className="flex items-center justify-between gap-4 bg-surface/80 px-4 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[9px] text-cream-600">0{index + 1}</span>
                  <span className="text-[12.5px] font-medium text-cream-100">
                    {course.shortTitle} Department
                  </span>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-cream-500">
                  {course.conditions.length} conditions
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-10">
          <ul className="space-y-2.5 text-[12px] text-cream-400">
            <li className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
              Review &amp; agree to department conditions
            </li>
            <li className="flex items-center gap-2.5">
              <Headphones className="h-4 w-4 text-accent" aria-hidden="true" />
              Stream audio lessons without downloads
            </li>
            <li className="flex items-center gap-2.5">
              <Award className="h-4 w-4 text-gold-400" aria-hidden="true" />
              Earn your verifiable department certificate
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

