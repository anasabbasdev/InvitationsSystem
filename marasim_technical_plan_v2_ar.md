# خطة تقنية تنفيذية v2 لمشروع مراسِم Marasim

> آخر تحديث: يعكس فصل Sequence/Invitation، تدفق QR عبر `/s/[rsvp_view_token]`، وإكمال المرحلتين 0 و1.
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

- تحميل config الدعوة (مبني من Sequence + InvitationData).
- عرض المشاهد حسب الترتيب.
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
- إنشاء/تعديل Sequence (تصميم قابل لإعادة الاستخدام).
- إنشاء دعوة جديدة بربط Sequence + بيانات العميل.
- رفع assets (صور/فيديو/موسيقى).
- إنشاء controlled links.
- إدارة guest list.
- تصدير CSV.

---

## 4. المشاهد المعتمدة في المحرك

هذه هي المشاهد الأساسية المعتمدة من البداية. يجب إنشاء مكونات لها كلها في المرحلة الأولى حتى لو كانت بعض المشاهد بسيطة جداً في البداية.

### القائمة الأساسية 10 مشاهد

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

#### 10. ticket_confirmation
مشهد الإغلاق داخل الدعوة:
- شكر / نراكم قريباً.
- تأكيد استلام الطلب (عند تفعيل RSVP).
- **لا يعرض QR داخل الدعوة.**

حالة التذكرة وQR يظهران فقط في:
- `/s/[rsvp_view_token]` (Public Request)
- `/t/[ticketToken]` أو رابط controlled link (Controlled Link)

### ملاحظة مهمة

إذا كان RSVP غير مفعل، يتم إخفاء مشهدي rsvp وticket_confirmation أو تحويل ticket_confirmation إلى closing/thank_you بسيط.

لا تعرض QR داخل scroll الدعوة — المدعو غير مرتبط بحساب ولا يستطيع استرجاع التذكرة لاحقاً من نفس الصفحة.

---

## 5. نموذج البيانات المعتمد: Sequence + Invitation

لا تخلط التصميم مع بيانات العميل في ملف واحد.

### الطبقتان

| الطبقة | الملف | المحتوى |
|---|---|---|
| `InvitationSequence` | `data/sequences/*.sequence.ts` | theme, layout, variants, gradients, motion, defaultContent |
| `InvitationData` | `data/invitations/*.ts` | أسماء، تواريخ، صور، فيديو، RSVP، content overrides |

### الدمج قبل العرض

```txt
buildInvitationConfig(InvitationData, InvitationSequence) → InvitationConfig
```

```ts
// data/sequences/wedding-royal.sequence.ts — التصميم فقط
export const weddingRoyalSequence: InvitationSequence = {
  id: "wedding-royal",
  label: "Wedding Royal — Dark Gold",
  theme: { primaryColor: "#C9A24D", backgroundColor: "#0F0B08", /* ... */ },
  layout: { mobileMaxWidth: 430, minSupportedWidth: 348, safePaddingX: 24 },
  scenes: [
    {
      sceneType: "hero_names",
      variant: "calligraphy_reveal",
      background: { type: "gradient", value: "radial-gradient(...)" },
      defaultContent: { primaryName: "الاسم الأول", secondaryName: "الاسم الثاني" },
    },
    // ... باقي المشاهد بدون بيانات عميل حقيقية
  ],
};
```

```ts
// data/invitations/ahmad-sara-demo.ts — بيانات العميل فقط
export const ahmadSaraDemoData: InvitationData = {
  id: "demo-wedding-royal-01",
  slug: "demo-wedding",
  eventId: "event_demo_001",
  sequenceId: "wedding-royal",
  language: "ar",
  direction: "rtl",
  music: { enabled: true, src: "/assets/demo/wedding/music.mp3", startMode: "after_first_tap" },
  rsvp: { enabled: true, mode: "public_request", approvalRequired: true, maxPublicRequest: 4 },
  content: {
    hero_names: { primaryName: "أحمد", secondaryName: "سارة", subtitle: "..." },
    event_details: { date: "2026-09-15", time: "20:00", venueName: "قاعة المثال — دبي" },
    gallery_media: { media: [{ type: "image", src: "/assets/demo/wedding/photo-01.webp" }] },
    // ...
  },
  assetOverrides: {
    // اختياري: استبدال gradient بصورة/فيديو حقيقي
    // opening: { background: { type: "video", src: "/storage/client/opening.mp4" } },
  },
};
```

