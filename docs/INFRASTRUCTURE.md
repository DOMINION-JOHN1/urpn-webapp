# URPN Infrastructure Decision — Database, Auth & Video

**Status:** research + recommendation  
**Date:** November 2026  
**Scope:** the worker portal (courses, progress, exams, certificates), the public site, and the testimony module.

---

## TL;DR

1. **Yes — use Supabase**, specifically the **Pro** plan, as the database + auth + small-file storage layer. The current JSON file works for a demo but is not production infrastructure.
2. **Do not use Supabase Storage as the video CDN.** It can store files, but it does not transcode to HLS, does not provide adaptive bitrate, and video egress is billed per GB.
3. **Use a dedicated video platform for lessons.** My recommendation is **Mux** for this scale; **Cloudflare Stream** is the simpler “Cloudflare-only” alternative, and **Bunny Stream** is the budget alternative.
4. **Google Drive should be the upload/archive source, not the player.** A sync job can pull videos from Drive and upload them to Mux/Cloudflare Stream.
5. **Telegram should be for notifications, not media.** The Bot API can only download files up to **20 MB**, and even a local Bot API server is not a CDN or an access-controlled video platform.
6. Recommended stack: **Next.js + Vercel (fra1) + Supabase Pro (EU) + Mux** — roughly **$25–30/month** at 25 lessons and 100–500 workers.

---

## Current state

- Next.js 14 App Router on a single deployment.
- Custom email/password auth (scrypt + HMAC-signed cookie) in `lib/server/auth.ts`.
- Data in `data/urpn-db.json` through `lib/server/db.ts` (atomic writes, single-process queue).
- Course videos/audio in `media/`, streamed through `/api/portal/stream/[lessonId]` with enrollment checks and Range support.
- Testimony recordings already use Google Drive + Google Sheets + Deepgram.
- PWA shell and offline page.

This is excellent for a pilot, but:
- `data/` is ephemeral on Vercel/serverless and has no managed backups.
- Custom auth means password reset, email verification, MFA, and session revocation are manual.
- Video served through a Next.js function does not scale like a CDN and is tied to the app server’s bandwidth.

---

## Recommendation at a glance

| Layer | Recommendation | Why |
| --- | --- | --- |
| Database | **Supabase Postgres (Pro)** | Relational data fits the domain; managed backups; connection pooling; $25/mo |
| Auth | **Supabase Auth** via `@supabase/ssr` | Cookie/PKCE sessions, password reset, email verification, MFA, admin APIs |
| Authorization | **Postgres RLS** + server-side writes for attempts/certificates | Users can read their own data; grading cannot be forged from the browser |
| Small files | **Supabase Storage** | Posters, audio lessons, certificate PDFs; private buckets + signed URLs |
| Video | **Mux** (recommended) / **Cloudflare Stream** (alternative) / **Bunny Stream** (budget) | HLS/ABR, global delivery, signed playback, analytics, no server proxying |
| Upload source | **Google Drive** → sync job → Mux/Stream | Keeps the team’s existing Drive workflow without exposing Drive to workers |
| Notifications | **Telegram Bot** (announcements/reminders) | Good delivery channel, wrong media store |
| Hosting | **Vercel `fra1`** or a VPS | Closest practical region to Nigeria; pair with Supabase EU |

---

## Database research

### Supabase

Facts from Supabase’s current pricing and docs:

