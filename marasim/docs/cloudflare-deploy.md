# Cloudflare Workers Deployment

## Why 500 on `/owner/login`?

Usually one of:

1. **Missing env vars** on the Worker (Supabase URL/keys not set at build or runtime).
2. **Middleware/auth crash** on edge (now hardened — page should load with a config message).
3. **Test Hub hidden** — `/lab/test-hub` returns 404 in production unless `ENABLE_TEST_HUB=true`.

## Required variables

| Variable | When | Where |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Build + Runtime | GitHub secret + Worker var |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Build + Runtime | GitHub secret + Worker var |
| `SUPABASE_SERVICE_ROLE_KEY` | Runtime only | Worker **secret** |
| `NEXT_PUBLIC_SITE_URL` | Build (QR links) | GitHub secret + Worker var |
| `ENABLE_TEST_HUB` | Runtime (optional) | Worker var = `true` |

## GitHub Actions secrets

Add to repository **Settings → Secrets**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL` (e.g. `https://marasim.anas-abass1.workers.dev`)

Push to `main` redeploys with build-time env + service role secret sync.

## Manual setup (Cloudflare Dashboard)

1. **Workers → marasim → Settings → Variables**
2. Add **plain text**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `ENABLE_TEST_HUB` = `true` (optional)
3. Add **secret**:
   - `SUPABASE_SERVICE_ROLE_KEY`

## Manual CLI

```bash
cd marasim
npx opennextjs-cloudflare build
npx wrangler deploy
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

Set plain vars in dashboard or `wrangler.jsonc` `[vars]` (never commit secrets).

## Verify after deploy

- `/` — landing
- `/i/ws-royal-demo` — invitation (needs service role + DB)
- `/owner/login` — login form (not 500)
- `/lab/test-hub` — only if `ENABLE_TEST_HUB=true`
