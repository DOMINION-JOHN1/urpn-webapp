# Supabase setup

This folder contains the schema for the production migration described in
[`../docs/INFRASTRUCTURE.md`](../docs/INFRASTRUCTURE.md).

## Apply

```bash
# Install the Supabase CLI once
brew install supabase/tap/supabase

supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

Then set these hosting environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (server only; do not prefix with `NEXT_PUBLIC_`)
- `AUTH_SECRET` (stable, random, and at least 32 characters)

Migration `0002_serverless_portal_state.sql` creates the private state table
used by the current portal adapter. It keeps worker registration, progress,
attempts, and certificates persistent across serverless instances. The portal
still uses its own scrypt password hashes and session cookies; Supabase Auth,
SMTP, and the relational learner tables are for a later adapter migration.

## Notes

- Course/module/lesson content remains in `lib/courses.ts` for now.
- Students read their own rows through RLS; all writes for attempts, certificates,
  and progress go through the server with the service-role key.
- The current JSON store remains as a local fallback until the repository swap is
  complete. Do not run both as sources of truth in production.
