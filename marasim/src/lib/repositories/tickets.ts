import { createSupabaseAdminClient } from "@/lib/supabase/create-admin-client";
import type { DbTicketRow } from "@/types/persistence";
import type { CheckInResult, ScanResult, TicketDisplayInfo } from "@/types/tickets";
import { callRpc } from "@/lib/repositories/rpc";

type TicketJoinRow = DbTicketRow & {
  rsvps: { name: string; side: string | null } | null;
  events: { id: string; title: string; event_date: string | null; venue_name: string | null } | null;
};

function mapDisplayInfo(row: TicketJoinRow): TicketDisplayInfo {
  return {
    ticket: {
      token: row.token,
      maxEntries: row.max_entries,
      usedEntries: row.used_entries,
      remainingEntries: row.max_entries - row.used_entries,
      status: row.status,
    },
    event: {
      id: row.events?.id ?? row.event_id,
      title: row.events?.title ?? "",
      eventDate: row.events?.event_date ?? null,
      venueName: row.events?.venue_name ?? null,
    },
    guest: {
      name: row.rsvps?.name ?? "",
      side: row.rsvps?.side ?? null,
    },
  };
}

async function fetchTicketJoinByToken(token: string): Promise<TicketJoinRow | null> {
  const { data, error } = await createSupabaseAdminClient()
    .from("tickets")
    .select("*, rsvps(name, side), events(id, title, event_date, venue_name)")
    .eq("token", token)
    .maybeSingle();

  if (error) throw error;
  return data as TicketJoinRow | null;
}

export async function fetchTicketDisplayInfo(
  token: string
): Promise<TicketDisplayInfo | null> {
  const row = await fetchTicketJoinByToken(token);
  if (!row) return null;
  return mapDisplayInfo(row);
}

export async function fetchTicketTokenByRsvpId(rsvpId: string): Promise<string | null> {
  const { data, error } = await createSupabaseAdminClient()
    .from("tickets")
    .select("token")
    .eq("rsvp_id", rsvpId)
    .maybeSingle();

  if (error) throw error;
  return (data?.token as string | undefined) ?? null;
}

/** Read-only lookup for the scanner UI — no mutation, safe to call freely. */
export async function scanTicket(
  token: string,
  scannerEventId: string
): Promise<ScanResult> {
  const row = await fetchTicketJoinByToken(token);
  if (!row) return { status: "INVALID" };

  const info = mapDisplayInfo(row);

  if (row.event_id !== scannerEventId) {
    return { status: "WRONG_EVENT", info };
  }
  if (row.status === "revoked") {
    return { status: "REVOKED", info };
  }
  if (row.status === "fully_used" || row.used_entries >= row.max_entries) {
    return { status: "FULLY_USED", info };
  }
  return { status: "VALID", info };
}

export type CheckInRpcResult = {
  ticketId: string;
  maxEntries: number;
  usedEntries: number;
  remainingEntries: number;
  status: "active" | "fully_used";
};

/** Atomic check-in via Postgres function — see migration 004. */
export async function checkInTicket(
  token: string,
  scannerEventId: string,
  entriesCount: number,
  checkedBy?: string | null
): Promise<CheckInResult> {
  const result = await callRpc<CheckInRpcResult>("check_in_ticket", {
    p_ticket_token: token,
    p_scanner_event_id: scannerEventId,
    p_entries_count: entriesCount,
    p_checked_by: checkedBy ?? null,
  });

  if (!result.ok) {
    const info = await fetchTicketDisplayInfo(token);
    return {
      status: result.code as CheckInResult["status"],
      message: result.message,
      info: info ?? undefined,
    };
  }

  const info = await fetchTicketDisplayInfo(token);
  return { status: "VALID", info: info ?? undefined };
}

export async function listTicketsForEvent(eventId: string): Promise<
  Array<{
    id: string;
    token: string;
    maxEntries: number;
    usedEntries: number;
    status: string;
    guestName: string;
    createdAt: string;
  }>
> {
  const { data, error } = await createSupabaseAdminClient()
    .from("tickets")
    .select("id, token, max_entries, used_entries, status, created_at, rsvps(name)")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => {
    const r = row as unknown as {
      id: string;
      token: string;
      max_entries: number;
      used_entries: number;
      status: string;
      created_at: string;
      rsvps: { name: string } | null;
    };
    return {
      id: r.id,
      token: r.token,
      maxEntries: r.max_entries,
      usedEntries: r.used_entries,
      status: r.status,
      guestName: r.rsvps?.name ?? "",
      createdAt: r.created_at,
    };
  });
}
