-- Persistent backing store for the current JSON-shaped portal model.
-- The service role is the only identity that can read or write this state.

create table if not exists public.urpn_app_state (
  id          text primary key check (id = 'main'),
  revision    bigint not null default 0 check (revision >= 0),
  state       jsonb not null check (jsonb_typeof(state) = 'object'),
  updated_at  timestamptz not null default now()
);

alter table public.urpn_app_state enable row level security;
revoke all on public.urpn_app_state from anon, authenticated;
grant all on public.urpn_app_state to service_role;

create or replace function public.urpn_commit_state(
  p_state jsonb,
  p_expected_revision bigint
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.urpn_app_state
  set state = p_state,
      revision = revision + 1,
      updated_at = now()
  where id = 'main'
    and revision = p_expected_revision;

  return found;
end;
$$;

revoke all on function public.urpn_commit_state(jsonb, bigint) from public, anon, authenticated;
grant execute on function public.urpn_commit_state(jsonb, bigint) to service_role;
