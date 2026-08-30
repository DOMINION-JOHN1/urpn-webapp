import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { validateTestimonySubmission } from '@/lib/validation';
import { uploadTestimonyToDrive } from '@/lib/google/drive';
import { appendTestimonyToSheet } from '@/lib/google/sheets';
import { transcribeMedia } from '@/lib/transcription';
import { config } from '@/lib/config';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Max execution duration in seconds for Vercel functions

function getExtension(mimeType: string, mediaType: 'audio' | 'video'): string {
  const mime = mimeType.toLowerCase();
  if (mime.includes('mp4')) return 'mp4';
  if (mime.includes('quicktime') || mime.includes('mov')) return 'mov';
  if (mime.includes('wav')) return 'wav';
  if (mime.includes('ogg')) return 'ogg';
  if (mime.includes('mp3') || mime.includes('mpeg')) return 'mp3';
  if (mime.includes('m4a')) return 'm4a';
  if (mime.includes('webm')) return 'webm';
  return mediaType === 'video' ? 'webm' : 'webm';
}

function getFormattedTimestamp(): { display: string; fileTag: string } {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return {
    display: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
    fileTag: `${year}${month}${day}_${hours}${minutes}${seconds}`,
  };
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const submissionId = crypto.randomBytes(4).toString('hex'); // e.g. "8f32a10b"

  console.log(`[API /api/testimonies] New testimony submission received. ID: ${submissionId}`);

  try {
    const formData = await req.formData();

    const name = formData.get('name') as string | null;
    const contact = formData.get('contact') as string | null;
    const mediaType = (formData.get('mediaType') as string | null) || 'audio';
    const duration = formData.get('duration') as string | null;
    const file = formData.get('media') as File | Blob | null;

    // 1. Validate submission input and file
    const validation = validateTestimonySubmission(
      { name, contact, mediaType, duration },
      file
    );

    if (!validation.valid || !validation.data || !file) {
      console.warn(`[API /api/testimonies] Validation failed for ID ${submissionId}: ${validation.error}`);
      return NextResponse.json(
        {
          success: false,
          error: validation.error || 'Invalid testimony submission.',
        },
        { status: 400 }
      );
    }

    const { name: cleanName, contact: cleanContact, mediaType: cleanMediaType } = validation.data;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || (cleanMediaType === 'video' ? 'video/webm' : 'audio/webm');
    const extension = getExtension(mimeType, cleanMediaType);
    const { display: submittedAt, fileTag } = getFormattedTimestamp();
    const fileName = `testimony_${cleanMediaType}_${submissionId}_${fileTag}.${extension}`;

    console.log(
      `[API /api/testimonies] [${submissionId}] Validated submission. Name: "${cleanName}", Type: ${cleanMediaType}, Size: ${(
        buffer.length /
        (1024 * 1024)
      ).toFixed(2)} MB, MIME: ${mimeType}`
    );

    // 2. Upload to Google Drive (Persistent Media Storage)
    let driveResult;
    try {
      driveResult = await uploadTestimonyToDrive({
        buffer,
        fileName,
        mimeType,
        submissionId,
        candidateName: cleanName,
      });
      console.log(
        `[API /api/testimonies] [${submissionId}] Uploaded to Google Drive. File ID: ${driveResult.fileId}`
      );
    } catch (driveError: any) {
      console.error(`[API /api/testimonies] [${submissionId}] Google Drive upload failed:`, driveError);
      return NextResponse.json(
        {
          success: false,
          error: "We couldn't save your recording to storage right now. Please check your connection and try again.",
        },
        { status: 500 }
      );
    }

    // 3. Transcribe Media (Deepgram / Google Speech)
    let transcript = '';
    let transcriptionError: string | undefined = undefined;
    let submissionStatus: 'Completed' | 'Processing' | 'Failed' = 'Completed';

    try {
      const transcriptionResult = await transcribeMedia(buffer, mimeType, submissionId);
      transcript = transcriptionResult.transcript;
      if (transcriptionResult.error) {
        transcriptionError = transcriptionResult.error;
        submissionStatus = 'Failed';
      }
      console.log(
        `[API /api/testimonies] [${submissionId}] Transcription complete via ${transcriptionResult.provider}. Length: ${transcript.length} chars.`
      );
    } catch (transcribeErr: any) {
      console.error(`[API /api/testimonies] [${submissionId}] Transcription failed:`, transcribeErr);
      transcriptionError = transcribeErr.message || 'Transcription failed';
      submissionStatus = 'Failed';
      // Do NOT delete the audio; keep it in Google Drive safely
    }

    // 4. Log Record to Google Sheets
    try {
      await appendTestimonyToSheet({
        id: submissionId,
        name: cleanName,
        contact: cleanContact,
        mediaType: cleanMediaType,
        fileName: driveResult.fileName,
        driveFileId: driveResult.fileId,
        driveUrl: driveResult.webViewLink,
        transcript: transcript || 'Transcription pending or failed',
        submittedAt,
        status: submissionStatus,
        error: transcriptionError,
      });
      console.log(`[API /api/testimonies] [${submissionId}] Recorded entry in Google Sheets.`);
    } catch (sheetError: any) {
      console.error(`[API /api/testimonies] [${submissionId}] Google Sheets logging failed:`, sheetError);
      // Even if Sheet append failed, Drive has the file
    }

    const elapsedMs = Date.now() - startTime;
    console.log(`[API /api/testimonies] [${submissionId}] Submission processed in ${elapsedMs}ms.`);

    return NextResponse.json(
      {
        success: true,
        message: 'Your testimony has been submitted successfully. Thank you for sharing your story!',
        submission_id: submissionId,
        media_type: cleanMediaType,
        drive_url: driveResult.webViewLink,
        transcript: transcript || undefined,
        submitted_at: submittedAt,
        is_mock: driveResult.isMock,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(`[API /api/testimonies] [${submissionId}] Unexpected error processing request:`, err);
    return NextResponse.json(
      {
        success: false,
        error: "We couldn't submit your testimony right now. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': config.cors.allowedOrigins.join(', '),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
