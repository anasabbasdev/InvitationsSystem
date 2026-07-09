# Asset Handoff Guide — Noor (Designer)

> هذا الملف موجّه للمصمم. يشرح كيفية إعداد وتسليم الـ assets لكل نوع من أنواع الدعوات.

---

## 1. المقاسات الأساسية

| العنصر | القيمة |
|---|---|
| العرض المستهدف | **390px** (iPhone 14 Pro — المرجع الأساسي) |
| نطاق العرض المدعوم | 348px — 430px (لا يجوز كسر التصميم خارج هذا النطاق) |
| الارتفاع | متغير — كل مشهد يأخذ **100dvh** كحد أدنى |
| Safe Text Area | يسار/يمين: **24px** padding من الحافة — لا يجوز وضع نصوص تحت هذه المنطقة داخل الصورة |
| الاتجاه | RTL (من اليمين لليسار) |

### خريطة safe areas

```
┌─────────────────────────────┐  ← 390px
│ ←24px→          ←24px→     │
│        SAFE TEXT AREA       │  ← كل نص حي يقع هنا
│                             │
│  [خلفية / زخارف / صور]     │
│                             │
│        SAFE TEXT AREA       │
│ ←24px→          ←24px→     │
└─────────────────────────────┘
```

**مهم:** إذا كان النص جزءاً من الصورة (مدمج في الـ webp/png)، فيجب أن يبقى النص ضمن safe area، وأن يُعيد اختباره على 348px.

---

## 2. أنواع الملفات المقبولة

| النوع | الصيغة | الحجم الأقصى | ملاحظة |
|---|---|---|---|
| صورة خلفية (background) | `.webp` | 400 KB | لا png ثقيل، استخدم webp |
| صورة foreground / ornament | `.webp` أو `.svg` أو `.png` (transparent) | 150 KB | يفضّل webp أو svg |
| فيديو خلفية | `.mp4` (H.264, AAC muted) | **3 MB** | 5–10 ثواني، loop بدون صوت |
| موسيقى | `.mp3` | **2 MB** | يُبدأ تشغيلها بعد أول tap |
| Lottie animation | `.json` | 100 KB | مدعوم مستقبلاً (Phase 3) |

### قواعد الفيديو

- H.264 codec فقط (Safari iOS متطلب).
- `autoplay muted loop playsinline` — لا صوت في الفيديو نفسه.
- الفيديو للخلفية فقط؛ لا تضع عليه نصوص داخل الفيديو.
- الحجم < 3MB لأن المدعوين يفتحون الدعوة على شبكات محمول.
- ابدأ وانتهِ بنفس الـ frame لتجنب الوميض عند الـ loop.

---

## 3. بنية مجلدات الـ Assets

```
marasim/public/assets/
  demo/
    noor/
      wedding/
        music.mp3              ← موسيقى خلفية (لا تُشغَّل حتى أول tap)
        opening-bg.webp        ← خلفية مشهد الافتتاح (390×844+)
        opening-bg.mp4         ← بديل فيديو لمشهد الافتتاح (اختياري)
        hero-bg.webp           ← خلفية مشهد الأسماء
        ornament-top.webp      ← زخرفة علوية PNG/webp بخلفية شفافة
        ornament-bottom.webp   ← زخرفة سفلية
        photo-01.webp          ← صورة للـ gallery — نسبة 3:4 عمودية
        photo-02.webp          ← صورة ثانية للـ gallery
      birth/
        music.mp3
        opening-bg.webp
        hero-bg.webp
        ornament-top.webp
        ornament-bottom.webp
        photo-baby-01.webp     ← صورة للمولود — نسبة 3:4
```

---

## 4. أسماء الملفات — Convention

```
{event-type}-{scene-slug}-{role}.webp
```

أمثلة:
```
wedding-opening-bg.webp
wedding-hero-ornament-bottom.webp
birth-hero-bg.webp
birth-gallery-photo-01.webp
```

---

## 5. خريطة Assets لكل مشهد

### المشهد 1 — Opening

| الـ Layer | الوصف | الملف المقترح |
|---|---|---|
| `background` | خلفية كاملة (cover) | `opening-bg.webp` أو `opening-bg.mp4` |
| `overlay` | تدرج شفاف فوق الخلفية (gradient CSS فقط) | — |
| `foreground[0]` | زخرفة علوية شفافة | `ornament-top.webp` |
| `foreground[1]` | زخرفة سفلية شفافة | `ornament-bottom.webp` |

