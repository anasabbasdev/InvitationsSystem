import { createSupabaseAdminClient } from "@/lib/supabase/create-admin-client";
import type { SequenceBlueprint } from "@/types/invitation";
import type {
  DbSequenceBlueprintRow,
  UpsertBlueprintInput,
} from "@/types/persistence";

const TABLE = "sequence_blueprints";

export async function fetchBlueprintById(
  id: string
): Promise<DbSequenceBlueprintRow | null> {
  const { data, error } = await createSupabaseAdminClient()
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as DbSequenceBlueprintRow | null;
}

export async function fetchBlueprintByNameVersion(
  name: string,
  version: string
): Promise<DbSequenceBlueprintRow | null> {
  const { data, error } = await createSupabaseAdminClient()
    .from(TABLE)
    .select("*")
    .eq("name", name)
    .eq("version", version)
    .maybeSingle();

  if (error) throw error;
  return data as DbSequenceBlueprintRow | null;
}

export function parseBlueprintRow(row: DbSequenceBlueprintRow): SequenceBlueprint {
  return row.blueprint_json;
}

export type UpsertBlueprintResult = {
  row: DbSequenceBlueprintRow;
  action: "created" | "updated";
};

export async function upsertBlueprint(
  input: UpsertBlueprintInput
): Promise<UpsertBlueprintResult> {
  const admin = createSupabaseAdminClient();
  const existing = await fetchBlueprintByNameVersion(input.name, input.version);

  const payload = {
    name: input.name,
    version: input.version,
    blueprint_json: input.blueprint,
    status: input.status ?? "active",
  };

  const { data, error } = await admin
    .from(TABLE)
    .upsert(payload, { onConflict: "name,version" })
    .select("*")
    .single();

  if (error) throw error;
  return {
    row: data as DbSequenceBlueprintRow,
    action: existing ? "updated" : "created",
  };
}

export async function updateBlueprintJson(
  id: string,
  blueprint: SequenceBlueprint
): Promise<void> {
  const { error } = await createSupabaseAdminClient()
    .from(TABLE)
    .update({ blueprint_json: blueprint })
    .eq("id", id);

  if (error) throw error;
}
