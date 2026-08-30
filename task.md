BUILD A CHURCH TESTIMONY VOICE SUBMISSION MVP
You are a senior full-stack engineer. Build a complete, production-ready MVP for a church testimony voice submission platform.
The application must be designed so that the entire project is contained in one Next.js repository and deployed as ONE Vercel project.
IMPORTANT: Do NOT create a separate FastAPI/Python backend. Do NOT require a separate backend deployment.
Use Next.js server-side Route Handlers/API routes for all backend functionality.
The goal is simple:
A visitor opens the church website → records their testimony using their voice → submits it → the audio is stored in Google Drive → the audio is transcribed automatically → the transcription and submission information are stored in Google Sheets.The system should be simple, reliable, secure, and easy for a church team to operate.

1. REQUIRED TECHNOLOGY STACK
Use:
Frontend + Backend
Next.js
React
TypeScript
Tailwind CSS
Next.js App Router
Next.js Route Handlers for backend/API functionality
Google Services
Google Drive API for audio storage
Google Sheets API for submission records
Google Cloud Speech-to-Text for transcription
Deployment
Vercel
One GitHub repository
One Vercel project
One deployment
Do NOT introduce:
FastAPI
Python backend
Separate Node/Express server
Separate backend deployment
PostgreSQL
Redis
Kubernetes
Microservices
unless there is an absolutely necessary technical reason.
The priority is:
Simple working MVP > unnecessary architecture.

2. CORE USER FLOW
Create a beautiful page:
/testimonyThe visitor should be able to:
Enter their name.
Optionally enter email or phone number.
Click "Start Recording".
Grant microphone permission.
Record their testimony directly in the browser.
See a recording timer.
Stop recording.
Listen to the recording.
Re-record if necessary.
Submit the testimony.
See a clear confirmation message.
The user should NOT need to:
Create an account
Sign in
Upload manually
Know anything about Google Drive
Know anything about Google Sheets
Everything should happen automatically.

3. USER INTERFACE
Create a modern church-appropriate design.
The interface should be:
Elegant
Clean
Mature
Warm
Minimal
Mobile-first
Responsive
Accessible
Fast
Avoid excessive animations and unnecessary visual complexity.
The recording experience is the main focus.
Suggested structure:
------------------------------------------------

              SHARE YOUR
               TESTIMONY

       Your story could encourage
              someone else.

Name
[____________________________]

Email / Phone (optional)
[____________________________]

          🎙 START RECORDING

               00:00

          [ STOP RECORDING ]

          [ ▶ PLAY RECORDING ]

             [ RE-RECORD ]

        [ SUBMIT TESTIMONY ]

------------------------------------------------The UI should clearly show different states:
Ready to record
Recording...
Recording complete
Uploading...
Processing...
Submitted successfully
4. RECORDING IMPLEMENTATION
Use the browser's native:
MediaRecorder APIThe recording should happen entirely in the browser.
Support common modern mobile and desktop browsers.
The component must provide:
Start recording
Stop recording
Recording timer
Audio playback
Pause/play preview
Delete recording
Re-record
Submit
Prevent accidental multiple submissions.
Disable the submit button while submission is processing.
Handle microphone permission denial gracefully.
For example:
Microphone access is required to record your testimony. Please allow microphone access in your browser and try again.5. AUDIO FORMAT
Prefer browser-compatible formats such as:
audio/webm
audio/webm;codecs=opusDo NOT assume every browser produces exactly the same format.
The backend/API route must validate the received MIME type.
If Google Speech-to-Text requires conversion or a specific encoding for the selected configuration, implement the appropriate conversion/processing step.
Do not silently assume compatibility.
6. RECORDING LIMITS
Implement configurable limits.
For example:
MAX_RECORDING_SECONDS=600
MAX_UPLOAD_SIZE_MB=25The exact defaults may be adjusted based on the implementation.
The limits must be configurable through environment variables rather than being scattered as hard-coded values throughout the code.
Reject:
Empty recordings
Invalid file types
Files exceeding the configured size
Recordings exceeding the configured duration