**تصميم الـ opening:**
- إذا كانت صورة: يجب أن تكون داكنة بما يكفي لإظهار النص الذهبي فوقها.
- إذا كان فيديو: نفس المعيار — فيديو داكن، أو يُضاف gradient overlay عبر الكود.
- لا تضع أي نص داخل الصورة — كل النصوص مرنة ومحسوبة بالكود.

---

### المشهد 2 — Hero Names

| الـ Layer | الوصف | الملف |
|---|---|---|
| `background` | خلفية كاملة | `hero-bg.webp` |
| `foreground[0]` | زخرفة علوية | `ornament-top.webp` |
| `foreground[1]` | زخرفة سفلية (أسفل الأسماء) | `ornament-bottom.webp` |

**ملاحظة مهمة:**
- الأسماء تُعرض من خلال الكود (ليست داخل الصورة).
- حجم الخط للأسماء ~54px على الموبايل.
- أبقِ منطقة مركزية الصورة خالية نسبياً لظهور الأسماء.

---

### المشهد 3 — Invitation Message

| الـ Layer | الوصف |
|---|---|
| `background` | gradient CSS فقط (لا حاجة لصورة) |

---

### المشهد 4 — Event Details

| الـ Layer | الوصف |
|---|---|
| `background` | gradient CSS أو صورة خلفية خفيفة |

---

### المشهد 5 — Countdown

| الـ Layer | الوصف |
|---|---|
| `background` | gradient CSS فقط (لا حاجة لصورة) |

---

### المشهد 6 — Gallery / Media

| الـ Layer | الوصف | الملف |
|---|---|---|
| `background` | gradient CSS | — |
| `content.media[0]` | صورة أولى | `photo-01.webp` |
| `content.media[1]` | صورة ثانية (اختياري) | `photo-02.webp` |

**مواصفات صور الـ Gallery:**
- **نسبة العرض/الارتفاع: 3:4 (عمودي)**.
- الحجم المقترح: 390×520px أو أكبر.
- الحجم الأقصى للملف: 350 KB لكل صورة.
- لا نص داخل الصورة.

---

### المشهد 7 — Location

| الـ Layer | الوصف |
|---|---|
| `background` | gradient CSS فقط |

---

### المشهد 8 — Notes

| الـ Layer | الوصف |
|---|---|
| `background` | gradient CSS فقط |

---

### المشهد 9 — RSVP

| الـ Layer | الوصف |
|---|---|
| `background` | gradient CSS فقط — لا تضع صوراً هنا |

---

### المشهد 10 — Ticket Confirmation (Closing)

| الـ Layer | الوصف | الملف |
|---|---|---|
| `background` | gradient CSS أو نفس خلفية الـ opening | `opening-bg.webp` (اختياري) |
| `foreground[0]` | زخرفة ختامية | `ornament-bottom.webp` (اختياري) |

---

## 6. متى يكون النص داخل الصورة؟

| النص | الموقع الصحيح |
|---|---|
| اسم العريس/العروسة | **في الكود** — يُقرأ من config |
| التاريخ والوقت | **في الكود** — يُقرأ من config |
| اسم القاعة | **في الكود** |
| رسالة الدعوة | **في الكود** |
| عنوان الـ section مثل "دعوة كريمة" | **في الكود** |
| زخارف خطية/نباتية/هندسية | **في الصورة** — هذه أصول بصرية |
| نسيج الخلفية | **في الصورة** |
| Bismillah أو آية قرآنية ثابتة | يمكن في الصورة **أو** في الكود (content.header) |

**القاعدة:** كل نص يتغير من عميل لآخر → الكود. كل عنصر بصري ثابت → الصورة.

---

## 7. طريقة ربط Assets بالسيكوينس والدعوة

### تعديل على مستوى الـ Sequence (تصميم افتراضي)

في ملف `data/sequences/noor-wedding-luxury.sequence.ts`، يمكن تحديد background افتراضي:

