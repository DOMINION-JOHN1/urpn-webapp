import { google } from 'googleapis';
import { config, isGoogleConfigured } from '../config';

const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/spreadsheets',
];

export function getGoogleAuth() {
  if (!isGoogleConfigured()) {
    throw new Error(
      'Google Service Account credentials are not fully configured. Please set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_DRIVE_FOLDER_ID, and GOOGLE_SHEET_ID in your environment.'
    );
  }

  const auth = new google.auth.JWT({
    email: config.google.clientEmail,
    key: config.google.privateKey,
    scopes: SCOPES,
  });

  return auth;
}
