import { NextResponse } from 'next/server';
import { config, isGoogleConfigured, isDeepgramConfigured } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    configurations: {
      googleDriveConfigured: Boolean(config.google.driveFolderId && config.google.clientEmail),
      googleSheetsConfigured: Boolean(config.google.sheetId && config.google.clientEmail),
      googleAuthComplete: isGoogleConfigured(),
      deepgramConfigured: isDeepgramConfigured(),
    },
    limits: {
      maxAudioRecordingSeconds: config.limits.maxAudioRecordingSeconds,
      maxVideoRecordingSeconds: config.limits.maxVideoRecordingSeconds,
      maxUploadSizeMB: config.limits.maxUploadSizeMB,
    },
    environment: process.env.NODE_ENV,
  });
}
