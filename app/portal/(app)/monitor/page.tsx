import React from 'react';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { requireUser } from '@/lib/server/auth';
import { getAdminProgressData } from '@/lib/server/learning';
import { ProgressMonitorView } from '@/components/portal/ProgressMonitorView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Progress Monitor · Unique Revival Prayer Network',
  description: 'Live monitoring of workers progress as they mark each course content complete.',
};

export default async function MonitorPage() {
  const user = await requireUser();
  if (user.role === 'workforce') redirect('/workforce');
  const data = await getAdminProgressData();

  return (
    <div className="space-y-6">
      <div>
        <span className="mono-label text-gold-300">Church Leadership &amp; Administration</span>
        <h1 className="mt-2 text-[30px] font-semibold leading-[1.1] tracking-[-0.04em] text-cream-50 sm:text-[36px]">
          Workers Progress Monitor
        </h1>
        <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-cream-400">
          Track members in real-time as they enroll, listen to audio teachings, take notes, mark lessons complete, and sit their final certification exams.
        </p>
      </div>

      <ProgressMonitorView data={data} />
    </div>
  );
}

