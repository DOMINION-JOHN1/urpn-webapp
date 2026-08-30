import { config } from './config';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface TestimonyPayload {
  name: string;
  contact?: string;
  mediaType: 'audio' | 'video';
  durationSeconds?: number;
}

const ALLOWED_AUDIO_MIME_TYPES = [
  'audio/webm',
  'audio/webm;codecs=opus',
  'audio/mp4',
  'audio/m4a',
  'audio/x-m4a',
  'audio/ogg',
  'audio/ogg;codecs=opus',
  'audio/wav',
  'audio/x-wav',
  'audio/aac',
  'audio/mpeg',
  'audio/mp3',
];

const ALLOWED_VIDEO_MIME_TYPES = [
  'video/webm',
  'video/webm;codecs=vp8,opus',
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=h264,opus',
  'video/mp4',
  'video/quicktime',
  'video/x-matroska',
];

export function validateTestimonySubmission(
  fields: {
    name?: string | null;
    contact?: string | null;
    mediaType?: string | null;
    duration?: string | null;
  },
  file: File | Blob | null
): { valid: boolean; error?: string; data?: TestimonyPayload } {
  // 1. Validate Name
  if (!fields.name || typeof fields.name !== 'string' || fields.name.trim().length === 0) {
    return { valid: false, error: 'Please provide your name.' };
  }

  const cleanName = fields.name.trim();
  if (cleanName.length > 100) {
    return { valid: false, error: 'Name must be under 100 characters.' };
  }

  // 2. Validate Contact (optional)
  let cleanContact: string | undefined = undefined;
  if (fields.contact && typeof fields.contact === 'string' && fields.contact.trim().length > 0) {
    cleanContact = fields.contact.trim();
    if (cleanContact.length > 150) {
      return { valid: false, error: 'Contact information is too long.' };
    }
  }

  // 3. Validate Media Type
  const rawMediaType = fields.mediaType?.toLowerCase() || 'audio';
  if (rawMediaType !== 'audio' && rawMediaType !== 'video') {
    return { valid: false, error: 'Invalid media type. Must be audio or video.' };
  }
  const mediaType = rawMediaType as 'audio' | 'video';

  // 4. Validate File presence
  if (!file || !(file instanceof Blob)) {
    return { valid: false, error: 'No media file provided. Please record your testimony before submitting.' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'The recording is empty. Please record again.' };
  }

  // 5. Validate File Size
  if (file.size > config.limits.maxUploadSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds the ${config.limits.maxUploadSizeMB}MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please keep your recording within limits.`,
    };
  }

  // 6. Validate MIME Type
  const mime = file.type?.toLowerCase() || '';
  const baseMime = mime.split(';')[0].trim();

  if (mediaType === 'audio') {
    const isAllowedAudio =
      ALLOWED_AUDIO_MIME_TYPES.some((allowed) => mime.startsWith(allowed.split(';')[0])) ||
      baseMime.startsWith('audio/') ||
      baseMime === 'application/octet-stream' ||
      baseMime === 'video/webm'; // Chrome sometimes tags audio-only webm as video/webm

    if (!isAllowedAudio) {
      return {
        valid: false,
        error: `Unsupported audio format: "${file.type}". Please use a modern browser (Chrome, Safari, Firefox).`,
      };
    }
  } else {
    // Video
    const isAllowedVideo =
      ALLOWED_VIDEO_MIME_TYPES.some((allowed) => mime.startsWith(allowed.split(';')[0])) ||
      baseMime.startsWith('video/') ||
      baseMime === 'application/octet-stream';

    if (!isAllowedVideo) {
      return {
        valid: false,
        error: `Unsupported video format: "${file.type}". Please use a modern browser with camera support.`,
      };
    }
  }

  // 7. Validate Duration if supplied
  let durationSeconds: number | undefined = undefined;
  if (fields.duration) {
    const parsedDuration = parseFloat(fields.duration);
    if (!isNaN(parsedDuration) && parsedDuration > 0) {
      durationSeconds = parsedDuration;
      const maxLimit =
        mediaType === 'video'
          ? config.limits.maxVideoRecordingSeconds
          : config.limits.maxAudioRecordingSeconds;

      // Allow 5 seconds grace period for network/recording buffer delays
      if (durationSeconds > maxLimit + 5) {
        const maxMinutes = Math.floor(maxLimit / 60);
        return {
          valid: false,
          error: `Recording duration (${Math.round(durationSeconds)}s) exceeds the maximum limit of ${maxMinutes} minutes for ${mediaType} testimonies.`,
        };
      }
    }
  }

  return {
    valid: true,
    data: {
      name: cleanName,
      contact: cleanContact,
      mediaType,
      durationSeconds,
    },
  };
}
