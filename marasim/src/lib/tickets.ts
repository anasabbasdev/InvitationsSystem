import "server-only";

/**
 * Ticket lookups — group QR tickets are created inside approve_rsvp /
 * confirm_invite_link (Postgres functions), never directly from app code.
 * This module only exposes read access for guest-facing pages and the scanner.
 */

import { fetchTicketDisplayInfo, scanTicket } from "@/lib/repositories";
import type { ScanResult, TicketDisplayInfo } from "@/types/tickets";

export type { Ticket, TicketDisplayInfo, ScanResult } from "@/types/tickets";
export { extractTicketToken } from "@/lib/ticket-token";

export async function getTicketByToken(
  token: string
): Promise<TicketDisplayInfo | null> {
  return fetchTicketDisplayInfo(token);
}

/** Read-only lookup used by the scanner before check-in — never mutates. */
export async function lookupTicketForScanner(
  token: string,
  scannerEventId: string
): Promise<ScanResult> {
  return scanTicket(token, scannerEventId);
}
