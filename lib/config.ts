export interface AppConfig {
  google: {
    projectId?: string;
    clientEmail?: string;
    privateKey?: string;
    // OAuth (user delegation) — used for free @gmail.com accounts where a
    // service account cannot own Drive files (no storage quota).
    oauthClientId?: string;
    oauthClientSecret?: string;
    oauthRefreshToken?: string;
    driveFolderId?: string;
    sheetId?: string;
    sheetName: string;
  };
  transcription: {
    deepgramApiKey?: string;
  };
  limits: {
    maxAudioRecordingSeconds: number;
    maxVideoRecordingSeconds: number;
    maxUploadSizeMB: number;
    maxUploadSizeBytes: number;
  };
  cors: {
    allowedOrigins: string[];
  };
}

function extractDriveFolderId(input?: string): string | undefined {
  if (!input) return undefined;
  const trimmed = input.trim();
  // Match folder ID inside URL: https://drive.google.com/drive/folders/<FOLDER_ID>...
  const match = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }
  // Return clean ID if passed directly
  return trimmed.replace(/^["']|["']$/g, '');
}

function extractSheetId(input?: string): string | undefined {
  if (!input) return undefined;
  const trimmed = input.trim();
  // Match sheet ID inside URL: https://docs.google.com/spreadsheets/d/<SHEET_ID>...
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }
  // Return clean ID if passed directly
  return trimmed.replace(/^["']|["']$/g, '');
}

function cleanPrivateKey(key?: string): string | undefined {
  if (!key) return undefined;
  let cleaned = key.trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1);
  }
  return cleaned.replace(/\\n/g, '\n');
}

const rawDriveInput =
  process.env.GOOGLE_DRIVE_FOLDER_ID ||
  process.env['Google Drive Folder'] ||
  process.env.GOOGLE_DRIVE_FOLDER;

const rawSheetInput =
  process.env.GOOGLE_SHEET_ID ||
  process.env['Google Sheet'] ||
  process.env.GOOGLE_SHEET;

const rawProjectId =
  process.env.GOOGLE_PROJECT_ID ||
  process.env.project_id ||
  process.env.PROJECT_ID;

const rawPrivateKey =
  process.env.GOOGLE_PRIVATE_KEY ||
  process.env.private_key ||
  process.env.PRIVATE_KEY;

export const config: AppConfig = {
  google: {
    projectId: rawProjectId?.trim(),
    clientEmail: (
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
      process.env.client_email ||
      process.env.CLIENT_EMAIL
    )?.trim(),
    privateKey: cleanPrivateKey(rawPrivateKey),
    oauthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID?.trim(),
    oauthClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim(),
    oauthRefreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN?.trim(),
    driveFolderId: extractDriveFolderId(rawDriveInput),
    sheetId: extractSheetId(rawSheetInput),
    sheetName: process.env.GOOGLE_SHEET_NAME || 'Submissions',
  },
  transcription: {
    deepgramApiKey: process.env.DEEPGRAM_API_KEY?.trim(),
  },
  limits: {
    maxAudioRecordingSeconds: parseInt(process.env.MAX_AUDIO_RECORDING_SECONDS || '600', 10), // 10 mins
    maxVideoRecordingSeconds: parseInt(process.env.MAX_VIDEO_RECORDING_SECONDS || '420', 10), // 7 mins
    maxUploadSizeMB: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '50', 10), // 50MB
    get maxUploadSizeBytes() {
      return this.maxUploadSizeMB * 1024 * 1024;
    },
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
      : ['*'],
  },
};

/** OAuth (user delegation) creds — the path for free @gmail.com accounts. */
export function isGoogleOAuthConfigured(): boolean {
  return Boolean(
    config.google.oauthClientId &&
    config.google.oauthClientSecret &&
    config.google.oauthRefreshToken
  );
}

/** Service-account creds — works only with Shared Drives (Workspace). */
export function isServiceAccountConfigured(): boolean {
  return Boolean(config.google.clientEmail && config.google.privateKey);
}

export function isGoogleConfigured(): boolean {
  return Boolean(
    (isGoogleOAuthConfigured() || isServiceAccountConfigured()) &&
    config.google.driveFolderId &&
    config.google.sheetId
  );
}

export function isDeepgramConfigured(): boolean {
  return Boolean(
    config.transcription.deepgramApiKey &&
    config.transcription.deepgramApiKey.trim().length > 0
  );
}
