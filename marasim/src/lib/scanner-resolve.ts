import { normalizePhoneToE164, looksLikePhoneInput } from "@/lib/phone";
import { isGuestCodeFormat, normalizeGuestCodeInput } from "@/lib/guest-code";
import { extractTicketToken } from "@/lib/ticket-token";
import {
  fetchRsvpByGuestCode,
  fetchRsvpByPhoneE164,
  fetchTicketTokenByRsvpId,
} from "@/lib/repositories";

/**
 * Resolve scanner / guest lookup input to an internal ticket token.
 * Accepts: guest code, E.164 phone, legacy /t/ URL, or raw ticket token.
 */
export async function resolveLookupToTicketToken(
  eventId: string,
  raw: string
): Promise<string | null> {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const guestCodeCandidate = normalizeGuestCodeInput(trimmed);
  if (isGuestCodeFormat(guestCodeCandidate)) {
    const rsvp = await fetchRsvpByGuestCode(eventId, guestCodeCandidate);
    if (rsvp) {
      const token = await fetchTicketTokenByRsvpId(rsvp.id);
      if (token) return token;
    }
  }

  if (looksLikePhoneInput(trimmed)) {
    try {
      const e164 = normalizePhoneToE164(trimmed);
      const rsvp = await fetchRsvpByPhoneE164(eventId, e164);
      if (rsvp) {
        const token = await fetchTicketTokenByRsvpId(rsvp.id);
        if (token) return token;
      }
    } catch {
      // not a valid phone — fall through to token extraction
    }
  }

  const extracted = extractTicketToken(trimmed);
  if (extracted) return extracted;

  return null;
}
