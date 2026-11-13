import React from 'react';
import type { Metadata } from 'next';
import { MeetingSchedule } from '@/components/MeetingSchedule';

export const metadata: Metadata = {
  title: 'Days of Meeting · Unique Revival Prayer Network',
  description: 'The URPN days of meeting and gathering schedule.',
};

export default function GatheringsPage() {
  return (
    <div className="w-full pb-20">
      <MeetingSchedule />
    </div>
  );
}
