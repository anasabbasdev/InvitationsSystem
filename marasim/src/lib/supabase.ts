/**
 * Supabase clients — Phase 3A
 *
 * Env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   SUPABASE_SERVICE_ROLE_KEY  (seed / admin writes only)
 */

export {
  getSupabaseUrl,
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  isSupabaseConfigured,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/env";

export { getSupabaseServer } from "@/lib/supabase/server";
export { getSupabaseAdmin } from "@/lib/supabase/admin";
