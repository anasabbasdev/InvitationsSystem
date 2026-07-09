import { getSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { DesignPreset } from "@/types/invitation";
import type { DbDesignPresetRow, UpsertPresetInput } from "@/types/persistence";

const TABLE = "design_presets";

export async function fetchPresetById(
  id: string
): Promise<DbDesignPresetRow | null> {
  const { data, error } = await getSupabaseServer()
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
  const { data, error } = await getSupabaseServer()
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

export async function upsertPreset(
  input: UpsertPresetInput
): Promise<DbDesignPresetRow> {
  const admin = getSupabaseAdmin();
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
  return data as DbDesignPresetRow;
}