```ts
{
  sceneType: "opening",
  variant: "envelope_dark",
  background: {
    type: "image",
    src: "/assets/demo/noor/wedding/opening-bg.webp",
    fit: "cover",
  },
  overlay: {
    type: "gradient",
    value: "linear-gradient(180deg, rgba(13,8,7,0.4) 0%, transparent 40%, rgba(13,8,7,0.55) 100%)",
  },
  foreground: [
    { type: "image", src: "/assets/demo/noor/wedding/ornament-top.webp", position: "top", opacity: 0.85 },
    { type: "image", src: "/assets/demo/noor/wedding/ornament-bottom.webp", position: "bottom", opacity: 0.85 },
  ],
}
```

### تبديل asset لعميل بعينه (assetOverrides)

في ملف `data/invitations/client-xyz.ts`:

```ts
assetOverrides: {
  opening: {
    background: { type: "video", src: "/assets/clients/xyz/opening.mp4", fit: "cover" },
  },
  hero_names: {
    background: { type: "image", src: "/assets/clients/xyz/hero-bg.webp", fit: "cover", opacity: 0.7 },
    foreground: [
      { type: "image", src: "/assets/clients/xyz/ornament-bottom.webp", position: "bottom", opacity: 0.9 },
    ],
  },
},
```

---

## 8. قيود الأداء

| القيد | السبب |
|---|---|
| لا فيديو في كل مشهد | سيصل المدعو عبر موبايل + شبكة متغيرة |
| لا autoplay فيديو مرئي | iOS يمنع autoplay المرئي — `muted` + `playsinline` مطلوبان |
| صور webp فقط | أصغر 30–50% من jpg بنفس الجودة |
| الموسيقى تبدأ بعد أول tap | قانون المتصفحات — لا يمكن تشغيل صوت تلقائياً |
| background video ≤ 3MB | المدعو لا يُحمّل ملفاً ثقيلاً على موبايل |
| لا تضع نصوصاً داخل الصورة | ضروري لدعم أسماء وتواريخ مختلفة |

---

## 9. اختبار سريع بعد التسليم

1. الصورة تبدو جيدة عند 348px (أضيق موبايل مدعوم).
2. الصورة تبدو جيدة عند 430px (أوسع موبايل مدعوم).
3. لا يوجد نص يُقطع أو يتداخل مع نصوص الكود الذهبية.
4. الخلفية داكنة بما يكفي لأن النص الذهبي يظهر بوضوح فوقها.
5. الفيديو يُشغَّل على Safari iOS بدون خطأ.
6. حجم كل صورة < 400KB.

---

## 10. ملاحظات إضافية

- أرسل كل asset في مجلد منظم مضغوط أو عبر مشاركة Drive.
- لا تسمّي الملفات بالعربية — استخدم الحروف اللاتينية فقط.
- أرسل النسخة الأصلية (psd/ai/figma) للمراجعة والتعديل المستقبلي.
- إذا كان للمشهد خيارات متعددة (dark / light version)، ارسل كلاهما.

---

## 11. نظام Variants — Phase 2.6

كل مشهد من المشاهد العشرة يدعم عدة **variants** — أي أشكال بصرية مختلفة لنفس المحتوى.
الـ variant يُحدَّد في ملف الـ Sequence ويؤثر على الـ layout والبنية كلياً، وليس فقط الألوان.

### الـ Variants المدعومة لكل مشهد

