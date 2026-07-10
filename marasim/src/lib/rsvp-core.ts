/**
 * RSVP business logic — importable from Node scripts (seed, verify) and Next.js server.
 * Next.js routes should import via @/lib/rsvp (adds server-only guard).
 */

import {
  fetchEventById,
  fetchEventSettings,
  fetchInvitationBySlug,
  fetchInviteLinkByToken,
  fetchRsvpByViewToken,
  fetchRsvpByGuestCode,
  fetchRsvpByPhoneE164,
  createPublicRsvp,
  createEventNotification,
  approveRsvp as approveRsvpRepo,
  rejectRsvp as rejectRsvpRepo,
  confirmInviteLinkRpc,
  fetchTicketDisplayInfo,
  fetchTicketTokenByRsvpId,
} from "@/lib/repositories";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { parsePublicRsvpBody, guestLookupSchema } from "@/lib/validation/rsvp-schemas";
import { normalizePhoneToE164, PhoneValidationError } from "@/lib/phone";
import { normalizeGuestCodeInput } from "@/lib/guest-code";
import type {
  ControlledRSVPSubmission,
  GuestLookupResult,
  PublicRSVPResult,
  PublicRSVPSubmission,
  RSVPStatusView,
} from "@/types/rsvp";
import type { DbInviteLinkRow } from "@/types/persistence";

export type {
  PublicRSVPSubmission,
  PublicRSVPResult,
  RSVPStatusView,
  GuestLookupResult,
} from "@/types/rsvp";

export class RsvpError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number = 400
  ) {
    super(message);
    this.name = "RsvpError";
  }
}

const NOT_FOUND_MESSAGE = "لم يُعثر على طلب مطابق لهذه الدعوة";

async function buildStatusViewFromRsvp(rsvp: Awaited<ReturnType<typeof fetchRsvpByViewToken>> & object): Promise<GuestLookupResult> {
  const event = await fetchEventById(rsvp.eventId);

  let ticket: RSVPStatusView["ticket"] = null;
  if (rsvp.status === "approved" || rsvp.status === "confirmed") {
    const ticketInfo = await findTicketForRsvp(rsvp.id);
    if (ticketInfo) {
      ticket = {
        token: ticketInfo.ticket.token,
        maxEntries: ticketInfo.ticket.maxEntries,
        usedEntries: ticketInfo.ticket.usedEntries,
        remainingEntries: ticketInfo.ticket.remainingEntries,
        status: ticketInfo.ticket.status,
      };
    }
  }

  return {
    found: true,
    status: rsvp.status,
    name: rsvp.name,
    guestCode: rsvp.guestCode ?? undefined,
    requestedSeats: rsvp.requestedSeats,
    approvedSeats: rsvp.approvedSeats,
    eventTitle: event?.title,
    eventDate: event?.event_date,
    venueName: event?.venue_name,
    guestNote: rsvp.guestNote,
    ticket,
  };
}

export async function lookupGuestBySlug(
  slug: string,
  input: { phone?: string; guestCode?: string }
): Promise<GuestLookupResult> {
  if (!isSupabaseConfigured()) {
    return { found: false, message: "الخدمة غير متاحة حالياً" };
  }

  const parsed = guestLookupSchema.parse({ slug, ...input });

  const invitation = await fetchInvitationBySlug(parsed.slug);
  if (!invitation?.event_id) {
    return { found: false, message: NOT_FOUND_MESSAGE };
  }

  const eventId = invitation.event_id;
  let rsvp = null;

  if (parsed.guestCode?.trim()) {
    const code = normalizeGuestCodeInput(parsed.guestCode);
    rsvp = await fetchRsvpByGuestCode(eventId, code);
  } else if (parsed.phone?.trim()) {
    try {
      const e164 = normalizePhoneToE164(parsed.phone);
      rsvp = await fetchRsvpByPhoneE164(eventId, e164);
    } catch {
      return { found: false, message: NOT_FOUND_MESSAGE };
    }
  }

  if (!rsvp) {
    return { found: false, message: NOT_FOUND_MESSAGE };
  }

  return buildStatusViewFromRsvp(rsvp);
}

