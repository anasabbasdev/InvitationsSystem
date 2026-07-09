import type { InvitationConfig } from "@/types/invitation";

export type InvitationLoadSource =
  | "supabase_snapshot"
  | "supabase_draft"
  | "local_registry";

export type InvitationLoadErrorCode =
  | "DATABASE_ERROR"
  | "CONFIG_INVALID"
  | "DRAFT_PREVIEW_REQUIRED"
  | "MISSING_SNAPSHOT"
  | "MISSING_REFERENCES";

export type InvitationLoadResult =
  | {
      status: "loaded";
      source: InvitationLoadSource;
      config: InvitationConfig;
      /** Present when source is supabase_snapshot — used for cache keys */
      snapshotId?: string;
    }
  | { status: "not_found" }
  | { status: "not_configured" }
  | {
      status: "database_error";
      errorCode: InvitationLoadErrorCode;
      message: string;
    };

export function isInvitationLoaded(
  result: InvitationLoadResult
): result is Extract<InvitationLoadResult, { status: "loaded" }> {
  return result.status === "loaded";
}
