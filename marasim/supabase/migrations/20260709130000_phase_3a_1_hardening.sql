-- Phase 3A.1: Persistence hardening
-- Apply AFTER 20260709120000_phase_3a_persistence.sql

-- ── Draft preview token (hash only — never store plaintext) ─────────────────

alter table invitations
  add column if not exists preview_token_hash text;

-- ── Non-empty constraints ───────────────────────────────────────────────────

alter table invitations
  add constraint invitations_slug_not_empty check (length(trim(slug)) > 0);

alter table invitations
  add constraint invitations_blueprint_version_not_empty
  check (length(trim(blueprint_version)) > 0);

alter table invitations
  add constraint invitations_preset_version_not_empty
  check (length(trim(preset_version)) > 0);

alter table sequence_blueprints
  add constraint sequence_blueprints_name_not_empty check (length(trim(name)) > 0);

alter table sequence_blueprints
  add constraint sequence_blueprints_version_not_empty check (length(trim(version)) > 0);

alter table design_presets
  add constraint design_presets_name_not_empty check (length(trim(name)) > 0);

alter table design_presets
  add constraint design_presets_version_not_empty check (length(trim(version)) > 0);

-- ── Published invitations must reference a snapshot ─────────────────────────

alter table invitations
  add constraint invitations_published_requires_snapshot
  check (
    status <> 'published'
    or published_snapshot_id is not null
  );

-- ── Snapshots are immutable (no UPDATE/DELETE via app; DB trigger guard) ────

create or replace function prevent_snapshot_mutation()
returns trigger as $$
begin
  raise exception 'published_snapshots rows are immutable';
end;
$$ language plpgsql;

drop trigger if exists published_snapshots_no_update on published_snapshots;
create trigger published_snapshots_no_update
  before update on published_snapshots
  for each row execute function prevent_snapshot_mutation();

drop trigger if exists published_snapshots_no_delete on published_snapshots;
create trigger published_snapshots_no_delete
  before delete on published_snapshots
  for each row execute function prevent_snapshot_mutation();

-- ── RLS: deny anon/authenticated — server service role only ────────────────

drop policy if exists "anon_read_sequence_blueprints" on sequence_blueprints;
drop policy if exists "anon_read_design_presets" on design_presets;
drop policy if exists "anon_read_invitations" on invitations;
drop policy if exists "anon_read_published_snapshots" on published_snapshots;
drop policy if exists "anon_read_events" on events;
drop policy if exists "anon_read_event_settings" on event_settings;

-- RLS remains enabled with no permissive policies for anon/authenticated.
-- Service role bypasses RLS for server-side reads/writes.
