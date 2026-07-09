/**
 * Pure helpers for ticket token parsing — safe to import from tests and client code.
 */

/** Normalize bare token, path, or full URL to the raw ticket token. */
export function extractTicketToken(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? "";
  } catch {
    const parts = trimmed.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? trimmed;
  }
}
