# خطة تقنية تنفيذية v2 لمشروع مراسِم Marasim

> آخر تحديث: **Phase 2.12** — معمارية V2 فقط كمرجع، عقد قاعدة البيانات، وسياسة الـ Snapshot قبل Supabase.
>
> **المعمارية المعتمدة:** `SequenceBlueprint` + `DesignPreset` + `InvitationData` → `buildInvitationConfigV2()` → `InvitationConfig` → `InvitationRenderer`
>
> هذا الملف مخصص لوضعه داخل Cursor كبداية تنفيذ مباشرة. الهدف ليس بناء SaaS كامل، ولا صفحة HTML واحدة، بل بناء محرك دعوات تفاعلية قابل للتكرار، مع Dashboard لصاحب المناسبة، RSVP مضبوط، وتذاكر QR جماعية.

---

## 0. القرار التنفيذي المعتمد

المشروع يقوم على مبدأ:

**Custom من الخارج، Modular من الداخل.**

للعميل نبيع دعوة مخصصة وفاخرة. داخلياً نبني محركاً ثابتاً يعرض مشاهد محددة من خلال JSON Config وAssets قابلة للتبديل.

لا نبني محرر قوالب للعميل الآن.  
لا نبني صفحة HTML منفصلة لكل عميل.  
لا نبني SaaS self-service في الـ MVP.  
نبني **Invitation Renderer / Player**.

---

## 1. الهدف من الـ MVP

الـ MVP يجب أن يثبت أننا قادرون على:

1. إنشاء دعوة رقمية فاخرة تعمل بسلاسة على الموبايل.
2. تغيير التصميم والهوية والـ assets بدون إعادة كتابة المحرك.
3. استقبال RSVP من المدعوين.
4. تمكين صاحب المناسبة من متابعة الطلبات والمقاعد من Dashboard قابل للعمل كـ PWA.
5. إصدار QR ticket للمجموعة بعد التأكيد.
6. تمكين المنظم من مسح QR وتسجيل دخول 1 أو أكثر من نفس المجموعة.
7. منع تجاوز المقاعد أو استخدام QR في مناسبة خاطئة.

---

## 2. التقنية المعتمدة

### Frontend

- React 19.2 + TypeScript.
- Next.js 16.x (التطبيق داخل مجلد `marasim/`).
- Tailwind CSS v4 للتنسيق.
- Framer Motion للحركات الأساسية.
- React Hook Form + Zod للفورمات والتحقق.

### Backend / Database

- Supabase:
  - PostgreSQL.
  - Auth للمالك/admin.
  - RLS لاحقاً، لكن يجب عدم نسيانها.
  - Realtime اختياري لاحقاً للداشبورد.

### Storage

- في البداية: public assets داخل المشروع للديمو.
- لاحقاً: Cloudflare R2 للصور والفيديوهات الثقيلة.

### PWA

- PWA لصاحب المناسبة والمنظم فقط.
- المدعو لا يحتاج PWA ولا حساب.
- في الـ MVP نبني dashboard قابلاً للتحول إلى PWA مع in-app notifications.
- Push notifications ليست شرطاً أساسياً في أول نسخة، لكنها قابلة للإضافة لاحقاً.

---

## 3. الواجهات الأساسية

### 3.1 صفحة الدعوة العامة

```txt
/i/[invitationSlug]
```

تعرض الدعوة التفاعلية على الموبايل.

المهام:

- تحميل config الدعوة (V2: `buildInvitationConfigV2` أو snapshot منشور من `published_snapshots`).
- عرض المشاهد حسب ترتيب الـ Blueprint (المشاهد ذات `enabled: false` لا تُعرض).
- تشغيل الموسيقى بعد أول tap.
- إظهار RSVP إذا كان مفعلاً.
- مشهد `ticket_confirmation` داخل الدعوة = إغلاق / شكر فقط — **ليس** صفحة QR.

### 3.1.1 صفحة حالة المدعو الشخصية (بدون حساب)

```txt
/s/[rsvp_view_token]
```

صفحة خاصة بالمدعو بعد إرسال RSVP في وضع Public Request.

المهام:

- عرض حالة الطلب: `pending` / `approved` / `rejected`.
- عند الموافقة: عرض QR ticket والتذكرة الجماعية.
- لا يحتاج المدعو login أو PWA.
- الرابط يُولَّد عند الإرسال ويُحفظ من قبل المدعو (screenshot / bookmark).
- لاحقاً: يمكن للمالك نسخ الرابط وإرساله يدوياً (WhatsApp في مرحلة لاحقة).

### 3.1.2 صفحة التذكرة المباشرة

```txt
/t/[ticketToken]
```

- الرابط الذي يُشفَّر داخل QR.
- يعرض التذكرة للمدعو.
- Scanner يقرأ هذا الرابط ويتحقق من قاعدة البيانات.

### 3.2 Dashboard صاحب المناسبة

```txt
/owner/events/[eventId]
```

المهام:

- عدد المقاعد الكلي.
- المقاعد المؤكدة.
- المقاعد المتبقية.
- طلبات الحضور pending.
- قبول/رفض/تعديل عدد المقاعد.
- عرض التذاكر.
- فتح scanner.
- سجل إشعارات داخل التطبيق.

