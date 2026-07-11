# Cloudflare Workers Deployment

## المشكلة الشائعة: GitHub Secrets وحدها لا تكفي

OpenNext يحتاج متغيرين **منفصلين**:

| المرحلة | أين تُضبط | لماذا |
|---|---|---|
| **Build** | GitHub Secrets → `env:` على job النشر → `opennextjs-cloudflare build` | تضمين `NEXT_PUBLIC_*` في الحزمة |
| **Runtime** | Cloudflare Worker vars/secrets عند `deploy` | `middleware` و Server Components تقرأ `process.env` على الـ Worker |

وضع Secrets في GitHub **فقط** يصلح البناء لكن الـ Worker عند التشغيل يبقى بدون `process.env` → 500.

الـ workflow (`.github/workflows/deploy-cloudflare.yml`) يزامن **تلقائياً**:

- `SUPABASE_SERVICE_ROLE_KEY` → Worker **secret**
- `NEXT_PUBLIC_*` + `ENABLE_TEST_HUB` → Worker **vars** عبر `--var`
- المتغيرات الاختيارية تُمرَّر فقط إذا وُجدت في GitHub Secrets (لا تُمسح قيم Dashboard بقيم فارغة)
- `--keep-vars` يحافظ على vars اليدوية في Dashboard

## GitHub Secrets

### مطلوبة

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### مُستحسنة

- `NEXT_PUBLIC_SITE_URL` — روابط QR المطلقة (مثال: `https://marasim.anas-abass1.workers.dev`)

### اختيارية (الصفحة الرئيسية)

- `NEXT_PUBLIC_WHATSAPP_URL`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_INSTAGRAM_URL`

إذا لم تُضبط، أزرار التواصل تُخفى في الإنتاج (بدون أرقام وهمية).

### ليست للنشر

- `SEED_OWNER_EMAIL` / `SEED_OWNER_PASSWORD` — محلي فقط
- صور الـ landing — ملفات في `public/` وليس متغيرات بيئة

## إضافة متغير جديد

عند أي `process.env` جديد في الكود، حدّث معاً:

1. `marasim/.env.local.example`
2. `.github/workflows/deploy-cloudflare.yml` (build `env:` + deploy `--var` أو `secret put`)
3. هذا الملف
4. `marasim/AGENTS.md` (قائمة المتغيرات إن لزم)

## تحقق بعد النشر

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
export NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/971...
export NEXT_PUBLIC_CONTACT_EMAIL=hello@example.com
export SUPABASE_SERVICE_ROLE_KEY=...

npx opennextjs-cloudflare build
echo "$SUPABASE_SERVICE_ROLE_KEY" | npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx opennextjs-cloudflare deploy -- \
  --keep-vars \
  --var "NEXT_PUBLIC_SUPABASE_URL:$NEXT_PUBLIC_SUPABASE_URL" \
  --var "NEXT_PUBLIC_SUPABASE_ANON_KEY:$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --var "NEXT_PUBLIC_SITE_URL:$NEXT_PUBLIC_SITE_URL" \
  --var "NEXT_PUBLIC_WHATSAPP_URL:$NEXT_PUBLIC_WHATSAPP_URL" \
  --var "NEXT_PUBLIC_CONTACT_EMAIL:$NEXT_PUBLIC_CONTACT_EMAIL" \
  --var "ENABLE_TEST_HUB:true"
```

## Test Hub على الإنتاج

`/lab/test-hub` يظهر فقط إذا `ENABLE_TEST_HUB=true` على الـ Worker (الـ workflow يضبطها تلقائياً).

## ملاحظة على `if: secrets` في GitHub Actions

لا تستخدم `if: secrets.X != ''` — GitHub يعاملها دائماً كفارغة في الشروط. المتغيرات الاختيارية تُمرَّر عبر دالة `add_var` في الـ workflow بدلاً من شروط `if`.
