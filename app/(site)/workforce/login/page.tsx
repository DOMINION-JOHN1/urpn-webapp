import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Award, Headphones, ShieldCheck } from 'lucide-react';
import { getSessionUser } from '@/lib/server/auth';
import { UrpnLogo } from '@/components/UrpnLogo';
import { AuthForm } from '@/components/portal/AuthForm';
import { WorkforceSignInVisual } from '@/components/portal/WorkforceSignInVisual';
import { ThemeToggle } from '@/components/ThemeToggle';

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
  if (user) redirect(user.role === 'workforce' ? nextPath : '/portal');

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

        <div className="mb-8 lg:hidden">
          <WorkforceSignInVisual compact />
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
          <WorkforceSignInVisual />
        </div>

        <div className="relative mt-10">
          <ul className="space-y-2.5 text-[12px] text-cream-400">
            <li className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
              One shared training journey across departments
            </li>
            <li className="flex items-center gap-2.5">
              <Headphones className="h-4 w-4 text-accent" aria-hidden="true" />
              Audio lessons and module exams in your browser
            </li>
            <li className="flex items-center gap-2.5">
              <Award className="h-4 w-4 text-gold-400" aria-hidden="true" />
              Pass the final certification exam to earn your certificate
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
