import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Award, CheckCircle2, Lock, Timer } from 'lucide-react';
import { getSessionUser } from '@/lib/server/auth';
import { UrpnLogo } from '@/components/UrpnLogo';
import { AuthForm } from '@/components/portal/AuthForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { COURSES } from '@/lib/courses';

export const metadata: Metadata = {
  title: 'Worker sign in',
  description: 'Sign in to the URPN worker portal to continue your training.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { mode?: string; next?: string };
}) {
  const requestedNext = typeof searchParams.next === 'string' ? searchParams.next : '';
  const nextPath =
    requestedNext.startsWith('/portal') && !requestedNext.startsWith('//')
      ? requestedNext
      : '/portal';

  const user = await getSessionUser();
  if (user) redirect(nextPath);

  const initialMode = searchParams.mode === 'register' ? 'register' : 'signin';
  const showDemo = process.env.SHOW_DEMO_LOGIN !== 'false';

  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-5 py-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="URPN home">
            <UrpnLogo size="sm" />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-cream-500 transition-colors hover:text-cream-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to website
            </Link>
          </div>
        </div>

        <div className="flex flex-1 items-center py-10">
          <div className="mx-auto w-full max-w-sm lg:mx-0">
            <AuthForm initialMode={initialMode} showDemo={showDemo} nextPath={nextPath} />
          </div>
        </div>

        <p className="text-[10.5px] text-cream-600">
          © {new Date().getFullYear()} Unique Revival Prayer Network
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
            <span className="mono-label text-gold-300">Worker formation</span>
          </div>
          <h2 className="mt-6 max-w-[15ch] text-[40px] font-semibold leading-[1.06] tracking-[-0.045em] text-cream-50">
            Built for the field.
            <span className="block text-cream-500">Not just the classroom.</span>
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream-400">
            Every worker in the URPN family is formed at the altar and tested in the open.
            Your training, progress, and certificate live in one place.
          </p>

          <div className="mt-10 space-y-px overflow-hidden rounded-xl border border-line bg-line">
            {COURSES.map((course, index) => (
              <div
                key={course.slug}
                className="flex items-center justify-between gap-4 bg-surface/80 px-4 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-cream-600">0{index + 1}</span>
                  <span className="text-[13px] font-medium text-cream-100">
                    {course.shortTitle}
                  </span>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-cream-500">
                  {course.exam.durationMinutes} min exam
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-12">
          <ul className="space-y-3 text-[12.5px] text-cream-400">
            <li className="flex items-center gap-2.5">
              <Lock className="h-4 w-4 text-accent" aria-hidden="true" />
              Lessons stream inside the portal — no loose downloads
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />
              Progress saved across every device you sign in on
            </li>
            <li className="flex items-center gap-2.5">
              <Timer className="h-4 w-4 text-accent" aria-hidden="true" />
              One timed exam attempt per track
            </li>
            <li className="flex items-center gap-2.5">
              <Award className="h-4 w-4 text-accent" aria-hidden="true" />
              A verifiable certificate when you pass
            </li>
          </ul>
          <p className="mt-8 border-t border-line-soft pt-5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-cream-600">
            Restore · Equip · Deploy
          </p>
        </div>
      </aside>
    </div>
  );
}
