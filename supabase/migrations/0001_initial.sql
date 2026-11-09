-- ============================================================================
-- URPN portal — initial Supabase schema
--
-- Apply with the Supabase CLI:
--   supabase link --project-ref <project-ref>
--   supabase db push
--
-- Design notes:
--   * Course/module/lesson CONTENT stays in lib/courses.ts for version control.
--   * This schema stores dynamic learner data and provider media IDs.
--   * RLS protects reads. Exam attempts, certificates, and progress writes are
--     performed only by the server using the service-role key (never the browser).
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null default '',
  role        text not null default 'worker' check (role in ('worker', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'URPN worker/admin profile, one row per auth user.';

-- Admin check used by RLS policies. SECURITY DEFINER avoids recursive RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Create a profile automatically when a Supabase Auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'full_name', ''),
      split_part(coalesce(new.email, 'worker'), '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Generic updated_at trigger
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Enrollments
-- ---------------------------------------------------------------------------
create table if not exists public.enrollments (
  user_id      uuid not null references auth.users(id) on delete cascade,
  course_id    text not null,                -- e.g. 'foundation', 'ministers', 'pastors'
  enrolled_at  timestamptz not null default now(),
  primary key (user_id, course_id)
);

create index if not exists enrollments_course_idx on public.enrollments (course_id);

-- ---------------------------------------------------------------------------
-- Lesson progress
-- ---------------------------------------------------------------------------
create table if not exists public.lesson_progress (
  user_id           uuid not null references auth.users(id) on delete cascade,
  course_id         text not null,
  lesson_id         text not null,
  position_seconds  integer not null default 0 check (position_seconds >= 0),
  completed_at      timestamptz,
  updated_at        timestamptz not null default now(),
  primary key (user_id, course_id, lesson_id)
);

create index if not exists lesson_progress_course_idx
  on public.lesson_progress (course_id, lesson_id);

drop trigger if exists lesson_progress_touch_updated_at on public.lesson_progress;
create trigger lesson_progress_touch_updated_at
  before update on public.lesson_progress
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Exam attempts — exactly one per user/course
-- ---------------------------------------------------------------------------
create table if not exists public.exam_attempts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  course_id     text not null,
  question_ids  text[] not null default '{}',
  answers       jsonb,
  started_at    timestamptz not null default now(),
  expires_at    timestamptz not null,
  submitted_at  timestamptz,
  status        text not null default 'in_progress'
                check (status in ('in_progress', 'submitted', 'expired')),
  score         integer check (score between 0 and 100),
  passed        boolean,
  reason        text check (reason in ('submitted', 'tab_left', 'time_expired')),
  created_at    timestamptz not null default now()
);

create unique index if not exists exam_attempts_one_per_course
  on public.exam_attempts (user_id, course_id);

create index if not exists exam_attempts_course_idx
  on public.exam_attempts (course_id, status);

-- ---------------------------------------------------------------------------
-- Certificates
-- ---------------------------------------------------------------------------
create table if not exists public.certificates (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,           -- URPN-XXXX-XXXX
  user_id     uuid not null references auth.users(id) on delete cascade,
  course_id   text not null,
  attempt_id  uuid not null references public.exam_attempts(id),
  score       integer not null check (score between 0 and 100),
  issued_at   timestamptz not null default now(),
  unique (user_id, course_id)
);

create index if not exists certificates_user_idx
  on public.certificates (user_id, issued_at desc);

-- ---------------------------------------------------------------------------
-- Lesson media mapping (content stays code-managed)
-- ---------------------------------------------------------------------------
create table if not exists public.lesson_media (
  lesson_id         text primary key,
  provider          text not null check (provider in ('mux', 'cloudflare_stream', 'supabase', 'external')),
  asset_id          text,                     -- Mux asset ID / Stream UID / R2 key
  playback_id       text,                     -- signed-playback ID for Mux
  duration_seconds  integer not null default 0 check (duration_seconds >= 0),
  poster_path       text,
  updated_at        timestamptz not null default now()
);

drop trigger if exists lesson_media_touch_updated_at on public.lesson_media;
create trigger lesson_media_touch_updated_at
  before update on public.lesson_media
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles        enable row level security;
alter table public.enrollments     enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.exam_attempts   enable row level security;
alter table public.certificates    enable row level security;
alter table public.lesson_media    enable row level security;

-- Profiles: read own or admin; update only own full_name (role is not grantable).
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles for select to authenticated
  using (auth.uid() = id or public.is_admin());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Enrollments: read own or admin. Writes are service-role only.
drop policy if exists enrollments_select_own on public.enrollments;
create policy enrollments_select_own
  on public.enrollments for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

-- Progress: read own or admin. Writes are service-role only.
drop policy if exists lesson_progress_select_own on public.lesson_progress;
create policy lesson_progress_select_own
  on public.lesson_progress for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

-- Attempts: read own or admin. Writes are service-role only.
drop policy if exists exam_attempts_select_own on public.exam_attempts;
create policy exam_attempts_select_own
  on public.exam_attempts for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

-- Certificates: read own or admin. Writes are service-role only.
drop policy if exists certificates_select_own on public.certificates;
create policy certificates_select_own
  on public.certificates for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

-- Lesson media: any signed-in worker may read provider metadata.
drop policy if exists lesson_media_select_authenticated on public.lesson_media;
create policy lesson_media_select_authenticated
  on public.lesson_media for select to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Privileges
-- Supabase's default grants are broad; make read/write surfaces explicit.
-- ---------------------------------------------------------------------------
revoke all on public.profiles        from anon, authenticated;
revoke all on public.enrollments     from anon, authenticated;
revoke all on public.lesson_progress from anon, authenticated;
revoke all on public.exam_attempts   from anon, authenticated;
revoke all on public.certificates    from anon, authenticated;
revoke all on public.lesson_media    from anon, authenticated;

grant select on public.profiles        to authenticated;
grant select on public.enrollments     to authenticated;
grant select on public.lesson_progress to authenticated;
grant select on public.exam_attempts   to authenticated;
grant select on public.certificates    to authenticated;
grant select on public.lesson_media    to authenticated;

-- Workers may change their display name only. The trigger still sets updated_at.
grant update (full_name) on public.profiles to authenticated;

-- The server (service role) performs all dynamic writes.
grant all on public.profiles, public.enrollments, public.lesson_progress,
  public.exam_attempts, public.certificates, public.lesson_media
  to service_role;

-- ---------------------------------------------------------------------------
-- Storage buckets (run once after creating them in the dashboard, or here)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('course-posters', 'course-posters', true),
  ('course-audio', 'course-audio', false),
  ('certificates', 'certificates', false)
on conflict (id) do nothing;

-- Public read for posters
drop policy if exists course_posters_public_read on storage.objects;
create policy course_posters_public_read
  on storage.objects for select
  using (bucket_id = 'course-posters');

-- Audio and certificates are private. The server issues short-lived signed
-- URLs after checking enrollment/ownership, so no broad client read policy is
-- needed here. Uploads and signed-URL generation use the service role.
