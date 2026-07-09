-- Phase 4/5: RSVP approval, seat capacity safety, tickets, check-in.
-- Adds 'confirmed' status for Controlled Link RSVPs (Phase 6), tickets/checkins
-- tables, and atomic PostgreSQL functions so seat/entry counts can never be
-- corrupted by concurrent requests or client-side math.

-- ── rsvps: allow 'confirmed' status (Controlled Link) ───────────────────────

alter table rsvps drop constraint if exists rsvps_status_check;
alter table rsvps
  add constraint rsvps_status_check
  check (status in ('pending', 'approved', 'rejected', 'confirmed'));

-- ── events: DB-level capacity safety net (defense in depth) ─────────────────

alter table events drop constraint if exists events_confirmed_seats_non_negative;
alter table events
  add constraint events_confirmed_seats_non_negative check (confirmed_seats >= 0);

alter table events drop constraint if exists events_seats_within_capacity;
alter table events
  add constraint events_seats_within_capacity
  check (total_capacity is null or confirmed_seats <= total_capacity);

-- ── tickets ───────────────────────────────────────────────────────────────

create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  rsvp_id uuid not null references rsvps(id) on delete cascade,
  token text unique not null,
  max_entries integer not null check (max_entries > 0),
  used_entries integer not null default 0 check (used_entries >= 0),
  status text not null default 'active' check (status in ('active', 'revoked', 'fully_used')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tickets_used_within_max check (used_entries <= max_entries),
  constraint tickets_rsvp_id_unique unique (rsvp_id)
);

create index if not exists idx_tickets_event_id on tickets (event_id);
create index if not exists idx_tickets_token on tickets (token);

drop trigger if exists tickets_updated_at on tickets;
create trigger tickets_updated_at
  before update on tickets
  for each row execute function set_updated_at();

-- ── checkins (audit history) ────────────────────────────────────────────────

