import "server-only";

/**
 * @deprecated Phase 3A.1 — all persistence reads use getSupabaseAdmin() server-side.
 * Anon client is not used while RLS denies public access.
 */
export function getSupabaseServer(): never {
  throw new Error(
    "getSupabaseServer is deprecated. Use getSupabaseAdmin() in server-only code."
  );
}
