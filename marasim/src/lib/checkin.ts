import "server-only";

/**
 * Check-in / scanner logic. All capacity and event-matching safety lives in
 * the check_in_ticket Postgres function (migration 004) — this module is a
 * thin, typed wrapper so app code never has to reason about SQL directly.
 */

import { checkInTicket as checkInTicketRepo } from "@/lib/repositories";
import type { CheckInResult } from "@/types/tickets";

export type { CheckInResult } from "@/types/tickets";

export async function checkIn(
  ticketToken: string,
  scannerEventId: string,
  entriesCount: number,
  checkedBy?: string | null
): Promise<CheckInResult> {
  return checkInTicketRepo(ticketToken, scannerEventId, entriesCount, checkedBy);
}
