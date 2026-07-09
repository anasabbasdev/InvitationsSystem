import React from "react";
import Link from "next/link";
import GuideShell, {
  Callout,
  CodeBlock,
  GuideTable,
  H2,
  H3,
  Ol,
  P,
  TocItem,
  Ul,
} from "./GuideShell";

const EXPORT_LUXURY_WEDDING = `{
  "themeOverrides": {
    "primaryColor": "#C9A84C",
    "secondaryColor": "#E8D5A3",
    "backgroundColor": "#1A1208",
    "textColor": "#F5F0E8",
    "mutedTextColor": "#9A8B72",
    "accentColor": "#D4AF37",
    "typography": {
      "headingFont": "var(--font-amiri)",
      "bodyFont": "var(--font-tajawal)",
      "namesFont": "var(--font-amiri)",
      "namesSize": "clamp(2.2rem, 10vw, 3.4rem)"
    },
    "design": {
      "cardStyle": "framed",
      "buttonStyle": "pill",
      "typographyStyle": "calligraphy",
      "density": "airy"
    }
  },
  "content": {
    "opening": { "tapText": "افتح الدعوة" },
    "hero_names": {
      "primaryName": "فيصل",
      "secondaryName": "دانة",
      "subtitle": "يتشرفان بدعوتكم لحفل زفافهما"
    },
    "invitation_message": {
      "title": "دعوة كريمة",
      "body": "يسعدنا أن نتشرف بدعوتكم لمشاركتنا فرحة زفافهما في أجواء مليئة بالحب والبهجة."
    },
    "event_details": {
      "date": "2026-12-20",
      "time": "20:30",
      "venueName": "قاعة اللؤلؤة — الخبر"
    },
    "countdown": { "targetDate": "2026-12-20T20:30:00+03:00" },
    "location": {
      "venueName": "قاعة اللؤلؤة",
      "address": "الكورنيش الشرقي — الخبر",
      "mapUrl": "https://maps.google.com/?q=Khobar"
    },
    "notes": {
      "items": ["الحضور قبل ٨:٣٠", "الزي الرسمي الفاخر", "الدعوة شخصية"]
    },
    "ticket_confirmation": {
      "title": "شكراً لتفاعلكم",
      "closingTitle": "شكراً لتفاعلكم",
      "body": "نتطلع لرؤيتكم في ليلة لا تُنسى."
    }
  },
  "mediaOverrides": {
    "opening": {
      "compositionMode": "full_media",
      "mainMedia": {
        "type": "video",
        "src": "/assets/demo/noor/media-wedding/opening.mp4",
        "poster": "/assets/demo/noor/media-wedding/opening-poster.webp",
        "fit": "cover",
        "muted": true,
        "playsInline": true
      },
      "startBehavior": "center_button",
      "startButtonText": "افتح الدعوة",
      "playBehavior": "on_tap",
      "revealAfter": "media_end"
    },
    "hero_names": {
      "compositionMode": "layered_media",
      "background": {
        "type": "image",
        "src": "/assets/demo/noor/media-wedding/hero-bg.webp",
        "fit": "cover",
        "zIndex": 0
      },
      "foreground": [
        {
          "type": "image",
          "src": "/assets/demo/noor/media-wedding/hero-foreground.webp",
          "fit": "contain",
          "position": "bottom",
          "opacity": 0.95,
          "height": "45%",
          "zIndex": 20
        }
      ],
      "liveText": {
        "enabled": true,
        "placement": "center",
        "style": "classic"
      }
    },
    "invitation_message": {
      "compositionMode": "full_media",
      "mainMedia": {
        "type": "image",
        "src": "/assets/demo/noor/media-wedding/message-bg.webp",
        "fit": "cover"
      },
      "liveText": {
        "enabled": true,
        "placement": "overlay",
        "emphasisColor": "#C9A84C"
      }
    },
    "ticket_confirmation": {
      "compositionMode": "full_media",
      "mainMedia": {
        "type": "video",
        "src": "/assets/demo/noor/media-wedding/closing.mp4",
        "poster": "/assets/demo/noor/media-wedding/closing-poster.webp",
        "loop": true,
        "muted": true
      },
      "liveText": { "enabled": true, "placement": "center" }
    }
  }
}`;

