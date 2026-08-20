# دليل ربط بريد الإرسال في Supabase (SMTP)

هذا الدليل لمشروع **مراسِم**. الهدف: أن تصل رسائل استعادة كلمة مرور صاحب المناسبة إلى صندوق الوارد، من بريد تختاره أنت.

لا تضع بيانات SMTP داخل ملفات المشروع (`.env.local` أو Git). الإعداد كله داخل لوحة Supabase.

---

## ماذا نربط؟ وماذا لا نربط؟

| الشيء | هل نحتاجه؟ | لماذا |
|---|---|---|
| **SMTP** (إرسال) | نعم | Supabase يرسل رسالة الاستعادة عبر خادم الإرسال |
| **IMAP** (استقبال) | لا | التطبيق لا يقرأ صندوق الوارد. صاحب المناسبة يفتح الإيميل بنفسه |
| دومين `marasim.com` | لا الآن | يكفي أي بريد عندك (Gmail وغيره) إلى أن يتوفر دومين احترافي |
| WhatsApp Business | لا | خارج هذا الدليل |

الرسائل التي يرسلها Supabase بعد الربط:

- نسيت كلمة المرور (`/owner/forgot-password`)
- نسيت البريد — نرسل لنفس البريد المسجّل على المناسبة (`/owner/forgot-account`)
- أي رسالة Auth أخرى (تأكيد حساب، دعوة مستخدم) إن فعّلتموها لاحقاً

بدون SMTP مخصص: بريد Supabase الافتراضي محدود جداً (غالباً رسالتان في الساعة) وكثيراً ما يذهب إلى الرسائل غير المرغوبة أو لا يصل.

---

## قبل أن تبدأ: اجمع هذه القيم من مزوّد البريد

اكتبها في ورقة جانبية (لا ترفعها للمستودع):

```txt
SMTP Host      مثال: smtp.gmail.com
SMTP Port      عادة 587
SMTP User      غالباً عنوان البريد كاملاً
SMTP Password  كلمة مرور التطبيق، ليست كلمة مرور الدخول العادية في Gmail
Sender email   نفس البريد أو بريد مسموح من المزوّد
Sender name    مراسيم
```

المنفذ `587` مع STARTTLS هو الاختيار الافتراضي الآمن. بعض المزوّدين يستخدمون `465` (SSL).

---

## الخيار أ — Gmail (الأسهل الآن إذا ما عندك دومين)

Gmail لا يقبل كلمة مرور الحساب العادية داخل SMTP. تحتاج **كلمة مرور للتطبيقات (App Password)**.

### أ-1. فعّل التحقق بخطوتين