| المشهد | Variant | الوصف |
|---|---|---|
| Opening | `rings_luxury` | 3 حلقات متحركة + نجمة مركزية — كلاسيكي فاخر |
| Opening | `full_video_intro` | الخلفية تملأ الشاشة، واجهة تحكم بسيطة في الأسفل |
| Opening | `minimal_tap` | لا حلقات، نص + زر فقط، هوائي ومفتوح |
| Hero Names | `stacked_calligraphy` | اسمان مكدّسان، كبيران، مع "و" وسطاً |
| Hero Names | `split_names` | الاسم الأول يميناً والثاني يساراً، فاصل أفقي |
| Hero Names | `single_name_centered` | اسم واحد كبير جداً في المنتصف (للمواليد) |
| Invitation Message | `classic_card` | بطاقة مؤطّرة مع زخارف الأركان |
| Invitation Message | `full_bleed_text` | نص مباشرة على الخلفية، لا إطار |
| Invitation Message | `minimal_quote` | علامة اقتباس كبيرة + نص كاقتباس |
| Event Details | `stacked_cards` | أيقونات في دوائر + تسميات + قيم |
| Event Details | `timeline` | خط زمني عمودي بنقاط وخطوط |
| Event Details | `minimal_rows` | صفوف نظيفة: تسمية + قيمة، بدون أيقونات |
| Countdown | `boxed_luxury` | صناديق مؤطّرة لكل وحدة زمنية |
| Countdown | `minimal_digits` | أرقام كبيرة بدون صناديق |
| Countdown | `hidden` | لا يُعرض (يختفي المشهد كلياً) |
| Gallery | `single_card` | عرض صورة/فيديو واحد في بطاقة |
| Gallery | `full_bleed_media` | الوسائط تملأ المشهد بالكامل |
| Gallery | `polaroid_stack` | إطار بولارويد دافئ مع ظل ودوران طفيف |
| Location | `map_button_card` | أيقونة دبوس + اسم القاعة + زر الخريطة |
| Location | `minimal_link` | نص نظيف + رابط تحتي فقط |
| Location | `full_bleed_location` | اسم القاعة بخط ضخم جداً في الأسفل |
| Notes | `simple_list` | قائمة بنقاط ماسية داخل بطاقة |
| Notes | `elegant_cards` | كل ملاحظة في بطاقة منفصلة زجاجية |
| Notes | `hidden` | لا يُعرض |
| RSVP | `luxury_form` | فورم كامل مع زخارف |
| RSVP | `minimal_form` | فورم أبسط، حدود سفلية فقط |
| Ticket/Closing | `closing_luxury` | حلقات + نص + زخرفة (يعكس الـ opening) |
| Ticket/Closing | `minimal_thank_you` | نص كبير في المنتصف فقط |
| Ticket/Closing | `brand_signature` | علامة "مراسِم" كعلامة مائية + نص إغلاق |

---

### Design Tokens — ما يمكن التحكم به من ملف الـ Sequence

| Token | القيم المتاحة | الأثر |
|---|---|---|
| `cardStyle` | `framed` / `minimal` / `glass` / `full_bleed` / `none` | شكل الحاوية والإطار |
| `buttonStyle` | `pill` / `square` / `ghost` / `underline` / `none` | شكل زر الـ CTA |
| `dividerStyle` | `diamond` / `line` / `floral_asset` / `none` | نوع الفاصل الزخرفي |
| `iconStyle` | `line` / `filled` / `asset` / `none` | طريقة عرض الأيقونات |
| `typographyStyle` | `classic` / `modern` / `calligraphy` / `soft` | اختيار الخط والإحساس |
| `cornerStyle` | `ornate` / `minimal` / `none` | زخارف الأركان على البطاقات |
| `sectionLabelStyle` | `badge` / `plain` / `hidden` | تسميات المشاهد |
| `density` | `airy` / `balanced` / `compact` | كثافة المساحة العمودية |

---

### الثلاثة اتجاهات التصميم والـ assets المطلوبة

#### A — Wedding Royal (الكلاسيكي الذهبي الداكن)
```
variant:         rings_luxury / stacked_calligraphy / classic_card / stacked_cards / boxed_luxury
cardStyle:       framed      (إطارات ذهبية)
buttonStyle:     pill        (أزرار دائرية)
dividerStyle:    diamond     (ماسة ذهبية)
iconStyle:       line        (أيقونات خطية)
cornerStyle:     ornate      (زخارف الأركان)
density:         balanced
```
**الـ assets المطلوبة:**
- `opening-bg.webp` — خلفية داكنة فاخرة مع نسيج ذهبي خفيف (لا نص داخلها)
- `hero-overlay.webp` — طبقة علوية شفافة للمشهد الثاني (اختيارية)
- `divider-diamond.svg` — فاصل ماسة مخصص (اختياري — هناك fallback في الكود)
- `ornament-top.webp` — زخرفة علوية للمشاهد (position: top)
- `ornament-bottom.webp` — زخرفة سفلية (position: bottom)