7. DATA FLOW
The complete flow should be:
USER
  │
  │ Records testimony
  ▼
NEXT.JS FRONTEND
  │
  │ POST /api/testimonies
  ▼
NEXT.JS ROUTE HANDLER
  │
  ├───────────────► GOOGLE DRIVE
  │                   │
  │                   └── Stores audio
  │
  ├───────────────► GOOGLE CLOUD
  │                   │
  │                   └── Speech-to-Text
  │
  └───────────────► GOOGLE SHEETS
                      │
                      ├── Name
                      ├── Contact
                      ├── Audio URL
                      ├── Transcript
                      ├── Date
                      └── StatusThe Next.js server-side code is responsible for coordinating these operations.

8. GOOGLE DRIVE
Create/use a dedicated Google Drive folder:
Church TestimoniesEvery submitted audio recording should be stored inside this folder.
Use a unique filename such as:
testimony_<unique-id>_<timestamp>.webmExample:
testimony_8f32a1_20260830_093500.webmThe backend should obtain:
Google Drive file ID
File name
Appropriate Drive URL/reference
The actual audio must be stored in Google Drive.
Do NOT store the audio itself inside Google Sheets.
Google Sheets should only contain a reference/link to the Drive file.
Do not make all recordings publicly accessible by default.
Use appropriate Google Drive permissions so the church team can access the recordings.

9. GOOGLE SHEETS
Create/use a Google Sheet:
Church TestimoniesCreate a worksheet:
SubmissionsUse these columns:
ID
Name
Contact
Audio File Name
Google Drive File ID
Audio URL
Transcript
Submitted At
Status
ErrorExample:
ID: abc123
Name: David
Contact: 080...
Audio File Name: testimony_abc123.webm
Google Drive File ID: 1abc...
Audio URL: Google Drive link
Transcript: I want to thank God...
Submitted At: 2026-08-30 09:35
Status: Completed
Error:Possible statuses:
Processing
Completed
Failed
Reviewed
Approved
RejectedFor the MVP, the primary statuses should be:
Processing
Completed
FailedDesign the code so additional statuses can be introduced later.

10. TRANSCRIPTION
Use:
Google Cloud Speech-to-TextWhen a valid recording is submitted:
Receive the audio.
Validate it.
Generate a unique submission ID.
Upload audio to Google Drive.
Send/process the audio through Speech-to-Text.
Receive the transcript.
Write the submission data into Google Sheets.
Include the Drive audio reference.
Set status to Completed.
If transcription fails:
DO NOT delete the audio.
Keep the audio safely stored in Google Drive.
Set status to Failed.
Save a useful error description in the Error column.
Log the technical error server-side.
Do not expose sensitive technical information to the user.
The architecture should make it possible to retry transcription later.

11. IMPORTANT: SERVER-SIDE GOOGLE INTEGRATION
All Google API credentials and service-account credentials must remain server-side.
The browser must NEVER receive:
GOOGLE_PRIVATE_KEY
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
GOOGLE_CLIENT_SECRETor any equivalent secret.
Use environment variables.
The frontend should only communicate with the Next.js API route.

12. GOOGLE SERVICE ACCOUNT
Use a Google service account for server-side communication where appropriate.
The README must explain step-by-step how to:
Create a Google Cloud project.
Enable Google Drive API.
Enable Google Sheets API.
Enable Google Cloud Speech-to-Text.
Create a service account.
Generate credentials securely.
Give the service account access to the Google Drive folder.
Give the service account access to the Google Sheet.
Configure the required environment variables.
Deploy to Vercel.
Do not assume the church administrator already knows Google Cloud.
Make the instructions beginner-friendly.

13. ENVIRONMENT VARIABLES
Create:
.env.exampleInclude all required variables.
For example:
GOOGLE_PROJECT_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_DRIVE_FOLDER_ID=
GOOGLE_SHEET_ID=
GOOGLE_SHEET_NAME=Submissions

