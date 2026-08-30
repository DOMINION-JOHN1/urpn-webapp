import { transcribeWithDeepgram, TranscriptionResult } from './deepgram';
import { transcribeWithGoogleSpeech } from './google-speech';
import { isDeepgramConfigured, isGoogleConfigured } from '../config';

export * from './deepgram';

export async function transcribeMedia(
  buffer: Buffer,
  mimeType: string,
  submissionId: string
): Promise<TranscriptionResult> {
  // 1. Try Deepgram first if configured
  if (isDeepgramConfigured()) {
    try {
      console.log(`[Transcription] Attempting Deepgram transcription for submission ${submissionId}...`);
      return await transcribeWithDeepgram(buffer, mimeType);
    } catch (err: any) {
      console.warn(`[Transcription] Deepgram transcription failed: ${err.message}. Checking fallback...`);
    }
  }

  // 2. Try Google Cloud Speech-to-Text if configured
  if (isGoogleConfigured()) {
    try {
      console.log(`[Transcription] Attempting Google Speech-to-Text transcription for submission ${submissionId}...`);
      return await transcribeWithGoogleSpeech(buffer, mimeType);
    } catch (err: any) {
      console.warn(`[Transcription] Google Speech-to-Text failed: ${err.message}.`);
    }
  }

  // 3. Fallback / Dev Mock if no providers are configured or both failed
  if (!isDeepgramConfigured() && !isGoogleConfigured()) {
    console.warn(
      `[Transcription] No transcription keys configured (DEEPGRAM_API_KEY / GOOGLE). Returning simulated transcription for local test.`
    );
    return {
      transcript:
        'Praise the Lord, I want to thank God for His faithfulness, grace, and provision in my life. He answered our prayers and brought breakthrough.',
      confidence: 0.98,
      provider: 'mock',
    };
  }

  return {
    transcript: '',
    provider: 'mock',
    error: 'Transcription service was unavailable or encountered an error processing the media format.',
  };
}
