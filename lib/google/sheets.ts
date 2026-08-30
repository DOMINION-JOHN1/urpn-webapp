import { google } from 'googleapis';
import { getGoogleAuth } from './auth';
import { config, isGoogleConfigured } from '../config';

export interface SheetRowData {
  id: string;
  name: string;
  contact?: string;
  mediaType: 'audio' | 'video' | 'text';
  fileName: string;
  driveFileId: string;
  driveUrl: string;
  transcript: string;
  submittedAt: string;
  status: 'Completed' | 'Processing' | 'Failed';
  error?: string;
}

const EXPECTED_HEADERS = [
  'ID',
  'Name',
  'Contact',
  'Media Type',
  'Media File Name',
  'Google Drive File ID',
  'Media URL',
  'Transcript',
  'Submitted At',
  'Status',
  'Error',
];

async function ensureHeaderRow(sheets: any, spreadsheetId: string, sheetName: string): Promise<void> {
  try {
    const checkResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:K1`,
    });

    const rows = checkResponse.data.values;
    if (!rows || rows.length === 0 || rows[0].length === 0) {
      // Sheet is empty, write header row
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1:K1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [EXPECTED_HEADERS],
        },
      });
    }
  } catch (err) {
    console.warn('[Google Sheets] Note when checking header row:', err);
  }
}

export async function appendTestimonyToSheet(data: SheetRowData): Promise<{ success: boolean; isMock?: boolean }> {
  if (!isGoogleConfigured()) {
    console.warn(
      `[Google Sheets] Service Account not configured. Simulating Google Sheet entry for submission ${data.id}.`
    );
    return { success: true, isMock: true };
  }

  const auth = getGoogleAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = config.google.sheetId!;
  const sheetName = config.google.sheetName;

  await ensureHeaderRow(sheets, spreadsheetId, sheetName);

  const rowValues = [
    data.id,
    data.name,
    data.contact || 'N/A',
    data.mediaType.toUpperCase(),
    data.fileName,
    data.driveFileId,
    data.driveUrl,
    data.transcript || 'No transcript generated',
    data.submittedAt,
    data.status,
    data.error || '',
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:K`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [rowValues],
    },
  });

  return { success: true, isMock: false };
}
