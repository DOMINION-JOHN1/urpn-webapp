import React from 'react';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { requireUser } from '@/lib/server/auth';
import { getAdminWorkforceData } from '@/lib/server/learning';
import { AdminWorkforceView } from '@/components/portal/AdminWorkforceView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Workforce Administration Dashboard · Unique Revival Prayer Network',
  description: 'Manage and review everyone who has applied for the URPN workforce.',
};

export default async function AdminDashboardPage() {
  const user = await requireUser();
  if (user.role === 'workforce') redirect('/workforce');
  const data = await getAdminWorkforceData();

  return <AdminWorkforceView data={data} currentUser={user} />;
}
