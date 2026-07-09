# Cloudflare Workers Deployment

## المشكلة الشائعة: GitHub Secrets وحدها لا تكفي

OpenNext يحتاج متغيرين **منفصلين**:

| المرحلة | أين تُضبط | لماذا |
|---|---|---|
| **Build** | GitHub Secrets → خطوة `opennextjs-cloudflare build` | تضمين `NEXT_PUBLIC_*` في الحزمة |
| **Runtime** | Cloudflare Worker vars/secrets عند `deploy` | `middleware` و Server Components تقرأ `process.env` على الـ Worker |

وضع Secrets في GitHub **فقط** يصلح البناء لكن الـ Worker عند التشغيل يبقى بدون `process.env` → 500.

الـ workflow الحالي (`deploy-cloudflare.yml`) يزامن **تلقائياً**:

- `SUPABASE_SERVICE_ROLE_KEY` → Worker secret
- `NEXT_PUBLIC_*` + `ENABLE_TEST_HUB` → Worker vars عبر `--var`
- `--keep-vars` يحافظ على vars اليدوية في Dashboard

## GitHub Secrets المطلوبة

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL` (مثال: `https://marasim.anas-abass1.workers.dev`)

## تحقق بعد النشر

افتح:

```txt
https://YOUR-WORKER.workers.dev/api/health
```

المتوقع:

```json
{
  "ok": true,
  "supabasePublic": true,
  "supabaseAdmin": true,
  "hasSiteUrl": true
}
```

إذا `supabasePublic: false` → runtime vars لم تصل للـ Worker.

## يدوياً (بدون انتظار GitHub)

```bash
cd marasim
export NEXT_PUBLIC_SUPABASE_URL=...
export NEXT_PUBLIC_SUPABASE_ANON_KEY=...
export NEXT_PUBLIC_SITE_URL=https://marasim.anas-abass1.workers.dev
export SUPABASE_SERVICE_ROLE_KEY=...

npx opennextjs-cloudflare build
echo "$SUPABASE_SERVICE_ROLE_KEY" | npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx opennextjs-cloudflare deploy -- \
  --keep-vars \
  --var "NEXT_PUBLIC_SUPABASE_URL:$NEXT_PUBLIC_SUPABASE_URL" \
  --var "NEXT_PUBLIC_SUPABASE_ANON_KEY:$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --var "NEXT_PUBLIC_SITE_URL:$NEXT_PUBLIC_SITE_URL" \
  --var "ENABLE_TEST_HUB:true"
```

## Test Hub على الإنتاج

`/lab/test-hub` يظهر فقط إذا `ENABLE_TEST_HUB=true` على الـ Worker (الـ workflow يضبطها تلقائياً).

## ملاحظة على `if: secrets` في GitHub Actions

لا تستخدم `if: secrets.X != ''` — GitHub يعاملها دائماً كفارغة في الشروط. لذلك أزلنا الشرط من خطوة secret sync.
