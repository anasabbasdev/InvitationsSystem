import { buildInvitationConfigV2 } from "@/lib/build-config";
import { getInvitationFromRegistry, isLocalRegistrySlug } from "@/lib/invitation-config";
import {
  canAccessDraftInvitation,
  resolveLocalRegistryOnly,
  shouldFallbackToLocalRegistry,
} from "@/lib/invitation-load-policy";
import { verifyPreviewToken } from "@/lib/preview-token";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  fetchBlueprintById,
  fetchInvitationBySlug,
  fetchPresetById,
  fetchSnapshotById,
  parseBlueprintRow,
  parsePresetRow,
  parseSnapshotConfig,
} from "@/lib/repositories";
import {
  formatZodIssues,
  parseDesignPreset,
  parseInvitationConfig,
  parseInvitationData,
  parseSequenceBlueprint,
} from "@/lib/validation/persistence-schemas";
import type { InvitationLoadResult } from "@/types/invitation-load";
import type { DbInvitationRow } from "@/types/persistence";

export type LoadInvitationOptions = {
  previewToken?: string | null;
};

function logServerDiagnostic(message: string, detail?: Record<string, unknown>) {
  if (process.env.NODE_ENV === "production") return;
  console.error(`[invitation-loader] ${message}`, detail ?? "");
}

function databaseError(
  errorCode: "DATABASE_ERROR" | "CONFIG_INVALID" | "MISSING_SNAPSHOT" | "MISSING_REFERENCES" | "DRAFT_PREVIEW_REQUIRED",
  message: string
): InvitationLoadResult {
  return { status: "database_error", errorCode, message };
}

/**
 * Resolve an invitation by slug with explicit result states.
 *
 * Precedence:
 * 1. Supabase configured + row exists → DB path (no silent local fallback)
 * 2. Supabase not configured OR slug not in DB → local registry if registered
 * 3. DB-only slug missing → not_found
 * 4. DB errors → database_error (never masked as not_found or local fallback)
 */
export async function loadInvitation(
  slug: string,
  options: LoadInvitationOptions = {}
): Promise<InvitationLoadResult> {
  const configured = isSupabaseConfigured();
  const localSlug = isLocalRegistrySlug(slug);

  if (!configured) {
    const local = getInvitationFromRegistry(slug);
    if (local) {
      return { status: "loaded", source: "local_registry", config: local };
    }
    return { status: "not_configured" };
  }

  let row: DbInvitationRow | null;
  try {
    row = await fetchInvitationBySlug(slug);
  } catch (error) {
    logServerDiagnostic("Supabase query failed", {
      slug,
      error: error instanceof Error ? error.message : "unknown",
    });
    return databaseError(
      "DATABASE_ERROR",
      "Unable to load invitation at this time."
    );
  }

  if (!row) {
    if (
      shouldFallbackToLocalRegistry({
        supabaseConfigured: true,
        slugInDatabase: false,
        slugInLocalRegistry: localSlug,
        databaseError: false,
      })
    ) {
      const local = getInvitationFromRegistry(slug);
      if (local) {
        return { status: "loaded", source: "local_registry", config: local };
      }
    }
    return { status: "not_found" };
  }

  return resolveDatabaseInvitation(row, options.previewToken ?? null);
}

