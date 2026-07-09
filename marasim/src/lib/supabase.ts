/**
 * Supabase clients — Phase 3A.1
 *
 * Next.js reads `.env.local` automatically (not `.dev.vars`).
 * Scripts (seed, tests) call `loadProjectEnv()` from `lib/env/load-dotenv.ts`.
 *
 * Env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   SUPABASE_SERVICE_ROLE_KEY  (server-only)
 */

export {
  getSupabaseUrl,
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  isSupabaseConfigured,
  isSupabaseAdminConfigured,
  assertSupabasePublicEnv,
  assertSupabaseAdminEnv,
  SupabaseEnvError,
} from "@/lib/supabase/env";

export { getSupabaseAdmin } from "@/lib/supabase/admin";
