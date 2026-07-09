-- Phase 4: Owner authentication + simple role model
-- Auth identity via Supabase Auth (auth.users). Authorization is enforced
-- server-side in application code (service role client) against these tables —
-- consistent with the existing "service role only, no anon RLS policies" pattern.

create table if not exists user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'owner')),
  created_at timestamptz not null default now()
);

create table if not exists event_owners (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role = 'owner'),
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create index if not exists idx_event_owners_user_id on event_owners (user_id);
create index if not exists idx_event_owners_event_id on event_owners (event_id);

alter table user_roles enable row level security;
alter table event_owners enable row level security;

-- No anon/authenticated policies — all reads/writes via server-side service role,
-- which bypasses RLS. Ownership/role checks happen in application code
-- (see lib/auth.ts: requireOwnerSession, isEventOwner, requireAdmin).