const EXPORT_MODERN_MINIMAL = `{
  "themeOverrides": {
    "primaryColor": "#FFFFFF",
    "secondaryColor": "#A0A0A0",
    "backgroundColor": "#0A0A0A",
    "textColor": "#F0F0F0",
    "mutedTextColor": "#666666",
    "accentColor": "#FFFFFF",
    "typography": {
      "headingFont": "var(--font-tajawal)",
      "bodyFont": "var(--font-tajawal)",
      "namesFont": "var(--font-tajawal)",
      "namesSize": "clamp(2.5rem, 11vw, 4rem)",
      "letterSpacing": "0.12em",
      "lineHeight": "1.4"
    },
    "design": {
      "cardStyle": "minimal",
      "buttonStyle": "underline",
      "dividerStyle": "line",
      "iconStyle": "line",
      "typographyStyle": "modern",
      "density": "compact"
    }
  },
  "designOverrides": {
    "hero_names": {
      "colors": {
        "backgroundColor": "#000000",
        "textColor": "#FFFFFF",
        "accentColor": "#FFFFFF"
      },
      "typography": { "namesSize": "3.5rem", "textAlign": "center" }
    },
    "invitation_message": {
      "colors": { "overlayColor": "#000000", "overlayOpacity": 0.55 }
    },
    "event_details": { "iconStyle": "none" }
  },
  "content": {
    "hero_names": {
      "primaryName": "KHALID",
      "secondaryName": "SARA",
      "subtitle": "YOU ARE INVITED"
    },
    "invitation_message": {
      "title": "Join Us",
      "body": "A modern celebration. Dress code: black tie optional."
    }
  },
  "mediaOverrides": {
    "opening": {
      "compositionMode": "full_media",
      "mainMedia": {
        "type": "image",
        "src": "/assets/demo/noor/media-wedding/opening-poster.webp",
        "fit": "cover"
      },
      "startBehavior": "center_button",
      "startButtonText": "ENTER",
      "revealAfter": "tap"
    },
    "hero_names": {
      "compositionMode": "layered_media",
      "background": {
        "type": "image",
        "src": "/assets/demo/noor/media-wedding/hero-bg.webp",
        "fit": "cover"
      },
      "liveText": {
        "enabled": true,
        "placement": "center",
        "color": "#FFFFFF",
        "style": "modern",
        "panelEnabled": true,
        "panelColor": "#000000",
        "panelOpacity": 0.5
      }
    }
  }
}`;

const EXPORT_BIRTH_SOFT = `{
  "themeOverrides": {
    "primaryColor": "#E8B4BC",
    "secondaryColor": "#F5D5DA",
    "backgroundColor": "#FFF8F9",
    "textColor": "#4A3035",
    "mutedTextColor": "#9A7A80",
    "accentColor": "#D4848F",
    "typography": {
      "headingFont": "var(--font-amiri)",
      "bodyFont": "var(--font-tajawal)",
      "namesFont": "var(--font-amiri)",
      "namesSize": "clamp(2.8rem, 12vw, 4rem)"
    },
    "design": {
      "typographyStyle": "soft",
      "density": "airy",
      "buttonStyle": "pill"
    }
  },
  "content": {
    "hero_names": {
      "primaryName": "ليان",
      "subtitle": "بشرى سارة بقدوم مولودة"
    },
    "invitation_message": {
      "title": "فرحة العائلة",
      "body": "يسعدنا دعوتكم للاحتفال بقدوم ليان إلى العائلة."
    },
    "event_details": {
      "date": "2026-09-10",
      "time": "17:00",
      "venueName": "قاعة الياسمين — الدمام"
    }
  },
  "mediaOverrides": {
    "hero_names": {
      "compositionMode": "layered_media",
      "background": {
        "type": "image",
        "src": "/assets/demo/noor/media-birth/baby-bg.webp",
        "fit": "cover"
      },
      "liveText": { "enabled": true, "placement": "center", "style": "soft" }
    }
  }
}`;

export const COMPOSER_GUIDE_TOC: TocItem[] = [
  { id: "intro", title: "١. مقدمة" },
  { id: "access", title: "٢. الوصول والصلاحيات" },
  { id: "architecture", title: "٣. كيف يعمل Composer مع المحرك" },
  { id: "ui", title: "٤. واجهة Composer" },
  { id: "basic-advanced", title: "٥. Basic و Advanced" },
  { id: "demos", title: "٦. الديموهات المتاحة" },
  { id: "global-identity", title: "٧. الهوية العالمية" },
  { id: "content-basic", title: "٨. محرر المحتوى (Basic)" },
  { id: "composition", title: "٩. أوضاع التركيب" },
  { id: "scene-colors", title: "١٠. ألوان المشهد" },
  { id: "typography", title: "١١. الخطوط والتايبوغرافي" },
  { id: "icons", title: "١٢. الأيقونات" },
  { id: "layers", title: "١٣. الطبقات (layered_media)" },
  { id: "live-text", title: "١٤. النص الحي Live Text" },
  { id: "assets", title: "١٥. الأصول والـ Checklist" },
  { id: "export", title: "١٦. التصدير" },
  { id: "scenario-assets", title: "١٧. سيناريو: استلام assets من المصمم" },
  { id: "scenario-luxury", title: "١٨. سيناريو: زفاف فاخر ذهبي" },
  { id: "scenario-modern", title: "١٩. سيناريو: نفس Sequence — هوية حديثة جذرية" },
  { id: "scenario-hero-layers", title: "٢٠. سيناريو: Hero بثلاث طبقات foreground" },
  { id: "scenario-web-vs-media", title: "٢١. سيناريو: web_layout مقابل media" },
  { id: "scenario-birth", title: "٢٢. سيناريو: دعوة ميلاد" },
  { id: "scenario-clients-ab", title: "٢٣. سيناريو: عميلان على sequence واحد" },
  { id: "per-scene-ref", title: "٢٤. مرجع المشاهد العشرة" },
  { id: "troubleshooting", title: "٢٥. استكشاف الأخطاء" },
  { id: "future-auth", title: "٢٦. الحماية المستقبلية" },
];

