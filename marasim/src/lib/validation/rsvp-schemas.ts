import { z } from "zod";
import { normalizePhoneToE164 } from "@/lib/phone";
import { isGuestCodeFormat, normalizeGuestCodeInput } from "@/lib/guest-code";

export const publicRsvpBodySchema = z.object({
  slug: z.string().min(1).max(120),
  name: z.string().trim().min(2, "Name is too short").max(120),
  requestedSeats: z.coerce.number().int().min(1).max(20),
  guestNote: z.string().trim().max(500).optional(),
  phone: z.string().trim().min(8, "Phone is required").max(30),
});

export type ParsedPublicRsvpBody = z.infer<typeof publicRsvpBodySchema>;

export function parsePublicRsvpBody(input: unknown): ParsedPublicRsvpBody & { phoneE164: string } {
  const body = publicRsvpBodySchema.parse(input);
  const phoneE164 = normalizePhoneToE164(body.phone);
  return { ...body, phoneE164 };
}

export const controlledRsvpBodySchema = z.object({
  slug: z.string().min(1).max(120),
  inviteToken: z.string().min(16).max(200),
  name: z.string().trim().min(2, "Name is too short").max(120),
  seats: z.coerce.number().int().min(1).max(50),
  phone: z.string().trim().min(8).max(30).optional(),
});

export type ParsedControlledRsvpBody = z.infer<typeof controlledRsvpBodySchema>;

export function parseControlledRsvpBody(
  input: unknown
): ParsedControlledRsvpBody & { phoneE164: string | null } {
  const body = controlledRsvpBodySchema.parse(input);
  const phoneE164 = body.phone ? normalizePhoneToE164(body.phone) : null;
  return { ...body, phoneE164 };
}

export const guestLookupSchema = z
  .object({
    slug: z.string().min(1).max(120),
    phone: z.string().trim().max(30).optional(),
    guestCode: z.string().trim().max(12).optional(),
  })
  .superRefine((data, ctx) => {
    const hasPhone = Boolean(data.phone?.trim());
    const hasCode = Boolean(data.guestCode?.trim());
    if (!hasPhone && !hasCode) {
      ctx.addIssue({
        code: "custom",
        message: "أدخل رقم الجوال أو رمز الدعوة",
        path: ["phone"],
      });
    }
    if (hasCode && !isGuestCodeFormat(normalizeGuestCodeInput(data.guestCode!))) {
      ctx.addIssue({
        code: "custom",
        message: "رمز الدعوة غير صالح",
        path: ["guestCode"],
      });
    }
  });

export type ParsedGuestLookup = z.infer<typeof guestLookupSchema>;

export const scannerLookupSchema = z.object({
  eventId: z.string().uuid(),
  lookup: z.string().min(1).max(200),
});

export const scannerCheckinSchema = z.object({
  eventId: z.string().uuid(),
  lookup: z.string().min(1).max(200),
  entries: z.coerce.number().int().min(1).max(50),
});

export const publicScannerLookupSchema = z.object({
  scannerToken: z.string().min(8).max(64),
  lookup: z.string().min(1).max(200),
});

export const publicScannerCheckinSchema = z.object({
  scannerToken: z.string().min(8).max(64),
  lookup: z.string().min(1).max(200),
  entries: z.coerce.number().int().min(1).max(50),
});

export function formatRsvpZodIssues(error: z.ZodError): string {
  return error.issues.map((i) => i.message).join("; ");
}
