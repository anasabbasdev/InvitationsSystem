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
  created_at: string;
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
};