export async function submitPublicRSVP(
  input: PublicRSVPSubmission
): Promise<PublicRSVPResult> {
  if (!isSupabaseConfigured()) {
    throw new RsvpError("RSVP is not available", "NOT_CONFIGURED", 503);
  }

  let body: ReturnType<typeof parsePublicRsvpBody>;
  try {
    body = parsePublicRsvpBody(input);
  } catch (error) {
    if (error instanceof PhoneValidationError) {
      throw new RsvpError(error.message, "INVALID_PHONE", 400);
    }
    throw error;
  }

  const invitation = await fetchInvitationBySlug(body.slug);
  if (!invitation) {
    throw new RsvpError("Invitation not found", "NOT_FOUND", 404);
  }
  if (invitation.status !== "published") {
    throw new RsvpError(
      "RSVP is only available for published invitations",
      "NOT_PUBLISHED",
      403
    );
  }
  if (!invitation.event_id) {
    throw new RsvpError(
      "Event is not linked to this invitation",
      "NO_EVENT",
      400
    );
  }

  const settings = await fetchEventSettings(invitation.event_id);
  if (!settings?.rsvp_enabled || settings.rsvp_mode !== "public_request") {
    throw new RsvpError(
      "Public RSVP is not enabled for this event",
      "RSVP_DISABLED",
      400
    );
  }

  if (body.requestedSeats > settings.max_public_request) {
    throw new RsvpError(
      `Maximum ${settings.max_public_request} seats per request`,
      "SEATS_EXCEEDED",
      400
    );
  }

  let rsvp;
  try {
    rsvp = await createPublicRsvp({
      name: body.name,
      requestedSeats: body.requestedSeats,
      guestNote: body.guestNote,
      phone: body.phone,
      phoneE164: body.phoneE164,
      eventId: invitation.event_id,
      invitationId: invitation.id,
    });
  } catch (error) {
    if ((error as Error).name === "DuplicatePhoneError") {
      throw new RsvpError(
        "يوجد طلب حضور مسجّل مسبقاً بهذا الرقم لهذه المناسبة",
        "DUPLICATE_PHONE",
        409
      );
    }
    throw error;
  }

  await createEventNotification({
    eventId: invitation.event_id,
    type: "rsvp_pending",
    title: "طلب حضور جديد",
    message: `${rsvp.name} طلب ${rsvp.requestedSeats} مقعد/مقاعد`,
    payload: {
      rsvpId: rsvp.id,
      name: rsvp.name,
      requestedSeats: rsvp.requestedSeats,
      invitationSlug: body.slug,
      guestCode: rsvp.guestCode,
    },
  });

  return {
    rsvpViewToken: rsvp.rsvpViewToken,
    guestCode: rsvp.guestCode!,
    status: rsvp.status,
  };
}

export async function getRSVPStatusView(
  token: string
): Promise<RSVPStatusView | null> {
  if (!isSupabaseConfigured()) return null;

  const rsvp = await fetchRsvpByViewToken(token);
  if (!rsvp) return null;

  const result = await buildStatusViewFromRsvp(rsvp);
  if (!result.found) return null;

  return {
    status: result.status!,
    name: result.name!,
    guestCode: result.guestCode,
    requestedSeats: result.requestedSeats!,
    approvedSeats: result.approvedSeats,
    eventTitle: result.eventTitle,
    eventDate: result.eventDate,
    venueName: result.venueName,
    guestNote: result.guestNote,
    ticket: result.ticket,
  };
}

async function findTicketForRsvp(rsvpId: string) {
  const token = await fetchTicketTokenByRsvpId(rsvpId);
  if (!token) return null;
  return fetchTicketDisplayInfo(token);
}

export async function approveRSVP(rsvpId: string, approvedSeats: number) {
  return approveRsvpRepo(rsvpId, approvedSeats);
}

export async function rejectRSVP(rsvpId: string) {
  return rejectRsvpRepo(rsvpId);
}

export type InviteLinkValidation =
  | { valid: true; link: DbInviteLinkRow }
  | { valid: false; code: string; message: string };

export async function validateInviteLink(
  token: string,
  slug: string
): Promise<InviteLinkValidation> {
  const link = await fetchInviteLinkByToken(token);
  if (!link) {
    return { valid: false, code: "INVALID", message: "رابط الدعوة غير صالح" };
  }

  const invitation = await fetchInvitationBySlug(slug);
  if (!invitation || link.event_id !== invitation.event_id) {
    return { valid: false, code: "INVALID", message: "رابط الدعوة لا يخص هذه الدعوة" };
  }

  if (link.status === "confirmed") {
    return { valid: false, code: "ALREADY_CONFIRMED", message: "تم تأكيد هذا الرابط مسبقاً" };
  }
  if (link.status === "disabled") {
    return { valid: false, code: "DISABLED", message: "تم تعطيل هذا الرابط" };
  }
  if (link.status === "expired" || (link.expires_at && new Date(link.expires_at) < new Date())) {
    return { valid: false, code: "EXPIRED", message: "انتهت صلاحية هذا الرابط" };
  }

  return { valid: true, link };
}

export async function confirmControlledRSVP(
  input: ControlledRSVPSubmission
): Promise<{ rsvpViewToken: string; guestCode: string; ticketToken: string }> {
  if (!isSupabaseConfigured()) {
    throw new RsvpError("RSVP is not available", "NOT_CONFIGURED", 503);
  }

  const validation = await validateInviteLink(input.inviteToken, input.slug);
  if (!validation.valid) {
    throw new RsvpError(validation.message, validation.code, 400);
  }

  if (!input.name || input.name.trim().length < 2) {
    throw new RsvpError("الاسم غير صالح", "VALIDATION_ERROR", 400);
  }
  if (!Number.isInteger(input.seats) || input.seats <= 0) {
    throw new RsvpError("عدد المقاعد غير صالح", "VALIDATION_ERROR", 400);
  }

  let phoneE164: string | null = null;
  if (input.phone?.trim()) {
    try {
      phoneE164 = normalizePhoneToE164(input.phone);
    } catch {
      throw new RsvpError("رقم الجوال غير صالح", "INVALID_PHONE", 400);
    }
  }

  const result = await confirmInviteLinkRpc(
    input.inviteToken,
    input.name.trim(),
    input.phone?.trim() || null,
    phoneE164,
    input.seats
  );

  if (!result.ok) {
    throw new RsvpError(result.message, result.code, 400);
  }

  return {
    rsvpViewToken: result.rsvpViewToken,
    guestCode: result.guestCode,
    ticketToken: result.ticketToken,
  };
}
