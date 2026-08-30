import { describe, it, expect } from 'vitest';
import { validateTestimonySubmission } from '@/lib/validation';

describe('Testimony Server Validation', () => {
  it('should reject submission with missing or empty name', () => {
    const fakeBlob = new Blob(['sample audio data'], { type: 'audio/webm' });
    const result = validateTestimonySubmission({ name: '   ', mediaType: 'audio' }, fakeBlob);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('Please provide your name');
  });

  it('should reject submission with missing media file', () => {
    const result = validateTestimonySubmission({ name: 'Sister Grace', mediaType: 'audio' }, null);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('No media file provided');
  });

  it('should reject submission with empty media file (0 bytes)', () => {
    const emptyBlob = new Blob([], { type: 'audio/webm' });
    const result = validateTestimonySubmission({ name: 'Sister Grace', mediaType: 'audio' }, emptyBlob);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('The recording is empty');
  });

  it('should reject invalid media types', () => {
    const fakeBlob = new Blob(['sample audio data'], { type: 'audio/webm' });
    const result = validateTestimonySubmission(
      { name: 'Brother John', mediaType: 'invalid_type' },
      fakeBlob
    );

    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid media type');
  });

  it('should reject unsupported MIME types for audio', () => {
    const invalidBlob = new Blob(['image data'], { type: 'image/png' });
    const result = validateTestimonySubmission(
      { name: 'Brother John', mediaType: 'audio' },
      invalidBlob
    );

    expect(result.valid).toBe(false);
    expect(result.error).toContain('Unsupported audio format');
  });

  it('should reject audio recordings exceeding duration limit', () => {
    const fakeBlob = new Blob(['sample audio data'], { type: 'audio/webm' });
    const result = validateTestimonySubmission(
      { name: 'Brother John', mediaType: 'audio', duration: '900' }, // 15 mins > 10 mins
      fakeBlob
    );

    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds the maximum limit');
  });

  it('should reject video recordings exceeding 7-minute limit', () => {
    const fakeBlob = new Blob(['sample video data'], { type: 'video/webm' });
    const result = validateTestimonySubmission(
      { name: 'Sister Faith', mediaType: 'video', duration: '480' }, // 8 mins > 7 mins
      fakeBlob
    );

    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds the maximum limit of 7 minutes');
  });

  it('should accept valid voice submission', () => {
    const validBlob = new Blob(['sample audio buffer data'], { type: 'audio/webm;codecs=opus' });
    const result = validateTestimonySubmission(
      {
        name: 'Brother Samuel',
        contact: 'samuel@church.org',
        mediaType: 'audio',
        duration: '120',
      },
      validBlob
    );

    expect(result.valid).toBe(true);
    expect(result.data?.name).toBe('Brother Samuel');
    expect(result.data?.contact).toBe('samuel@church.org');
    expect(result.data?.mediaType).toBe('audio');
    expect(result.data?.durationSeconds).toBe(120);
  });

  it('should accept valid video submission within 7-minute limit', () => {
    const validVideoBlob = new Blob(['sample video buffer data'], { type: 'video/webm' });
    const result = validateTestimonySubmission(
      {
        name: 'Sister Mary',
        contact: '+1 555 987 6543',
        mediaType: 'video',
        duration: '300', // 5 minutes
      },
      validVideoBlob
    );

    expect(result.valid).toBe(true);
    expect(result.data?.name).toBe('Sister Mary');
    expect(result.data?.mediaType).toBe('video');
    expect(result.data?.durationSeconds).toBe(300);
  });
});
