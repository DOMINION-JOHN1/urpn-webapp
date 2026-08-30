import { getGoogleAuth } from '../lib/google/auth';
import { google } from 'googleapis';
import { config, isGoogleConfigured, isDeepgramConfigured } from '../lib/config';
import { createClient } from '@deepgram/sdk';

async function testLiveIntegration() {
  console.log('Testing live configurations...');
  console.log('Config status:', {
    projectId: config.google.projectId,
    clientEmail: config.google.clientEmail,
    driveFolderId: config.google.driveFolderId,
    sheetId: config.google.sheetId,
    sheetName: config.google.sheetName,
    isGoogleConfigured: isGoogleConfigured(),
    isDeepgramConfigured: isDeepgramConfigured(),
  });

  if (!isGoogleConfigured()) {
    console.error('Google is not configured properly.');
    return;
  }

  try {
    const auth = getGoogleAuth();
    console.log('Getting Google access token...');
    const token = await auth.getAccessToken();
    console.log('Google Auth token acquired successfully!');

    // 1. Test Google Drive folder access
    console.log('Testing Google Drive Folder access...');
    const drive = google.drive({ version: 'v3', auth });
    const folder = await drive.files.get({
      fileId: config.google.driveFolderId!,
      fields: 'id, name, mimeType',
    });
    console.log(`Google Drive Folder verified! Name: "${folder.data.name}", ID: ${folder.data.id}`);

    // 2. Test Google Sheets access
    console.log('Testing Google Sheets access...');
    const sheets = google.sheets({ version: 'v4', auth });
    const sheet = await sheets.spreadsheets.get({
      spreadsheetId: config.google.sheetId!,
    });
    console.log(`Google Sheet verified! Title: "${sheet.data.properties?.title}"`);

    // 3. Test Deepgram key
    if (isDeepgramConfigured()) {
      console.log('Testing Deepgram API connection...');
      const deepgram = createClient(config.transcription.deepgramApiKey!);
      const projects = await deepgram.manage.getProjects();
      console.log('Deepgram API verified successfully! Projects count:', projects.result?.projects?.length);
    }

    console.log('\n ALL LIVE CREDENTIALS VERIFIED & WORKING PERFECTLY!');
  } catch (err: any) {
    console.error('Live integration test error:', err.message || err);
    if (err.errors) {
      console.error('Detailed Google errors:', JSON.stringify(err.errors, null, 2));
    }
  }
}

testLiveIntegration();
