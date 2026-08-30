import { createClient } from '@deepgram/sdk';
import { config, isDeepgramConfigured } from '../config';

export interface TranscriptionResult {
  transcript: string;
  confidence?: number;
  provider: 'deepgram' | 'google-speech' | 'mock';
  error?: string;
}

export async function transcribeWithDeepgram(
  buffer: Buffer,
  mimeType: string
): Promise<TranscriptionResult> {
  if (!isDeepgramConfigured()) {
    throw new Error('Deepgram API key is not configured.');
  }

  try {
    const deepgram = createClient(config.transcription.deepgramApiKey!);

    const response = await deepgram.listen.prerecorded.transcribeFile(
      buffer,
      {
        model: 'nova-2',
        smart_format: true,
        punctuate: true,
        paragraphs: true,
        mimetype: mimeType,
      }
    );

    if (response.error) {
      throw new Error(`Deepgram transcription error: ${response.error.message}`);
    }

    const transcript =
      response.result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
    const confidence =
      response.result?.results?.channels?.[0]?.alternatives?.[0]?.confidence;

    return {
      transcript: transcript.trim(),
      confidence,
      provider: 'deepgram',
    };
  } catch (err: any) {
    console.error('[Deepgram] Transcription failed:', err);
    throw new Error(err.message || 'Deepgram transcription failed');
  }
}