#### B — Noor Wedding Luxury (السينمائي النحاسي)
```
variant:         full_video_intro / split_names / full_bleed_text / minimal_rows / minimal_digits / full_bleed_media
cardStyle:       minimal     (لا إطارات)
buttonStyle:     square      (أزرار مربعة)
dividerStyle:    line        (خط بسيط)
iconStyle:       none        (لا أيقونات)
density:         airy        (مساحة واسعة)
```
**الـ assets المطلوبة:**
- `opening-bg.mp4` — فيديو خلفية سينمائي ≤ 3MB، muted، loopable
- `opening-bg.webp` — صورة fallback للفيديو (نفس المشهد، لقطة ثابتة)
- `gallery-01.webp` — صورة رئيسية للـ full_bleed gallery
- `gallery-01.mp4` — فيديو للـ gallery (اختياري)
- لا تُرسل أيقونات لهذا الاتجاه — `iconStyle: none`

#### C — Noor Birth Soft (الطري الوردي للمواليد)
```
variant:         minimal_tap / single_name_centered / minimal_quote / polaroid_stack / elegant_cards
cardStyle:       glass       (زجاج شفاف دافئ)
buttonStyle:     pill        (ناعم ودائري)
dividerStyle:    none        (لا فواصل)
iconStyle:       none        (لا أيقونات)
cornerStyle:     none
density:         airy
```
**الـ assets المطلوبة:**
- `opening-bg.webp` — خلفية وردية ناعمة لمشهد الفتح (gradient أو صورة ناعمة)
- `hero-bg.webp` — خلفية ناعمة لمشهد الاسم (اختيارية)
- `baby-photo-01.webp` — صورة المولود للـ polaroid gallery (تظهر بإطار بولارويد دافئ)
- `baby-photo-02.webp` — صورة ثانية (اختيارية)

---

### ما يجب ألا يكون داخل الصورة (مطلق)

❌ الأسماء: أحمد، نورة، ليان — تأتي من النظام
❌ التاريخ أو الوقت — تأتي من بيانات الدعوة
❌ اسم القاعة أو العنوان — تأتي من بيانات الدعوة
❌ نص RSVP أو أي تعليمات تفاعلية
❌ أي نص متغير من عميل لآخر

✅ المسموح: نسيج، زخارف هندسية، خطوط، أشكال، ألوان، ضوء، تأثيرات — بدون نص

---

### كيفية استبدال asset في دعوة محددة

في ملف `InvitationData`:
```ts
assetOverrides: {
  opening: {
    background: { type: "video", src: "/assets/demo/noor/wedding/opening-bg.mp4", fit: "cover", position: "full" }
  },
  gallery_media: {
    background: { type: "image", src: "/assets/demo/noor/wedding/gallery-01.webp", fit: "cover", position: "full" }
  },
}
```

في ملف `InvitationData` لتغيير design per scene:
```ts
designOverrides: {
  event_details: { iconStyle: "asset", iconAssets: { calendar: "/assets/icons/calendar-gold.webp" } }
}
```

---

## 12. مثال عملي — تركيب Assets لثلاثة مشاهد (Phase 2.7)

هذا المثال يوضح كيف يسلّم نور الدين ملفات حقيقية وكيف نركّبها في `InvitationData.assetOverrides` **بدون تعديل أي component**.

### الملفات التي يسلّمها المصمم

```
public/assets/demo/noor/wedding/
├── opening-bg.mp4          ← فيديو خلفية مشهد الفتح (≤ 3MB)
├── opening-bg.webp           ← صورة fallback إذا لم يُشغَّل الفيديو
├── opening-ornament-top.webp ← زخرفة علوية شفافة (position: top)
├── hero-bg.webp              ← خلفية مشهد الأسماء (اختياري)
├── divider-floral.webp       ← فاصل زخرفي مخصص (floral_asset)
└── gallery-01.webp           ← صورة المعرض
```

### مثال TypeScript كامل في `InvitationData`

