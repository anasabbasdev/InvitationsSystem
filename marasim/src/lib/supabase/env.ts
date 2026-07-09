export type SupabaseEnvErrorCode =
  | "MISSING_URL"
  | "MISSING_ANON_KEY"
  | "MISSING_SERVICE_ROLE_KEY"
  | "INVALID_URL";

export class SupabaseEnvError extends Error {
  readonly code: SupabaseEnvErrorCode;

  constructor(code: SupabaseEnvErrorCode, message: string) {
    super(message);
    this.name = "SupabaseEnvError";
    this.code = code;
  }
}

export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
}

export function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
}

export function getSupabaseServiceRoleKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
}

function validateUrl(url: string): void {
  try {
    const parsed = new URL(url);
    if (!parsed.protocol.startsWith("http")) {
      throw new SupabaseEnvError(
        "INVALID_URL",
        "NEXT_PUBLIC_SUPABASE_URL must be an http(s) URL."
      );
    }
  } catch {
    throw new SupabaseEnvError(
      "INVALID_URL",
      "NEXT_PUBLIC_SUPABASE_URL is not a valid URL."
    );
  }
}

export function assertSupabasePublicEnv(): void {
  const url = getSupabaseUrl();
  const anon = getSupabaseAnonKey();
  if (!url) {
    throw new SupabaseEnvError(
      "MISSING_URL",
      "NEXT_PUBLIC_SUPABASE_URL is not set. Add it to .env.local"
    );
  }
  if (!anon) {
    throw new SupabaseEnvError(
      "MISSING_ANON_KEY",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Add it to .env.local"
    );
  }
  validateUrl(url);
}

export function assertSupabaseAdminEnv(): void {
  assertSupabasePublicEnv();
  if (!getSupabaseServiceRoleKey()) {
    throw new SupabaseEnvError(
      "MISSING_SERVICE_ROLE_KEY",
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local (server-only)."
    );
  }
}

export function isSupabaseConfigured(): boolean {
  try {
    assertSupabasePublicEnv();
    return true;
  } catch {
    return false;
  }
}

export function isSupabaseAdminConfigured(): boolean {
  try {
    assertSupabaseAdminEnv();
    return true;
  } catch {
    return false;
  }
}
