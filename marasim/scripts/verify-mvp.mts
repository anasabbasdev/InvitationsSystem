/**
 * End-to-end MVP verification against real Supabase.
 * Requires all migrations + npm run db:seed
 *
 * Usage: npm run verify:mvp
 */

import assert from "node:assert/strict";
import { loadProjectEnv } from "../src/lib/env/load-dotenv";
import { assertSupabaseAdminEnv } from "../src/lib/supabase/env";
import { createSupabaseAdminClient } from "../src/lib/supabase/create-admin-client";
import {
  fetchEventBySlug,
  fetchInvitationBySlug,
  approveRsvp,
  rejectRsvp,
  checkInTicket,
  scanTicket,
  createPublicRsvp,
  createInviteLink,
  confirmInviteLinkRpc,
  fetchTicketDisplayInfo,
} from "../src/lib/repositories";
import { submitPublicRSVP, getRSVPStatusView } from "../src/lib/rsvp-core";

loadProjectEnv();

const TABLES = [
  "events",
  "event_settings",
  "rsvps",
  "tickets",
  "checkins",
  "event_notifications",
  "event_owners",
  "user_roles",
  "invite_links",
];

async function main() {
  assertSupabaseAdminEnv();
  const admin = createSupabaseAdminClient();

  console.log("\n── Tables ──");
  for (const table of TABLES) {
    const { error } = await admin.from(table).select("*", { count: "exact", head: true });
    if (error) throw new Error(`${table}: ${error.message}`);
    console.log(`  ✓ ${table}`);
  }

  const royal = await fetchEventBySlug("ws-royal-demo");
  const floral = await fetchEventBySlug("ws-floral-demo");
  const royalInv = await fetchInvitationBySlug("ws-royal-demo");
  assert.ok(royal && floral && royalInv);
  assert.equal(royalInv.status, "published");

  console.log("\n── Public RSVP flow ──");
  const submit = await submitPublicRSVP({
    slug: "ws-royal-demo",
    name: `MVP Verify ${Date.now()}`,
    requestedSeats: 1,
  });
  assert.equal(submit.status, "pending");
  const status = await getRSVPStatusView(submit.rsvpViewToken);
  assert.ok(status);
  assert.equal(status?.status, "pending");
  assert.equal(status?.ticket, null);
  console.log("  ✓ submit + pending status");

  console.log("\n── Approve + ticket ──");
  const pending = await createPublicRsvp({
    eventId: royal!.id,
    invitationId: royalInv.id,
    name: `Approve Test ${Date.now()}`,
    requestedSeats: 2,
    guestNote: "[verify-mvp]",
  });
  const approved = await approveRsvp(pending.id, 2);
  assert.ok(approved.ticketToken);
  const afterApprove = await getRSVPStatusView(pending.rsvpViewToken);
  assert.ok(afterApprove?.ticket);
  console.log("  ✓ approve creates ticket + status shows QR data");

  console.log("\n── Reject ──");
  const rejectPending = await createPublicRsvp({
    eventId: royal!.id,
    invitationId: royalInv.id,
    name: `Reject Test ${Date.now()}`,
    requestedSeats: 1,
    guestNote: "[verify-mvp-reject]",
  });
  await rejectRsvp(rejectPending.id);
  const rejectedView = await getRSVPStatusView(rejectPending.rsvpViewToken);
  assert.equal(rejectedView?.status, "rejected");
  console.log("  ✓ reject");

  console.log("\n── Capacity guard ──");
  const capEvent = royal!;
  const { data: eventRow } = await admin
    .from("events")
    .select("confirmed_seats, total_capacity")
    .eq("id", capEvent.id)
    .single();
  const beforeConfirmed = eventRow!.confirmed_seats as number;
  await admin
    .from("events")
    .update({ total_capacity: beforeConfirmed + 1 })
    .eq("id", capEvent.id);

  const capPending = await createPublicRsvp({
    eventId: capEvent.id,
    invitationId: royalInv.id,
    name: `Cap Test ${Date.now()}`,
    requestedSeats: 2,
    guestNote: "[verify-mvp-cap]",
  });
  try {
    await approveRsvp(capPending.id, 2);
    assert.fail("should throw on over-capacity");
  } catch (e) {
    assert.ok(e instanceof Error);
  }
  const { data: afterCap } = await admin
    .from("events")
    .select("confirmed_seats, total_capacity")
    .eq("id", capEvent.id)
    .single();
  assert.equal(afterCap!.confirmed_seats, beforeConfirmed);
  await admin.from("events").update({ total_capacity: 20 }).eq("id", capEvent.id);
  console.log("  ✓ over-capacity approval blocked");

  console.log("\n── Check-in + wrong event ──");
  const ticketInfo = await fetchTicketDisplayInfo(approved.ticketToken);
  assert.ok(ticketInfo);
  const wrongScan = await scanTicket(approved.ticketToken, floral!.id);
  assert.equal(wrongScan.status, "WRONG_EVENT");
  const checkIn = await checkInTicket(approved.ticketToken, royal!.id, 1);
  assert.equal(checkIn.status, "VALID");
  assert.ok(checkIn.info);
  assert.equal(checkIn.info!.ticket.usedEntries, 1);
  console.log("  ✓ partial check-in + wrong event");

  console.log("\n── Controlled link ──");
  const link = await createInviteLink({
    eventId: royal!.id,
    invitationId: royalInv.id,
    label: "[verify-mvp-link]",
    maxSeats: 2,
  });
  const confirm = await confirmInviteLinkRpc(link.token, "Controlled Guest", null, 2);
  assert.equal(confirm.ok, true);
  if (!confirm.ok) throw new Error("confirm failed");
  const dup = await confirmInviteLinkRpc(link.token, "Again", null, 1);
  assert.equal(dup.ok, false);
  assert.equal(dup.code, "ALREADY_CONFIRMED");
  console.log("  ✓ controlled confirm + duplicate blocked");

  console.log("\n── All MVP verification checks passed ──\n");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