### 3.3 Scanner يوم المناسبة

```txt
/owner/events/[eventId]/scanner
```

المهام:

- مسح QR.
- التحقق أن التذكرة تخص نفس المناسبة.
- عرض معلومات مختصرة للمنظم.
- تسجيل دخول 1 أو 2 أو 3 أو الكل حسب العدد المتبقي.
- منع استخدام أكثر من max_entries.

### 3.4 Admin داخلي

```txt
/admin
```

المهام:

- إنشاء مناسبة.
- إنشاء/تعديل Blueprint (رحلة) و Design Preset (هوية بصرية).
- إنشاء دعوة جديدة = blueprint + preset + invitation data + assets.
- رفع assets (صور/فيديو/موسيقى).
- إنشاء controlled links.
- إدارة guest list.
- تصدير CSV.

---

## 4. مكتبة المشاهد (Scene Library)

الأنواع العشرة التالية هي **مكتبة مكونات** قابلة لإعادة الاستخدام — وليست رحلة إجبارية ثابتة. كل دعوة تحدد رحلتها عبر `SequenceBlueprint`: يمكن إضافة، حذف، تكرار، وإعادة ترتيب المشاهد.

### الأنواع المعتمدة (10)

```txt
1. opening
2. hero_names
3. invitation_message
4. event_details
5. countdown
6. gallery_media
7. location
8. notes
9. rsvp
10. ticket_confirmation
```

### شرح سريع

#### 1. opening
مشهد البداية: ظرف، باب، ستارة، فيديو افتتاحي، tap to open.

#### 2. hero_names
أسماء أصحاب المناسبة، خط عربي/لاتيني، كشف أسماء، زخارف.

#### 3. invitation_message
رسالة الدعوة الرسمية أو النص الشعوري.

#### 4. event_details
التاريخ، الوقت، نوع المناسبة، اسم القاعة.

#### 5. countdown
عداد تنازلي حتى يوم المناسبة.

#### 6. gallery_media
صور أو فيديو قصير أو لحظة سينمائية.

#### 7. location
اسم المكان، العنوان، زر فتح Google Maps.

#### 8. notes
تعليمات: dress code، family only، الدعوة خاصة، إلخ.

#### 9. rsvp
فورم تأكيد الحضور عند تفعيل RSVP.

#### 10. ticket_confirmation (Closing Scene)
مشهد الإغلاق داخل الدعوة — الاسم التاريخي في الكود `ticket_confirmation`، والوظيفة **Closing Scene** فقط:
- شكر / نراكم قريباً.
- رسالة وداع (قد تشير لاستلام الطلب عند تفعيل RSVP).
- **لا يعرض QR داخل الدعوة.**

حالة التذكرة وQR يظهران فقط في:
- `/s/[rsvp_view_token]` (Public Request)
- `/t/[ticketToken]` أو رابط controlled link (Controlled Link)

### ملاحظات الرحلة وRSVP

- كل مشهد يُتحكم بظهوره عبر `enabled` على مستوى الـ scene instance — وليس عبر `variant: "hidden"`.
- تعطيل RSVP (`rsvp.enabled = false`) **لا يخفي** مشهد الإغلاق تلقائياً. لإخفاء `rsvp` أو Closing Scene يجب تعطيل المشهد نفسه في overrides.
- لا تعرض QR داخل scroll الدعوة — المدعو غير مرتبط بحساب.

---

## 5. نموذج البيانات المعتمد (V2)

لا تخلط الرحلة مع التصميم مع بيانات العميل في ملف واحد.

### الطبقات الست

| # | الطبقة | النوع | الملف | المحتوى |
|---|---|---|---|---|
| 1 | مكتبة المشاهد | `SceneType` | `scene-registry.tsx` | 10 أنواع — كتالوج مكونات، ليست رحلة |
| 2 | الرحلة | `SequenceBlueprint` | `data/blueprints/*.blueprint.ts` | `SceneBlueprintEntry[]`: id, type, enabledByDefault, required |
| 3 | التصميم | `DesignPreset` | `data/presets/*.preset.ts` | theme, typeDefaults[sceneType], sceneOverrides[sceneId] |
| 4 | المحتوى | `InvitationData` | `data/invitations/*.ts` | أسماء، تواريخ، RSVP، sceneOverrides[sceneId] |
| 5 | المدمج | `InvitationConfig` | يُبنى وقت التشغيل | InvitationScene[] جاهز للـ Renderer |
| 6 | المنشور | `PublishedSnapshot` | `published_snapshots` (Phase 3A) | InvitationConfig مجمد + snapshotAt + مراجع الإصدارات |

**SceneInstance** = وحدة مشهد محلولة وقت التشغيل: `InvitationScene` بـ `id` فريد (sceneId) و `type` (SceneType).

### مسار الدمج

```txt
SequenceBlueprint + DesignPreset + InvitationData
  → buildInvitationConfigV2()
  → InvitationConfig
  → InvitationRenderer
```

### ترتيب الدمج (الأولوية من الأدنى للأعلى)