async function resolveDatabaseInvitation(
  row: DbInvitationRow,
  previewToken: string | null
): Promise<InvitationLoadResult> {
  if (row.status === "archived") {
    return { status: "not_found" };
  }

  if (row.status === "published") {
    if (!row.published_snapshot_id) {
      logServerDiagnostic("Published invitation missing snapshot", { slug: row.slug });
      return databaseError(
        "MISSING_SNAPSHOT",
        "Published invitation is misconfigured."
      );
    }

    let snapshot;
    try {
      snapshot = await fetchSnapshotById(row.published_snapshot_id);
    } catch (error) {
      logServerDiagnostic("Snapshot fetch failed", {
        slug: row.slug,
        error: error instanceof Error ? error.message : "unknown",
      });
      return databaseError("DATABASE_ERROR", "Unable to load invitation at this time.");
    }

    if (!snapshot) {
      return databaseError("MISSING_SNAPSHOT", "Published invitation is misconfigured.");
    }

    const parsed = parseInvitationConfig(snapshot.resolved_config_json);
    if (!parsed.success) {
      logServerDiagnostic("Invalid snapshot JSON", {
        slug: row.slug,
        issues: formatZodIssues(parsed.error),
      });
      return databaseError("CONFIG_INVALID", "Invitation configuration is invalid.");
    }

    return {
      status: "loaded",
      source: "supabase_snapshot",
      config: parsed.data as import("@/types/invitation").InvitationConfig,
      snapshotId: snapshot.id,
    };
  }

  if (row.status === "draft") {
    if (
      !canAccessDraftInvitation({
        status: row.status,
        previewToken,
        storedPreviewHash: row.preview_token_hash,
      })
    ) {
      return databaseError(
        "DRAFT_PREVIEW_REQUIRED",
        "Draft invitation requires a valid preview token."
      );
    }

    return resolveDraftLiveMerge(row);
  }

  return { status: "not_found" };
}

async function resolveDraftLiveMerge(
  row: DbInvitationRow
): Promise<InvitationLoadResult> {
  let blueprintRow;
  let presetRow;
  try {
    [blueprintRow, presetRow] = await Promise.all([
      fetchBlueprintById(row.blueprint_id),
      fetchPresetById(row.preset_id),
    ]);
  } catch (error) {
    logServerDiagnostic("Blueprint/preset fetch failed", {
      slug: row.slug,
      error: error instanceof Error ? error.message : "unknown",
    });
    return databaseError("DATABASE_ERROR", "Unable to load invitation at this time.");
  }

  if (!blueprintRow || !presetRow) {
    logServerDiagnostic("Missing blueprint or preset reference", { slug: row.slug });
    return databaseError(
      "MISSING_REFERENCES",
      "Invitation references are incomplete."
    );
  }

  const blueprintParsed = parseSequenceBlueprint(blueprintRow.blueprint_json);
  const presetParsed = parseDesignPreset(presetRow.preset_json);
  const dataParsed = parseInvitationData(row.invitation_data_json);

  if (!blueprintParsed.success) {
    logServerDiagnostic("Invalid blueprint JSON", {
      slug: row.slug,
      issues: formatZodIssues(blueprintParsed.error),
    });
    return databaseError("CONFIG_INVALID", "Invitation configuration is invalid.");
  }
  if (!presetParsed.success) {
    logServerDiagnostic("Invalid preset JSON", {
      slug: row.slug,
      issues: formatZodIssues(presetParsed.error),
    });
    return databaseError("CONFIG_INVALID", "Invitation configuration is invalid.");
  }
  if (!dataParsed.success) {
    logServerDiagnostic("Invalid invitation data JSON", {
      slug: row.slug,
      issues: formatZodIssues(dataParsed.error),
    });
    return databaseError("CONFIG_INVALID", "Invitation configuration is invalid.");
  }

  const config = buildInvitationConfigV2(
    blueprintParsed.data as import("@/types/invitation").SequenceBlueprint,
    presetParsed.data as import("@/types/invitation").DesignPreset,
    dataParsed.data as import("@/types/invitation").InvitationData
  );

  return {
    status: "loaded",
    source: "supabase_draft",
    config,
  };
}

/** @deprecated Use loadInvitation — kept for gradual migration */
export async function loadInvitationBySlug(
  slug: string,
  previewToken?: string | null
) {
  const result = await loadInvitation(slug, { previewToken });
  if (result.status === "loaded") return result.config;
  return null;
}

export function isDraftPreviewRequired(result: InvitationLoadResult): boolean {
  return (
    result.status === "database_error" &&
    result.errorCode === "DRAFT_PREVIEW_REQUIRED"
  );
}

export function isPreviewTokenValid(
  previewToken: string | null | undefined,
  storedHash: string | null | undefined
): boolean {
  return verifyPreviewToken(previewToken, storedHash);
}

export { resolveLocalRegistryOnly, shouldFallbackToLocalRegistry };
