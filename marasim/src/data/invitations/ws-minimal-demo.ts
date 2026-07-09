import { InvitationData } from "@/types/invitation";

/**
 * Invitation C — Minimal Modern Demo
 *
 * Journey:  weddingStandardBlueprint      (10 scenes)
 * Design:   weddingMinimalModernPreset    (light, no icons, Tajawal, modern)
 * Content:  Khalid & Nour — minimalist, clean, contemporary
 *
 * PROOF: Same wedding-standard blueprint → radically different visual (C)
 * compared to ws-royal-demo (A — dark gold) and ws-floral-demo (B — cinematic).
 *
 * RSVP disabled via data.rsvp.enabled=false (build-config sets ws-rsvp.enabled=false).
 * Notes disabled via sceneOverrides.
 * Demonstrates: 3 disable mechanisms working together.
 */
export const wsMinimalDemoData: InvitationData = {
  id: "ws-minimal-demo-01",
  slug: "ws-minimal-demo",
  eventId: "event_ws_minimal_01",
  sequenceId: "wedding-standard",

  language: "ar",
  direction: "rtl",

  music: {
    enabled: false,
    src: undefined,
    startMode: "disabled",
  },

  rsvp: {
    enabled: true,
    mode: "public_request",
    approvalRequired: true,
    maxPublicRequest: 3,
  },

  content: {
    opening: {
      tapText: "اكتشف الدعوة",
      label: "دعوة زفاف",
    },
    hero_names: {
      primaryName: "خالد",
      secondaryName: "نور",
      connector: "و",
      subtitle: "يدعوانكم لمشاركتهم فرحة الزفاف",
    },
    invitation_message: {
      title: "دعوة كريمة",
      body: "بكل الأناقة والبساطة، يسعد خالد ونور بدعوتكم لإضفاء جمال حضوركم على حفل زفافهما.",
    },
    event_details: {
      sectionLabel: "التفاصيل",
      date: "2027-05-01",
      day: "الجمعة",
      time: "19:00",
      venueName: "The Gallery Venue — جدة",
    },
    countdown: {
      sectionLabel: "يوم المناسبة",
      targetDate: "2027-05-01T19:00:00+03:00",
    },
    gallery_media: {
      label: "لحظاتنا",
      media: [],
    },
    location: {
      sectionLabel: "الموقع",
      venueName: "The Gallery Venue",
      address: "شارع التحلية — جدة، المملكة العربية السعودية",
      mapUrl: "https://maps.google.com/?q=Jeddah+Saudi+Arabia",
    },
    notes: {
      sectionLabel: "ملاحظات",
      items: ["يُرجى الحضور في الوقت المحدد", "الدعوة شخصية"],
    },
    rsvp: {
      sectionLabel: "تأكيد الحضور",
    },
    ticket_confirmation: {
      closingTitle: "نراكم قريباً",
      body: "شكراً لكم",
    },
  },
};