```ts
export const clientWeddingData: InvitationData = {
  // ... id, slug, content, etc.

  // ── 1. Opening: فيديو + fallback + زخرفة علوية ─────────────────────────
  assetOverrides: {
    opening: {
      // فيديو خلفية كامل الشاشة
      background: {
        type: "video",
        src: "/assets/demo/noor/wedding/opening-bg.mp4",
        fit: "cover",
        position: "full",
      },
      // تدرج داكن فوق الفيديو لقراءة النص
      overlay: {
        type: "gradient",
        value:
          "linear-gradient(180deg, rgba(12,9,5,0.5) 0%, transparent 40%, rgba(12,9,5,0.75) 100%)",
      },
      // زخرفة علوية — لا تمتد لارتفاع كامل
      foreground: [
        {
          type: "image",
          src: "/assets/demo/noor/wedding/opening-ornament-top.webp",
          position: "top",
          height: "auto",
          opacity: 0.9,
        },
      ],
    },

    // ── 2. Hero Names: خلفية صورة + فاصل زخرفي عبر designOverrides ─────────
    hero_names: {
      background: {
        type: "image",
        src: "/assets/demo/noor/wedding/hero-bg.webp",
        fit: "cover",
        position: "full",
        opacity: 0.55,
      },
      overlay: {
        type: "gradient",
        value:
          "linear-gradient(180deg, #0C0905 0%, transparent 20%, transparent 80%, #0C0905 100%)",
      },
    },

    // ── 3. Gallery: صورة full-bleed أو داخل content.media ───────────────────
    gallery_media: {
      background: {
        type: "image",
        src: "/assets/demo/noor/wedding/gallery-01.webp",
        fit: "cover",
        position: "full",
      },
    },
  },

  // فاصل زخرفي مخصص (ليس في assetOverrides — يأتي من design token)
  designOverrides: {
    opening: {
      dividerStyle: "floral_asset",
      ornamentAsset: "/assets/demo/noor/wedding/divider-floral.webp",
    },
    hero_names: {
      dividerStyle: "floral_asset",
      ornamentAsset: "/assets/demo/noor/wedding/divider-floral.webp",
    },
    event_details: {
      iconStyle: "asset",
      iconAssets: {
        calendar: "/assets/demo/noor/wedding/icon-calendar.webp",
        clock: "/assets/demo/noor/wedding/icon-clock.webp",
        pin: "/assets/demo/noor/wedding/icon-pin.webp",
      },
    },
  },

  // صور المعرض تذهب في content (لـ variants: single_card / polaroid_stack)
  content: {
    gallery_media: {
      label: "لحظات",
      media: [
        {
          type: "image",
          src: "/assets/demo/noor/wedding/gallery-01.webp",
          alt: "",
        },
      ],
    },
  },
};
```

### متى تستخدم `background` vs `content.media`

| الهدف | أين تضع الـ asset | Variant المناسب |
|---|---|---|
| خلفية كاملة للمشهد | `assetOverrides[scene].background` | `full_video_intro`, `full_bleed_media` |
| زخرفة علوية/سفلية | `assetOverrides[scene].foreground[]` | أي variant |
| صورة داخل بطاقة أو بولارويد | `content.gallery_media.media[]` | `single_card`, `polaroid_stack` |
| فاصل زخرفي مخصص | `designOverrides.dividerStyle: "floral_asset"` + `ornamentAsset` | أي variant يعرض فاصل |
| أيقونة مخصصة | `designOverrides.iconStyle: "asset"` + `iconAssets` | `stacked_cards`, `map_button_card` |

### Fallback إذا لم يُسلَّم الفيديو بعد

استخدم gradient في `background` حتى يصل الفيديو — كما في الـ sequences الحالية:

```ts
background: {
  type: "gradient",
  value: "linear-gradient(160deg, #1A0E06 0%, #0C0905 50%, #0A0704 100%)",
},
// عند التسليم: استبدل بـ { type: "video", src: "...", fit: "cover", position: "full" }
```

### اختبار سريع بعد التركيب

1. افتح `/i/noor-wedding-demo` — تأكد أن الفيديو يظهر في opening (إن وُجد).
2. تأكد أن الزخرفة العلوية لا تُمدَّد لارتفاع كامل (يجب أن تحافظ على نسبتها).
3. تأكد أن الأسماء والتواريخ ما زالت نصاً حياً فوق الصورة.
4. شغّل `npm run build` — لا أخطاء TypeScript.

---

## 13. Asset-Driven Scene Workflow (Phase 2.8)

> **الفكرة التجارية:** المصمم يصمم الحركة (فراشة، بوابة، دخان، قماش…) كفيديو أو صورة. المحرك يشغّلها — لا نبرمج كل فكرة بالويب.

### أوضاع التركيب الثلاثة

| `compositionMode` | المعنى | متى يستخدمه المصمم |
|---|---|---|
| `full_media` | مشهد كامل = فيديو أو صورة واحدة تملأ الشاشة | افتتاحية سينمائية، معرض، ختام، رسالة بصرية كاملة |
| `layered_media` | طبقات: خلفية + فيديو + overlay + foreground + frame | أسماء live فوق خلفية، زخارف منفصلة عن النص |
| `web_layout` | التصميم الحالي (variants + tokens) | RSVP، عد تنازلي، خريطة، تفاصيل تفاعلية |

