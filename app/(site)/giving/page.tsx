import type { Metadata } from 'next';
import { GivingProject } from '@/components/GivingProject';

export const metadata: Metadata = {
  title: 'Giving · The Mount Zion Building Project · URPN',
  description:
    'Learn about Phase 1 of the Mount Zion Building Project and view the support and land-purchase flyers.',
};

export default function GivingPage() {
  return <GivingProject />;
}
