import type { DbInvitationStatus } from "@/types/persistence";
import { verifyPreviewToken } from "@/lib/preview-token";

export type DraftAccessInput = {
  status: DbInvitationStatus;
  previewToken: string | null | undefined;
  storedPreviewHash: string | null | undefined;
  nodeEnv?: string;
};

/**
 * Draft invitations require a valid preview token on all environments.
 * Published/archived use separate public rules in the loader.
 */
export function canAccessDraftInvitation(input: DraftAccessInput): boolean {
  if (input.status !== "draft") return false;
  return verifyPreviewToken(input.previewToken, input.storedPreviewHash);
}

export function shouldFallbackToLocalRegistry(input: {
  supabaseConfigured: boolean;
  slugInDatabase: boolean;
  slugInLocalRegistry: boolean;
  databaseError: boolean;
}): boolean {
  if (!input.supabaseConfigured) {
    return input.slugInLocalRegistry;
  }
  if (input.databaseError) {
    return false;
  }
  if (input.slugInDatabase) {
    return false;
  }
  return input.slugInLocalRegistry;
}

export function resolveLocalRegistryOnly(input: {
  supabaseConfigured: boolean;
  slugInLocalRegistry: boolean;
}): "local_registry" | "not_configured" | "not_found" {
  if (!input.supabaseConfigured) {
    return input.slugInLocalRegistry ? "local_registry" : "not_found";
  }
  return "not_found";
}
