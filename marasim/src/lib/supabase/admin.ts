import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/create-admin-client";

let adminClient: SupabaseClient | null = null;

/**
 * Service-role client — server-only reads and writes.
 * Never import from Client Components.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!adminClient) {
    adminClient = createSupabaseAdminClient();
  }
  return adminClient;
}

export function resetSupabaseAdminClient(): void {
  adminClient = null;
}
