import { randomBytes } from "node:crypto";

/** Unambiguous charset — no 0/O, 1/I/L. */
const GUEST_CODE_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

const GUEST_CODE_REGEX = /^[23456789A-HJ-NP-Z]{6}$/;

export function generateGuestCode(): string {
  const bytes = randomBytes(6);
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += GUEST_CODE_CHARS[bytes[i]! % GUEST_CODE_CHARS.length];
  }
  return code;
}

export function normalizeGuestCodeInput(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

export function isGuestCodeFormat(value: string): boolean {
  return GUEST_CODE_REGEX.test(normalizeGuestCodeInput(value));
}

export function generateScannerPublicToken(): string {
  return randomBytes(6).toString("hex");
}
