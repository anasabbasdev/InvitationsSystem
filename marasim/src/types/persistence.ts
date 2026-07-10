import type {
  DesignPreset,
  InvitationConfig,
  InvitationData,
  SequenceBlueprint,
} from "@/types/invitation";

export type DbRecordStatus = "active" | "archived";
export type DbInvitationStatus = "draft" | "published" | "archived";

export type DbSequenceBlueprintRow = {
  id: string;
  name: string;
  version: string;
  blueprint_json: SequenceBlueprint;
  status: DbRecordStatus;
  created_at: string;
  updated_at: string;
};

export type DbDesignPresetRow = {
  id: string;
  name: string;
  version: string;
  compatible_blueprint_id: string | null;
  preset_json: DesignPreset;
  status: DbRecordStatus;
  created_at: string;
  updated_at: string;
};

export type DbInvitationRow = {
  id: string;
  event_id: string | null;
  slug: string;
  blueprint_id: string;
  blueprint_version: string;
  preset_id: string;
  preset_version: string;
  invitation_data_json: InvitationData;
  status: DbInvitationStatus;
  published_snapshot_id: string | null;
  preview_token_hash: string | null;
  created_at: string;
  updated_at: string;
};

export type DbPublishedSnapshotRow = {
  id: string;
  invitation_id: string;
  resolved_config_json: InvitationConfig;
  blueprint_id: string;
  blueprint_version: string;
  preset_id: string;
  preset_version: string;
  snapshot_at: string;
};

export type DbEventRow = {
  id: string;
  title: string;
  slug: string;
  event_date: string | null;
  venue_name: string | null;
  venue_address: string | null;
  map_url: string | null;
  total_capacity: number | null;
  confirmed_seats: number;
  status: string;
  scanner_public_token: string | null;
  created_at: string;
};

export type DbEventSettingsRow = {
  id: string;
  event_id: string;
  rsvp_enabled: boolean;
  rsvp_mode: string;
  max_public_request: number;
  approval_required: boolean;
  cancellation_deadline_hours: number;
  created_at: string;
};

export type DbRsvpRow = {
  id: string;
  event_id: string;
  invitation_id: string | null;
  invite_link_id: string | null;
  name: string;
  phone: string | null;
  phone_e164: string | null;
  guest_code: string | null;
  side: string | null;
  guest_note: string | null;
  requested_seats: number;
  approved_seats: number | null;
  status: "pending" | "approved" | "rejected" | "confirmed";
  rsvp_view_token: string;
  created_at: string;
  updated_at: string;
};

export type DbTicketRow = {
  id: string;
  event_id: string;
  rsvp_id: string;
  token: string;
  max_entries: number;
  used_entries: number;
  status: "active" | "revoked" | "fully_used";
  created_at: string;
  updated_at: string;
};

export type DbCheckinRow = {
  id: string;
  ticket_id: string;
  event_id: string;
  entries_count: number;
  checked_by: string | null;
  created_at: string;
};

export type DbInviteLinkRow = {
  id: string;
  event_id: string;
  invitation_id: string | null;
  token: string;
  label: string | null;
  guest_name: string | null;
  side: string | null;
  max_seats: number;
  status: "active" | "disabled" | "expired" | "confirmed";
  expires_at: string | null;
  confirmed_seats: number | null;
  rsvp_id: string | null;
  ticket_id: string | null;
  created_at: string;
  updated_at: string;
};

export type DbEventOwnerRow = {
  id: string;
  event_id: string;
  user_id: string;
  role: "owner";
  created_at: string;
};

export type DbUserRoleRow = {
  user_id: string;
  role: "admin" | "owner";
  created_at: string;
};

export type CreateInviteLinkInput = {
  eventId: string;
  invitationId?: string | null;
  label?: string | null;
  guestName?: string | null;
  side?: string | null;
  maxSeats: number;
  expiresAt?: string | null;
};

export type DbEventNotificationRow = {
  id: string;
  event_id: string;
  type: string;
  title: string;
  message: string | null;
  payload: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
};

export type UpsertEventInput = {
  slug: string;
  title: string;
  eventDate?: string | null;
  venueName?: string | null;
  totalCapacity?: number | null;
  rsvpEnabled: boolean;
  rsvpMode: "none" | "public_request" | "controlled_link";
  maxPublicRequest: number;
  approvalRequired: boolean;
};

export type UpsertBlueprintInput = {
  name: string;
  version: string;
  blueprint: SequenceBlueprint;
  status?: DbRecordStatus;
};

export type UpsertPresetInput = {
  name: string;
  version: string;
  preset: DesignPreset;
  compatibleBlueprintId?: string | null;
  status?: DbRecordStatus;
};

export type UpsertInvitationInput = {
  slug: string;
  eventId?: string | null;
  blueprintId: string;
  blueprintVersion: string;
  presetId: string;
  presetVersion: string;
  data: InvitationData;
  status?: DbInvitationStatus;
  previewTokenHash?: string | null;
};
