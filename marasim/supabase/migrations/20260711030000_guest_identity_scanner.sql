-- Guest identity (phone E.164 + short guest code) and per-event public scanner links.

-- ── Helper: generate 6-char guest code (no 0/O/1/I/L) ───────────────────────

create or replace function generate_guest_code() returns text as $$
declare
  chars text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  result text := '';
  i int;
begin
  for i in 1..6 loop
    result := result || substr(chars, 1 + floor(random() * length(chars))::int, 1);
  end loop;
  return result;
end;
$$ language plpgsql;

-- ── rsvps: guest_code + phone_e164 ──────────────────────────────────────────

alter table rsvps
  add column if not exists guest_code text,
  add column if not exists phone_e164 text;

create unique index if not exists idx_rsvps_event_guest_code
  on rsvps (event_id, guest_code)
  where guest_code is not null;

create unique index if not exists idx_rsvps_event_phone_e164
  on rsvps (event_id, phone_e164)
  where phone_e164 is not null;

-- Backfill guest codes for existing rows
do $$
declare
  r record;
  v_code text;
  v_attempts int;
begin
  for r in select id, event_id from rsvps where guest_code is null loop
    v_attempts := 0;
    loop
      v_code := generate_guest_code();
      begin
        update rsvps set guest_code = v_code where id = r.id and guest_code is null;
        exit;
      exception when unique_violation then
        v_attempts := v_attempts + 1;
        if v_attempts > 20 then
          raise exception 'Failed to backfill guest_code for rsvp %', r.id;
        end if;
      end;
    end loop;
  end loop;
end $$;

-- ── events: public scanner token ─────────────────────────────────────────────

alter table events
  add column if not exists scanner_public_token text;

update events
set scanner_public_token = lower(substring(replace(encode(gen_random_bytes(8), 'hex'), '-', '') from 1 for 12))
where scanner_public_token is null;

create unique index if not exists idx_events_scanner_public_token
  on events (scanner_public_token)
  where scanner_public_token is not null;

-- ── confirm_invite_link: assign guest_code + phone_e164 ─────────────────────

create or replace function confirm_invite_link(
  p_token text,
  p_name text,
  p_phone text,
  p_phone_e164 text,
  p_seats integer
) returns jsonb as $$
declare
  v_link invite_links%rowtype;
  v_event events%rowtype;
  v_rsvp_token text;
  v_ticket_token text;
  v_guest_code text;
  v_rsvp_id uuid;
  v_ticket_id uuid;
  v_attempts int := 0;
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

  loop
    v_guest_code := generate_guest_code();
    begin
      insert into rsvps (
        event_id, invitation_id, invite_link_id, name, phone, phone_e164, guest_code, side,
        requested_seats, approved_seats, status, rsvp_view_token
      ) values (
        v_link.event_id, v_link.invitation_id, v_link.id, p_name, p_phone, p_phone_e164, v_guest_code, v_link.side,
        p_seats, p_seats, 'confirmed', v_rsvp_token
      ) returning id into v_rsvp_id;
      exit;
    exception when unique_violation then
      v_attempts := v_attempts + 1;
      if v_attempts > 20 then
        return jsonb_build_object('ok', false, 'code', 'INTERNAL', 'message', 'Could not assign guest code');
      end if;
    end;
  end loop;

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
    'guestCode', v_guest_code,
    'ticketToken', v_ticket_token
  );
end;
$$ language plpgsql;
