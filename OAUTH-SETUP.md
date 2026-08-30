# Fixing "We couldn't save your recording to storage"

Recordings weren't uploading because the app used a **service account**, and
service accounts have **no Google Drive storage** of their own — Google returns
`403 storageQuotaExceeded`. Since the church uses a **free @gmail.com** account,
the fix is to let the app sign in **as that Gmail account** (OAuth). Recordings
then go into that account's own 15 GB Drive.

You do this **entirely in the browser** — no local script, no localhost. It's a
**one-time** setup (~10 minutes). At the end you'll have 3 values to paste into
Vercel.

---

## A. Create an OAuth client in Google Cloud

1. Go to **https://console.cloud.google.com** and select your project (top bar).
2. **APIs & Services → Enabled APIs & services → + Enable APIs and services** —
   enable **Google Drive API** and **Google Sheets API** (search each, Enable).
3. **APIs & Services → OAuth consent screen**
   - User type: **External** → Create
   - App name `URPN Testimonies`; support email + developer email: your Gmail → Save
   - Scopes: Save and continue (nothing to add)
   - Test users: add your Gmail → Save and continue
   - **Back on the OAuth consent screen, click "PUBLISH APP" → Confirm.**
     (Important — otherwise your sign-in stops working after 7 days.)
4. **APIs & Services → Credentials → + Create credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: `URPN`
   - Under **Authorized redirect URIs → + Add URI**, paste **exactly**:
     ```
     https://developers.google.com/oauthplayground
     ```
     (This is Google's own tool — NOT localhost and NOT your Vercel URL.)
   - Create, then **copy the Client ID and Client secret.**

## B. Get the refresh token (OAuth Playground — all in the browser)

1. Open **https://developers.google.com/oauthplayground**
2. Click the **⚙️ gear icon** (top-right) → tick **"Use your own OAuth
   credentials"** → paste your **Client ID** and **Client secret** → Close.
3. On the left, in **"Input your own scopes"**, paste this (both, with a space
   between) and click **Authorize APIs**:
   ```
   https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets
   ```
4. Sign in with **your church Gmail** and approve. If you see **"Google hasn't
   verified this app"**, click **Advanced → Go to URPN Testimonies (unsafe)** →
   Allow. (It's your own app — safe.)
5. Back in the Playground, click **"Exchange authorization code for tokens"**.
6. Copy the **Refresh token** value it shows.

## C. Put the 3 values into Vercel

In **Vercel → your project → Settings → Environment Variables**, add these three
for **Production** (and Preview), then **Redeploy**:

```
GOOGLE_OAUTH_CLIENT_ID       = (your client id)
GOOGLE_OAUTH_CLIENT_SECRET   = (your client secret)
GOOGLE_OAUTH_REFRESH_TOKEN   = (the refresh token from step B6)
```

## D. Make sure the folder + sheet belong to that same Gmail

- `GOOGLE_DRIVE_FOLDER_ID` must be a folder in **that Gmail's** Drive.
- `GOOGLE_SHEET_ID` must be a sheet **that Gmail can edit**.
- You no longer need to "share with a service account" — the app *is* that
  account now. (The old `GOOGLE_SERVICE_ACCOUNT_EMAIL` / `GOOGLE_PRIVATE_KEY`
  can stay; OAuth takes priority when present.)

That's it — redeploy and test.

---

### Heads-up: large videos on Vercel

Vercel serverless functions cap the request body at about **4.5 MB**, so a long
**video** can still fail on the live site (audio and short videos are fine). If
you need long videos, tell me and I'll add a direct browser-to-Drive upload.

### Optional: doing it from your own computer instead

If you'd rather not use the Playground, there's a local helper
(`node scripts/get-google-token.mjs`) that uses `http://localhost:5555/oauth2callback`
as the redirect URI. That localhost URL is only for that script and never
touches your deployed site. Most people find the Playground above easier.