1. ادخل إلى حساب Google الذي سيرسل الرسائل.
2. افتح: [https://myaccount.google.com/security](https://myaccount.google.com/security)
3. تحت «كيفية تسجيل الدخول إلى Google» فعّل **التحقق بخطوتين (2-Step Verification)**.
4. أكمل الخطوات حتى يصبح مفعّلاً.

بدون هذه الخطوة لن تظهر كلمة مرور التطبيقات.

### أ-2. أنشئ App Password

1. افتح: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. إذا طلب Google تسجيلاً إضافياً، أكمله.
3. في «اسم التطبيق» اكتب مثلاً: `Marasim Supabase`.
4. اضغط **إنشاء / Create**.
5. تظهر كلمة من **16 حرفاً** (أربع مجموعات). انسخها فوراً. لن تظهر مرة ثانية.
6. احذف الفراغات عند اللصق في Supabase إن وُجدت: `abcd efgh ijkl mnop` → `abcdefghijklmnop`.

هذه هي قيمة **SMTP Password**. ليست كلمة دخول Gmail.

### أ-3. قيم Gmail التي ستلصقها في Supabase

| الحقل في Supabase | القيمة |
|---|---|
| Sender email | `you@gmail.com` (نفس الحساب) |
| Sender name | `مراسيم` |
| Host | `smtp.gmail.com` |
| Port | `587` |
| Username | `you@gmail.com` (البريد كاملاً) |
| Password | الـ 16 حرفاً من App Password |

حدود Gmail تقريباً: مئات الرسائل يومياً للحساب الشخصي. كافية لـ MVP أصحاب المناسبات. ليست مناسبة لإرسال آلاف الدعوات لاحقاً.

---

## الخيار ب — أي مزوّد SMTP آخر (Hostinger / Outlook / Zoho / Resend)

خذ القيم من لوحة المزوّد والصقها كما هي.

| المزوّد | Host | Port | Username | Password |
|---|---|---|---|---|
| Outlook / Microsoft 365 | `smtp.office365.com` | `587` | البريد كاملاً | كلمة مرور الحساب أو App Password |
| Hostinger / cPanel | غالباً `smtp.titan.email` أو `smtp.yourdomain.com` | `587` | البريد كاملاً | كلمة مرور صندوق البريد |
| Zoho | `smtp.zoho.com` | `587` | البريد كاملاً | كلمة مرور البريد |
| Resend | `smtp.resend.com` | `465` أو `587` | `resend` | مفتاح API يبدأ بـ `re_` |
| SendGrid | `smtp.sendgrid.net` | `587` | `apikey` | مفتاح API |

عندما يتوفر دومين مراسيم الاحترافي: أنشئ صندوقاً مثل `no-reply@your-domain.com` عند المزوّد، ثم أعد هذه الخطوة بنفس القيم الجديدة. لا تحتاج تغييراً في كود مراسيم.

---

## خطوات لوحة Supabase (هنا يُحفظ البريد المرسل)

افتح مشروع مراسيم: [https://supabase.com/dashboard](https://supabase.com/dashboard)

### 1) اختر المشروع الصحيح

من أعلى اليسار اختر مشروع Supabase الخاص بمراسِم (ليس مشروعاً تجريبياً آخر).

### 2) اربط روابط التحويل أولاً (وإلا زر الإيميل لن يفتح التطبيق)

1. من القائمة اليسرى: **Authentication**.
2. ادخل **URL Configuration** (أو **Authentication → URL Configuration**).
3. **Site URL**
   - للتطوير المحلي: `http://localhost:3000`
   - للإنتاج لاحقاً: عنوان الموقع النهائي مثل `https://your-domain.com`
4. تحت **Redirect URLs** أضف سطراً لكل بيئة، ثم Save:

```txt
http://localhost:3000/auth/callback
http://localhost:3000/auth/callback?next=/owner/update-password
https://YOUR-PRODUCTION-DOMAIN/auth/callback
https://YOUR-PRODUCTION-DOMAIN/auth/callback?next=/owner/update-password
```

إذا نُشر التطبيق على Cloudflare Workers الآن، أضف أيضاً:

```txt
https://YOUR-WORKER.workers.dev/auth/callback
https://YOUR-WORKER.workers.dev/auth/callback?next=/owner/update-password
```

بدون هذه الروابط: الرسالة قد تصل، لكن الضغط على الرابط يعطي خطأ `redirect_to` غير مسموح.

### 3) فعّل Custom SMTP

المسار الحالي في لوحة Supabase:

1. **Authentication** (القائمة اليسرى).
2. تحت **Notifications** اختر **Emails**.
3. افتح تبويب **SMTP Settings**.
4. إذا ظهر زر **Set up SMTP** اضغطه.
5. فعّل المفتاح: **Enable Custom SMTP**.

(في بعض الحسابات القديمة يظهر الإعداد تحت **Project Settings → Authentication → SMTP Settings**. ابحث عن «SMTP» من مربع البحث أعلى اللوحة إن اختلفت القائمة.)

### 4) املأ الحقول ثم احفظ

| الحقل | ماذا تكتب |
|---|---|
| Sender email | البريد الذي سيظهر للمستقبل: `من: مراسيم <you@gmail.com>` |
| Sender name | `مراسيم` |
| Host | من الجدول أعلاه |
| Port number | `587` عادة |
| Username | غالباً البريد كاملاً |
| Password | App Password أو كلمة مرور SMTP |
| Minimum interval | اترك الافتراضي أو `20`–`60` ثانية |

اضغط **Save**. انتظر رسالة تأكيد أن الإعدادات حُفظت.

لا تضع هذه القيم في GitHub Secrets ولا في `.env.local`. التطبيق لا يرسل الإيميل بنفسه؛ Auth في Supabase يرسله.

### 5) (اختياري) قوالب الرسالة بالعربية

1. نفس صفحة **Authentication → Emails**.
2. تبويب **Templates**.
3. اختر **Reset password** / **Magic Link** حسب الحاجة.
4. عدّل العنوان والنص إلى العربية إن رغبت. أبقِ المتغير `{{ .ConfirmationURL }}` كما هو؛ هذا رابط الاستعادة.
5. Save.

مثال عنوان: `استعادة الدخول إلى لوحة مراسيم`

### 6) (اختياري) حد الإرسال

**Authentication → Rate Limits**

بعد تفعيل SMTP المخصص يفرض Supabase حداً ابتدائياً منخفضاً (حوالي 30 رسالة/ساعة). ارفعه لاحقاً إذا احتجت، بما يتوافق مع حدود Gmail أو المزوّد.

---

## تجربة أن الإرسال يعمل (من مراسيم)

1. شغّل التطبيق محلياً:

```bash
cd marasim
npm run dev
```

2. افتح: [http://localhost:3000/owner/forgot-password](http://localhost:3000/owner/forgot-password)
3. اكتب البريد المسجّل لصاحب المناسبة، مثلاً بريدك الحالي.
4. اضغط **إرسال رابط الاستعادة**.
5. افتح صندوق الوارد **لنفس البريد** (والمجلد Promotions / Spam).
6. يجب أن ترى رسالة من اسم المرسل `مراسيم`.
7. افتح الرابط → يحوّلك إلى `/owner/update-password` → عيّن كلمة مرور جديدة → تدخل `/owner/events`.

لاختبار «نسيت البريد»:

1. افتح `/owner/forgot-account`
2. اكتب `mhmd_lara` أو `زفاف محمد و لارا`
3. الرسالة تذهب إلى البريد المسجّل على المناسبة، دون أن يظهر على الشاشة.

---

## إذا احتجت دخولاً فورياً بدون انتظار الإيميل

على جهاز التطوير فقط:

```bash
cd marasim
npm run owner:set-password -- you@email.com
```

السكربت يطبع كلمة مرور مؤقتة في الطرفية. لا تشاركها ولا ترفعها للمستودع. بعد الدخول غيّرها من `/owner/update-password`.

---

## أعطال شائعة

| العرض | السبب الغالب | الحل |
|---|---|---|
| لا تصل أي رسالة | SMTP غير مفعّل أو البيانات خطأ | أعد حفظ SMTP، تأكد من App Password |
| Gmail يرفض الدخول | استخدمت كلمة مرور Gmail العادية | أنشئ App Password بعد تفعيل 2FA |
| الرسالة في Spam | بريد شخصي / بدون دومين موثّق | اطلب من صاحب المناسبة مراجعة Spam؛ لاحقاً استخدم دومين مع SPF/DKIM |
| الرابط يفتح خطأ redirect | رابط التحويل غير مضاف | أضف `/auth/callback` في Redirect URLs |
| الرابط يفتح على localhost وأنت على الإنتاج | Site URL ما زال localhost | غيّر Site URL لعنوان الإنتاج |
| «تم الإرسال» لكن لا إيميل | البريد غير موجود في Auth أو ذهب للبريد الخطأ | استخدم `npm run owner:set-password` مؤقتاً، وتأكد من البريد في Auth → Users |
| حد الإرسال | بريد Supabase الافتراضي أو Rate Limit | فعّل SMTP وارفع الحد من Rate Limits |

للتشخيص من لوحة Supabase:

1. **Authentication → Users** — هل المستخدم موجود ونفس الإيميل؟
2. **Logs** (أو Authentication logs) — هل محاولة `recover` نجحت أم رُفضت SMTP؟

---

## ماذا يتغير عندما يتوفر دومين مراسيم؟

1. أنشئ صندوق بريد مثل `no-reply@your-domain.com` عند المستضيف.
2. اضبط سجلات DNS التي يعطيها المزوّد: **SPF** و **DKIM** (و **DMARC** إن طُلب).
3. أعد خطوة SMTP في Supabase بالقيم الجديدة.
4. حدّث Sender email / Sender name.
5. أضف Redirect URLs للدومين النهائي إن لم تكن مضافة.

كود مراسيم وصفحات `/owner/forgot-password` و `/owner/forgot-account` تبقى كما هي.

---

## مرجع سريع للصفحات في التطبيق

| الصفحة | الوظيفة |
|---|---|
| `/owner/login` | دخول صاحب المناسبة |
| `/owner/forgot-password` | استعادة بالبريد |
| `/owner/forgot-account` | استعادة باسم المناسبة أو الرابط |
| `/owner/update-password` | تعيين كلمة مرور بعد فتح الرابط |
| `/auth/callback` | تبادل رمز Supabase ثم التحويل (لا تفتحها يدوياً) |

وثائق Supabase الرسمية للإرسال: [Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
