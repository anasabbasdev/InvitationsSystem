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

export function formatRsvpZodIssues(error: z.ZodError): string {
  return error.issues.map((i) => i.message).join("; ");
}
