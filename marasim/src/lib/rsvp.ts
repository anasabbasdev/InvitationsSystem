import "server-only";

import { fetchEventById, fetchEventSettings } from "@/lib/repositories/events";
import { createEventNotification } from "@/lib/repositories/notifications";
import { fetchInvitationBySlug } from "@/lib/repositories/invitations";
import { createPublicRsvp, fetchRsvpByViewToken } from "@/lib/repositories/rsvps";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { parsePublicRsvpBody } from "@/lib/validation/rsvp-schemas";
import type {
  PublicRSVPResult,
  PublicRSVPSubmission,
  RSVPStatusView,
} from "@/types/rsvp";

export type { PublicRSVPSubmission, PublicRSVPResult, RSVPStatusView } from "@/types/rsvp";

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

export async function submitPublicRSVP(
  input: PublicRSVPSubmission
): Promise<PublicRSVPResult> {
  if (!isSupabaseConfigured()) {
    throw new RsvpError("RSVP is not available", "NOT_CONFIGURED", 503);
  }

  const body = parsePublicRsvpBody(input);

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

  const rsvp = await createPublicRsvp({
    name: body.name,
    requestedSeats: body.requestedSeats,
    guestNote: body.guestNote,
    phone: body.phone,
    eventId: invitation.event_id,
    invitationId: invitation.id,
  });

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
    },
  });

  return {
    rsvpViewToken: rsvp.rsvpViewToken,
    status: rsvp.status,
  };
}

export async function getRSVPStatusView(
  token: string
): Promise<RSVPStatusView | null> {
  if (!isSupabaseConfigured()) return null;

  const rsvp = await fetchRsvpByViewToken(token);
  if (!rsvp) return null;

  const event = await fetchEventById(rsvp.eventId);

  return {
    status: rsvp.status,
    name: rsvp.name,
    requestedSeats: rsvp.requestedSeats,
    approvedSeats: rsvp.approvedSeats,
    eventTitle: event?.title,
    guestNote: rsvp.guestNote,
  };
}

// TODO Phase 4: implement approveRSVP(id: string, approvedSeats: number)
// TODO Phase 4: implement rejectRSVP(id: string)