create table if not exists checkins (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  entries_count integer not null check (entries_count > 0),
  checked_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_checkins_ticket_id on checkins (ticket_id);
create index if not exists idx_checkins_event_id on checkins (event_id);

alter table tickets enable row level security;
alter table checkins enable row level security;

-- ── RPC: approve_rsvp ────────────────────────────────────────────────────────
-- Atomically approves (or edits an already-approved) RSVP. Only the seat
-- delta is applied to events.confirmed_seats — never the raw new value.
-- Creates/updates the group ticket. Row locks on rsvps + events serialize
-- concurrent approvals against the same event so capacity can never be exceeded.

create or replace function approve_rsvp(
  p_rsvp_id uuid,
  p_approved_seats integer
) returns jsonb as $$
declare
  v_rsvp rsvps%rowtype;
  v_event events%rowtype;
  v_old_approved integer;
  v_delta integer;
  v_ticket tickets%rowtype;
  v_ticket_token text;
begin
  if p_approved_seats <= 0 then
    return jsonb_build_object('ok', false, 'code', 'INVALID_SEATS', 'message', 'approvedSeats must be greater than 0');
  end if;

  select * into v_rsvp from rsvps where id = p_rsvp_id for update;
  if v_rsvp.id is null then
    return jsonb_build_object('ok', false, 'code', 'NOT_FOUND', 'message', 'RSVP not found');
  end if;

  if v_rsvp.status not in ('pending', 'approved', 'rejected') then
    return jsonb_build_object('ok', false, 'code', 'INVALID_STATUS', 'message', 'RSVP cannot be approved from its current status');
  end if;

  if p_approved_seats > v_rsvp.requested_seats then
    return jsonb_build_object('ok', false, 'code', 'EXCEEDS_REQUESTED', 'message', 'approvedSeats cannot exceed requestedSeats');
  end if;

  select * into v_event from events where id = v_rsvp.event_id for update;
  if v_event.id is null then
    return jsonb_build_object('ok', false, 'code', 'EVENT_NOT_FOUND', 'message', 'Event not found');
  end if;

  v_old_approved := case when v_rsvp.status = 'approved' then coalesce(v_rsvp.approved_seats, 0) else 0 end;
  v_delta := p_approved_seats - v_old_approved;

  if v_delta > 0 and v_event.total_capacity is not null
     and (v_event.confirmed_seats + v_delta) > v_event.total_capacity then
    return jsonb_build_object(
      'ok', false,
      'code', 'SEATS_EXCEEDED',
      'message', 'Not enough remaining seats',
      'remainingSeats', greatest(v_event.total_capacity - v_event.confirmed_seats, 0)
    );
  end if;

  update events set confirmed_seats = confirmed_seats + v_delta where id = v_event.id;

  update rsvps
    set status = 'approved', approved_seats = p_approved_seats, updated_at = now()
    where id = v_rsvp.id;

  select * into v_ticket from tickets where rsvp_id = v_rsvp.id for update;

  if v_ticket.id is null then
    v_ticket_token := replace(replace(encode(gen_random_bytes(24), 'base64'), '+', '-'), '/', '_');
    v_ticket_token := regexp_replace(v_ticket_token, '=+$', '');

    insert into tickets (event_id, rsvp_id, token, max_entries, used_entries, status)
    values (v_event.id, v_rsvp.id, v_ticket_token, p_approved_seats, 0, 'active')
    returning * into v_ticket;
  else
    if v_ticket.used_entries > p_approved_seats then
      return jsonb_build_object(
        'ok', false,
        'code', 'MAX_BELOW_USED',
        'message', 'Cannot set approved seats below already checked-in entries',
        'usedEntries', v_ticket.used_entries
      );
    end if;

    update tickets
      set max_entries = p_approved_seats,
          status = case
            when used_entries >= p_approved_seats then 'fully_used'
            else 'active'
          end
      where id = v_ticket.id
      returning * into v_ticket;
  end if;

  insert into event_notifications (event_id, type, title, message, payload)
  values (
    v_event.id,
    'rsvp_approved',
    'تمت الموافقة على طلب حضور',
    v_rsvp.name || ' — ' || p_approved_seats || ' مقعد',
    jsonb_build_object('rsvpId', v_rsvp.id, 'approvedSeats', p_approved_seats)
  );

  return jsonb_build_object(
    'ok', true,
    'rsvpId', v_rsvp.id,
    'status', 'approved',
    'approvedSeats', p_approved_seats,
    'ticketToken', v_ticket.token,
    'ticketStatus', v_ticket.status,
    'confirmedSeats', v_event.confirmed_seats + v_delta,
    'totalCapacity', v_event.total_capacity
  );
end;
$$ language plpgsql;

-- ── RPC: reject_rsvp ─────────────────────────────────────────────────────────
-- Frees any previously approved seats and revokes the ticket, without
-- deleting the RSVP record (audit trail preserved).

create or replace function reject_rsvp(p_rsvp_id uuid) returns jsonb as $$
declare
  v_rsvp rsvps%rowtype;
  v_event events%rowtype;
begin
  select * into v_rsvp from rsvps where id = p_rsvp_id for update;
  if v_rsvp.id is null then
    return jsonb_build_object('ok', false, 'code', 'NOT_FOUND', 'message', 'RSVP not found');
  end if;

  select * into v_event from events where id = v_rsvp.event_id for update;

  if v_rsvp.status = 'approved' then
    update events
      set confirmed_seats = greatest(confirmed_seats - coalesce(v_rsvp.approved_seats, 0), 0)
      where id = v_event.id;

    update tickets set status = 'revoked' where rsvp_id = v_rsvp.id;
  end if;

  update rsvps
    set status = 'rejected', approved_seats = null, updated_at = now()
    where id = v_rsvp.id;

  insert into event_notifications (event_id, type, title, message, payload)
  values (
    v_rsvp.event_id,
    'rsvp_rejected',
    'تم رفض طلب حضور',
    v_rsvp.name,
    jsonb_build_object('rsvpId', v_rsvp.id)
  );

  return jsonb_build_object('ok', true, 'rsvpId', v_rsvp.id, 'status', 'rejected');
end;
$$ language plpgsql;

-- ── RPC: check_in_ticket ─────────────────────────────────────────────────────
-- Atomic partial group check-in. Enforces: ticket belongs to scanner's event,
-- ticket is active, used_entries + entries_count <= max_entries.

create or replace function check_in_ticket(
  p_ticket_token text,
  p_scanner_event_id uuid,
  p_entries_count integer,
  p_checked_by uuid default null
) returns jsonb as $$
declare
  v_ticket tickets%rowtype;
begin
  select * into v_ticket from tickets where token = p_ticket_token for update;

  if v_ticket.id is null then
    return jsonb_build_object('ok', false, 'code', 'INVALID', 'message', 'Ticket not found');
  end if;

  if v_ticket.event_id <> p_scanner_event_id then
    return jsonb_build_object('ok', false, 'code', 'WRONG_EVENT', 'message', 'Ticket belongs to a different event');
  end if;

  if v_ticket.status = 'revoked' then
    return jsonb_build_object('ok', false, 'code', 'REVOKED', 'message', 'Ticket has been revoked');
  end if;

  if v_ticket.status = 'fully_used' or v_ticket.used_entries >= v_ticket.max_entries then
    return jsonb_build_object('ok', false, 'code', 'FULLY_USED', 'message', 'Ticket already fully used');
  end if;

  if p_entries_count is null or p_entries_count <= 0 then
    return jsonb_build_object('ok', false, 'code', 'INVALID', 'message', 'entries_count must be greater than 0');
  end if;

  if v_ticket.used_entries + p_entries_count > v_ticket.max_entries then
    return jsonb_build_object(
      'ok', false,
      'code', 'EXCEEDED',
      'message', 'Not enough remaining entries',
      'remainingEntries', v_ticket.max_entries - v_ticket.used_entries
    );
  end if;

  update tickets
    set used_entries = used_entries + p_entries_count,
        status = case
          when used_entries + p_entries_count >= max_entries then 'fully_used'
          else status
        end
    where id = v_ticket.id
    returning * into v_ticket;

  insert into checkins (ticket_id, event_id, entries_count, checked_by)
  values (v_ticket.id, v_ticket.event_id, p_entries_count, p_checked_by);

  return jsonb_build_object(
    'ok', true,
    'code', 'VALID',
    'ticketId', v_ticket.id,
    'maxEntries', v_ticket.max_entries,
    'usedEntries', v_ticket.used_entries,
    'remainingEntries', v_ticket.max_entries - v_ticket.used_entries,
    'status', v_ticket.status
  );
end;
$$ language plpgsql;