1. **Blueprint** — `SceneBlueprintEntry` (id, type, enabled من enabledByDefault/required)
2. **Preset** — `typeDefaults[sceneType]`
3. **Preset** — `sceneOverrides[sceneId]`
4. **Data** — `sceneOverrides[sceneId]` (محتوى، enabled، أصول)
5. → **InvitationScene** محلول

### مثال Blueprint (رحلة فقط)

```ts
// data/blueprints/wedding-standard.blueprint.ts
export const weddingStandardBlueprint: SequenceBlueprint = {
  id: "wedding-standard",
  label: "Wedding Standard Journey",
  version: "1.0.0",
  layout: { mobileMaxWidth: 430, minSupportedWidth: 348, safePaddingX: 24 },
  scenes: [
    { id: "ws-opening", type: "opening", label: "Opening", enabledByDefault: true },
    { id: "ws-hero", type: "hero_names", enabledByDefault: true },
    { id: "ws-gallery-a", type: "gallery_media", label: "Gallery A" },
    { id: "ws-gallery-b", type: "gallery_media", label: "Gallery B" },
    // ... باقي المشاهد — بدون theme ولا variant ولا محتوى عميل
  ],
};
```

### مثال Design Preset (تصميم فقط)

```ts
// data/presets/wedding-royal-dark.preset.ts
export const weddingRoyalDarkPreset: DesignPreset = {
  id: "wedding-royal-dark",
  label: "Royal Dark",
  version: "1.0.0",
  theme: { primaryColor: "#C9A24D", backgroundColor: "#0F0B08", design: { cardStyle: "framed", /* ... */ } },
  typeDefaults: {
    opening: { variant: "rings_luxury", media: { compositionMode: "web_layout" } },
    hero_names: { variant: "stacked_calligraphy" },
  },
  sceneOverrides: {
    "ws-gallery-a": { variant: "single_card", media: { compositionMode: "full_media" } },
    "ws-gallery-b": { variant: "full_bleed_media" },
  },
};
```

### مثال InvitationData (محتوى العميل)

```ts
// data/invitations/ws-royal-demo.ts
export const wsRoyalDemoData: InvitationData = {
  id: "ws-royal-demo-01",
  slug: "ws-royal-demo",
  eventId: "event_demo_ws",
  blueprintId: "wedding-standard",
  presetId: "wedding-royal-dark",
  language: "ar",
  direction: "rtl",
  music: { enabled: true, src: "/assets/demo/wedding/music.mp3", startMode: "after_first_tap" },
  rsvp: { enabled: true, mode: "public_request", approvalRequired: true, maxPublicRequest: 4 },
  sceneOverrides: {
    "ws-hero": {
      content: { primaryName: "أحمد", secondaryName: "سارة", subtitle: "..." },
    },
    "ws-gallery-a": {
      content: { media: [{ type: "image", src: "/assets/demo/wedding/photo-01.webp" }] },
    },
    // rsvp: { enabled: false }  — لتعطيل مشهد RSVP مستقلاً
  },
};
```

### البناء والتسجيل

```ts
const config = buildInvitationConfigV2(weddingStandardBlueprint, weddingRoyalDarkPreset, wsRoyalDemoData);
// للنشر: const snapshot = createPublishedSnapshot(config);
```

### قواعد إنشاء جديد

| التغيير | الإجراء |
|---|---|
| رحلة مختلفة (عدد/ترتيب/تكرار) | `SequenceBlueprint` جديد في `data/blueprints/` |
| هوية بصرية أو أصول جديدة | `DesignPreset` جديد في `data/presets/` |
| دعوة عميل جديد | `InvitationData` جديد + نفس blueprint/preset أو مختلفين |
| slug عام | تسجيل في `lib/invitation-config.ts` (Phase 3A: Supabase + fallback محلي) |

---

## 5.1 InvitationConfig النهائي (ما يستهلكه Renderer)

كل دعوة تُعرض عبر `InvitationConfig` مدمج. لا تكتب بيانات دعوة داخل components مباشرة.

الشكل النهائي يتضمن `scenes[]` حيث كل عنصر:

```ts
{
  id: "ws-hero",           // sceneId — مفتاح overrides
  type: "hero_names",      // SceneType — يحدد المكون من scene-registry
  enabled: true,
  variant: "stacked_calligraphy",
  design?: SceneDesign,
  media?: SceneMediaConfig,
  background?: Layer,
  content?: { primaryName: "أحمد", /* ... */ },
}
```

> المصدر الحقيقي للصيانة: Blueprint + Preset + InvitationData — وليس ملف config واحد ضخم.
> الدعوات المنشورة تُقرأ من `PublishedSnapshot.resolved_config_json` وليس من إعادة دمج حية.

### سياسة الـ Snapshot

- **مسودة (draft):** تُبنى من أحدث Blueprint/Preset/Data المرتبطة.
- **منشورة (published):** تعرض الـ snapshot المجمد فقط.
- تعديل Blueprint أو Preset لا يغيّر دعوة منشورة تلقائياً.
- إعادة النشر تنشئ snapshot جديدة؛ تُحفظ القديمة للتدقيق أو rollback.

