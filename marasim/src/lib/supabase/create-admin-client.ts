import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  assertSupabaseAdminEnv,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

/** Shared factory — safe for Node scripts and server runtime. */
export function createSupabaseAdminClient(): SupabaseClient {
  assertSupabaseAdminEnv();
  return createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
