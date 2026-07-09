export type RSVPStatus = "pending" | "approved" | "rejected";

export type RSVPMode = "public_request" | "controlled_link";

export interface RSVPSubmission {
  name: string;
  phone?: string;
  requestedSeats: number;
  eventId: string;
  inviteLinkId?: string;
}

export interface RSVP {
  id: string;
  eventId: string;
  inviteLinkId?: string;
  name: string;
  phone?: string;
  side?: string;
  requestedSeats: number;
  approvedSeats?: number;
  status: RSVPStatus;
  createdAt: string;
  updatedAt: string;
}
