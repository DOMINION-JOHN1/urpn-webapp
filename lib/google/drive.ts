import { google } from 'googleapis';
import { Readable } from 'stream';
import { getGoogleAuth } from './auth';
import { config, isGoogleConfigured } from '../config';

export interface DriveUploadResult {
  fileId: string;
  fileName: string;
  webViewLink: string;
  isMock?: boolean;
}

export function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export async function uploadTestimonyToDrive(options: {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  submissionId: string;
  candidateName: string;
}): Promise<DriveUploadResult> {
  const { buffer, fileName, mimeType, submissionId, candidateName } = options;

  if (!isGoogleConfigured()) {
    console.warn(
      `[Google Drive] Service Account not configured. Returning simulated mock drive upload for submission ${submissionId}.`
    );
    return {
      fileId: `mock_drive_file_${submissionId}`,
      fileName,
      webViewLink: `https://drive.google.com/file/d/mock_drive_file_${submissionId}/view?usp=drivesdk`,
      isMock: true,
    };
  }

  const auth = getGoogleAuth();
  const drive = google.drive({ version: 'v3', auth });

  const stream = bufferToStream(buffer);

  const fileMetadata: Record<string, any> = {
    name: fileName,
    description: `Church Testimony submission from ${candidateName} (ID: ${submissionId})`,
  };

  if (config.google.driveFolderId) {
    fileMetadata.parents = [config.google.driveFolderId];
  }

  const media = {
    mimeType,
    body: stream,
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id, name, webViewLink, webContentLink',
  });

  const fileId = response.data.id || `file_${submissionId}`;
  const webViewLink =
    response.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;

  return {
    fileId,
    fileName: response.data.name || fileName,
    webViewLink,
    isMock: false,
  };
}
