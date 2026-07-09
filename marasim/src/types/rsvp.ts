export type RSVPStatus = "pending" | "approved" | "rejected";

export type RSVPMode = "public_request" | "controlled_link";

export interface PublicRSVPSubmission {
  slug: string;
  name: string;
  requestedSeats: number;
  guestNote?: string;
  phone?: string;
}

export interface RSVPSubmission {
  name: string;
  phone?: string;
  requestedSeats: number;
  eventId: string;
  invitationId?: string;
  guestNote?: string;
  inviteLinkId?: string;
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

export interface RSVPStatusView {
  status: RSVPStatus;
  name: string;
  requestedSeats: number;
  approvedSeats?: number | null;
  eventTitle?: string;
  guestNote?: string | null;
}