---

## 6. Types المعتمدة (V2)

```ts
export type SceneType =
  | "opening" | "hero_names" | "invitation_message" | "event_details"
  | "countdown" | "gallery_media" | "location" | "notes" | "rsvp"
  | "ticket_confirmation";  // Closing Scene — الاسم التاريخي

export type SceneBlueprintEntry = {
  id: string;
  type: SceneType;
  label?: string;
  enabledByDefault?: boolean;
  required?: boolean;
};

export type SequenceBlueprint = {
  id: string;
  label: string;
  version?: string;
  layout: InvitationLayout;
  scenes: SceneBlueprintEntry[];
};

export type DesignPresetScene = {
  variant?: string;
  design?: SceneDesign;
  media?: SceneMediaConfig;
  background?: Layer;
  defaultContent?: Record<string, unknown>;
  motion?: Record<string, unknown>;
};

export type DesignPreset = {
  id: string;
  label: string;
  version?: string;
  theme: InvitationTheme;
  typeDefaults?: Partial<Record<SceneType, DesignPresetScene>>;
  sceneOverrides?: Record<string, DesignPresetScene>;
};

export type SceneInstanceOverride = {
  enabled?: boolean;
  variant?: string;
  content?: Record<string, unknown>;
  design?: SceneDesign;
  media?: SceneMediaConfig;
  background?: Layer;
  overlay?: Layer;
  foreground?: Layer[];
};

export type InvitationData = {
  id: string;
  slug: string;
  eventId: string;
  blueprintId: string;
  presetId: string;
  language: "ar" | "en";
  direction: "rtl" | "ltr";
  music: InvitationMusic;
  rsvp: InvitationRSVP;
  sceneOverrides?: Record<string, SceneInstanceOverride>;
};

export type InvitationScene = {
  id: string;
  type: SceneType;
  enabled: boolean;
  variant: string;
  design?: SceneDesign;
  media?: SceneMediaConfig;
  background?: Layer;
  content?: Record<string, unknown>;
  motion?: Record<string, unknown>;
};

export type InvitationConfig = {
  id: string;
  eventId: string;
  slug: string;
  language: "ar" | "en";
  direction: "rtl" | "ltr";
  theme: InvitationTheme;
  layout: InvitationLayout;
  music: InvitationMusic;
  rsvp: InvitationRSVP;
  scenes: InvitationScene[];
  snapshotAt?: string;
  blueprintRef?: { id: string; version: string };
  presetRef?: { id: string; version: string };
  dataRef?: { id: string };
};

// PublishedSnapshot = InvitationConfig مجمد في published_snapshots.resolved_config_json
```

> التفاصيل الكاملة في `marasim/src/types/invitation.ts`.

## 7. بنية الملفات المعتمدة (V2)

```txt
marasim/
src/
  app/
    i/[slug]/page.tsx
    s/[token]/page.tsx                # Phase 3B
    t/[ticketToken]/page.tsx          # Phase 5
    lab/
      composer/page.tsx               # Scene Instance Composer
      composer/userguide/page.tsx
    owner/ ...
    admin/page.tsx
  components/
    invitation/
      InvitationRenderer.tsx
      SceneFrame.tsx
      LayerRenderer.tsx
      MediaSceneRenderer.tsx
      MusicGate.tsx
      scene-registry.tsx              # SceneType → component
      scenes/ ...
    lab/
      ComposerApp.tsx
      JourneyPanel.tsx
      DesignPanel.tsx
      ContentPanel.tsx
    dashboard/ ...
    scanner/ ...
    ui/
  lib/
    build-config.ts                   # buildInvitationConfigV2 + createPublishedSnapshot
    preset-utils.ts
    composer/
      state.ts
      journey.ts
    scene-design.ts
    supabase.ts                       # Phase 3A+
    invitation-config.ts
    rsvp.ts | tickets.ts | checkin.ts | notifications.ts
  types/
    invitation.ts                     # V2 + Legacy V1 types
    rsvp.ts | tickets.ts | events.ts
  data/
    blueprints/                       # SequenceBlueprint
      wedding-standard.blueprint.ts
      wedding-short.blueprint.ts
    presets/                          # DesignPreset
      wedding-royal-dark.preset.ts
      wedding-cinematic-floral.preset.ts
    invitations/                      # InvitationData
      ws-royal-demo.ts
    sequences/                        # LEGACY V1 — ديموهات قديمة فقط
    demo-invitations/                 # LEGACY V1 wrappers
  public/assets/demo/
```

---

## 8. RSVP المعتمد

### 8.1 Public Request RSVP

رابط عام، أي شخص يطلب الحضور، لكن لا يحصل على QR مباشرة داخل الدعوة.

Flow:

```txt
Guest submits RSVP on /i/[slug]
-> rsvp.status = pending
-> generate rsvp_view_token (unguessable)
-> redirect guest to /s/[rsvp_view_token]
-> dashboard notification created
-> owner approves / edits seats / rejects
-> if approved: ticket generated
-> same /s/[rsvp_view_token] now shows QR ticket
```

قواعد مهمة:

- requested_seats لا تخصم من المقاعد.
- approved_seats فقط هي التي تخصم.
- لا QR قبل الموافقة.
- QR لا يظهر داخل scroll الدعوة.
- max_public_request يمنع طلب أرقام غير منطقية.
- المدعو لا يحتاج حساب — الرابط الشخصي هو وسيلة الوصول.

### 8.2 Controlled Link RSVP

رابط خاص لكل شخص/عائلة/مجموعة.

Flow:

```txt
Owner/admin creates invite link with max_seats
-> Guest opens /i/[slug]?t=[invite_token]
-> Guest confirms seats <= max_seats
-> ticket generated immediately
-> guest sees QR on the same controlled/status page
```

قواعد مهمة:

- لا يمكن تجاوز max_seats.
- يمكن جعل الرابط يستخدم مرة واحدة.
- يمكن ربط الرابط بطرف العريس/العروس/VIP.
- الرابط الخاص نفسه يصبح صفحة التذكرة بعد التأكيد.

---

## 9. QR Group Ticket

كل RSVP approved أو controlled confirmation ينتج ticket واحد للمجموعة.

### أين يظهر QR للمدعو؟

| الوضع | صفحة العرض |
|---|---|
| Public Request | `/s/[rsvp_view_token]` بعد الموافقة |
| Controlled Link | نفس رابط الدعوة الخاص بعد التأكيد |
| Scanner | يقرأ `/t/[ticketToken]` فقط |

QR داخل scroll الدعوة (`/i/[slug]`) **ممنوع** — المدعو غير مرتبط بحساب.

### بيانات تظهر عند المسح

```txt
Status: صالح / غير صالح / مستخدم بالكامل / لا يخص هذه المناسبة
Event: اسم المناسبة
Date: التاريخ
Venue: المكان
Guest: اسم الضيف
Side: طرف العريس / العروس / عام / VIP
Seats: عدد المقاعد
Used: 0 من 4
```

### أزرار check-in

إذا max_entries = 4 و used_entries = 0:

```txt
إدخال 1
إدخال 2
إدخال 3
إدخال الكل
```

بعد كل إدخال يتم تحديث used_entries.

### منع مناسبة خاطئة

```ts
if (scannerEventId !== ticket.eventId) {
  return "WRONG_EVENT";
}
```

---

## 10. عقد قاعدة البيانات (Phase 3A — تصميم فقط، غير منفّذ)

> **لا تنشئ جداول أو migrations قبل الموافقة الصريحة على Phase 3A.**
> قد تستخدم الـ schema UUID كمفاتيح أساسية مع business IDs نصية داخل JSON — يجب اتخاذ قرار واحد قبل كتابة الـ migration.

### جداول التصميم والدعوات

```sql
-- الرحلات القابلة لإعادة الاستخدام
create table sequence_blueprints (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  version text not null,
  blueprint_json jsonb not null,       -- SequenceBlueprint
  status text not null default 'active',  -- active | archived
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- الهويات البصرية
create table design_presets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  version text not null,
  compatible_blueprint_id uuid references sequence_blueprints(id),  -- null = عام
  preset_json jsonb not null,          -- DesignPreset
  status text not null default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- دعوة العميل
create table invitations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  slug text unique not null,
  blueprint_id uuid references sequence_blueprints(id) not null,
  blueprint_version text not null,
  preset_id uuid references design_presets(id) not null,
  preset_version text not null,
  invitation_data_json jsonb not null, -- InvitationData (بدون blueprint/preset مكررة)
  status text not null default 'draft',  -- draft | published | archived
  published_snapshot_id uuid,            -- FK → published_snapshots (nullable للمسودات)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- لقطة مجمدة عند النشر
create table published_snapshots (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid references invitations(id) on delete cascade not null,
  resolved_config_json jsonb not null, -- InvitationConfig كامل مجمد
  blueprint_id uuid not null,
  blueprint_version text not null,
  preset_id uuid not null,
  preset_version text not null,
  snapshot_at timestamptz not null default now()
);

alter table invitations
  add constraint fk_published_snapshot
  foreign key (published_snapshot_id) references published_snapshots(id);
```

### جداول تشغيلية (Phase 3B+)

```sql
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  event_date timestamptz,
  venue_name text,
  venue_address text,
  map_url text,
  total_capacity integer,
  confirmed_seats integer default 0,
  status text default 'draft',
  created_at timestamptz default now()
);

create table event_settings (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  rsvp_enabled boolean default false,
  rsvp_mode text default 'none',
  max_public_request integer default 4,
  approval_required boolean default true,
  cancellation_deadline_hours integer default 24,
  created_at timestamptz default now()
);

create table invite_links (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  token text unique not null,
  label text,
  side text,
  max_seats integer not null,
  used boolean default false,
  status text default 'active',
  expires_at timestamptz,
  created_at timestamptz default now()
);

create table rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  invite_link_id uuid references invite_links(id),
  name text not null,
  phone text,
  side text,
  requested_seats integer not null,
  approved_seats integer,
  status text default 'pending',
  rsvp_view_token text unique not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table tickets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  rsvp_id uuid references rsvps(id) on delete cascade,
  token text unique not null,
  max_entries integer not null,
  used_entries integer default 0,
  status text default 'active',
  created_at timestamptz default now()
);

create table checkins (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references tickets(id) on delete cascade,
  event_id uuid references events(id) on delete cascade,
  entries_count integer not null,
  checked_by uuid,
  created_at timestamptz default now()
);

create table event_notifications (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  type text not null,
  title text not null,
  message text,
  payload jsonb,
  read_at timestamptz,
  created_at timestamptz default now()
);
```

