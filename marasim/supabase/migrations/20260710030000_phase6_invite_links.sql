-- Phase 6: Controlled Link RSVP
-- Invite links let an owner hand a private, capped-seat link to a specific
-- guest/group. Confirmation is atomic and creates the RSVP + ticket directly
-- (no owner approval step), and can only happen once per link.

create table if not exists invite_links (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  invitation_id uuid references invitations(id) on delete set null,
  token text unique not null,
  label text,
  guest_name text,
  side text check (side is null or side in ('groom', 'bride', 'general', 'vip')),
  max_seats integer not null check (max_seats > 0),
  status text not null default 'active' check (status in ('active', 'disabled', 'expired', 'confirmed')),
  use_mode text not null default 'single' check (use_mode = 'single'),
  expires_at timestamptz,
  confirmed_seats integer check (confirmed_seats is null or confirmed_seats > 0),
  rsvp_id uuid references rsvps(id) on delete set null,
  ticket_id uuid references tickets(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_invite_links_event_id on invite_links (event_id);
create index if not exists idx_invite_links_token on invite_links (token);

drop trigger if exists invite_links_updated_at on invite_links;
create trigger invite_links_updated_at
  before update on invite_links
  for each row execute function set_updated_at();

alter table invite_links enable row level security;

-- ── RPC: confirm_invite_link ─────────────────────────────────────────────────
-- Atomically validates + confirms a controlled invite link:
--   - token must exist, be active, not expired
--   - seats must be > 0 and <= max_seats
--   - event capacity must not be exceeded
--   - creates rsvp (status=confirmed) + ticket in the same transaction
--   - marks the link 'confirmed' so it can never create a second ticket

create or replace function confirm_invite_link(
  p_token text,
  p_name text,
  p_phone text,
  p_seats integer
) returns jsonb as $$
declare
  v_link invite_links%rowtype;
  v_event events%rowtype;
  v_rsvp_token text;
  v_ticket_token text;
  v_rsvp_id uuid;
  v_ticket_id uuid;
begin
  select * into v_link from invite_links where token = p_token for update;

  if v_link.id is null then
    return jsonb_build_object('ok', false, 'code', 'INVALID', 'message', 'Invite link not found');
  end if;

  if v_link.status = 'confirmed' then
    return jsonb_build_object(
      'ok', false,
      'code', 'ALREADY_CONFIRMED',
      'message', 'This link has already been confirmed',
      'rsvpId', v_link.rsvp_id,
      'ticketId', v_link.ticket_id
    );
  end if;

  if v_link.status = 'disabled' then
    return jsonb_build_object('ok', false, 'code', 'DISABLED', 'message', 'This invite link has been disabled');
  end if;

  if v_link.expires_at is not null and v_link.expires_at < now() then
    update invite_links set status = 'expired' where id = v_link.id;
    return jsonb_build_object('ok', false, 'code', 'EXPIRED', 'message', 'This invite link has expired');
  end if;

  if v_link.status <> 'active' then
    return jsonb_build_object('ok', false, 'code', 'INVALID', 'message', 'Invite link is not active');
  end if;

  if p_seats is null or p_seats <= 0 or p_seats > v_link.max_seats then
    return jsonb_build_object(
      'ok', false,
      'code', 'SEATS_EXCEEDED',
      'message', 'Requested seats exceed the seats allowed for this link',
      'maxSeats', v_link.max_seats
    );
  end if;

  select * into v_event from events where id = v_link.event_id for update;
  if v_event.id is null then
    return jsonb_build_object('ok', false, 'code', 'EVENT_NOT_FOUND', 'message', 'Event not found');
  end if;

  if v_event.total_capacity is not null
     and (v_event.confirmed_seats + p_seats) > v_event.total_capacity then
    return jsonb_build_object(
      'ok', false,
      'code', 'EVENT_FULL',
      'message', 'Event has no remaining capacity',
      'remainingSeats', greatest(v_event.total_capacity - v_event.confirmed_seats, 0)
    );
  end if;

  v_rsvp_token := replace(replace(encode(gen_random_bytes(32), 'base64'), '+', '-'), '/', '_');
  v_rsvp_token := regexp_replace(v_rsvp_token, '=+$', '');

  insert into rsvps (
    event_id, invitation_id, invite_link_id, name, phone, side,
    requested_seats, approved_seats, status, rsvp_view_token
  ) values (
    v_link.event_id, v_link.invitation_id, v_link.id, p_name, p_phone, v_link.side,
    p_seats, p_seats, 'confirmed', v_rsvp_token
  ) returning id into v_rsvp_id;

  update events set confirmed_seats = confirmed_seats + p_seats where id = v_event.id;

  v_ticket_token := replace(replace(encode(gen_random_bytes(24), 'base64'), '+', '-'), '/', '_');
  v_ticket_token := regexp_replace(v_ticket_token, '=+$', '');

  insert into tickets (event_id, rsvp_id, token, max_entries, used_entries, status)
  values (v_link.event_id, v_rsvp_id, v_ticket_token, p_seats, 0, 'active')
  returning id into v_ticket_id;

  update invite_links
    set status = 'confirmed', confirmed_seats = p_seats, rsvp_id = v_rsvp_id, ticket_id = v_ticket_id
    where id = v_link.id;

  insert into event_notifications (event_id, type, title, message, payload)
  values (
    v_link.event_id,
    'controlled_rsvp_confirmed',
    'تأكيد حضور عبر رابط خاص',
    p_name || ' — ' || p_seats || ' مقعد',
    jsonb_build_object('rsvpId', v_rsvp_id, 'inviteLinkId', v_link.id)
  );

  return jsonb_build_object(
    'ok', true,
    'code', 'CONFIRMED',
    'rsvpId', v_rsvp_id,
    'rsvpViewToken', v_rsvp_token,
    'ticketToken', v_ticket_token
  );
end;
$$ language plpgsql;
