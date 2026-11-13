import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { requireUser } from '@/lib/server/auth';
import { ProfileForm } from '@/components/portal/ProfileForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Profile settings · URPN',
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const user = await requireUser();
  const requestedNext = typeof searchParams.next === 'string' ? searchParams.next : '';
  const nextPath = requestedNext.startsWith('/portal/') && !requestedNext.startsWith('//')
    ? requestedNext
    : '/portal/profile';

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/portal/courses"
        className="inline-flex items-center gap-1.5 text-[11.5px] text-cream-500 transition-colors hover:text-cream-50"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Courses
      </Link>

      <header className="mt-5">
        <p className="mono-label text-gold-300">Your account</p>
        <h1 className="mt-2 text-[30px] font-semibold leading-tight tracking-[-0.035em] text-cream-50 sm:text-[38px]">
          Profile settings
        </h1>
        <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-cream-400">
          Add your name, birthday, address, and portrait. Your name and portrait appear on your URPN certificate.
        </p>
      </header>

      <ProfileForm
        email={user.email}
        initialName={user.name}
        initialBirthday={user.birthday ?? ''}
        initialAddress={user.address ?? ''}
        avatarPath={user.avatarPath ?? null}
        nextPath={nextPath}
      />
    </div>
  );
}