```ts
// data/demo-invitations/wedding-royal.ts — غلاف رفيع للـ registry
export const weddingRoyalConfig = buildInvitationConfig(
  ahmadSaraDemoData,
  weddingRoyalSequence
);
```

### إنشاء دعوة جديدة بنفس التصميم

1. أنشئ ملف `InvitationData` جديد في `data/invitations/`.
2. اربطه بـ `sequenceId: "wedding-royal"`.
3. املأ `content` و`assetOverrides`.
4. سجّل الـ slug في `lib/invitation-config.ts` (لاحقاً: Supabase).

### إنشاء Sequence جديدة

1. أنشئ ملف في `data/sequences/`.
2. عرّف theme + layout + scenes مع variants وdefaultContent فقط.
3. لا تضع أسماء أو تواريخ أو assets خاصة بعميل.
4. أعد استخدامها لعدة دعوات.

---

## 5.1 InvitationConfig النهائي (ما يستهلكه Renderer)

كل دعوة تُعرض عبر `InvitationConfig` مدمج. لا تكتب بيانات دعوة داخل components مباشرة.

مثال مبسط للشكل النهائي بعد الدمج:

```ts
export const invitationConfig = {
  id: "demo-wedding-royal-01",
  eventId: "event_001",
  slug: "ahmad-sara-wedding",
  language: "ar",
  direction: "rtl",
  theme: {
    family: "royal",
    primaryColor: "#C9A24D",
    secondaryColor: "#F7E7B4",
    backgroundColor: "#0F0B08",
    fontHeading: "CustomArabicFont",
    fontBody: "Tajawal"
  },
  layout: {
    mobileMaxWidth: 430,
    minSupportedWidth: 348,
    safePaddingX: 24
  },
  music: {
    enabled: true,
    src: "/assets/demo/wedding/music.mp3",
    startMode: "after_first_tap"
  },
  rsvp: {
    enabled: true,
    mode: "public_request",
    approvalRequired: true,
    maxPublicRequest: 4
  },
  scenes: [
    {
      id: "opening-01",
      type: "opening",
      variant: "envelope_video",
      background: {
        type: "video",
        src: "/assets/demo/wedding/opening.mp4",
        fit: "cover"
      },
      content: {
        tapText: "افتح الدعوة"
      },
      motion: {
        enter: "fade",
        scrollHint: true
      }
    },
    {
      id: "hero-01",
      type: "hero_names",
      variant: "calligraphy_reveal",
      background: {
        type: "image",
        src: "/assets/demo/wedding/bg-gold.webp",
        fit: "cover"
      },
      foreground: [
        {
          type: "image",
          src: "/assets/demo/wedding/ornament-bottom.webp",
          position: "bottom",
          opacity: 0.85
        }
      ],
      content: {
        primaryName: "أحمد",
        secondaryName: "سارة",
        subtitle: "يتشرفان بدعوتكم لحضور حفل زفافهما"
      },
      motion: {
        names: "fade_up",
        ornaments: "slow_float"
      }
    },
    {
      id: "message-01",
      type: "invitation_message",
      variant: "classic_card",
      content: {
        title: "دعوة كريمة",
        body: "يسعدنا حضوركم ومشاركتكم فرحتنا في هذه الليلة المميزة."
      },
      motion: {
        card: "scroll_reveal"
      }
    },
    {
      id: "details-01",
      type: "event_details",
      variant: "stacked_info",
      content: {
        date: "2026-09-15",
        time: "20:00",
        venueName: "قاعة المثال - دبي"
      }
    },
    {
      id: "countdown-01",
      type: "countdown",
      variant: "minimal_luxury",
      content: {
        targetDate: "2026-09-15T20:00:00+04:00"
      }
    },
    {
      id: "gallery-01",
      type: "gallery_media",
      variant: "single_video_or_image",
      content: {
        media: [
          { type: "image", src: "/assets/demo/wedding/photo-01.webp", alt: "" }
        ]
      }
    },
    {
      id: "location-01",
      type: "location",
      variant: "map_button",
      content: {
        venueName: "قاعة المثال - دبي",
        address: "Dubai, UAE",
        mapUrl: "https://maps.google.com/"
      }
    },
    {
      id: "notes-01",
      type: "notes",
      variant: "simple_list",
      content: {
        items: ["يرجى تأكيد الحضور", "الدعوة خاصة للعائلة"]
      }
    },
    {
      id: "rsvp-01",
      type: "rsvp",
      variant: "public_request_form"
    },
    {
      id: "ticket-01",
      type: "ticket_confirmation",
      variant: "closing_or_status"
    }
  ]
};
```

