# Marasim MVP — Manual Test Guide

Run after `npm run db:seed` and `npm run dev`. Open `/lab/test-hub` for quick links.

## Scenario A — Public RSVP → Approve → Check-in

1. Open `/i/ws-royal-demo`
2. Scroll to RSVP scene
3. Enter name, select 2 seats, submit
4. Confirm redirect to `/s/[token]` with **pending**
5. Login at `/owner/login` (`owner@marasim.local` / see `.seed-data.local`)
6. Open event → **طلبات الحضور**
7. Approve the new request with 2 seats
8. Re-open the guest status URL — **QR appears**
9. Open **Scanner**, paste ticket URL or scan QR
10. **Check in 1** — remaining should be 1
11. Scan again, **Check in remaining**
12. Scan again — **Fully Used**

## Scenario B — Rejection

1. Submit new RSVP from invitation
2. Reject from dashboard
3. Status page shows **Rejected**, no QR

## Scenario C — Capacity

1. From Test Hub note remaining seats on Event A
2. Try approving a pending RSVP that exceeds remaining capacity
3. Dashboard shows error; confirmed seats unchanged

## Scenario D — Wrong Event

1. Open Scanner for **Event A (Royal)**
2. Scan/paste ticket from **Event B (Floral)** — use Test Hub link
3. **WRONG_EVENT** — no check-in buttons

## Scenario E — Controlled Link

1. Open **Controlled invitation** link from Test Hub
2. Confirm with seats ≤ max
3. Ticket + QR appear immediately on status page
4. Re-submit — blocked (already confirmed)

## Demo credentials

See `.seed-data.local` after seed (gitignored).

Environment overrides: `SEED_OWNER_EMAIL`, `SEED_OWNER_PASSWORD`.