### زر البداية في opening

- `startBehavior: "center_button"` → زر دائماً في **منتصف الشاشة** فوق الفيديو/الصورة.
- عند النقر: يبدأ الفيديو (إن وُجد) → يختفي الزر → بعد `revealAfter` تفتح باقي الدعوة.
- لا حاجة لبرمجة gate أو envelope — الفيديو نفسه هو الافتتاحية.

### جدول assets لكل مشهد

| المشهد | full_media | layered_media | نص live مفضّل | قيود |
|---|---|---|---|---|
| opening | `opening.mp4` + `opening-poster.webp` | — | label اختياري (يفضل hidden) | فيديو ≤ 3MB، 9:16، muted |
| hero_names | صورة كاملة نادرة | `hero-bg.webp` + `hero-foreground.webp` | **الأسماء live** | لا أسماء داخل الصورة |
| invitation_message | `message-bg.webp` أو فيديو | خلفية + إطار | **header, title, body live** | النص المتغير في الويب |
| event_details | نادر | نادر | — | استخدم `web_layout` |
| countdown | — | — | — | `web_layout` دائماً |
| gallery_media | `gallery-01.webp` أو `.mp4` | — | label اختياري | صورة ≤ 400KB |
| location | خلفية زخرفية فقط (اختياري) | — | — | الزر والرابط = `web_layout` |
| notes | صورة خلفية (اختياري) | — | items live | أو `web_layout` |
| rsvp | — | — | — | `web_layout` دائماً |
| ticket_confirmation | `closing.mp4` أو `closing.webp` | — | closingTitle live | فيديو loop أو صورة ثابتة |

### بنية المجلدات (Phase 2.8)

```
public/assets/demo/noor/media-wedding/
  opening.mp4
  opening-poster.webp
  hero-bg.webp
  hero-foreground.webp
  message-bg.webp
  gallery-01.webp
  closing.mp4
  closing-poster.webp

public/assets/demo/noor/media-birth/
  opening.mp4
  opening-poster.webp
  hero-bg.webp
  baby-bg.webp
  message-bg.webp
  gallery-01.webp
  closing.webp
```

### مثال config في Sequence

```ts
{
  sceneType: "opening",
  variant: "minimal_tap", // ignored when media-driven
  media: {
    compositionMode: "full_media",
    mainMedia: {
      type: "video",
      src: "/assets/demo/noor/media-wedding/opening.mp4",
      poster: "/assets/demo/noor/media-wedding/opening-poster.webp",
      fit: "cover",
      muted: true,
      playsInline: true,
      loop: false,
    },
    startBehavior: "center_button",
    startButtonText: "افتح الدعوة",
    playBehavior: "on_tap",
    revealAfter: "media_end",
    liveTextEnabled: false,
  },
}
```

### مثال layered hero مع أسماء live

```ts
{
  sceneType: "hero_names",
  media: {
    compositionMode: "layered_media",
    background: { type: "image", src: "/assets/demo/noor/media-wedding/hero-bg.webp", fit: "cover" },
    foreground: [
      { type: "image", src: "/assets/demo/noor/media-wedding/hero-foreground.webp", position: "bottom", fit: "contain" },
    ],
    liveTextEnabled: true,
    liveTextPlacement: "center",
    liveTextStyle: "classic",
  },
}
// الأسماء من InvitationData.content.hero_names — ليست داخل الصورة
```

### تجاوز media من InvitationData (بدون تعديل sequence)

```ts
mediaOverrides: {
  opening: {
    mainMedia: { type: "video", src: "/assets/clients/ahmad/opening-v2.mp4", poster: "..." },
    startButtonText: "ادخل",
  },
}
```

### قرار سريع: أي وضع أختار؟

| السيناريو | الوضع |
|---|---|
| المصمم سلّم فيديو افتتاحية جاهز | `full_media` |
| خلفية فنية + أسماء/تاريخ يتغيران | `layered_media` + live text |
| فورم RSVP أو عداد أو خريطة | `web_layout` |
| لا assets بعد | `web_layout` (الديموهات القديمة) أو placeholder gradient تلقائي |