### تحميل الدعوة (Phase 3A)

```txt
slug → invitations row
  if status = published → published_snapshots.resolved_config_json
  if status = draft     → buildInvitationConfigV2(blueprint, preset, invitation_data_json)
fallback: lib/invitation-config.ts للديموهات المحلية
```

---

## 11. مراحل التنفيذ المعتمدة

### المرحلة 0: إعداد المشروع والاتفاقات ✅ مكتملة

- إنشاء المشروع في `marasim/` (Next.js 16.x + React 19.2 + Tailwind v4).
- إضافة AGENTS.md.
- تثبيت TypeScript/Tailwind/Framer Motion/React Hook Form/Zod.
- وضع بنية folders الأساسية.
- لا يتم ربط Supabase قبل تثبيت الواجهة الأساسية.

### المرحلة 1: محرك الدعوة الكامل Skeleton ✅ مكتملة (V1 — أصبح Legacy)

الهدف: بناء الهيكل الكامل للمحرك ومكتبة المشاهد العشرة.

> هذه المرحلة استخدمت `InvitationSequence` + `buildInvitationConfig()` — المسار المعتمد الآن هو V2 (Phase 2.10+).

المطلوب (منجز):

- types/invitation.ts (+ InvitationSequence, InvitationData)
- lib/build-config.ts + buildInvitationConfig()
- InvitationRenderer.tsx
- SceneFrame.tsx
- LayerRenderer.tsx
- MusicGate.tsx
- كل مكونات المشاهد العشرة
- فصل Sequence/Data: `data/sequences/` + `data/invitations/`
- demo config عبر `buildInvitationConfig()`
- route: /i/demo-wedding
- TicketConfirmationScene = إغلاق فقط (بدون QR مزيف)

معيار القبول (محقق):

- تفتح الدعوة على موبايل أو viewport 390px.
- تظهر كل المشاهد العشرة بالترتيب.
- يمكن إخفاء rsvp/ticket عندما rsvp.enabled = false.
- لا توجد بيانات hardcoded داخل scenes إلا fallback بسيط.
- يمكن إنشاء دعوة جديدة بربط sequence موجود + invitation data جديد.

### المرحلة 2: تحسين أول Demo بصرياً

الهدف: جعل أول دعوة قابلة للتصوير والتسويق.

المطلوب:

- تصميم Wedding Royal Demo.
- motion بسيط:
  - fade up.
  - scroll reveal.
  - slow float ornaments.
- Music starts after first tap.
- Mobile-first max width 430px.
- ضغط الصور والفيديوهات.

معيار القبول:

- الديمو يبدو مقنعاً في تسجيل شاشة موبايل.
- لا يوجد layout broken بين 348px و430px.



Phase 2.5 — Make engine ready for Noor assets and create two Noor-driven demos.

ماذا تعني Phase 2.5 عملياً؟
1. توحيد Asset Contract

يعني نحدد لنور الدين ماذا يسلّم.

مثلاً لكل مشهد:

scene: opening
background: opening-bg.mp4 أو opening-bg.webp
foreground: ornament-top.webp, ornament-bottom.webp
safe text area: center 70%
motion suggestion: reveal / fade / float
notes: لا تضع النص داخل الصورة إذا كان النص يجب أن يتغير
2. جعل كل Scene يقبل assets من config

مثلاً:

assetOverrides: {
  opening: {
    background: {
      type: "video",
      src: "/assets/noor/wedding/opening.mp4",
      fit: "cover"
    }
  },
  hero_names: {
    background: {
      type: "image",
      src: "/assets/noor/wedding/hero-bg.webp",
      fit: "cover"
    },
    foreground: [
      {
        type: "image",
        src: "/assets/noor/wedding/gold-ornament.webp",
        position: "bottom",
        opacity: 0.9
      }
    ]
  }
}
3. إنشاء ديموين يدويين

ليس من Admin.

يدوياً بالكود:

data/sequences/
  noor-wedding-luxury.sequence.ts
  noor-birth-soft.sequence.ts

data/invitations/
  noor-wedding-demo.ts
  noor-birth-demo.ts

data/demo-invitations/
  noor-wedding.ts
  noor-birth.ts

ثم routes:

/i/noor-wedding-demo
/i/noor-birth-demo
4. اختبار أن نفس Sequence تقبل بيانات مختلفة

يعني نأخذ noor-wedding-luxury.sequence.ts ونركب عليها دعوتين مختلفتين:

ahmad-sara
khalid-noura

### المرحلة 2.10: Architecture Validation & Journey Foundation ✅

المطلوب:

