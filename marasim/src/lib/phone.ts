/** Default country for invitations — United Arab Emirates. */
export const DEFAULT_PHONE_COUNTRY = "AE";

/** UAE mobile: 50, 52, 54, 55, 56, 58 + 7 digits */
const UAE_MOBILE = /^5[024568]\d{7}$/;

const DIAL_CODES = [
  { dial: "971", len: 12 }, // AE: +971 + 9 digits
  { dial: "966", len: 12 }, // SA
  { dial: "965", len: 11 }, // KW
  { dial: "974", len: 11 }, // QA
  { dial: "973", len: 11 }, // BH
  { dial: "968", len: 11 }, // OM
  { dial: "962", len: 12 }, // JO
  { dial: "20", len: 12 }, // EG
] as const;

export class PhoneValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PhoneValidationError";
  }
}

function digitsOnly(raw: string): string {
  return raw.replace(/\D/g, "");
}

function normalizeUaeNational(national: string): string {
  let d = national;
  if (d.startsWith("971")) d = d.slice(3);
  if (d.startsWith("0")) d = d.slice(1);
  if (!UAE_MOBILE.test(d)) {
    throw new PhoneValidationError(
      "رقم الجوال غير صالح. أدخل رقم إماراتي صحيح (مثال: 50 123 4567)"
    );
  }
  return `+971${d}`;
}

function normalizeInternationalDigits(digits: string): string {
  for (const { dial, len } of DIAL_CODES) {
    if (digits.startsWith(dial) && digits.length === len - 1) {
      return `+${digits}`;
    }
  }
  if (digits.length >= 10 && digits.length <= 15) {
    return `+${digits}`;
  }
  throw new PhoneValidationError("رقم الجوال غير صالح. أدخل الرقم مع رمز الدولة (+971)");
}

/**
 * Normalize user input to E.164.
 * Default country: UAE (+971).
 */
export function normalizePhoneToE164(
  raw: string,
  defaultCountry: string = DEFAULT_PHONE_COUNTRY
): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new PhoneValidationError("رقم الجوال مطلوب");
  }

  const digits = digitsOnly(trimmed);

  if (trimmed.startsWith("+") || digits.length > 10) {
    return normalizeInternationalDigits(digits);
  }

  if (defaultCountry === "AE") {
    return normalizeUaeNational(digits);
  }

  return normalizeInternationalDigits(digits);
}

/** Display format — spaced international style for UAE. */
export function formatPhoneForDisplay(e164: string): string {
  if (e164.startsWith("+971") && e164.length === 13) {
    const n = e164.slice(4);
    return `+971 ${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5)}`;
  }
  return e164;
}

export function looksLikePhoneInput(raw: string): boolean {
  return digitsOnly(raw).length >= 8;
}