MAX_RECORDING_SECONDS=600
MAX_UPLOAD_SIZE_MB=25

ALLOWED_ORIGINS=Add any other variables genuinely required by the implementation.
Never include real credentials.
Never commit .env.
Add .env to .gitignore.
Because this will be deployed on Vercel, document exactly where these values should be entered in:
Vercel → Project → Settings → Environment Variables
14. API
Create a Next.js Route Handler:
POST /api/testimoniesIt should accept:
name
contact (optional)
audioUse an appropriate multipart/form-data implementation.
Validate everything server-side.
Return structured JSON.
Success example:
{
  "success": true,
  "message": "Your testimony has been submitted successfully.",
  "submission_id": "abc123"
}Do not return:
Private credentials
Stack traces
Internal server paths
Sensitive Google API information

15. ERROR HANDLING
Handle errors gracefully.
Microphone denied
Show:
Microphone access is required to record your testimony. Please allow microphone access in your browser and try again.Invalid recording
Show:
Please record a valid testimony before submitting.Upload failure
Show:
We couldn't submit your testimony right now. Please try again.Transcription failure
If the audio was successfully uploaded, do not falsely tell the user that the entire processing succeeded.
The backend should preserve the audio and mark the submission appropriately.
Network failure
Do not tell the user the testimony was successfully submitted unless the server actually confirms it.

16. PROCESSING EXPERIENCE
Make the submission experience clear.
After clicking Submit:
Submitting your testimony...

Uploading recording...
Processing transcription...
Almost done...If the backend architecture allows processing to happen asynchronously, use that approach rather than making the browser wait unnecessarily.
The user ultimately sees:
Your testimony has been received.

Thank you for sharing your story.
17. DATA PRIVACY
The application is collecting personal information and voice recordings.
Collect only what is necessary.
Required:
Name
Voice recordingOptional:
Email
PhoneInclude a simple consent statement:
By submitting this testimony, I understand that my recording and the information I provide will be received and reviewed by the church team.Do NOT automatically publish submitted testimonies.
The MVP is for collection and church-team review only.

18. SECURITY
This is a public-facing application.
Implement reasonable protection against abuse.
Include:
Server-side validation
File type validation
File size validation
Recording duration validation
Rate limiting or basic abuse protection
Secure CORS configuration
Environment-based secrets
No secrets in client-side JavaScript
No credentials committed to Git
Safe error handling
Protection against arbitrary file uploads
Protection against duplicate submissions where practical
Do not trust frontend validation alone.

19. LOGGING
Implement useful server-side logs.
Log:
submission_id
timestamp
processing stage
success/failure
error categoryDo NOT log:
Private keys
Passwords
Authentication tokens
Entire audio contents
Sensitive information unnecessarily

20. PROJECT STRUCTURE
Use the Next.js App Router.
A structure similar to this is preferred:
church-testimony-mvp/
│
├── app/
│   ├── testimony/
│   │   └── page.tsx
│   │
│   ├── api/
│   │   └── testimonies/
│   │       └── route.ts
│   │
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── AudioRecorder.tsx
│   ├── TestimonyForm.tsx
│   ├── RecordingControls.tsx
│   └── ...
│
├── lib/
│   ├── google/
│   │   ├── drive.ts
│   │   ├── sheets.ts
│   │   └── speech.ts
│   │
│   ├── validation.ts
│   └── config.ts
│
├── public/
│
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── ...You may improve this structure if you have a good architectural reason.
Keep Google-specific logic separated from the API route where practical.

21. VERCEL DEPLOYMENT REQUIREMENT
This is extremely important:
The entire application must deploy as a single Vercel project.
The deployment should be conceptually:
GitHub Repository
       ↓
     Vercel
       ↓
   Next.js App
       ↓
Frontend + API RoutesThere must NOT be:
Frontend → Vercel

