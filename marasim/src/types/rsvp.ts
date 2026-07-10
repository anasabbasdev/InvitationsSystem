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
  phoneE164?: string;
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
  phoneE164?: string | null;
  guestCode?: string | null;
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
  guestCode: string;
  status: RSVPStatus;
}

export interface GuestLookupResult {
  found: boolean;
  message?: string;
  status?: RSVPStatus;
  name?: string;
  guestCode?: string;
  requestedSeats?: number;
  approvedSeats?: number | null;
  eventTitle?: string;
  eventDate?: string | null;
  venueName?: string | null;
  guestNote?: string | null;
  ticket?: RSVPStatusTicketView | null;
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
  guestCode?: string | null;
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
