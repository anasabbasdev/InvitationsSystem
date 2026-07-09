# Supabase — Phase 3A

## 1. Create project

Create a Supabase project at [supabase.com](https://supabase.com).

## 2. Apply migration

In the Supabase SQL editor, run:

`migrations/20260709120000_phase_3a_persistence.sql`

Or with Supabase CLI:

```bash
supabase db push
```

## 3. Environment variables

Copy `marasim/.dev.vars.example` → `.dev.vars` and set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

For Cloudflare deploy, add the same vars as Worker secrets (`NEXT_PUBLIC_*` and `SUPABASE_SERVICE_ROLE_KEY`).

## 4. Seed demo data

```bash
cd marasim
npm run db:seed
```

Seeds V2 blueprints, presets, and all `ws-*` demo invitations.  
`ws-royal-demo` is published with a frozen snapshot; others remain draft.

## 5. Loading behavior

| Condition | Source |
|---|---|
| Supabase not configured | Local registry (`lib/invitation-config.ts`) |
| Slug in DB, `published` | `published_snapshots.resolved_config_json` |
| Slug in DB, `draft` | `buildInvitationConfigV2()` live merge |
| Slug not in DB | Registry fallback |

Legacy demos (`demo-wedding`, `noor-*`) always work via registry when not seeded.
