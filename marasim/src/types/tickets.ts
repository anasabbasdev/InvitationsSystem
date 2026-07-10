export type TicketStatus = "active" | "revoked" | "fully_used";

export interface Ticket {
  id: string;
  eventId: string;
  rsvpId: string;
  token: string;
  maxEntries: number;
  usedEntries: number;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CheckinEntry {
  id: string;
  ticketId: string;
  eventId: string;
  entriesCount: number;
  checkedBy?: string | null;
  createdAt: string;
}

/** Discriminated scan result — never trust client math for capacity. */
export type ScanResultStatus =
  | "VALID"
  | "INVALID"
  | "REVOKED"
  | "FULLY_USED"
  | "WRONG_EVENT";

export interface TicketDisplayInfo {
  ticket: {
    token: string;
    maxEntries: number;
    usedEntries: number;
    remainingEntries: number;
    status: TicketStatus;
  };
  event: {
    id: string;
    title: string;
    eventDate?: string | null;
    venueName?: string | null;
  };
  guest: {
    name: string;
    side?: string | null;
    guestCode?: string | null;
  };
}

export interface ScanResult {
  status: ScanResultStatus;
  info?: TicketDisplayInfo;
}

export interface CheckInResult {
  status: ScanResultStatus | "EXCEEDED";
  info?: TicketDisplayInfo;
  message?: string;
}
