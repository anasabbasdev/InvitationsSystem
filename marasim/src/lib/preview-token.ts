import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

/** Generate a URL-safe preview token (store hash in DB, not plaintext). */
export function generatePreviewToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashPreviewToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function verifyPreviewToken(
  token: string | null | undefined,
  storedHash: string | null | undefined
): boolean {
  if (!token || !storedHash) return false;
  const candidate = hashPreviewToken(token);
  try {
    return timingSafeEqual(
      Buffer.from(candidate, "hex"),
      Buffer.from(storedHash, "hex")
    );
  } catch {
    return false;
  }
}
