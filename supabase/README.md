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

Then:

1. Enable **Email** auth in Supabase → Authentication → Providers.
2. Configure a custom SMTP provider for production email (confirmation/reset).
3. Create the first admin by registering a user, then setting `profiles.role = 'admin'`.
4. Add the environment variables from `../.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Seed course media rows after uploading videos to Mux/Stream/Bunny.

## Notes

- Course/module/lesson content remains in `lib/courses.ts` for now.
- Students read their own rows through RLS; all writes for attempts, certificates,
  and progress go through the server with the service-role key.
- The current JSON store remains as a local fallback until the repository swap is
  complete. Do not run both as sources of truth in production.
