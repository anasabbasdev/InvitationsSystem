import { createSupabaseAdminClient } from "@/lib/supabase/create-admin-client";

export type CheckinHistoryRow = {
  id: string;
  ticketId: string;
  entriesCount: number;
  createdAt: string;
  guestName: string;
  checkedBy?: string | null;
};

export async function listCheckinsForEvent(eventId: string): Promise<CheckinHistoryRow[]> {
  const { data, error } = await createSupabaseAdminClient()
    .from("checkins")
    .select("id, ticket_id, entries_count, created_at, checked_by, tickets(rsvps(name))")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => {
    const r = row as unknown as {
      id: string;
      ticket_id: string;
      entries_count: number;
      created_at: string;
      checked_by: string | null;
      tickets: { rsvps: { name: string } | null } | null;
    };
    return {
      id: r.id,
      ticketId: r.ticket_id,
      entriesCount: r.entries_count,
      createdAt: r.created_at,
      checkedBy: r.checked_by,
      guestName: r.tickets?.rsvps?.name ?? "",
    };
  });
}