> ملاحظة: المثال أعلاه يمثل الشكل النهائي بعد `buildInvitationConfig()`. المصدر الحقيقي للصيانة هو ملفا Sequence + InvitationData وليس ملف config واحد ضخم.

---

## 6. Types المعتمدة

```ts
export type SceneType =
  | "opening"
  | "hero_names"
  | "invitation_message"
  | "event_details"
  | "countdown"
  | "gallery_media"
  | "location"
  | "notes"
  | "rsvp"
  | "ticket_confirmation";

export type LayerType = "image" | "video" | "color" | "gradient" | "lottie";

export type Layer = {
  type: LayerType;
  src?: string;
  value?: string;
  fit?: "cover" | "contain";
  position?: "top" | "center" | "bottom" | "full";
  opacity?: number;
};

export type InvitationScene = {
  id: string;
  type: SceneType;
  variant: string;
  background?: Layer;
  overlay?: Layer;
  foreground?: Layer[];
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
  layout: {
    mobileMaxWidth: number;
    minSupportedWidth: number;
    safePaddingX: number;
  };
  music: {
    enabled: boolean;
    src?: string;
    startMode: "after_first_tap" | "manual" | "disabled";
  };
  rsvp: {
    enabled: boolean;
    mode: "none" | "public_request" | "controlled_link";
    approvalRequired: boolean;
    maxPublicRequest?: number;
  };
  scenes: InvitationScene[];
};

// ── Sequence + InvitationData (طبقتان قبل الدمج) ──

export type SceneDefinition = {
  sceneType: SceneType;
  variant: string;
  background?: Layer;
  overlay?: Layer;
  foreground?: Layer[];
  defaultContent?: Record<string, unknown>;
  motion?: Record<string, unknown>;
};

export type InvitationSequence = {
  id: string;
  label: string;
  theme: InvitationTheme;
  layout: InvitationConfig["layout"];
  scenes: SceneDefinition[];
};

export type InvitationData = {
  id: string;
  slug: string;
  eventId: string;
  sequenceId: string;
  language: "ar" | "en";
  direction: "rtl" | "ltr";
  music: InvitationConfig["music"];
  rsvp: InvitationConfig["rsvp"];
  content: Partial<Record<SceneType, Record<string, unknown>>>;
  assetOverrides?: Partial<Record<SceneType, {
    background?: Layer;
    overlay?: Layer;
    foreground?: Layer[];
  }>>;
  themeOverrides?: Partial<InvitationTheme>;
};
```

---

## 7. بنية الملفات المعتمدة

