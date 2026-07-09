# Supabase — Marasim MVP

## Environment

Copy `.env.local.example` → `.env.local`. Scripts also read `.dev.vars` via `loadProjectEnv()`.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth + browser client |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only DB access |
| `NEXT_PUBLIC_SITE_URL` | QR absolute URLs (optional) |
| `SEED_OWNER_EMAIL` / `SEED_OWNER_PASSWORD` | Demo owner account |

## Migrations (apply in order)

1. `20260709120000_phase_3a_persistence.sql`
2. `20260709130000_phase_3a_1_hardening.sql`
3. `20260709140000_phase_3b_rsvp.sql`
4. `20260710010000_phase4_owner_auth.sql`
5. `20260710020000_phase4_tickets_and_approval.sql`
6. `20260710030000_phase6_invite_links.sql`

## Commands

```bash
cd marasim
npm run db:seed          # idempotent — run twice for preview tokens
npm run test             # unit tests (no Supabase)
npm run verify:mvp       # integration (needs Supabase + migrations + seed)
npm run dev
```

After seed: `.seed-data.local` (demo URLs) and `.preview-tokens.local` (draft previews).

## Postgres RPC functions

| Function | Purpose |
|---|---|
| `approve_rsvp(rsvp_id, approved_seats)` | Atomic approve / edit seats + ticket |
| `reject_rsvp(rsvp_id)` | Reject + free seats + revoke ticket |
| `check_in_ticket(token, event_id, count, checked_by)` | Partial group check-in |
| `confirm_invite_link(token, name, phone, seats)` | Controlled link confirmation |

## RLS

RLS enabled on all tables. No anon/authenticated policies — all access via **service role** on the server after auth checks in `lib/auth.ts`.

## Demo owner

Default after seed: `owner@marasim.local` / `MarasimDemo123!` (override via env).

See `docs/mvp-manual-test-guide.md` for end-to-end scenarios.
