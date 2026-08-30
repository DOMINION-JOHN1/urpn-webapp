import { google } from 'googleapis';
import { config, isGoogleOAuthConfigured, isServiceAccountConfigured } from '../config';

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/spreadsheets',
];

/**
 * Returns a Google auth client for Drive + Sheets.
 *
 * Prefers OAuth (user delegation) when configured — this is required for free
 * @gmail.com accounts, because a service account has no personal Drive storage
 * quota and cannot own uploaded files. Falls back to a service-account JWT
 * (which only works when uploading into a Shared Drive).
 */
export function getGoogleAuth() {
  if (isGoogleOAuthConfigured()) {
    const oauth2 = new google.auth.OAuth2(
      config.google.oauthClientId,
      config.google.oauthClientSecret
    );
    oauth2.setCredentials({ refresh_token: config.google.oauthRefreshToken });
    return oauth2;
  }

  if (isServiceAccountConfigured()) {
    return new google.auth.JWT({
      email: config.google.clientEmail,
      key: config.google.privateKey,
      scopes: SCOPES,
    });
  }

  throw new Error(
    'Google credentials are not configured. Set GOOGLE_OAUTH_CLIENT_ID, ' +
      'GOOGLE_OAUTH_CLIENT_SECRET and GOOGLE_OAUTH_REFRESH_TOKEN (recommended for ' +
      'gmail.com accounts), or a service account (GOOGLE_SERVICE_ACCOUNT_EMAIL + ' +
      'GOOGLE_PRIVATE_KEY) plus GOOGLE_DRIVE_FOLDER_ID and GOOGLE_SHEET_ID.'
  );
}
