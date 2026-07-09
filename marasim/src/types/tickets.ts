export type TicketStatus = "active" | "used" | "cancelled";

export interface Ticket {
  id: string;
  eventId: string;
  rsvpId: string;
  token: string;
  maxEntries: number;
  usedEntries: number;
  status: TicketStatus;
  createdAt: string;
}

export interface CheckinEntry {
  id: string;
  ticketId: string;
  eventId: string;
  entriesCount: number;
  checkedBy?: string;
  createdAt: string;
}
