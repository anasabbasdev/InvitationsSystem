/**
 * Operational demo data for end-to-end MVP testing.
 * Called from seed-supabase.ts after invitations/events exist.
 */

import { writeFileSync, existsSync, appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { createSupabaseAdminClient } from "@/lib/supabase/create-admin-client";
import {
  addEventOwner,
  approveRsvp,
  callRpc,
  createInviteLink,
  createPublicRsvp,
  fetchEventBySlug,
  fetchInvitationBySlug,
  rejectRsvp,
  setUserRole,
} from "@/lib/repositories";
import { generateSecureToken } from "@/lib/secure-token";

const SEED_DATA_FILE = resolve(process.cwd(), ".seed-data.local");

export type SeedOperationalResult = {
  ownerEmail: string;
  ownerPassword: string;
  royalEventId: string;
  floralEventId: string;
};

function log(msg: string) {
  console.log(`  ${msg}`);
}

function writeSeedLine(key: string, value: string) {
  const line = `${key}=${value}\n`;
  if (!existsSync(SEED_DATA_FILE)) {
    writeFileSync(SEED_DATA_FILE, "# gitignored — demo URLs and tokens for Test Hub\n", "utf8");
  }
  appendFileSync(SEED_DATA_FILE, line, "utf8");
}

async function ensureOwnerUser(): Promise<{ id: string; email: string; password: string }> {
  const admin = createSupabaseAdminClient();
  const email = process.env.SEED_OWNER_EMAIL?.trim() || "owner@marasim.local";
  const password = process.env.SEED_OWNER_PASSWORD?.trim() || "MarasimDemo123!";

  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  let userId = created.user?.id;

  if (error) {
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const existing = list.users.find((u) => u.email === email);
    if (!existing) throw error;
    userId = existing.id;
    log(`~ owner user ${email} (existing)`);
  } else {
    log(`+ owner user ${email}`);
  }

  if (!userId) throw new Error("Failed to resolve owner user id");

  await setUserRole(userId, "admin");

  return { id: userId, email, password };
}

async function seedRsvpIfMissing(
  eventId: string,
  invitationId: string,
  seedKey: string,
  data: {
    name: string;
    requestedSeats: number;
    guestNote?: string;
    action: "pending" | "approve" | "reject";
    checkIn?: number;
  }
): Promise<{ rsvpViewToken?: string; ticketToken?: string }> {
  const admin = createSupabaseAdminClient();
  const marker = `[seed:${seedKey}]`;

  const { data: existing } = await admin
    .from("rsvps")
    .select("id, rsvp_view_token, status")
    .eq("event_id", eventId)
    .eq("guest_note", marker)
    .maybeSingle();

  if (existing) {
    let ticketToken: string | undefined;
    if (existing.status === "approved" || existing.status === "confirmed") {
      const { data: ticket } = await admin
        .from("tickets")
        .select("token")
        .eq("rsvp_id", existing.id)
        .maybeSingle();
      ticketToken = ticket?.token as string | undefined;
    }
    log(`○ rsvp ${seedKey} (existing)`);
    return { rsvpViewToken: existing.rsvp_view_token as string, ticketToken };
  }

  const rsvp = await createPublicRsvp({
    eventId,
    invitationId,
    name: data.name,
    requestedSeats: data.requestedSeats,
    guestNote: marker,
  });

  if (data.action === "reject") {
    await rejectRsvp(rsvp.id);
    log(`+ rsvp ${seedKey} rejected`);
    return { rsvpViewToken: rsvp.rsvpViewToken };
  }

  if (data.action === "approve") {
    const result = await approveRsvp(rsvp.id, data.requestedSeats);
    let ticketToken = result.ticketToken;

    if (data.checkIn && ticketToken) {
      await callRpc("check_in_ticket", {
        p_ticket_token: ticketToken,
        p_scanner_event_id: eventId,
        p_entries_count: data.checkIn,
        p_checked_by: null,
      });
    }

    log(`+ rsvp ${seedKey} approved${data.checkIn ? ` (checked in ${data.checkIn})` : ""}`);
    return { rsvpViewToken: rsvp.rsvpViewToken, ticketToken };
  }

  log(`+ rsvp ${seedKey} pending`);
  return { rsvpViewToken: rsvp.rsvpViewToken };
}

export async function seedOperationalDemoData(): Promise<SeedOperationalResult> {
  const owner = await ensureOwnerUser();

  const royalEvent = await fetchEventBySlug("ws-royal-demo");
  const floralEvent = await fetchEventBySlug("ws-floral-demo");
  const royalInvitation = await fetchInvitationBySlug("ws-royal-demo");
  const floralInvitation = await fetchInvitationBySlug("ws-floral-demo");

  if (!royalEvent || !floralEvent || !royalInvitation || !floralInvitation) {
    throw new Error("Demo events/invitations missing — run invitation seed first");
  }

  const admin = createSupabaseAdminClient();

  await admin.from("events").update({ total_capacity: 20 }).eq("id", royalEvent.id);
  await admin.from("events").update({ total_capacity: 10 }).eq("id", floralEvent.id);

  await addEventOwner(royalEvent.id, owner.id);
  await addEventOwner(floralEvent.id, owner.id);
  log(`~ linked owner to both events`);

  const pending = await seedRsvpIfMissing(royalEvent.id, royalInvitation.id, "pending", {
    name: "ضيف قيد المراجعة",
    requestedSeats: 2,
    action: "pending",
  });

  const approved = await seedRsvpIfMissing(royalEvent.id, royalInvitation.id, "approved", {
    name: "ضيف موافق عليه",
    requestedSeats: 2,
    action: "approve",
  });

  const rejected = await seedRsvpIfMissing(royalEvent.id, royalInvitation.id, "rejected", {
    name: "ضيف مرفوض",
    requestedSeats: 1,
    action: "reject",
  });

  const partial = await seedRsvpIfMissing(royalEvent.id, royalInvitation.id, "partial-ticket", {
    name: "ضيف جزئي الدخول",
    requestedSeats: 2,
    action: "approve",
    checkIn: 1,
  });

  const fullyUsed = await seedRsvpIfMissing(royalEvent.id, royalInvitation.id, "full-ticket", {
    name: "ضيف استخدم الكل",
    requestedSeats: 1,
    action: "approve",
    checkIn: 1,
  });

  const wrongEvent = await seedRsvpIfMissing(floralEvent.id, floralInvitation.id, "wrong-event", {
    name: "ضيف مناسبة B",
    requestedSeats: 2,
    action: "approve",
  });

  const { data: existingLink } = await admin
    .from("invite_links")
    .select("token")
    .eq("event_id", royalEvent.id)
    .eq("label", "[seed:controlled-demo]")
    .maybeSingle();

  let controlledToken = existingLink?.token as string | undefined;
  if (!controlledToken) {
    const link = await createInviteLink({
      eventId: royalEvent.id,
      invitationId: royalInvitation.id,
      label: "[seed:controlled-demo]",
      guestName: "ضيف الرابط الخاص",
      side: "general",
      maxSeats: 3,
    });
    controlledToken = link.token;
    log(`+ controlled invite link`);
  } else {
    log(`○ controlled invite link (existing)`);
  }

  writeSeedLine("owner_email", owner.email);
  writeSeedLine("owner_password", owner.password);
  writeSeedLine("royal_event_id", royalEvent.id);
  writeSeedLine("floral_event_id", floralEvent.id);
  if (pending.rsvpViewToken) writeSeedLine("rsvp_pending_url", `/s/${pending.rsvpViewToken}`);
  if (approved.rsvpViewToken) writeSeedLine("rsvp_approved_url", `/s/${approved.rsvpViewToken}`);
  if (rejected.rsvpViewToken) writeSeedLine("rsvp_rejected_url", `/s/${rejected.rsvpViewToken}`);
  if (approved.ticketToken) writeSeedLine("ticket_active_url", `/t/${approved.ticketToken}`);
  if (partial.ticketToken) writeSeedLine("ticket_partial_url", `/t/${partial.ticketToken}`);
  if (fullyUsed.ticketToken) writeSeedLine("ticket_full_url", `/t/${fullyUsed.ticketToken}`);
  if (wrongEvent.ticketToken) writeSeedLine("ticket_wrong_event_url", `/t/${wrongEvent.ticketToken}`);
  if (controlledToken) {
    writeSeedLine("controlled_invitation_url", `/i/ws-royal-demo?t=${controlledToken}`);
  }

  return {
    ownerEmail: owner.email,
    ownerPassword: owner.password,
    royalEventId: royalEvent.id,
    floralEventId: floralEvent.id,
  };
}

/** Creates a one-off pending RSVP for capacity testing (does not persist marker). */
export async function createCapacityTestRsvp(eventId: string, invitationId: string) {
  return createPublicRsvp({
    eventId,
    invitationId,
    name: `Capacity Test ${Date.now()}`,
    requestedSeats: 2,
    guestNote: "[capacity-test]",
  });
}

export { generateSecureToken };
