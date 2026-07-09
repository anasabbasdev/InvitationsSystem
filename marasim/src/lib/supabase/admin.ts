import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/env";

let adminClient: SupabaseClient | null = null;

/**
 * Service-role client for seed scripts and server-only writes.
 * Never import from client components.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!isSupabaseAdminConfigured()) {
    throw new Error(
      "Supabase admin is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  if (!adminClient) {
    adminClient = createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return adminClient;
}
