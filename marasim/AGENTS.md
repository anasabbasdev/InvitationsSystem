<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Marasim app — agent notes

App root: `marasim/`. Parent repo rules: `../AGENTS.md`.

## Cloudflare Workers deployment (required discipline)

Production deploys via **OpenNext on Cloudflare Workers**, not a plain Node server. `.env.local` is **local dev only** — it is never read on Cloudflare.

Full reference: `docs/cloudflare-deploy.md`.

### Two places for every env var

| Stage | Where | Why |
|-------|--------|-----|
| **Build** | GitHub Actions `env:` on the deploy job (from repository Secrets) | `NEXT_PUBLIC_*` are inlined into the client bundle during `opennextjs-cloudflare build` |
| **Runtime** | Cloudflare Worker **vars** (public) or **secrets** (server-only) via `wrangler deploy --var` / `wrangler secret put` | Middleware, Server Components, and API routes read `process.env` on the Worker |

GitHub Secrets alone are **not enough** for runtime. Worker vars alone are **not enough** for the client bundle. Both must stay in sync.

Workflow file: `.github/workflows/deploy-cloudflare.yml` (repo root, not under `marasim/`).

### When you add or change environment variables

Whenever you introduce a new `process.env.*` usage, update **all** of the following in the same change (or explicitly tell the user what to configure):

1. **`marasim/.env.local.example`** — document the variable for local dev (no real secrets).
2. **`.github/workflows/deploy-cloudflare.yml`**:
   - Add to job `env:` so the **build** step sees it.
   - If `NEXT_PUBLIC_*` or other runtime-needed: add to the **Deploy** step (`--var` for public values, `wrangler secret put` for secrets).
   - Optional public vars: use conditional `add_var` pattern (do not pass empty `--var` and wipe Dashboard values).
3. **`marasim/docs/cloudflare-deploy.md`** — list the GitHub Secret name and whether it is required or optional.
4. **Never** add seed-only or local-only vars to the workflow (e.g. `SEED_OWNER_*`).

### Variable types

| Prefix / name | Build | Runtime | GitHub | Worker type |
|---------------|-------|---------|--------|-------------|
| `NEXT_PUBLIC_*` | Yes | Yes (also as `--var`) | Secret (or variable) | **Text var** |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (server code) | Yes | Secret | **Secret** (`wrangler secret put`) |
| Server-only, no `NEXT_PUBLIC_` | Yes if imported at build | Yes | Secret | **Secret** |

Do not put service-role keys in `--var`; use secrets only.

### Current GitHub repository secrets (expected)

**Required**

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Recommended**

- `NEXT_PUBLIC_SITE_URL` — QR and absolute links (e.g. `https://your-worker.workers.dev`)

**Optional (landing page)**

- `NEXT_PUBLIC_WHATSAPP_URL`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_INSTAGRAM_URL`

The workflow syncs all of the above to the Worker when the secret is set. Optional secrets may be omitted; features hide gracefully when unset.

**Not for Cloudflare**

- `SEED_OWNER_EMAIL`, `SEED_OWNER_PASSWORD` — local `db:seed` only
- Landing images — static files under `public/` via `src/data/landing-assets.ts`, not env vars

### Post-deploy check

```txt
GET https://<your-worker>/api/health
```

Expect `supabasePublic`, `supabaseAdmin`, and `hasSiteUrl` true when configured.

### Manual deploy (same rules)

```bash
cd marasim
# export all NEXT_PUBLIC_* and SUPABASE_SERVICE_ROLE_KEY
npx opennextjs-cloudflare build
echo "$SUPABASE_SERVICE_ROLE_KEY" | npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx opennextjs-cloudflare deploy -- --keep-vars --var "NEXT_PUBLIC_SUPABASE_URL:..." ...
```

Mirror whatever the workflow passes in `--var` and secrets.
