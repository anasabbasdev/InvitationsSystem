# MVP manual test guide

## Prerequisites

- Migrations 1–7 applied
- `npm run db:seed`
- `npm run dev`

## Scenario A — Public RSVP → Approve → Check-in

1. Open `/i/ws-royal-demo`
2. Submit RSVP with **name + UAE phone + seats**
3. Note **guest code** (6 chars) + copy button — no redirect required
4. Use sticky bar **«تحقق من حالة دعوتك»** → enter phone **or** code → see **pending**
5. Owner login → approve RSVP
6. Guest checks status again via sticky bar → sees **approved** + QR (code only)
7. Owner dashboard → copy **scanner link** (`/scan/...`) → share with door staff
8. Scanner: scan QR, type code, or type phone → check-in

## Scenario B — Guest lookup privacy

- Wrong phone/code on invitation → generic «لم يُعثر على طلب مطابق»
- Lookup scoped to invitation event only

## Scenario C — Public scanner (no login)

- Open `/scan/[token]` from owner dashboard share card
- Works without owner account

## Demo credentials

See `.seed-data.local` after seed (`owner_email`, `royal_scanner_url`, `demo_guest_code_approved`).
