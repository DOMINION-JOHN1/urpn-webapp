# 🎙 Church Testimony Voice & Video Submission Platform

A modern, production-ready church testimony platform built as a **single Next.js project** ready for **one-click Vercel deployment**.

Visitors can record their testimonies using **Voice (up to 10 minutes)** or **Video (up to 7 minutes)** directly in their browser. Submissions are automatically uploaded to a designated **Google Drive** folder, transcribed using the ultra-fast **Deepgram Nova-2 AI** (with Google Cloud Speech-to-Text fallback), and logged into a **Google Sheet** for pastoral review.

---

## ✨ Features

- 🎙 **Voice Recording Mode**: Browser-native microphone recording with real-time animated audio waveform visualizer and configurable limit (default: 10 minutes).
- 📹 **Video Recording Mode**: In-browser camera recording with live viewfinder, front/rear camera switcher, and strict 7-minute limit with remaining-time indicators.
- ⚡ **Automated AI Transcription**: Powered by **Deepgram Nova-2 API** for fast, punctuated transcription of both audio and video containers (WebM, MP4, etc.), with Google Cloud Speech-to-Text fallback.
- 📁 **Google Drive Persistent Storage**: Automatically uploads and organizes voice/video recordings into a dedicated church Google Drive folder with unique tracking IDs.
- 📊 **Google Sheets Submission Log**: Automatically records submission metadata (ID, Name, Contact, Media Type, Drive Link, Full Transcript, Timestamp, Status) into a Google Spreadsheet for pastoral review.
- 📱 **Mobile-First & Zero Friction**: No accounts, sign-ins, or app downloads needed. Works on iOS Safari, Android Chrome, and all modern desktop browsers.
- 🎨 **Warm Church Aesthetic**: Rich dark navy & gold palette, accessible contrast, smooth micro-interactions, and celebratory submission confirmation.
- 🚀 **Single Vercel Deployment**: No separate backend servers, databases, or Redis required. All API routes run securely within Next.js Route Handlers.

---

## 🛠 Technology Stack

- **Framework**: Next.js 14 (App Router, Route Handlers)
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Storage**: Google Drive API (`googleapis`)
- **Database / Logging**: Google Sheets API (`googleapis`)
- **Transcription**: Deepgram SDK (`@deepgram/sdk`) & Google Cloud Speech API
- **Testing**: Vitest, React Testing Library, JSDOM
- **Deployment**: Vercel (Single Project)

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone <your-repository-url>
cd urpn
npm install
```

### 2. Configure Environment Variables
Copy the template to create your `.env.local`:
```bash
cp .env.example .env.local
```
*(Note: If you run without API keys, the application automatically runs in **Mock/Dev Mode**, allowing you to test UI recording and form flows locally!)*

### 3. Run Automated Tests
```bash
npm test
```

### 4. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the landing page, or [http://localhost:3000/testimony](http://localhost:3000/testimony) to test recording.

---

## ☁️ Google Cloud & Deepgram Setup Guide

Follow this beginner-friendly step-by-step guide to connect your Google Drive, Google Sheets, and Deepgram accounts:

### Step 1: Deepgram API Setup (Transcription)
1. Sign up for a free account at [console.deepgram.com](https://console.deepgram.com/).
2. Navigate to **API Keys** -> click **Create a New API Key**.
3. Copy the key and set it in your `.env.local` or Vercel settings:
   ```env
   DEEPGRAM_API_KEY=your_deepgram_api_key_here
   ```

---

### Step 2: Create a Google Cloud Project & Enable APIs
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. In the top bar, click the project dropdown and click **New Project** (e.g. `church-testimonies`).
3. In the search bar at the top, search for and **Enable** these 3 APIs:
   - **Google Drive API**
   - **Google Sheets API**
   - **Cloud Speech-to-Text API**

---

### Step 3: Create a Google Service Account & Generate JSON Key
1. Go to **IAM & Admin** -> **Service Accounts**.
2. Click **Create Service Account**:
   - Name: `testimony-bot`
   - Description: `Service account for Church Testimony submissions`
   - Click **Create and Continue**, then click **Done**.
3. Copy the generated **Service Account Email** (e.g., `testimony-bot@church-testimonies.iam.gserviceaccount.com`).
4. Click on the newly created service account -> navigate to the **Keys** tab.
5. Click **Add Key** -> **Create new key** -> Select **JSON** -> Click **Create**.
6. A JSON key file will download to your computer. Open it and extract:
   - `client_email` -> `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` -> `GOOGLE_PRIVATE_KEY`
   - `project_id` -> `GOOGLE_PROJECT_ID`

---

### Step 4: Create and Share Your Google Drive Folder
1. Go to [Google Drive](https://drive.google.com/).
2. Create a new folder named **"Church Testimonies"**.
3. Right-click the folder -> click **Share**.
4. In the "Add people" field, paste your **Service Account Email** (from Step 3).
5. Set the permission to **Editor** or **Content Manager** and click **Share**.
6. Copy the **Folder ID** from the browser URL:
   - Example URL: `https://drive.google.com/drive/folders/1abcXYZ_folder_id_here`
   - Folder ID is: `1abcXYZ_folder_id_here` -> set as `GOOGLE_DRIVE_FOLDER_ID`.

