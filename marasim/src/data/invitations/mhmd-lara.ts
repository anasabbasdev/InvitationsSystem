import { InvitationData } from "@/types/invitation";

/**
 * Mohammad & Lara — customer invitation data.
 * All guest-facing copy and event facts live here; visuals come from the PSD preset.
 */
export const mhmdLaraData: InvitationData = {
  id: "mhmd-lara-01",
  slug: "mhmd_lara",
  eventId: "event_mhmd_lara",
  sequenceId: "psd-wedding-01",
  blueprintId: "psd-wedding-01",
  presetId: "psd-wedding-01",

  language: "ar",
  direction: "rtl",

  music: {
    enabled: false,
    startMode: "disabled",
  },

  rsvp: {
    enabled: true,
    mode: "public_request",
    approvalRequired: true,
    maxPublicRequest: 4,
  },

  content: {
    opening: {
      tapText: "افتح الدعوة",
      label: "دعوة زفاف",
    },
    invitation_message: {
      header: "بـكـل حـب و ود يـتـشـرف",
      hostPrimaryTitle: "الحاج",
      hostPrimaryName: "معتصم الرز",
      hostSecondaryTitle: "السيد",
      hostSecondaryName: "بسام سلامه",
      body: "بــدعـوتـكـم لـحـضـور حفل زفـــــــاف ولـديـهـمـا",
      eyebrow: "WRITTEN IN LOVE",
      subtitle: "A PROMISE FOR A LIFETIME.",
    },
    hero_names: {
      primaryName: "محمد",
      secondaryName: "لارا",
      connector: "و",
      eyebrow: "OUR FOREVER BEGINS",
      subtitle: "Together",
    },
    countdown: {
      targetDate: "2026-10-15T21:00:00+04:00",
      sectionLabel: "THE CELEBRATION UNVEILING IN:",
      arabicLine: "وذلـك فـي يـوم الأحــــــــــــد 15 أكتوبر\nالساعــــــــة 9 مســـــــــــاء",
      englishLine:
        "On Sunday\nOctober 15th, at 9:00 PM,\nwe look forward to welcoming you to share a special evening\nfilled with warmth, joy, and beautiful moments together.",
    },
    event_details: {
      sectionLabel: "التفاصيــــــــــــ                     ـــــــــــــل",
      sectionLabelEn: "Details",
      date: "2026-10-15",
      day: "الأحد",
      time: "21:00",
      venueName: "قصر الأميرة - دبي",
    },
    gallery_media: {
      label: "OUR",
      scriptLabel: "Moments",
      caption: "Best Moment",
      media: [],
    },
    notes: {
      sectionLabel: "ملاحظات مهمة",
      sectionLabelEn: "IMPORTANT NOTES",
      items: [
        "نرجو التكرم بعدم اصطحاب الأطفال",
        "يُمنع التصوير حفاظاً على خصوصية الحفل",
        "نأمل الالتزام باللباس الرسمي المحتشم",
        "الدعوة خاصة وشخصية",
        "يرجى الحضور في الوقت المحدد",
      ],
      itemsEn: [
        "Kindly refrain from bringing children",
        "Photography is not permitted to respect the privacy of the event",
        "We kindly ask you to adhere to formal and modest attire",
        "This invitation is private and non-transferable",
        "Please arrive on time",
      ],
    },
    location: {
      sectionLabel: "موقـــــــــــع المناســــــــــــبة",
      sectionLabelEn: "Location on the map",
      venueName: "قصر الأميرة",
      address: "دبي، الإمارات العربية المتحدة",
      mapUrl: "https://maps.google.com/?q=Qasr+Al+Amira+Dubai",
      locationButtonLabel: "فتح الخريطة",
    },
    rsvp: {
      sectionLabel: "تأكيد الحضور",
      intro: "نرجو ملئ المعلومات لتأكيد الحضور",
    },
    ticket_confirmation: {
      closingTitle: "تفاصيل التذكرة تظهر في صفحة الحالة الخاصة بعد موافقة المضيف.",
      body: "تم تصميم هذه الدعوة بشكل خاص وبواسطة موقع مراسيم. لمناسبتك القادمة احصل على دعوة مميزة وتواصل معنا الان.",
    },
  },

  sceneOverrides: {
    "ml-program": {
      content: {
        sectionLabel: "EVENT",
        scriptLabel: "Timeline",
        hallEyebrow: "Our Luxury",
        hallTitle: "Wedding Hall",
        programItems: [
          { time: "15:00", title: "حفل الاستقبال", detail: "كوكتيلات وحلويات", titleEn: "WELCOME RECEPTION", detailEn: "Cocktails & sweets" },
          { time: "17:00", title: "عقد القِران", detail: "مراسم دينية", titleEn: "NIKAH CEREMONY", detailEn: "Religious ceremony" },
          { time: "19:00", title: "العشاء", detail: "عشاء فاخر", titleEn: "DINNER", detailEn: "Gourmet dinner" },
          { time: "20:00", title: "الحفل", detail: "استمتعوا بالرقص طوال المساء", titleEn: "PARTY", detailEn: "Dance the night away" },
          { time: "22:00", title: "نهاية الأمسية", detail: "نتمنى لكم مغادرة آمنة وسعيدة", titleEn: "END OF THE EVENING", detailEn: "Wishing you a safe and pleasant departure" },
        ],
      },
    },
  },
};