- فصل `SequenceBlueprint` (الرحلة) عن `DesignPreset` (الهوية البصرية) عن `InvitationData` (بيانات العميل).
- `buildInvitationConfigV2(blueprint, preset, data)`.
- `sceneId` مستقل عن `sceneType` — دعم تكرار نفس النوع.
- `enabled: false` لكل مشهد (بدلاً من `variant: "hidden"`).
- ثلاث دعوات من `wedding-standard` blueprint مع presets مختلفة: Royal Dark / Cinematic Floral / Minimal Modern.

### المرحلة 2.11: Scene Instance Composer & Architecture Closure ✅

المطلوب:

- Composer مفهرس بـ `sceneId` (ليس `sceneType`) في التعديلات والمعاينة والتصدير.
- Journey Editor: Add Scene / Duplicate / Remove / Move Up-Down / Enable-Disable / تعديل ID.
- `DesignPreset.typeDefaults` + `DesignPreset.sceneOverrides[sceneId]`.
- تصدير منفصل: Blueprint / Preset / InvitationData / Resolved Config.
- اختبار Gallery مكررة: `gallery-childhood` + `gallery-wedding-day`.
- سياسة `resolvedConfigSnapshot` للدعوات المنشورة.

معيار القبول:

- يمكن تكرار `gallery_media` مرتين وتعديل كل نسخة مستقلاً في Composer.
- نفس Blueprint + 3 Presets = 3 دعوات مختلفة جذرياً بدون تعطيل مشاهد مختلفة.
- `npm run build` و `tsc --noEmit` ينجحان.

**قاعدة معمارية نهائية:**

> assets جديدة أو تصميم جديد لا يعني Sequence جديدة.
> Sequence جديدة تُبنى فقط عندما تتغير رحلة الدعوة: عدد المشاهد، ترتيبها، تكرارها، أنواعها.


### المرحلة 2.12: Documentation & Persistence Contract Freeze ✅

المطلوب:

- V2 فقط كمعمارية أساسية في `AGENTS.md` وهذا الملف.
- V1 → Appendix Legacy.
- عقد قاعدة البيانات (blueprints, presets, invitations, snapshots).
- سياسة Snapshot موثقة.
- تقسيم Phase 3 → 3A (persistence) + 3B (RSVP).

معيار القبول:

- لا تعارض بين الوثائق ومعمارية V2 في الكود.
- لا migrations ولا Supabase جديد.
- `npm run build` لا يتأثر.

### المرحلة 3A: Supabase Persistence Foundation (لم تبدأ — تتطلب موافقة)

المطلوب:

- إعداد Supabase client.
- migrations للجداول: `sequence_blueprints`, `design_presets`, `invitations`, `published_snapshots` + `events`, `event_settings`.
- repositories لتحميل blueprint/preset/data/snapshot.
- تحميل دعوة بالـ slug من Supabase.
- fallback للـ registry المحلي للديموهات.
- **بدون** RSVP submission حقيقي.

معيار القبول:

- slug منشور يقرأ من snapshot مجمد.
- slug مسودة يُبنى حياً من أحدث blueprint/preset/data.
- الديموهات المحلية تعمل بدون Supabase.

### المرحلة 3B: Public Request RSVP (لم تبدأ — تتطلب موافقة)

المطلوب:

- ربط RSVPScene بقاعدة البيانات.
- إرسال public request بحالة pending.
- `rsvp_view_token` cryptographically strong.
- redirect إلى `/s/[rsvp_view_token]` بعد الإرسال.
- صفحة `/s/[token]`: pending / rejected / approved.
- إنشاء notification لصاحب المناسبة.
- **لا** خصم مقاعد قبل الموافقة.

معيار القبول:

- المدعو يرسل طلب حضور ويصل لصفحة حالته الشخصية.
- الطلب يظهر في قاعدة البيانات.
- بعد الموافقة يظهر QR في صفحة الحالة وليس داخل الدعوة.

### المرحلة 4: Owner Dashboard PWA Skeleton + Admin Blueprints/Presets

المطلوب:

- صفحة owner event overview.
- Seat counters.
- RSVP requests list.
- approve / reject / edit seats.
- in-app notifications.
- Admin: إنشاء/تعديل blueprints و presets.
- Admin: إنشاء دعوة جديدة = blueprint + preset + invitation data + assets.
- إعداد manifest كبداية PWA.

معيار القبول:

- صاحب المناسبة يرى الطلبات.
- يستطيع الموافقة أو الرفض.
- عند الموافقة يتم خصم المقاعد وتوليد ticket.

### المرحلة 5: QR Ticket + Scanner

المطلوب:

- توليد ticket token.
- عرض ticket + QR في `/s/[rsvp_view_token]` و `/t/[ticketToken]`.
- scanner route.
- ticket validation.
- check-in buttons حسب المقاعد المتبقية.
- منع ticket من مناسبة أخرى.

معيار القبول:

- QR يعمل.
- يمكن إدخال 1 أو أكثر.
- لا يمكن تجاوز max_entries.
- يظهر WRONG_EVENT عند مسح QR لمناسبة مختلفة.

### المرحلة 6: Controlled Link RSVP

المطلوب:

