-- Phase 3B: Public Request RSVP + owner notifications

create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  invitation_id uuid references invitations(id) on delete set null,
  invite_link_id uuid,
  name text not null,
  phone text,
  side text,
  guest_note text,
  requested_seats integer not null check (requested_seats > 0),
  approved_seats integer check (approved_seats is null or approved_seats > 0),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rsvp_view_token text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists event_notifications (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  type text not null,
  title text not null,
  message text,
  payload jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_rsvps_event_id on rsvps (event_id);
create index if not exists idx_rsvps_view_token on rsvps (rsvp_view_token);
create index if not exists idx_rsvps_status on rsvps (status);
create index if not exists idx_event_notifications_event_id on event_notifications (event_id);
create index if not exists idx_event_notifications_unread on event_notifications (event_id) where read_at is null;

drop trigger if exists rsvps_updated_at on rsvps;
create trigger rsvps_updated_at
  before update on rsvps
  for each row execute function set_updated_at();

alter table rsvps enable row level security;
alter table event_notifications enable row level security;

-- No anon/authenticated policies — service role server-side only (Phase 3A.1 pattern)
