// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/testimonies/route';
import { NextRequest } from 'next/server';

describe('API Route /api/testimonies', () => {
  it('should return 400 when name is missing', async () => {
    const formData = new FormData();
    const fakeBlob = new Blob(['test audio content'], { type: 'audio/webm' });
    formData.append('media', fakeBlob, 'testimony.webm');
    formData.append('mediaType', 'audio');

    const req = {
      formData: async () => formData,
    } as unknown as NextRequest;

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Please provide your name');
  });

  it('should return 400 when media file is missing', async () => {
    const formData = new FormData();
    formData.append('name', 'Brother Michael');
    formData.append('mediaType', 'audio');

    const req = {
      formData: async () => formData,
    } as unknown as NextRequest;

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('No media file provided');
  });

  it('should successfully process a valid audio testimony submission (in mock mode when unconfigured)', async () => {
    const formData = new FormData();
    formData.append('name', 'Sister Deborah');
    formData.append('contact', 'deborah@example.com');
    formData.append('mediaType', 'audio');
    formData.append('duration', '65');

    const fakeBlob = new Blob(['test audio stream data'], { type: 'audio/webm' });
    formData.append('media', fakeBlob, 'testimony.webm');

    const req = {
      formData: async () => formData,
    } as unknown as NextRequest;

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.submission_id).toBeDefined();
    expect(data.media_type).toBe('audio');
    expect(data.drive_url).toBeDefined();
    expect(data.submitted_at).toBeDefined();
  });

  it('should successfully process a valid video testimony submission', async () => {
    const formData = new FormData();
    formData.append('name', 'Pastor Emmanuel');
    formData.append('contact', '+1 800 555 0199');
    formData.append('mediaType', 'video');
    formData.append('duration', '180');

    const fakeVideoBlob = new Blob(['test video stream data'], { type: 'video/webm' });
    formData.append('media', fakeVideoBlob, 'testimony.webm');

    const req = {
      formData: async () => formData,
    } as unknown as NextRequest;

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.submission_id).toBeDefined();
    expect(data.media_type).toBe('video');
    expect(data.drive_url).toBeDefined();
  });
});
