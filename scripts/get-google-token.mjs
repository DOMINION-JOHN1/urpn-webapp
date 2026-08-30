/**
 * One-time helper: obtain a Google OAuth refresh token so the app can upload
 * testimonies into a normal @gmail.com Drive (owned by the user, so there is
 * no service-account storage-quota problem).
 *
 * Usage:
 *   1. In Google Cloud Console create an OAuth client (type: "Web application")
 *      and add this Authorized redirect URI:  http://localhost:5555/oauth2callback
 *   2. Put GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET in .env.local
 *   3. Run:  node scripts/get-google-token.mjs
 *   4. Approve access in the browser, then copy the printed
 *      GOOGLE_OAUTH_REFRESH_TOKEN into .env.local and your Vercel env vars.
 */
import http from 'node:http';
import { readFileSync } from 'node:fs';
import { google } from 'googleapis';

const PORT = 5555;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/spreadsheets',
];

function loadEnv() {
  const env = { ...process.env };
  try {
    const raw = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (env[m[1]] === undefined) env[m[1]] = v;
    }
  } catch {
    /* .env.local is optional if the vars are already exported */
  }
  return env;
}

const env = loadEnv();
const clientId = env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = env.GOOGLE_OAUTH_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error('\n❌  Missing GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET.');
  console.error('    Add them to .env.local first, then run this again.\n');
  process.exit(1);
}

const oauth2 = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);
const authUrl = oauth2.generateAuthUrl({
  access_type: 'offline', // ask for a refresh token
  prompt: 'consent', // force it to always return the refresh token
  scope: SCOPES,
});

const server = http.createServer(async (req, res) => {
  if (!req.url || !req.url.startsWith('/oauth2callback')) {
    res.writeHead(404).end('Not found');
    return;
  }
  const url = new URL(req.url, REDIRECT_URI);
  const err = url.searchParams.get('error');
  const code = url.searchParams.get('code');

  if (err) {
    res.writeHead(400, { 'Content-Type': 'text/html' }).end(`<h2>Authorization failed: ${err}</h2>`);
    console.error(`\n❌  Authorization failed: ${err}\n`);
    server.close();
    process.exit(1);
  }

  try {
    const { tokens } = await oauth2.getToken(code);
    res
      .writeHead(200, { 'Content-Type': 'text/html' })
      .end('<h2>✅ Success! Close this tab and return to your terminal.</h2>');

    console.log('\n============================================================');
    if (tokens.refresh_token) {
      console.log('✅  Copy this line into .env.local AND your Vercel env vars:\n');
      console.log('GOOGLE_OAUTH_REFRESH_TOKEN=' + tokens.refresh_token);
    } else {
      console.log('⚠️   No refresh token was returned.');
      console.log('    Go to https://myaccount.google.com/permissions, remove this app,');
      console.log('    then run this script again.');
    }
    console.log('============================================================\n');
    server.close();
    process.exit(0);
  } catch (e) {
    res.writeHead(500).end('Token exchange failed — check the terminal.');
    console.error('\n❌  Token exchange failed:', e?.message || e, '\n');
    server.close();
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log('\n────────────────────────────────────────────────────────────');
  console.log('URPN — Google refresh-token helper');
  console.log('────────────────────────────────────────────────────────────');
  console.log('\n1) Confirm this redirect URI is on your OAuth client:');
  console.log('   ' + REDIRECT_URI);
  console.log('\n2) Open this URL in your browser and approve access');
  console.log('   (if you see "Google hasn’t verified this app", click');
  console.log('    "Advanced" → "Go to … (unsafe)" — it is your own app):\n');
  console.log('   ' + authUrl + '\n');
  console.log('Waiting for approval…  (press Ctrl+C to cancel)\n');
});
