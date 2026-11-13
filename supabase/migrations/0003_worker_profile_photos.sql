-- Private storage for worker profile portraits used on their certificates.
-- Access is handled by authenticated Next.js routes with the server secret;
-- no direct anon or authenticated bucket access is granted.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'worker-avatars',
  'worker-avatars',
  false,
  4194304,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
