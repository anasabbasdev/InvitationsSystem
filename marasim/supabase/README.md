# Supabase — Phase 3A / 3A.1

## Environment files

| File | Used by | Purpose |
|---|---|---|
| **`.env.local`** | Next.js `dev` / `build` | **Primary** — copy from `.env.local.example` |
| `.dev.vars` | OpenNext Cloudflare local | Optional; `loadProjectEnv()` also reads it for scripts |

Scripts (`db:seed`, `verify:persistence`) call `loadProjectEnv()` which loads `.env.local` then `.dev.vars`.

**Required variables:**

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server-only — never commit
```

Next.js does **not** read `.dev.vars` by itself. Use `.env.local` for the app.

## Migrations (apply in order)

1. `migrations/20260709120000_phase_3a_persistence.sql`
2. `migrations/20260709130000_phase_3a_1_hardening.sql`

In Supabase SQL Editor: run each file in order.

Migration 002 adds: `preview_token_hash`, constraints, snapshot immutability triggers, removes anon read RLS policies.

## Commands

```bash
cd marasim

# Seed (idempotent)
npm run db:seed
npm run db:seed

# Unit tests (no Supabase required)
npm run test:persistence

# Integration tests (real Supabase + both migrations + seed)
npm run verify:persistence
```

Draft preview URLs are written to `.preview-tokens.local` (gitignored) on first seed.

## Loading behavior

| Condition | Result |
|---|---|
| Supabase not configured | Local registry slugs only |
| `published` slug | Frozen `published_snapshots.resolved_config_json` |
| `draft` slug | Live merge — **requires** `/i/[slug]?preview=[token]` |
| DB slug missing, local registry hit | Local fallback |
| DB slug missing, not in registry | 404 |
| Supabase query error | 404 (no silent fallback) |

## RLS (Phase 3A.1)

- RLS **enabled** on all Phase 3A tables.
- **No** anon/authenticated read or write policies.
- All DB access via **service role** on the server (`createSupabaseAdminClient`).
- Never import admin client in Client Components.

## Cache policy

- `/i/[slug]` is **dynamic** when loaded from DB or with `?preview=`.
- Published invitations read immutable snapshot JSON.
- Re-publish calls `revalidatePath(/i/[slug])` when run inside Next.js.
- Draft preview always reflects latest blueprint/preset/data (no snapshot).

## Draft preview policy

Draft invitations are **not** public. Access:

```txt
/i/[slug]?preview=[unguessable-token]
```

Token hash stored in `invitations.preview_token_hash`. Plain token shown once in `.preview-tokens.local` after seed.

## Re-publish

```ts
import { republishInvitation } from "@/lib/repositories/republish";
await republishInvitation("ws-royal-demo");
```

Creates a new snapshot row; old snapshots retained. Updates `published_snapshot_id`.