- **Free:** 500 MB database, 1 GB file storage, 5 GB egress (5 GB cached + 5 GB uncached), 50,000 MAU. Free projects are **paused after one week of inactivity**. [Pricing](https://supabase.com/pricing)
- **Pro ($25/mo):** 8 GB database disk, 100 GB file storage, 250 GB egress, 100,000 MAU, daily backups retained 7 days, email support. Egress overage is $0.09/GB; storage overage is $0.0213/GB. [Pricing](https://supabase.com/pricing)
- **Auth:** built-in email/password, magic links, OTP, OAuth, MFA, and admin user management. For Next.js SSR, use the PKCE flow with cookies via `@supabase/ssr`. [SSR guide](https://supabase.com/docs/guides/auth/server-side/advanced-guide)
- **RLS:** policies run inside Postgres, which is the right place to enforce “workers can only see their own progress.” [RLS docs](https://supabase.com/docs/guides/database/postgres/row-level-security)
- **Storage:** free file size limit is 50 MB; Pro allows up to 500 GB per file. [Limits](https://supabase.com/docs/guides/storage/uploads/file-limits) Egress counts against the plan’s bandwidth. [Bandwidth](https://supabase.com/docs/guides/storage/serving/bandwidth)
- **Regions:** Supabase has **no African region** as of November 2026. The closest practical choices for Nigeria are EU regions (Ireland, London, Paris, Frankfurt, Zurich, Stockholm) and Mumbai. [Regions](https://supabase.com/docs/guides/platform/regions) Choose **Frankfurt** or **Ireland** and pair it with a Vercel `fra1` or `cdg1` function region.

**Verdict:** Supabase is the best fit for this app because it bundles the three things the portal needs — Postgres, Auth, and RLS — without assembling three vendors. The 25-lesson catalogue produces very little relational data (tens of thousands of progress rows even at 1,000 workers), so the database cost is dominated by the flat Pro plan, not usage.

### Alternatives

| Option | Strengths | Weaknesses for URPN |
| --- | --- | --- |
| **Neon** | Excellent serverless Postgres, branching, usage-based; now also offers managed Better Auth/object storage | More assembly required; auth/storage policies are not as integrated as Supabase |
| **Firebase** | Mature auth, realtime, client SDKs | NoSQL model is a poor fit for relational enrollments, attempts, certificates; vendor lock-in |
| **MongoDB Atlas** | Flexible documents | Same relational mismatch; auth/storage still separate |
| **PocketBase** | Single binary, SQLite, auth + storage + admin UI, very cheap | Single-node; you own backups, upgrades, and multi-instance scaling |
| **Self-hosted Postgres / Supabase** | Lowest marginal cost, data control | You become the DBA; backups, upgrades, monitoring, and incident response are on you |
| **Current JSON store** | Zero setup | Not durable on serverless, no concurrent multi-instance safety, no backups, no real auth lifecycle |

**Decision:** Supabase Pro. If data residency or per-MAU cost becomes a binding constraint later, the repository layer can be moved to Neon or self-hosted Postgres without changing the UI.

### Password migration caveat

Supabase Auth uses bcrypt internally; the current app uses scrypt. Hashes cannot be imported directly. At the current scale, the clean path is to **invite workers / force a password reset** after the cutover. The demo account can be recreated through the Supabase Admin API. If there are already hundreds of active accounts, plan a “verify old password once, then create the Supabase user” migration instead.

---

## Media research

### Google Drive as playback

Google Drive is a file API, not a streaming/CDN product. It is technically possible to proxy a Drive file through a server with Range requests, but that is the wrong architecture:

- Every byte passes through your Next.js function; this does not scale and adds latency.
- Drive enforces API quotas and per-file download limits; heavily shared files can be throttled. [Drive API usage limits](https://developers.google.com/workspace/drive/api/guides/limits)
- No HLS/DASH packaging, no adaptive bitrate, no per-viewer signed playback tokens, no video analytics.
- Sharing a Drive file means anyone with the link/permission can download it; preventing downloads is not possible in any meaningful way.
- The existing OAuth refresh token grants broad Drive access; using it for public playback expands the blast radius of a leaked token.
- The Drive API Terms and download behavior are designed around file operations, not media delivery. [Drive API Terms](https://developers.google.com/workspace/drive/api/terms) · [Download docs](https://developers.google.com/workspace/drive/api/guides/manage-downloads)

**Use Drive for:** the team’s upload/archive folder, the existing testimony storage, and a one-off/scheduled ingestion job into the video platform.  
**Do not use Drive for:** the lesson player.

### Telegram as playback

Telegram’s own Bot API FAQ is decisive:

- `getFile` works only for files **up to 20 MB**; bots can upload files up to **50 MB**. [Bots FAQ — Handling Media](https://core.telegram.org/bots/faq#handling-media)
- A **local Bot API server** removes the download limit and allows 2 GB uploads, but you must host and operate it; it still is not a CDN, does not do HLS/ABR, has no per-viewer signed URLs, and exposes files through the bot. [Local Bot API server](https://core.telegram.org/bots/api#using-a-local-bot-api-server)
- Telegram is a messaging platform, not an access-controlled course-delivery system. There is no sensible way to prevent downloads or track lesson video progress.

**Use Telegram for:** class reminders, announcements, “new lesson available” messages, maybe certificate notifications.  
**Do not use Telegram for:** course video or audio storage.

### Video provider comparison

Assumptions for the cost column: 25 lessons × 30 min = **750 stored minutes**; 100 workers × 2 hours/month = **12,000 delivered minutes/month**.

| Option | Streaming | Security | Ops | Approx. monthly cost |
| --- | --- | --- | --- | --- |
| **Mux** | HLS/ABR, player, analytics, webhooks | Signed playback IDs/JWT, domain/referrer restrictions; DRM add-on available | Lowest — managed API | Storage 750 × $0.0024 ≈ **$1.80**; first 100k delivery min free; PAYG has a $20 monthly usage credit. **~$0–2** (plus Supabase) |
| **Cloudflare Stream** | HLS/DASH, built-in player, global CDN | Signed URLs/tokens, allowed origins, hotlink protection | Low | 750 min rounds to 1,000 stored = **$5/mo**; 12,000 delivered min = **$12/mo** → **~$17** |
| **Bunny Stream** | HLS/ABR, player, token auth | Token authentication, hotlink protection, media cage/DRM options | Low–medium | Storage from $0.01/GB, delivery from $0.005/GB, $1 minimum → **~$1–5** at this size |
| **Cloudflare R2 + HLS** | You generate HLS renditions and host manifests/segments | Signed URLs/Worker auth; you build it | High — encoding, packaging, token logic, player | Storage $0.015/GB-mo, **zero egress**, 10 GB free → **~$0.20–1** + engineering |
| **Supabase Storage** | Byte-range file delivery; **no transcoding/ABR** | Signed URLs + RLS | Low | Included 100 GB on Pro, then $0.0213/GB; egress 250 GB then $0.09/GB; not a video CDN |
| **Google Drive** | No HLS/ABR; proxy/quotas | Weak for paid/private media | Medium/high | No meaningful CDN cost, but poor UX/risk |
| **Telegram** | Not a streaming platform | Weak; bot token/file exposure | — | Not applicable |

Pricing sources: [Mux pricing](https://www.mux.com/pricing) · [Cloudflare Stream pricing](https://developers.cloudflare.com/stream/pricing/) · [Bunny Stream pricing](https://bunny.net/pricing/stream/) · [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/) · [Supabase storage pricing](https://supabase.com/docs/guides/storage/pricing).

### Recommendation

- **Primary: Mux.** At 750 stored minutes and under 100k delivered minutes, the monthly cost is close to zero beyond the $20 credit; signed playback and the player are included; analytics and webhooks are strong. It is the least operational work.
- **Choose Cloudflare Stream instead if** you want a single Cloudflare account, minute-based predictable billing, and generous global CDN reach; it costs more at this scale (~$17/mo) but is extremely simple.
- **Choose Bunny Stream instead if** the lowest possible bill matters more than developer experience; it is very cheap for small libraries.
- **Do not build R2 + HLS first.** It is the cheapest raw storage and has free egress, but you would be building transcoding, packaging, token auth, and a player. Revisit only at high volume or if you need full control.

**Security reality check:** no provider can prevent a determined viewer from screen-recording. Signed playback URLs, short expiries, domain restrictions, and a visible worker-email watermark are the practical controls. DRM (Mux DRM, Bunny MediaCage) is available but adds cost and complexity; likely unnecessary for URPN course content.

---

## Recommended architecture

```
Browser / installed PWA
│
├── Supabase Auth cookie (PKCE via @supabase/ssr)
├── Next.js app (Vercel fra1)
│     ├── Supabase Postgres (EU)  ← profiles, enrollments, progress, attempts, certificates
│     ├── Supabase Storage        ← posters (public), audio (private), certificate PDFs
│     ├── Mux API                 ← create signed playback tokens; upload
│     └── Next.js API routes      ← enrollment check, progress, grading, certificates
│
├── Mux CDN (HLS video)           ← signed playback, ABR, analytics
├── Google Drive                  ← upload/archive source; sync job → Mux
└── Telegram Bot                  ← announcements/reminders only
```

### Access flow for a video lesson

1. Worker opens a lesson; Next.js verifies the Supabase session and `enrollments` row.
2. Server calls Mux with the lesson’s `playback_id` and creates a **short-lived signed playback token** (e.g. 60 minutes), ideally tied to the worker ID in the JWT.
3. Client renders Mux Player/`<video>` with the HLS URL + token. No public MP4 URL is exposed.
4. The player reports progress to the app API every 10–15 seconds; the server writes `lesson_progress` using the service role.
5. Completion at 90% unlocks the exam exactly as today; attempts and certificates are written only by server-side code.
6. Audio lessons use a **private Supabase Storage bucket** with a short-lived signed URL (or stay on the current stream route until migration).

### Why not proxy Mux through the app?

It would add bandwidth cost, latency, and a single point of failure. Mux/Stream already terminate delivery at the CDN edge; only the signed token crosses your server.

---

## Proposed Postgres schema

The full migration is in [`../supabase/migrations/0001_initial.sql`](../supabase/migrations/0001_initial.sql).

Core tables:

- `profiles` — 1:1 with `auth.users`, `role` (`worker`/`admin`), `full_name`.
- `enrollments` — `(user_id, course_id)`; course IDs are slugs for now.
- `lesson_progress` — `(user_id, course_id, lesson_id)`, position, completed_at.
- `exam_attempts` — one per user/course, question IDs, answers, deadline, score, reason.
- `certificates` — unique code, user, course, attempt, score, issued_at.
- `lesson_media` — maps code-managed lesson IDs to provider (`mux`/`cloudflare_stream`/`supabase`), playback/asset ID, duration, poster.

Course/module/lesson **content** can stay in `lib/courses.ts` for version control. Only dynamic media IDs and user data need the database. If the church wants non-developers to edit courses later, add `courses`/`modules`/`lessons` tables and an admin UI.

### Security model

- RLS: users can `select` their own profile, enrollments, progress, attempts, and certificates; admins can read all.
- Browser clients **cannot** insert/update `exam_attempts` or `certificates`. Those writes use the service-role key on the server only.
- `lesson_progress` writes should also go through the server API so completion thresholds cannot be forged. RLS can allow read-only for users.
- `lesson_media` is readable by authenticated users; only service role/admin writes.
- `profiles` allows users to update `full_name` only; `role` is not grantable to `authenticated`.
- Storage policies: `posters` are public read; `audio` and `certificates` are private buckets served through server-generated, short-lived signed URLs (no broad client read policy).

---

## Google Drive ingestion design (optional but useful)

If the team’s habit is “upload the video to Drive”:

1. Create a dedicated **course uploads** folder or Shared Drive.
2. A scheduled job (Vercel Cron / GitHub Action / small worker) lists new files in the folder.
3. For each new video:
   - download the file with the Drive API to a temporary location,
   - create a Mux direct upload / Cloudflare Stream upload,
   - upload, wait for the asset-ready webhook,
   - write a row in `lesson_media`,
   - optionally move the Drive file to an `archive/` folder.
4. Playback always happens from Mux/Stream, never from Drive.

For 25 existing lessons, a **one-off migration script** is simpler and safer than a permanent sync. Continuous sync can come later.

Telegram can be notified by the same job (“Lesson 7 is ready”), but should not store the video.

---

## Cost model (approximate)

At 25 lessons (750 minutes) and 100 workers watching 2 hours/month (12,000 delivered minutes):

| Item | Monthly |
| --- | --- |
| Supabase Pro | $25 |
| Mux (storage ~$1.80, delivery within 100k free, $20 credit) | ~$0–2 |
| **Total with Mux** | **~$25–27** |
| Cloudflare Stream alternative | ~$17 → **~$42 total** |
| Bunny Stream alternative | ~$1–5 → **~$26–30 total** |
| Custom domain + email/SMTP | variable; budget $0–20 |

At 500 workers watching 2 hours/month (60,000 minutes), Mux is still within 100k free delivery; Cloudflare Stream would be about $65/month. At 1,000 workers (120,000 minutes), Mux adds about $16; Bunny is cheapest; Cloudflare Stream is about $125/month.

These are planning estimates, not quotes; re-check provider pricing at signup.

---

## Migration plan

### Phase 1 — Supabase foundation (1–2 days)

1. Create a Supabase project in **eu-central-1 (Frankfurt)** or **eu-west-1 (Ireland)**; choose Pro for production.
2. Apply `supabase/migrations/0001_initial.sql`.
3. Enable email confirmation, password reset, and custom SMTP.
4. Create the first admin profile; seed the demo worker.
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only)
   - `MUX_TOKEN_ID` / `MUX_TOKEN_SECRET` (or Cloudflare equivalents)

### Phase 2 — Replace the JSON repository (1–2 days)

1. Add a Supabase repository implementing the same functions as `lib/server/db.ts`.
2. Import the current demo/JSON data.
3. Replace custom auth with Supabase Auth; update middleware and portal session checks.
4. Keep the same UI and API route contracts.
5. Run RLS tests: a worker cannot read another worker’s progress, attempts, or certificate.

**Password note:** plan invites/resets; scrypt hashes cannot be imported into Supabase Auth.

### Phase 3 — Video migration (2–3 days)

1. Upload the 25 videos to Mux (or Stream/Bunny).
2. Add `lesson_media` rows with playback IDs/durations.
3. Generate signed playback tokens in the lesson page/API.
4. Replace the video `<video>` source with Mux Player / HLS; keep progress reporting.
5. Keep the current `/api/portal/stream` route for audio and as a fallback.
6. Add a watermark overlay with the worker email (UI only).

### Phase 4 — Admin, ingestion, notifications (2–3 days)

1. Admin roster: workers, enrollments, progress, attempts, certificates.
2. Admin reset/reissue attempt (careful audit trail).
3. Drive upload sync or direct admin upload.
4. Telegram announcements/reminders.
5. Monitoring: provider webhooks, Supabase logs, uptime check.

**Total:** roughly 6–10 developer days, excluding content upload/encoding time.

---

## Risks and things to decide

- **Region:** no Supabase Africa region; EU adds ~80–150 ms database latency from Lagos. Video is unaffected because it comes from the CDN. Pair the Next.js server with Supabase in the EU.
- **Cost controls:** set provider spending limits/alerts; video egress is the only variable cost that can surprise you.
- **Lock-in:** store provider + asset ID in `lesson_media`; the app’s playback token endpoint is the seam that lets you swap providers.
- **Password migration:** force reset/invite; do not attempt to carry scrypt hashes.
- **Admin scope:** decide whether admins can reset exam attempts. If yes, log every reset with actor/reason.
- **Content editing:** decide whether courses stay in code (fast, versioned) or move to an admin-managed CMS. Start with code; media IDs in DB.
- **DRM:** decide if signed URLs + watermark are enough. For a church course, they usually are. DRM adds real cost.
- **Free tiers:** Supabase Free pauses; Mux Free allows only 10 videos; neither is appropriate for production onboarding.

---

## Sources

- Supabase pricing — https://supabase.com/pricing
- Supabase regions — https://supabase.com/docs/guides/platform/regions
- Supabase Auth SSR — https://supabase.com/docs/guides/auth/server-side/advanced-guide
- Supabase RLS — https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Storage limits — https://supabase.com/docs/guides/storage/uploads/file-limits
- Supabase Storage bandwidth — https://supabase.com/docs/guides/storage/serving/bandwidth
- Supabase Storage pricing — https://supabase.com/docs/guides/storage/pricing
- Neon pricing — https://neon.com/pricing
- Google Drive API usage limits — https://developers.google.com/workspace/drive/api/guides/limits
- Google Drive API Terms — https://developers.google.com/workspace/drive/api/terms
- Google Drive download docs — https://developers.google.com/workspace/drive/api/guides/manage-downloads
- Telegram Bots FAQ (20 MB getFile / 50 MB upload) — https://core.telegram.org/bots/faq#handling-media
- Telegram local Bot API server — https://core.telegram.org/bots/api#using-a-local-bot-api-server
- Mux pricing — https://www.mux.com/pricing
- Mux secure playback — https://www.mux.com/docs/guides/secure-video-playback
- Cloudflare Stream pricing — https://developers.cloudflare.com/stream/pricing/
- Cloudflare Stream signed URLs — https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/
- Cloudflare R2 pricing — https://developers.cloudflare.com/r2/pricing/
- Bunny Stream pricing — https://bunny.net/pricing/stream/

---

## What I need before implementing the migration

- A Supabase project (URL + anon key + service role key) and confirmation of the region.
- The chosen video provider (Mux recommended; Stream/Bunny alternatives) and API credentials.
- A decision on whether course content stays in code or moves to an admin CMS.
- A decision on invite-only registration vs open registration.
- Whether the existing Google Drive OAuth credentials can be reused for a one-off ingestion job.