```txt
marasim/                              # تطبيق Next.js (اسم المشروع ليس نهائياً)
src/
  app/
    i/[slug]/page.tsx
    s/[token]/page.tsx                # صفحة حالة المدعو + QR (المرحلة 3)
    owner/
      login/page.tsx
      events/page.tsx
      events/[eventId]/page.tsx
      events/[eventId]/rsvps/page.tsx
      events/[eventId]/tickets/page.tsx
      events/[eventId]/scanner/page.tsx
      events/[eventId]/notifications/page.tsx
    admin/
      page.tsx
  components/
    invitation/
      InvitationRenderer.tsx
      SceneFrame.tsx
      LayerRenderer.tsx
      MusicGate.tsx
      scenes/
        OpeningScene.tsx
        HeroNamesScene.tsx
        InvitationMessageScene.tsx
        EventDetailsScene.tsx
        CountdownScene.tsx
        GalleryMediaScene.tsx
        LocationScene.tsx
        NotesScene.tsx
        RSVPScene.tsx
        TicketConfirmationScene.tsx   # إغلاق فقط — بدون QR
    dashboard/
      EventOverviewCards.tsx
      RSVPRequestsTable.tsx
      SeatCounters.tsx
      OwnerNotifications.tsx
    scanner/
      QRScanner.tsx
      TicketValidationResult.tsx
      CheckinActions.tsx
    ui/
  lib/
    build-config.ts                   # buildInvitationConfig()
    supabase.ts
    invitation-config.ts              # slug registry
    rsvp.ts
    tickets.ts
    checkin.ts
    notifications.ts
  types/
    invitation.ts
    rsvp.ts
    tickets.ts
    events.ts
  data/
    sequences/
      wedding-royal.sequence.ts
    invitations/
      ahmad-sara-demo.ts
    demo-invitations/
      wedding-royal.ts
      birth-elegant.ts
  public/
    assets/
      demo/
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

## 10. قاعدة البيانات المقترحة

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

create table invitations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  slug text unique not null,
  sequence_id text not null,
  invitation_data_json jsonb not null,
  config_json jsonb not null,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- sequences يمكن تخزينها في جدول منفصل لاحقاً في Admin
-- create table invitation_sequences (
--   id text primary key,
--   label text not null,
--   sequence_json jsonb not null,
--   created_at timestamptz default now()
-- );

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

---

## 11. مراحل التنفيذ المعتمدة

### المرحلة 0: إعداد المشروع والاتفاقات ✅ مكتملة

- إنشاء المشروع في `marasim/` (Next.js 16.x + React 19.2 + Tailwind v4).
- إضافة AGENTS.md.
- تثبيت TypeScript/Tailwind/Framer Motion/React Hook Form/Zod.
- وضع بنية folders الأساسية.
- لا يتم ربط Supabase قبل تثبيت الواجهة الأساسية.

### المرحلة 1: محرك الدعوة الكامل Skeleton ✅ مكتملة

الهدف: بناء الهيكل الكامل للمحرك والمشاهد العشرة.

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


### المرحلة 3: Supabase + RSVP Public Request + صفحة الحالة

المطلوب:

- إعداد Supabase client.
- إنشاء الجداول الأساسية (مع `rsvp_view_token`).
- ربط RSVPScene بقاعدة البيانات.
- إرسال public request بحالة pending.
- redirect إلى `/s/[rsvp_view_token]` بعد الإرسال.
- صفحة `/s/[token]` تعرض الحالة وQR بعد الموافقة.
- إنشاء notification لصاحب المناسبة.

معيار القبول:

- المدعو يرسل طلب حضور ويصل لصفحة حالته الشخصية.
- الطلب يظهر في قاعدة البيانات.
- لا يتم خصم المقاعد قبل الموافقة.
- بعد الموافقة يظهر QR في صفحة الحالة وليس داخل الدعوة.

### المرحلة 4: Owner Dashboard PWA Skeleton + Admin Sequences

المطلوب:

- صفحة owner event overview.
- Seat counters.
- RSVP requests list.
- approve / reject / edit seats.
- in-app notifications.
- Admin: إنشاء/تعديل sequences.
- Admin: إنشاء دعوة جديدة = sequence + invitation data + assets.
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
- لا تخلط Sequence (تصميم) مع InvitationData (بيانات عميل) في ملف واحد.
- استخدم `buildInvitationConfig()` دائماً قبل التمرير للـ Renderer.
- لا تعرض QR داخل scroll الدعوة — استخدم `/s/[rsvp_view_token]` أو controlled link.
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

1. فتح رابط دعوة demo على الموبايل.
2. مشاهدة 10 مشاهد بالترتيب.
3. إرسال RSVP والوصول لصفحة حالة شخصية `/s/[token]`.
4. الموافقة عليه من dashboard.
5. توليد QR وعرضه في صفحة الحالة (وليس داخل الدعوة).
6. مسح QR عبر `/t/[ticketToken]`.
7. تسجيل دخول جزء من المجموعة.
8. منع تجاوز المقاعد.
9. عرض WRONG_EVENT عند المناسبة الخاطئة.
10. إنشاء دعوة جديدة من sequence موجود + بيانات جديدة.
11. تصوير فيديو تسويقي للديمو وإرساله لعملاء محتملين.
