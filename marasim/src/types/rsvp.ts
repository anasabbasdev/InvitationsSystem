export type RSVPStatus = "pending" | "approved" | "rejected" | "confirmed";

export type RSVPMode = "public_request" | "controlled_link";

export interface PublicRSVPSubmission {
  slug: string;
  name: string;
  requestedSeats: number;
  guestNote?: string;
  phone?: string;
}

export interface ControlledRSVPSubmission {
  slug: string;
  inviteToken: string;
  name: string;
  phone?: string;
  seats: number;
}

export interface RSVPSubmission {
  name: string;
  phone?: string;
  requestedSeats: number;
  eventId: string;
  invitationId?: string;
  guestNote?: string;
  inviteLinkId?: string;
  side?: string;
  status?: RSVPStatus;
  approvedSeats?: number;
}

export interface RSVP {
  id: string;
  eventId: string;
  invitationId?: string | null;
  inviteLinkId?: string | null;
  name: string;
  phone?: string | null;
  guestNote?: string | null;
  side?: string | null;
  requestedSeats: number;
  approvedSeats?: number | null;
  status: RSVPStatus;
  rsvpViewToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicRSVPResult {
  rsvpViewToken: string;
  status: RSVPStatus;
}

export interface RSVPStatusTicketView {
  token: string;
  maxEntries: number;
  usedEntries: number;
  remainingEntries: number;
  status: "active" | "revoked" | "fully_used";
}

export interface RSVPStatusView {
  status: RSVPStatus;
  name: string;
  requestedSeats: number;
  approvedSeats?: number | null;
  eventTitle?: string;
  eventDate?: string | null;
  venueName?: string | null;
  guestNote?: string | null;
  ticket?: RSVPStatusTicketView | null;
}

/** Owner-facing RSVP row with computed fields for the management table. */
export interface OwnerRSVPRow extends RSVP {
  ticketToken?: string | null;
  ticketStatus?: "active" | "revoked" | "fully_used" | null;
}
