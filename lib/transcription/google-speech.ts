import { getGoogleAuth } from '../google/auth';
import { isGoogleConfigured } from '../config';
import { TranscriptionResult } from './deepgram';

export async function transcribeWithGoogleSpeech(
  buffer: Buffer,
  mimeType: string
): Promise<TranscriptionResult> {
  if (!isGoogleConfigured()) {
    throw new Error('Google Cloud credentials are not configured for Speech-to-Text.');
  }

  try {
    const auth = getGoogleAuth();
    const token = await auth.getAccessToken();

    let encoding = 'WEBM_OPUS';
    let sampleRateHertz = 48000;

    if (mimeType.includes('wav')) {
      encoding = 'LINEAR16';
      sampleRateHertz = 16000;
    } else if (mimeType.includes('mp3') || mimeType.includes('mpeg')) {
      encoding = 'MP3';
      sampleRateHertz = 44100;
    } else if (mimeType.includes('ogg')) {
      encoding = 'OGG_OPUS';
      sampleRateHertz = 48000;
    }

    const payload = {
      config: {
        encoding,
        sampleRateHertz,
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
        model: 'default',
      },
      audio: {
        content: buffer.toString('base64'),
      },
    };

    const response = await fetch('https://speech.googleapis.com/v1/speech:recognize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Speech-to-Text API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const transcript =
      data.results
        ?.map((res: any) => res.alternatives?.[0]?.transcript || '')
        .join(' ')
        .trim() || '';

    return {
      transcript,
      provider: 'google-speech',
    };
  } catch (err: any) {
    console.error('[Google Speech] Transcription failed:', err);
    throw new Error(err.message || 'Google Speech-to-Text failed');
  }
}
