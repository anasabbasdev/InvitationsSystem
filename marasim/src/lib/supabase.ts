/**
 * Supabase client — Phase 3
 *
 * To enable, install @supabase/supabase-js and set:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Then replace this stub with:
 *   import { createClient } from "@supabase/supabase-js";
 *   export const supabase = createClient(url, key);
 */

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
