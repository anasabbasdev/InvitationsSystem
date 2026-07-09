import { randomBytes } from "node:crypto";

/** Cryptographically strong URL-safe token for guest-facing links (RSVP status, etc.). */
export function generateSecureToken(): string {
  return randomBytes(32).toString("base64url");
}
