import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Award, Headphones, ShieldCheck } from 'lucide-react';
import { getSessionUser } from '@/lib/server/auth';
import { UrpnLogo } from '@/components/UrpnLogo';
import { AuthForm } from '@/components/portal/AuthForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { WORKFORCE_DEPARTMENTS } from '@/lib/courses';

export const metadata: Metadata = {
  title: 'Workforce Sign In · URPN',
  description: 'Sign in to access your URPN department audio training and exam.',
};

export const dynamic = 'force-dynamic';

export default async function WorkforceLoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const requestedNext = typeof searchParams.next === 'string' ? searchParams.next : '';
  const nextPath =
    requestedNext.startsWith('/portal') && !requestedNext.startsWith('//')
      ? requestedNext
      : '/portal/courses';

  const user = await getSessionUser();
  if (user) redirect(nextPath);

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
              initialMode="signin"
              showDemo={false}
              nextPath={nextPath}
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
            <span className="mono-label text-gold-300">Workforce sign in</span>
          </div>
          <h2 className="mt-6 max-w-[15ch] text-[38px] font-semibold leading-[1.06] tracking-[-0.04em] text-cream-50">
            Continue your formation.
            <span className="block text-cream-500">Pick up where you left off.</span>
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream-400">
            Sign in to continue listening to your department lessons, sit the timed exam, or access your certificates.
          </p>

          <div className="mt-8 space-y-px overflow-hidden rounded-xl border border-line bg-line">
            {WORKFORCE_DEPARTMENTS.map((department, index) => (
              <div
                key={department.slug}
                className="flex items-center justify-between gap-4 bg-surface/80 px-4 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[9px] text-cream-600">0{index + 1}</span>
                  <span className="text-[12.5px] font-medium text-cream-100">
                    {department.shortTitle} Department
                  </span>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-cream-500">
                  {department.conditions.length} conditions
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-10">
          <ul className="space-y-2.5 text-[12px] text-cream-400">
            <li className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
              Media · Technical · Ushering · Protocol · Choir · Welfare · Children
            </li>
            <li className="flex items-center gap-2.5">
              <Headphones className="h-4 w-4 text-accent" aria-hidden="true" />
              Stream audio lessons inside your browser
            </li>
            <li className="flex items-center gap-2.5">
              <Award className="h-4 w-4 text-gold-400" aria-hidden="true" />
              Pass your exam to earn your certificate
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
