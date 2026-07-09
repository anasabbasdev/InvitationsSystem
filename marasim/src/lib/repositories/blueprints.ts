import { getSupabaseServer } from "@/lib/supabase/server";
import type { SequenceBlueprint } from "@/types/invitation";
import type {
  DbSequenceBlueprintRow,
  UpsertBlueprintInput,
} from "@/types/persistence";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const TABLE = "sequence_blueprints";

export async function fetchBlueprintById(
  id: string
): Promise<DbSequenceBlueprintRow | null> {
  const { data, error } = await getSupabaseServer()
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
  const { data, error } = await getSupabaseServer()
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

export async function upsertBlueprint(
  input: UpsertBlueprintInput
): Promise<DbSequenceBlueprintRow> {
  const admin = getSupabaseAdmin();
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
  return data as DbSequenceBlueprintRow;
}
