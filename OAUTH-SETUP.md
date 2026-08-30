# Fixing "We couldn't save your recording to storage"

Recordings weren't uploading because the app used a **service account**, and
service accounts have **no Google Drive storage** of their own — Google returns
`403 storageQuotaExceeded`. Since the church uses a **free @gmail.com** account
(no Shared Drives), the fix is to let the app sign in **as that Gmail account**
(OAuth). Recordings then go into that account's own 15 GB Drive.

This is a **one-time** setup (~10 minutes).

---

## A. Create an OAuth client in Google Cloud

1. Go to **https://console.cloud.google.com** and select your project (top bar).
2. **APIs & Services → Enabled APIs & services → + Enable APIs and services** —
   make sure **Google Drive API** and **Google Sheets API** are both enabled.
3. **APIs & Services → OAuth consent screen**
   - User type: **External** → Create
   - App name: `URPN Testimonies`; support email + developer email: your Gmail → Save
   - Scopes: click Save and continue (nothing to add here)
   - Test users: add your Gmail → Save and continue
   - **Back on the OAuth consent screen, click "PUBLISH APP" → Confirm.**
     (Important — this keeps your sign-in working long-term instead of expiring
     after 7 days.)
4. **APIs & Services → Credentials → + Create credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: `URPN Local`
   - Under **Authorized redirect URIs → + Add URI**, paste exactly:
     ```
     http://localhost:5555/oauth2callback
     ```
   - Create. **Copy the Client ID and Client secret.**

## B. Get your refresh token

1. Open `.env.local` in the project and set:
   ```
   GOOGLE_OAUTH_CLIENT_ID=...paste client id...
   GOOGLE_OAUTH_CLIENT_SECRET=...paste client secret...
   ```
2. In a terminal in the project folder, run:
   ```bash
   node scripts/get-google-token.mjs
   ```
3. Open the link it prints, choose your Gmail. If you see
   **"Google hasn't verified this app"**, click **Advanced → Go to URPN
   Testimonies (unsafe)** → **Allow**. (It's your own app — safe.)
4. The terminal prints a line starting with `GOOGLE_OAUTH_REFRESH_TOKEN=` — copy it.

## C. Save the token (locally AND on Vercel)

1. Add it to `.env.local`:
   ```
   GOOGLE_OAUTH_REFRESH_TOKEN=...paste token...
   ```
2. In **Vercel → your project → Settings → Environment Variables**, add all three
   for **Production** (and Preview):
   `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN`
   — then **Redeploy**.

## D. Check the folder + sheet belong to that same Gmail

- `GOOGLE_DRIVE_FOLDER_ID` must be a folder in **that Gmail's** Drive.
- `GOOGLE_SHEET_ID` must be a sheet **that Gmail can edit**.
- You no longer need to "share with a service account" — the app *is* that
  account now. (The old `GOOGLE_SERVICE_ACCOUNT_EMAIL` / `GOOGLE_PRIVATE_KEY`
  can stay or be removed; OAuth takes priority when present.)

Restart `npm run dev` locally (or redeploy on Vercel) and test again.

---

### Heads-up: large videos on Vercel

Vercel serverless functions cap the request body at about **4.5 MB**, so a long
**video** can fail on the live site even after this fix (audio and short videos
are fine). If you need long videos in production, tell me and I'll add a secure
direct-to-Drive upload flow.