---

### Step 5: Create and Share Your Google Sheet
1. Go to [Google Sheets](https://sheets.new) and create a spreadsheet named **"Church Testimonies"**.
2. Name the first sheet/tab **"Submissions"**.
3. Click the **Share** button in the top right.
4. Add your **Service Account Email** as **Editor** and click **Send**.
5. Copy the **Spreadsheet ID** from the browser URL:
   - Example URL: `https://docs.google.com/spreadsheets/d/1abcXYZ_sheet_id_here/edit`
   - Sheet ID is: `1abcXYZ_sheet_id_here` -> set as `GOOGLE_SHEET_ID`.

The system automatically initializes the header columns on the first submission:
`ID | Name | Contact | Media Type | Media File Name | Google Drive File ID | Media URL | Transcript | Submitted At | Status | Error`

---

## 🔑 Environment Variables Reference

| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `GOOGLE_PROJECT_ID` | Yes | Google Cloud Project ID | `church-testimonies-2026` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Yes | Service Account Email | `bot@project.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | Yes | Service Account Private Key (with `\n` line breaks) | `"-----BEGIN PRIVATE KEY-----\n..."` |
| `GOOGLE_DRIVE_FOLDER_ID` | Yes | Google Drive Folder ID for audio/video storage | `1abcXYZ_drive_folder_id` |
| `GOOGLE_SHEET_ID` | Yes | Google Sheet ID for logging submissions | `1abcXYZ_sheet_id` |
| `GOOGLE_SHEET_NAME` | No | Worksheet tab name (default: `Submissions`) | `Submissions` |
| `DEEPGRAM_API_KEY` | Recommended | Deepgram Nova-2 API key for ultra-fast transcription | `your_deepgram_api_key` |
| `MAX_AUDIO_RECORDING_SECONDS`| No | Max voice recording duration in seconds (default: 600s = 10m) | `600` |
| `MAX_VIDEO_RECORDING_SECONDS`| No | Max video recording duration in seconds (default: 420s = 7m) | `420` |
| `MAX_UPLOAD_SIZE_MB` | No | Maximum media upload size in megabytes (default: 50MB) | `50` |

---

## 🚢 Deploying to Vercel (Single Project)

1. Push your code to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: complete church testimony voice and video submission MVP"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Go to [Vercel Dashboard](https://vercel.com/) -> click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add all variables from your `.env.local`:
   - `GOOGLE_PROJECT_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GOOGLE_DRIVE_FOLDER_ID`
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SHEET_NAME`
   - `DEEPGRAM_API_KEY`
   - `MAX_AUDIO_RECORDING_SECONDS`
   - `MAX_VIDEO_RECORDING_SECONDS`
   - `MAX_UPLOAD_SIZE_MB`
5. Click **Deploy**. Vercel will build and launch your application at `https://your-project.vercel.app`.

---

## 🧪 Testing Your Deployment

1. Visit `https://your-domain.vercel.app/api/health` to verify all integration checks.
2. Visit `https://your-domain.vercel.app/testimony`:
   - Enter your name and optional phone/email.
   - Record a voice or video testimony.
   - Preview the recording and click **Submit Testimony**.
   - Check Google Drive to see the newly saved audio/video file.
   - Check Google Sheets to see the new row with transcript and Drive link.

---

## 🛠 Troubleshooting & FAQ

### 1. "Microphone or Camera access is required"
- **Cause**: Browser permissions were dismissed or blocked.
- **Fix**: Click the padlock or camera icon in your browser URL bar, change Microphone and Camera permissions to **Allow**, and reload the page.

### 2. "The caller does not have permission" (Google Drive / Sheets)
- **Cause**: The Google Drive folder or Google Sheet was not shared with the service account.
- **Fix**: Open your Google Drive folder and Google Sheet, click **Share**, paste your `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and ensure permission is set to **Editor**.

### 3. "Invalid Private Key" (Google Auth)
- **Cause**: Line breaks in `GOOGLE_PRIVATE_KEY` were corrupted when pasting.
- **Fix**: Wrap the key in double quotes in your environment configuration and ensure newline characters `\n` are preserved:
  `GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"`

### 4. Video Recording Limit
- The video recorder is strictly capped at **7 minutes (420 seconds)**. A visual countdown bar alerts the user when approaching the limit, and the recording automatically finalizes when the limit is reached.

---

## 📜 License & Acknowledgments
Built with ❤️ for church ministry and community praise sharing. Free for use and modification.
# urpn-webapp
