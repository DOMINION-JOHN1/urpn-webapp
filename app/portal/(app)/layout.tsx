import React from 'react';
import type { Metadata } from 'next';
import { requireUser } from '@/lib/server/auth';
import { PortalShell } from '@/components/portal/PortalShell';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PortalAppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <PortalShell user={user}>{children}</PortalShell>;
}
