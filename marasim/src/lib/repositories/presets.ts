import { createSupabaseAdminClient } from "@/lib/supabase/create-admin-client";
import type { DesignPreset } from "@/types/invitation";
import type { DbDesignPresetRow, UpsertPresetInput } from "@/types/persistence";

const TABLE = "design_presets";

export async function fetchPresetById(
  id: string
): Promise<DbDesignPresetRow | null> {
  const { data, error } = await createSupabaseAdminClient()
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as DbDesignPresetRow | null;
}

export async function fetchPresetByNameVersion(
  name: string,
  version: string
): Promise<DbDesignPresetRow | null> {
  const { data, error } = await createSupabaseAdminClient()
    .from(TABLE)
    .select("*")
    .eq("name", name)
    .eq("version", version)
    .maybeSingle();

  if (error) throw error;
  return data as DbDesignPresetRow | null;
}

export function parsePresetRow(row: DbDesignPresetRow): DesignPreset {
  return row.preset_json;
}

export type UpsertPresetResult = {
  row: DbDesignPresetRow;
  action: "created" | "updated";
};

export async function upsertPreset(
  input: UpsertPresetInput
): Promise<UpsertPresetResult> {
  const admin = createSupabaseAdminClient();
  const existing = await fetchPresetByNameVersion(input.name, input.version);

  const payload = {
    name: input.name,
    version: input.version,
    preset_json: input.preset,
    compatible_blueprint_id: input.compatibleBlueprintId ?? null,
    status: input.status ?? "active",
  };

  const { data, error } = await admin
    .from(TABLE)
    .upsert(payload, { onConflict: "name,version" })
    .select("*")
    .single();

  if (error) throw error;
  return {
    row: data as DbDesignPresetRow,
    action: existing ? "updated" : "created",
  };
}

export async function updatePresetJson(
  id: string,
  preset: DesignPreset
): Promise<void> {
  const { error } = await createSupabaseAdminClient()
    .from(TABLE)
    .update({ preset_json: preset })
    .eq("id", id);

  if (error) throw error;
}