Backend → another serverEverything should be contained within the Next.js application.
Make sure the implementation is compatible with Vercel's serverless/runtime model.
Do not rely on:
Persistent local filesystem storage
Long-running background processes that Vercel cannot reliably maintain
A permanently running local server
In-memory state that must survive between requests
Use Google Drive as persistent audio storage.

22. IMPORTANT AUDIO/VERCEL CONSIDERATION
Before implementing the upload architecture, verify the current Vercel limits for request body size, function execution, and relevant runtime constraints.
Do not blindly assume that large audio files can be passed through a serverless function.
For the MVP, keep recordings reasonably short and configurable.
If a better architecture is required for larger recordings, consider a secure direct-upload flow where appropriate, while ensuring that Google credentials are never exposed to the browser.
The implementation should prioritize reliability.

23. TESTING
Create tests for important functionality.
Test:
Frontend
Recording starts
Recording stops
Timer works
Audio preview works
Re-record works
Required fields validate
Submit button state works
Loading state works
Error state works
Success state works
Backend
Valid submission
Missing name
Missing audio
Invalid file type
File too large
Invalid audio
Google Drive upload failure
Speech-to-Text failure
Google Sheets failure
Mock Google APIs in automated tests.
Tests should NOT require real Google credentials.

24. README
Create a comprehensive README.md.
It must explain:
Local development
How to:
git clone
npm install
npm run devGoogle Cloud setup
Explain step-by-step:
Create project
Enable APIs
Create service account
Create Drive folder
Create Sheet
Share Drive folder with service account
Share Sheet with service account
Get IDs
Configure credentials
Environment variables
Explain every variable.
Vercel deployment
Explain:
Push project to GitHub.
Import repository into Vercel.
Add environment variables.
Deploy.
Test /testimony.
Troubleshooting
Include common problems:
Microphone permission
Google authentication
Drive permissions
Sheets permissions
Speech-to-Text errors
Upload limits

25. FUTURE EXPANSION
Do NOT build these now, but structure the application so they can be added later.
Potential future features:
Admin dashboard
All testimonies
Pending
Reviewed
Approved
RejectedAI processing
Future pipeline:
Voice
 ↓
Transcription
 ↓
AI grammar cleanup
 ↓
Generate title
 ↓
Generate summary
 ↓
Categorize
 ↓
Church review
 ↓
PublishPublic testimony library
Future route:
/testimonieswith:
Testimony title
Person's name
Story
Audio
Category
Date
But DO NOT implement these features in the current MVP.

26. FINAL DEFINITION OF DONE
The project is complete only when I can do this:
From my phone:
Open the church website.

Navigate to /testimony.
Enter my name.
Optionally enter contact information.
Tap Start Recording.
Speak for several minutes.
Tap Stop.
Play the recording.
Re-record if necessary.
Tap Submit.
Then automatically:
Audio
   ↓
Google Drive
and:
Transcript
   ↓
Google Sheets
and the Sheet contains:
ID
Name
Contact
Audio File Name
Google Drive File ID
Audio URL
Transcript
Submitted At
Status
Error
The user receives a clear success confirmation.
The church administrator can open Google Sheets, see the submission, read the transcription, and click the Drive reference to access the original recording.

27. DEVELOPMENT APPROACH
Before writing the implementation:
Inspect the existing repository.
Determine whether there is already an application structure.
Reuse existing architecture where appropriate.
Do not unnecessarily rewrite unrelated code.
Verify the current Google API requirements.
Verify Vercel's current relevant runtime/request constraints.
Design the data flow.
Implement the MVP incrementally.
Test each major integration.
Run the application locally.
Fix errors.
Ensure the production build succeeds.
Provide clear deployment instructions.
Do not merely create a beautiful frontend mockup.
The Google Drive upload, transcription, Google Sheets integration, API route, validation, error handling, and deployment configuration must actually work.
If a technical decision is ambiguous, choose the simplest reliable solution compatible with a single Vercel deployment and document the decision.
The main objective is:
Build a real, deployable church testimony MVP that can be used immediately, while keeping the architecture simple enough to maintain and extend later.