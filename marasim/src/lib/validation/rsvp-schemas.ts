import { z } from "zod";

export const publicRsvpBodySchema = z.object({
  slug: z.string().min(1).max(120),
  name: z.string().trim().min(2, "Name is too short").max(120),
  requestedSeats: z.coerce.number().int().min(1).max(20),
  guestNote: z.string().trim().max(500).optional(),
  phone: z.string().trim().max(30).optional(),
});

export type ParsedPublicRsvpBody = z.infer<typeof publicRsvpBodySchema>;

export function parsePublicRsvpBody(input: unknown): ParsedPublicRsvpBody {
  return publicRsvpBodySchema.parse(input);
}

export const controlledRsvpBodySchema = z.object({
  slug: z.string().min(1).max(120),
  inviteToken: z.string().min(16).max(200),
  name: z.string().trim().min(2, "Name is too short").max(120),
  seats: z.coerce.number().int().min(1).max(50),
  phone: z.string().trim().max(30).optional(),
});

export type ParsedControlledRsvpBody = z.infer<typeof controlledRsvpBodySchema>;

export function parseControlledRsvpBody(input: unknown): ParsedControlledRsvpBody {
  return controlledRsvpBodySchema.parse(input);
}

export const scannerLookupSchema = z.object({
  eventId: z.string().uuid(),
  token: z.string().min(8).max(200),
});

export const scannerCheckinSchema = z.object({
  eventId: z.string().uuid(),
  token: z.string().min(8).max(200),
  entries: z.coerce.number().int().min(1).max(50),
});

export function formatRsvpZodIssues(error: z.ZodError): string {
  return error.issues.map((i) => i.message).join("; ");
}