export default function ComposerGuideContent() {
  return (
    <GuideShell toc={COMPOSER_GUIDE_TOC}>
      <div className="mb-8 rounded-xl border border-amber-600/30 bg-amber-950/20 p-6">
        <h1 className="mb-2 text-2xl font-bold text-amber-300">دليل Scene Composer — مراسِم</h1>
        <P>
          دليل داخلي مفصل لاستخدام أداة <strong className="text-amber-200">/lab/composer</strong>{" "}
          لإنتاج دعوات تفاعلية وتجربة هوية بصرية ومحتوى وأصول المصمم — قبل وبعد استلام الحزمة
          النهائية. مخصص لـ <strong>أنت</strong> و<strong>نور الدين</strong> فقط.
        </P>
        <P>
          الإصدار: Phase 2.9.x · آخر تحديث: يوليو 2026
        </P>
      </div>

      <H2 id="intro">١. مقدمة — ما هو Composer؟</H2>
      <P>
        Composer ليس محرر دعوة للعميل النهائي. هو <strong>مختبر داخلي</strong> يقرأ نفس بنية
        الإنتاج:
      </P>
      <CodeBlock>{`InvitationSequence + InvitationData
  → buildInvitationConfig()
  → InvitationConfig
  → InvitationRenderer (نفس المكونات الحقيقية)`}</CodeBlock>
      <P>
        أي تعديل تراه في Live Preview هو نفس ما سيراه الضيف على <code dir="ltr">/i/[slug]</code>{" "}
        بعد لصق التصدير في ملف <code dir="ltr">InvitationData</code>.
      </P>
      <Callout type="tip">
        القاعدة الذهبية: <strong>لا حفظ تلقائي</strong>. Composer يعيش في الذاكرة فقط. التصدير هو
        الطريقة الوحيدة لنقل التعديلات إلى الكود.
      </Callout>
      <Ul
        items={[
          "تعديل الألوان والخطوط والأيقونات والطبقات فوراً.",
          "تجربة مسارات assets قبل رفعها من المصمم.",
          "إنتاج دعوتين مختلفتين جذرياً من نفس Sequence دون نسخ الملف.",
          "نسخ قائمة الملفات المطلوبة للمصمم (Asset Checklist).",
        ]}
      />

      <H2 id="access">٢. الوصول والصلاحيات</H2>
      <GuideTable
        headers={["المسار", "الغرض", "الحالة"]}
        rows={[
          ["/lab/composer", "أداة Composer الرئيسية", "داخلي — غير مفهرس"],
          ["/lab/composer/userguide", "هذا الدليل", "داخلي — سيُحمى لاحقاً"],
          ["/i/[slug]", "معاينة الدعوة العامة للضيف", "عام للديموهات"],
        ]}
      />
      <Callout type="warn">
        <strong>المرحلة الحالية:</strong> لا يوجد Auth على Composer أو الدليل. أي شخص يعرف الرابط
        يمكنه الوصول. في Phase لاحقة سيُربط الدليل وComposer بصلاحيات dashboard الإدارة (أنت +
        نور الدين فقط).
      </Callout>

      <H2 id="architecture">٣. كيف يعمل Composer مع المحرك</H2>
      <H3 id="architecture-layers">طبقات الإعداد</H3>
      <GuideTable
        headers={["الطبقة", "الملف / المصدر", "ماذا يتحكم"]}
        rows={[
          ["InvitationSequence", "data/sequences/*.sequence.ts", "التصميم القابل لإعادة الاستخدام: theme افتراضي، variants، media افتراضي"],
          ["InvitationData", "data/invitations/*.ts", "محتوى العميل + overrides"],
          ["Composer edits", "في الذاكرة فقط", "تجارب قبل الكتابة في الملف"],
          ["InvitationConfig", "بعد الدمج", "ما يستهلكه Renderer"],
        ]}
      />
      <H3 id="architecture-overrides">أولوية الدمج (الأعلى يفوز)</H3>
      <Ol
        items={[
          "mediaOverrides[scene] > scene.media في Sequence",
          "variantOverrides > variant",
          "designOverrides > scene.design > theme.design",
          "content[scene] > defaultContent",
          "themeOverrides > sequence.theme",
        ]}
      />
      <P>
        Composer يصدّر فقط <strong>الفرق</strong> عن الديمو الأساسي — لا حاجة لنسخ كل الإعدادات إن
        لم تتغير.
      </P>

      <H2 id="ui">٤. واجهة Composer — خريطة الشاشة</H2>
      <GuideTable
        headers={["المنطقة", "الموقع", "الوظيفة"]}
        rows={[
          ["الهيدر", "أعلى", "اختيار الديمو، Basic/Advanced، Checklist، Preview كامل، Export"],
          ["قائمة المشاهد", "يسار", "10 مشاهد + وضع التركيب الحالي لكل مشهد"],
          ["Global Visual Identity", "وسط — أعلى", "ألوان وخطوط عالمية"],
          ["Controls", "وسط", "محتوى، ألوان مشهد، تركيب، media، layers"],
          ["Live Preview", "يمين", "معاينة 390px بنفس مكونات الإنتاج"],
        ]}
      />
      <Callout type="info">
        Live Preview يستخدم <code>PreviewFrame</code> + نفس Scene Component — ليس mockup منفصل.
      </Callout>

      <H2 id="basic-advanced">٥. Basic و Advanced</H2>
      <H3 id="basic-mode">Basic Mode — للتجربة السريعة</H3>
      <Ul
        items={[
          "Global: 6 ألوان + 3 خطوط (heading, body, names)",
          "Content (Basic): الحقول الأساسية لكل مشهد (انظر القسم ٨)",
          "Scene Colors: backgroundColor, textColor, accentColor",
          "Composition mode + مسار media رئيسي + poster",
          "layered_media: background + foreground[0] فقط",
          "Live Text: enabled + placement",
          "Icons: iconStyle (بما فيها none و asset)",
        ]}
      />
      <H3 id="advanced-mode">Advanced Mode — تحكم كامل</H3>
      <Ul
        items={[
          "كل ما في Basic +",
          "Typography sizes/spacing عالمي وللمشهد",
          "Design tokens عالمية (cardStyle, buttonStyle, …)",
          "محرر محتوى موسّع (header, sectionLabel, previewTitle, …)",
          "web_layout variants وتفاصيل playback",
          "كل الطبقات: background, mainMedia, overlay, frame, foreground[0..2]",
          "opacity, height, zIndex لكل layer",
          "Live Text كامل: colors, font, shadow, panel",
          "أيقونات مخصصة بمسار لكل أيقونة",
          "Asset Path Helper",
        ]}
      />

      <H2 id="demos">٦. الديموهات المتاحة في Composer</H2>
      <GuideTable
        headers={["Slug", "Sequence", "النوع", "متى تستخدمه"]}
        rows={[
          ["noor-wedding-media-demo", "noor-wedding-media", "Asset-driven زفاف", "الافتراضي — تجربة assets المصمم"],
          ["noor-birth-media-demo", "noor-birth-media", "Asset-driven ميلاد", "دعوات ولادة بفيديو/صور"],
          ["noor-wedding-demo", "noor-wedding-luxury", "Web layout فاخر", "variants وتصميم بدون media كامل"],
          ["noor-birth-demo", "noor-birth-soft", "Web layout ميلاد", "ميلاد ناعم بدون media-heavy"],
          ["demo-wedding", "wedding-royal", "Web layout كلاسيك", "مرجع قديم / مقارنة"],
        ]}
      />
      <Callout type="tip">
        لإنتاج دعوتين مختلفتين جذرياً على <strong>نفس Sequence</strong>: اختر نفس الديمو (مثلاً{" "}
        <code dir="ltr">noor-wedding-media-demo</code>)، عدّل الهوية والـ overrides، صدّر، واحفظ في
        ملفي InvitationData مختلفين يشيران لنفس <code>sequenceId</code>.
      </Callout>

      <H2 id="global-identity">٧. الهوية العالمية (Global Visual Identity)</H2>
      <GuideTable
        headers={["الحقل", "CSS Variable", "التأثير"]}
        rows={[
          ["primaryColor", "--inv-primary", "عناوين، أزرار، زخارف، live text emphasis"],
          ["secondaryColor", "--inv-secondary", "نصوص ثانوية، تفاصيل"],
          ["backgroundColor", "--inv-bg", "خلفية الجذر"],
          ["textColor", "--inv-text", "نص الجسم"],
          ["mutedTextColor", "--inv-muted", "نص باهت"],
          ["accentColor", "--inv-accent", "تمييز إضافي"],
          ["headingFont / bodyFont / namesFont", "--inv-font-*", "Amiri أو Tajawal المحمّلان حالياً"],
        ]}
      />
      <P>التغييرات تنعكس فوراً في Live Preview و Preview Full Invitation.</P>
      <H3 id="global-design-tokens">Design Tokens (Advanced)</H3>
      <P>
        cardStyle, buttonStyle, dividerStyle, iconStyle, typographyStyle, density — تُصدَّر ضمن{" "}
        <code>themeOverrides.design</code> وتؤثر على مشاهد web_layout بشكل أساسي.
      </P>

      <H2 id="content-basic">٨. محرر المحتوى (Basic) — حقل لكل مشهد</H2>
      <GuideTable
        headers={["المشهد", "الحقول في Basic", "مفتاح content"]}
        rows={[
          ["Opening", "startButtonText", "tapText (+ مزامنة media.startButtonText)"],
          ["Hero Names", "primaryName, secondaryName, subtitle", "نفس المفاتيح"],
          ["Invitation Message", "title, body", "title, body"],
          ["Event Details", "date, time, venueName", "نفس المفاتيح"],
          ["Countdown", "targetDate", "ISO 8601 مثل 2026-12-20T20:30:00+03:00"],
          ["Gallery", "title / caption", "label"],
          ["Location", "venueName, address, mapUrl", "نفس المفاتيح"],
          ["Notes", "items (سطر لكل ملاحظة)", "items[]"],
          ["RSVP", "title / sectionLabel", "sectionLabel"],
          ["Closing", "title, body", "title + closingTitle (للتوافق)"],
        ]}
      />
      <Callout type="info">
        في Opening بوضع <code>full_media</code>: تعديل startButtonText يحدّث{" "}
        <code>content.tapText</code> و<code>media.startButtonText</code> معاً.
      </Callout>

      <H2 id="composition">٩. أوضاع التركيب (Composition Mode)</H2>
      <H3 id="web-layout">web_layout</H3>
      <P>
        المحرك التقليدي: variant + design tokens + LayerRenderer. يُستخدم عندما لا توجد assets
        جاهزة أو للمقارنة. التصدير: <code>mediaOverrides: {`{ compositionMode: "web_layout" }`}</code>{" "}
        يُزيل media من المشهد.
      </P>
      <H3 id="full-media">full_media</H3>
      <P>
        صورة أو فيديو يملأ المشهد. مناسب لـ: opening (فيديو)، invitation_message، gallery، closing.
        حقول رئيسية: mainMedia.src, poster, startBehavior, playBehavior, revealAfter.
      </P>
      <H3 id="layered-media">layered_media</H3>
      <P>
        طبقات متراكبة: background + اختياري mainMedia/overlay/frame + حتى 3 foreground. مثالي
        لـ hero_names مع زخرفة سفلية وأسماء live text فوق الخلفية.
      </P>

      <H2 id="scene-colors">١٠. ألوان المشهد (Scene Colors)</H2>
      <P>تُطبَّق عبر CSS variables على SceneFrame لهذا المشهد فقط:</P>
      <GuideTable
        headers={["الحقل", "Basic", "Advanced"]}
        rows={[
          ["backgroundColor", "✓", "✓"],
          ["textColor", "✓", "✓"],
          ["accentColor", "✓", "✓"],
          ["buttonColor", "—", "✓"],
          ["overlayColor + overlayOpacity", "—", "✓ — طبقة تظليل فوق المشهد"],
        ]}
      />
      <P>تُصدَّر في <code>designOverrides[scene].colors</code>.</P>

      <H2 id="typography">١١. الخطوط والتايبوغرافي</H2>
      <P>الخطوط المتاحة حالياً (قابلة للتوسيع لاحقاً):</P>
      <Ul
        items={[
          <span key="1"><code dir="ltr">var(--font-amiri)</code> — Amiri (كلاسيكي/خطي)</span>,
          <span key="2"><code dir="ltr">var(--font-tajawal)</code> — Tajawal (حديث/sans)</span>,
          <span key="3">CustomArabicFont → يحوّل داخلياً إلى Amiri</span>,
        ]}
      />
      <P>
        عالمي (Advanced): headingSize, bodySize, namesSize, textAlign, lineHeight, letterSpacing.
        للمشهد: نفس الحقول في Scene Typography + namesFont override لـ hero_names.
      </P>

      <H2 id="icons">١٢. الأيقونات</H2>
      <P>للمشاهد الوظيفية: event_details, location, notes, rsvp.</P>
      <GuideTable
        headers={["iconStyle", "السلوك"]}
        rows={[
          ["line", "SVG خطي مدمج"],
          ["filled", "SVG مملوء"],
          ["asset", "صورة من مسار مخصص لكل مفتاح"],
          ["none", "إخفاء كل الأيقونات"],
        ]}
      />
      <P>مفاتيح asset (عند iconStyle = asset):</P>
      <CodeBlock>{`calendar, clock, pin, map, envelope, rsvp, check, star, bullet
— مسار فارغ = إخفاء تلك الأيقونة فقط`}</CodeBlock>

      <H2 id="layers">١٣. الطبقات — layered_media (Advanced)</H2>
      <GuideTable
        headers={["Layer", "zIndex افتراضي", "الاستخدام"]}
        rows={[
          ["background", "0", "خلفية كاملة"],
          ["mainMedia", "5", "فيديو/صورة وسط (اختياري)"],
          ["overlay", "10", "طبقة شفافة فوق الوسائط"],
          ["frame", "15", "إطار زخرفي"],
          ["foreground[0..2]", "20+", "زخارف أمامية (أسفل/أعلى/وسط)"],
        ]}
      />
      <P>لكل layer: type, src, position, fit, opacity, height, zIndex.</P>

      <H2 id="live-text">١٤. النص الحي (Live Text)</H2>
      <P>
        يقرأ النص من <code>scene.content</code> ويعرضه فوق الوسائط. يعمل في full_media و
        layered_media عندما <code>liveText.enabled = true</code>.
      </P>
      <GuideTable
        headers={["المشهد", "ما يُعرض تلقائياً"]}
        rows={[
          ["hero_names", "primaryName, secondaryName, connector, subtitle"],
          ["invitation_message", "header, title, body"],
          ["gallery_media", "label"],
          ["ticket_confirmation", "closingTitle / title, body"],
        ]}
      />
      <P>Advanced: color, emphasisColor, font, size, align, maxWidth, textShadow, background panel.</P>

      <H2 id="assets">١٥. الأصول و Copy Asset Checklist</H2>
      <H3 id="assets-wedding">زفاف media-wedding</H3>
      <CodeBlock title="المجلد: public/assets/demo/noor/media-wedding/">{`opening.mp4
opening-poster.webp
hero-bg.webp
hero-foreground.webp
message-bg.webp
gallery-01.webp
closing.mp4
closing-poster.webp`}</CodeBlock>
      <H3 id="assets-birth">ميلاد media-birth</H3>
      <CodeBlock title="المجلد: public/assets/demo/noor/media-birth/">{`opening.mp4
opening-poster.webp
hero-bg.webp
baby-bg.webp
message-bg.webp
gallery-01.webp
closing.webp`}</CodeBlock>
      <P>
        زر <strong>Copy Asset Checklist</strong> في الهيدر ينسخ القائمة + المسارات العامة (
        <code dir="ltr">/assets/demo/noor/...</code>) جاهزة للإرسال للمصمم.
      </P>
      <Callout type="warn">
        Composer لا يرفع ملفات. ضع الملفات يدوياً في المجلد ثم حدّث src في Composer أو استخدم
        &quot;Use suggested path&quot;.
      </Callout>

      <H2 id="export">١٦. التصدير</H2>
      <H3 id="export-json">Export JSON</H3>
      <P>JSON خام للمراجعة أو النسخ الاحتياطي — يحتوي فقط الحقول التي تغيّرت عن الديمو الأساسي.</P>
      <H3 id="export-snippet">Export InvitationData snippet</H3>
      <P>
        كتلة TypeScript جاهزة للصق في <code>data/invitations/*.ts</code> كجزء من{" "}
        <code>InvitationData</code>:
      </P>
      <Ul
        items={[
          "themeOverrides — ألوان وخطوط عالمية",
          "designOverrides — ألوان/خطوط/أيقونات لكل مشهد",
          "mediaOverrides — تركيب ووسائط وlive text",
          "variantOverrides — تغيير variant في web_layout",
          "content — نصوص العميل",
        ]}
      />

      {/* ─── SCENARIOS ─── */}

      <H2 id="scenario-assets">١٧. سيناريو كامل: استلام أول حزمة assets من المصمم</H2>
      <P>
        <strong>الهدف:</strong> تجربة دعوة شبه حقيقية قبل لمس ملفات TypeScript.
      </P>
      <Ol
        items={[
          <>افتح <Link href="/lab/composer" className="text-amber-400 underline">/lab/composer</Link> واختر <code dir="ltr">noor-wedding-media-demo</code>.</>,
          "اضغط Copy Asset Checklist وأرسلها للمصمم مع مقاسات 390px عرض.",
          "عند استلام الملفات: ضعها في public/assets/demo/noor/media-wedding/ بنفس الأسماء.",
          "Basic Mode: عدّل الأسماء في Hero Names ورسالة الدعوة والتاريخ.",
          "لكل مشهد media: تحقق من composition mode واضغط Use suggested path إن لزم.",
          "افتح opening — تأكد من poster يظهر قبل تحميل الفيديو.",
          "Preview Full Invitation — جرّب فتح الدعوة والتمرير كاملاً.",
          "Export InvitationData snippet — الصق في ملف دعوة جديد أو حدّث الموجود.",
          "شغّل npm run dev وافتح /i/noor-wedding-media-demo للتحقق النهائي.",
        ]}
      />
      <Callout type="tip">
        إذا ظهر placeholder رمادي بدل الصورة: الملف غير موجود أو src خاطئ — راجع المسار في
        المتصفح مباشرة.
      </Callout>

      <H2 id="scenario-luxury">١٨. سيناريو كامل: زفاف فاخر ذهبي (media-driven)</H2>
      <P>
        <strong>Sequence:</strong> noor-wedding-media · <strong>الهوية:</strong> ذهبي داكن، خط
        Amiri للأسماء، layered hero مع foreground.
      </P>
      <Ol
        items={[
          "Global: primary #C9A84C, background #1A1208, typographyStyle calligraphy (Advanced في theme.design).",
          "opening: full_media + فيديو opening.mp4 + center_button.",
          "hero_names: layered_media + hero-bg + hero-foreground position bottom + live text enabled.",
          "invitation_message: full_media + message-bg + live text overlay.",
          "ticket_confirmation: full_media + closing.mp4 loop.",
          "Basic Content: أسماء وتاريخ وملاحظات كما في المثال أدناه.",
          "Export والصق في InvitationData.",
        ]}
      />
      <CodeBlock title="مثال export كامل — زفاف فاخر">{EXPORT_LUXURY_WEDDING}</CodeBlock>

      <H2 id="scenario-modern">١٩. سيناريو كامل: نفس Sequence — هوية حديثة جذرية</H2>
      <P>
        <strong>نفس</strong> <code>noor-wedding-media</code> لكن مظهر مختلف تماماً: أسود/أبيض،
        Tajawal فقط، minimal، بدون أيقونات في التفاصيل، opening بصورة ثابتة بدل فيديو.
      </P>
      <Ol
        items={[
          "لا تغيّر الديمو — ابقَ على noor-wedding-media-demo.",
          "امسح أو عُد من الصفر: غيّر كل الألوان العالمية إلى أبيض/أسود.",
          "designOverrides.hero_names.colors: خلفية سوداء ونص أبيض.",
          "event_details: iconStyle none.",
          "opening: mainMedia نوع image من opening-poster.webp, revealAfter tap.",
          "hero live text: panel أسود شفاف، style modern.",
          "قارن Preview مع السيناريو ١٨ — نفس البنية، مظهر مختلف جذرياً.",
        ]}
      />
      <CodeBlock title="مثال export — هوية حديثة minimal">{EXPORT_MODERN_MINIMAL}</CodeBlock>
      <Callout type="info">
        هذا يثبت مبدأ المنتج: <strong>Custom externally, modular internally</strong> — Sequence واحد،
        هويات متعددة عبر overrides فقط.
      </Callout>

      <H2 id="scenario-hero-layers">٢٠. سيناريو كامل: Hero بثلاث طبقات foreground</H2>
      <P>
        <strong>Advanced فقط.</strong> hero_names → layered_media.
      </P>
      <Ol
        items={[
          "background: hero-bg.webp — fit cover, zIndex 0.",
          "foreground[0]: hero-foreground.webp — position bottom, height 45%, opacity 0.95, zIndex 20.",
          "foreground[1]: مسار زخرفة علوية (مثلاً إطار) — position top, height 25%, opacity 0.7, zIndex 21.",
          "foreground[2]: عنصر مركزي شفاف — position center, contain, opacity 0.5, zIndex 22.",
          "live text: enabled, placement center — الأسماء فوق كل الطبقات.",
          "Scene colors: overlayColor أسود بشفافية 0.3 لقراءة أفضل للنص.",
        ]}
      />
      <CodeBlock title="جزء mediaOverrides.hero_names">{`"foreground": [
  { "type": "image", "src": ".../hero-foreground.webp", "position": "bottom", "height": "45%", "zIndex": 20 },
  { "type": "image", "src": ".../frame-top.webp", "position": "top", "height": "25%", "opacity": 0.7, "zIndex": 21 },
  { "type": "image", "src": ".../accent-center.webp", "position": "center", "fit": "contain", "opacity": 0.5, "zIndex": 22 }
]`}</CodeBlock>

      <H2 id="scenario-web-vs-media">٢١. سيناريو: مقارنة web_layout مقابل media على نفس المشهد</H2>
      <P>جرّب على invitation_message في noor-wedding-demo (web) vs noor-wedding-media-demo:</P>
      <GuideTable
        headers={["", "web_layout", "full_media"]}
        rows={[
          ["المظهر", "بطاقة نص + زخارف CSS", "صورة المصمم كخلفية كاملة"],
          ["التعديل", "variant + cardStyle", "mainMedia.src + liveText"],
          ["متى", "قبل assets", "بعد assets"],
          ["التصدير", "variantOverrides + designOverrides", "mediaOverrides"],
        ]}
      />
      <P>
        للتبديل في Composer: غيّر Composition Mode — من web_layout إلى full_media يُنشئ media
        افتراضي تلقائياً بمسارات مقترحة.
      </P>

      <H2 id="scenario-birth">٢٢. سيناريو كامل: دعوة ميلاد (noor-birth-media-demo)</H2>
      <Ol
        items={[
          "اختر noor-birth-media-demo من القائمة.",
          "هوية ناعمة: وردي فاتح، typography soft، namesFont Amiri.",
          "hero_names: اسم واحد (primaryName فقط) — لا secondaryName.",
          "استخدم baby-bg.webp في layered hero بدل hero-foreground الزفافي.",
          "closing: closing.webp (صورة) وليس فيديو.",
          "Copy Asset Checklist لمجلد media-birth.",
        ]}
      />
      <CodeBlock title="مثال export — ميلاد ناعم">{EXPORT_BIRTH_SOFT}</CodeBlock>

      <H2 id="scenario-clients-ab">٢٣. سيناريو: عميلان A و B على sequence واحد</H2>
      <P>
        <strong>الفكرة:</strong> ملفان InvitationData يشيران لنفس <code>sequenceId: "noor-wedding-media"</code>{" "}
        لكن overrides مختلفة.
      </P>
      <GuideTable
        headers={["", "عميل A — فاخر", "عميل B — حديث"]}
        rows={[
          ["themeOverrides", "ذهبي + Amiri", "أبيض/أسود + Tajawal"],
          ["hero_names content", "فيصل & دانة", "KHALID & SARA"],
          ["opening media", "فيديو", "poster ثابت + tap reveal"],
          ["event_details icons", "line ذهبي", "none"],
          ["slug منفصل", "/i/client-a", "/i/client-b"],
        ]}
      />
      <P>الخطوات:</P>
      <Ol
        items={[
          "في Composer: أنتج export A (السيناريو ١٨) واحفظه في invitations/client-a.ts.",
          "أعد تحميل الديمو أو غيّر كل الإعدادات لـ B (السيناريو ١٩) وصدّر إلى client-b.ts.",
          "سجّل slugين مختلفين في invitation-config.ts.",
          "لا تنسخ sequence — فقط InvitationData جديد.",
        ]}
      />

      <H2 id="per-scene-ref">٢٤. مرجع المشاهد العشرة — ماذا تضبط في Composer</H2>
      <GuideTable
        headers={["المشهد", "Composition شائع", "Basic Content", "نصائح"]}
        rows={[
          ["opening", "full_media فيديو", "startButtonText", "poster مهم للتحميل البطيء"],
          ["hero_names", "layered_media", "أسماء + subtitle", "foreground + live text"],
          ["invitation_message", "full_media صورة", "title, body", "liveText overlay"],
          ["event_details", "web أو media", "date, time, venue", "أيقونات calendar/clock/pin"],
          ["countdown", "web_layout", "targetDate ISO", "يعتمد على تاريخ صحيح"],
          ["gallery_media", "full_media", "label", "صورة واحدة gallery-01"],
          ["location", "web_layout", "venue, address, mapUrl", "أيقونة pin/map"],
          ["notes", "web_layout", "items", "سطر لكل ملاحظة"],
          ["rsvp", "web_layout", "sectionLabel", "النموذج من المحرك — ليس QR هنا"],
          ["ticket_confirmation", "full_media فيديو/صورة", "title, body", "شكر فقط — ليس QR"],
        ]}
      />

      <H2 id="troubleshooting">٢٥. استكشاف الأخطاء</H2>
      <GuideTable
        headers={["المشكلة", "السبب المحتمل", "الحل"]}
        rows={[
          ["placeholder رمادي", "ملف asset غير موجود", "تحقق من المسار في المتصفح + اسم الملف"],
          ["التعديل لا يظهر", "لم تُحدَّث المعاينة", "غيّر مشهداً وارجع — أو أعد فتح Preview"],
          ["زر Opening لا يتغير", "full_media", "عدّل startButtonText في Content Basic"],
          ["الأسماء لا تتغير في media hero", "live text معطّل", "فعّل liveText.enabled"],
          ["التصدير فارغ", "لم تُغيّر شيء عن الديمو", "غيّر لوناً أو اسماً ثم صدّر"],
          ["أيقونة لا تظهر", "iconStyle asset بدون مسار", "أضف src أو ارجع لـ line"],
          ["طبقة خلف الأخرى خطأ", "zIndex", "ارفع zIndex للطبقة الأمامية"],
          ["فقدان التعديلات", "لا حفظ", "صدّر فور الانتهاء"],
        ]}
      />

      <H2 id="future-auth">٢٦. الحماية المستقبلية (Dashboard Admin)</H2>
      <P>
        هذا الدليل وComposer سيُنقلان خلف صلاحيات dashboard الإدارة في Phase لاحقة:
      </P>
      <Ul
        items={[
          "المسار المتوقع: /owner/... أو /admin/... مع Auth.",
          "الأدوار: أنت + نور الدين فقط — لا وصول للعملاء أو المنظمين.",
          "robots: noindex مفعّل حالياً على lab routes.",
          "حتى مع الحماية: لا تضع بيانات حساسة للضيوف في Composer — أداة تصميم فقط.",
        ]}
      />

      <div className="mt-12 rounded-xl border border-zinc-700 bg-zinc-900/50 p-6 text-center">
        <P>
          جاهز للتجربة؟{" "}
          <Link href="/lab/composer" className="font-semibold text-amber-400 underline hover:text-amber-300">
            افتح Scene Composer ←
          </Link>
        </P>
      </div>
    </GuideShell>
  );
}