- إنشاء invite links.
- token خاص.
- max_seats.
- side/label.
- صفحة RSVP عبر controlled token.
- توليد ticket بعد التأكيد.

معيار القبول:

- المدعو لا يستطيع تجاوز max_seats.
- الرابط يمكن تعطيله.
- يمكن ربط الرابط بطرف العريس/العروس/VIP.

### المرحلة 7: Landing Page

المطلوب:

- صفحة تعريفية للمشروع.
- عرض demos.
- شرح الخدمة الأساسية.
- إبراز الخدمات الإضافية:
  - تصوير حفلات الزفاف.
  - تغطية فيديو.
  - ديكور ولادة.
  - توزيعات وهدايا.
- CTA: WhatsApp / Request Quote.

معيار القبول:

- الموقع يصلح لإرسال الرابط لعميل محتمل.

### المرحلة 8: تحسينات لاحقة وليست شرط MVP

- Push notifications.
- WhatsApp Business API.
- Stripe/online checkout.
- R2 upload pipeline.
- Admin UI أوسع.
- Analytics.
- Multi-tenant SaaS.

---

## 12. قواعد مهمة للمطور والـ AI Agent

- لا تبنِ صفحة واحدة hardcoded.
- لا تكسر schema المشاهد.
- لا تخلط Blueprint (رحلة) مع DesignPreset (تصميم) مع InvitationData (محتوى) في ملف واحد.
- استخدم `buildInvitationConfigV2()` لأي feature جديد — وليس `buildInvitationConfig()`.
- overrides الجديدة تستهدف `sceneId` — وليس `SceneType` وحده.
- لا تعرض QR داخل scroll الدعوة — استخدم `/s/[rsvp_view_token]` أو controlled link.
- لا تبدأ Supabase أو migrations قبل الموافقة على Phase 3A.
- لا تضف features خارج المرحلة الحالية.
- لا تجعل المدعو يحتاج login أو PWA.
- لا تخصم المقاعد قبل approval أو confirmation النهائي.
- لا تخزن معلومات حساسة داخل QR.
- لا تسلم HTML export للعميل.
- لا تجعل كل حركة فيديو ثقيل.
- يجب أن تكون الدعوة mobile-first.
- يجب أن تعمل بين 348px و430px بدون كسر.
- استخدم أحدث الإصدارات المتوافقة: Next.js 16.x, React 19.2, Tailwind v4.

---

## 13. معيار النجاح العملي

يعتبر المشروع قابلاً للعرض عندما نستطيع:

1. فتح رابط دعوة demo على الموبايل (V2: `ws-*` أو Legacy: `demo-wedding` / `noor-*`).
2. مشاهدة رحلة الدعوة حسب Blueprint (ليست بالضرورة 10 مشاهد ثابتة).
3. إرسال RSVP والوصول لصفحة حالة شخصية `/s/[token]`.
4. الموافقة عليه من dashboard.
5. توليد QR وعرضه في صفحة الحالة (وليس داخل الدعوة).
6. مسح QR عبر `/t/[ticketToken]`.
7. تسجيل دخول جزء من المجموعة.
8. منع تجاوز المقاعد.
9. عرض WRONG_EVENT عند المناسبة الخاطئة.
10. إنشاء دعوة جديدة من blueprint + preset + invitation data (V2).
11. تصوير فيديو تسويقي للديمو وإرساله لعملاء محتملين.

---

## Appendix A — Legacy V1 (توافق خلفي فقط)

> **لا تستخدم V1 لأي feature أو دعوة أو تصميم قاعدة بيانات جديد.**

### المسار القديم

```txt
InvitationSequence + InvitationData
  → buildInvitationConfig()   // @deprecated
  → InvitationConfig
```

### لماذا بقي؟

| العنصر | السبب |
|---|---|
| `data/sequences/*.sequence.ts` | ديموهات `demo-wedding`, `noor-*` تعمل قبل Phase 2.10 |
| `buildInvitationConfig()` | غلاف registry للـ slugs القديمة |
| `content[SceneType]` / `assetOverrides[SceneType]` | fallback في دمج V2 للبيانات القديمة |
| `InvitationSequence` / `SceneDefinition` | أنواع TypeScript محفوظة للتوافق |
| `data/demo-invitations/` | configs مبنية مسبقاً للـ registry |

### ما الذي تغيّر في V2؟

| V1 | V2 |
|---|---|
| Sequence = تصميم + رحلة معاً | Blueprint = رحلة فقط، Preset = تصميم فقط |
| overrides بـ `SceneType` | overrides بـ `sceneId` |
| `variant: "hidden"` | `enabled: false` |
| `sequenceId` في InvitationData | `blueprintId` + `presetId` |
| `config_json` + `is_published` في DB | `published_snapshots` منفصلة |
| رحلة 10 مشاهد ضمنية | رحلة قابلة للتخصيص per blueprint |

### ترحيل ديمو قديم إلى V2

1. استخرج ترتيب المشاهد و IDs → `SequenceBlueprint`
2. استخرج theme/variants/media → `DesignPreset`
3. استخرج أسماء/تواريخ/أصول → `InvitationData.sceneOverrides[sceneId]`
4. سجّل slug جديد أو حدّث registry
