-- Phase 3A: Supabase Persistence Foundation
-- Blueprint / Preset / Invitation / Published Snapshot tables

create extension if not exists "pgcrypto";

-- ── Operational (minimal for invitation FK) ─────────────────────────────────

create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  event_date timestamptz,
  venue_name text,
  venue_address text,
  map_url text,
  total_capacity integer,
  confirmed_seats integer not null default 0,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table event_settings (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  rsvp_enabled boolean not null default false,
  rsvp_mode text not null default 'none',
  max_public_request integer not null default 4,
  approval_required boolean not null default true,
  cancellation_deadline_hours integer not null default 24,
  created_at timestamptz not null default now(),
  unique (event_id)
);

-- ── Design & invitation persistence ─────────────────────────────────────────

create table sequence_blueprints (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  version text not null,
  blueprint_json jsonb not null,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, version)
);

create table design_presets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  version text not null,
  compatible_blueprint_id uuid references sequence_blueprints(id) on delete set null,
  preset_json jsonb not null,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, version)
);

create table invitations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete set null,
  slug text unique not null,
  blueprint_id uuid not null references sequence_blueprints(id),
  blueprint_version text not null,
  preset_id uuid not null references design_presets(id),
  preset_version text not null,
  invitation_data_json jsonb not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_snapshot_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table published_snapshots (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references invitations(id) on delete cascade,
  resolved_config_json jsonb not null,
  blueprint_id uuid not null,
  blueprint_version text not null,
  preset_id uuid not null,
  preset_version text not null,
  snapshot_at timestamptz not null default now()
);

alter table invitations
  add constraint fk_invitations_published_snapshot
  foreign key (published_snapshot_id) references published_snapshots(id) on delete set null;

-- ── Indexes ─────────────────────────────────────────────────────────────────

create index idx_invitations_slug on invitations (slug);
create index idx_invitations_status on invitations (status);
create index idx_published_snapshots_invitation_id on published_snapshots (invitation_id);
create index idx_sequence_blueprints_name on sequence_blueprints (name);
create index idx_design_presets_name on design_presets (name);

-- ── updated_at trigger ──────────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger sequence_blueprints_updated_at
  before update on sequence_blueprints
  for each row execute function set_updated_at();

create trigger design_presets_updated_at
  before update on design_presets
  for each row execute function set_updated_at();

create trigger invitations_updated_at
  before update on invitations
  for each row execute function set_updated_at();

-- ── RLS (permissive read for Phase 3A — tighten before production) ──────────

alter table sequence_blueprints enable row level security;
alter table design_presets enable row level security;
alter table invitations enable row level security;
alter table published_snapshots enable row level security;
alter table events enable row level security;
alter table event_settings enable row level security;

create policy "anon_read_sequence_blueprints"
  on sequence_blueprints for select to anon, authenticated using (true);

create policy "anon_read_design_presets"
  on design_presets for select to anon, authenticated using (true);

create policy "anon_read_invitations"
  on invitations for select to anon, authenticated using (true);

create policy "anon_read_published_snapshots"
  on published_snapshots for select to anon, authenticated using (true);

create policy "anon_read_events"
  on events for select to anon, authenticated using (true);

create policy "anon_read_event_settings"
  on event_settings for select to anon, authenticated using (true);

-- Service role bypasses RLS for seed/admin writes (Phase 3A seed script)
