import type { LandingContent } from "./types";

const year = new Date().getFullYear();

export const landingContentEn: LandingContent = {
  locale: "en",
  dir: "ltr",
  siteDescription:
    "Bespoke digital invitations for premium events. Cinematic experience, RSVP, and guest check-in across the UAE and GCC.",
  ogLocale: "en_AE",
  alternateHomeHref: "/",
  alternatePrivacyHref: "/privacy",
  ui: {
    requestInviteCta: "Request your invite",
    viewInviteCta: "View invitation",
    navAriaLabel: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuSr: "Menu",
    sectionsLabel: "Sections",
    contactLabel: "Contact",
    ownerLogin: "Owner login",
    privacyLink: "Privacy policy",
    langSwitchLabel: "العربية",
    experienceTabsAria: "Experience roles",
    guestFlowHeading: "Guest journey",
    ownerFlowHeading: "For the host",
    compareTableTitle: "Quick comparison",
    heroDemoAria: "View a demo invitation",
    heroDemoCaption: "Tap to preview a real invitation",
    whatsappInline: "Contact via WhatsApp",
  },
  nav: [
    { id: "experience", label: "Experience", href: "#experience" },
    { id: "rsvp", label: "RSVP", href: "#rsvp" },
    { id: "services", label: "Services", href: "#services" },
    { id: "process", label: "How it works", href: "#process" },
    { id: "occasions", label: "Occasions", href: "#occasions" },
    { id: "faq", label: "FAQ", href: "#faq" },
  ],
  hero: {
    lines: ["More than an invitation", "The first moment of your event"],
    subtitle:
      "Bespoke digital invitations that bring together visual storytelling, RSVP, and organized guest entry.",
    microcopy: "Custom design · RSVP · QR · Check-in",
    primaryCta: { label: "See the experience", href: "#showcase" },
    secondaryCta: { label: "Request your invite", href: "#contact" },
    demoHref: "/i/ws-royal-demo",
    visualMock: {
      label: "Wedding invite",
      name1: "Ahmad",
      conj: "&",
      name2: "Sara",
      inviteLine: "Request the pleasure of your company",
      tapLabel: "Open invitation",
    },
  },
  statement: {
    title: "Your event begins before the guest arrives",
    body: "Marasim turns an invitation from a shared image into a complete experience that reflects your event and simplifies management, from the first tap to the gate.",
    highlights: ["Made for you", "Cinematic", "Personal", "Organized"],
  },
  showcase: {
    title: "Every occasion has its own world",
    subtitle: "Three real visual directions. Open any invitation and try the full experience on your phone.",
  },
  demos: [
    {
      slug: "ws-royal-demo",
      href: "/i/ws-royal-demo",
      name: "Royal · Ivory",
      tagline: "Classic luxury",
      description: "Arabic calligraphy, ornate frames, and warm tones for traditional premium weddings.",
      posterKey: "royalPoster",
      posterAlt: "Royal wedding invitation preview",
      accent: "#A67C2E",
    },
    {
      slug: "ws-floral-demo",
      href: "/i/ws-floral-demo",
      name: "Cinematic · Warm",
      tagline: "Video and imagery",
      description: "Designer video and layered scenes for an immersive experience from the first touch.",
      posterKey: "floralPoster",
      posterAlt: "Cinematic invitation preview",
      accent: "#B8722E",
    },
    {
      slug: "ws-minimal-demo",
      href: "/i/ws-minimal-demo",
      name: "Modern · Minimal",
      tagline: "Calm and clear",
      description: "Open space, clean type, and content-first layout for contemporary taste.",
      posterKey: "minimalPoster",
      posterAlt: "Modern invitation preview",
      accent: "#8B6F4E",
    },
  ],
  experience: {
    title: "One experience, three roles",
    subtitle: "From guest to host to gate organizer, everything stays connected.",
    roles: [
      {
        id: "guest",
        label: "For guests",
        title: "Smooth access, no account",
        points: [
          "Direct link on the phone",
          "No app required",
          "Clear RSVP flow",
          "Personal ticket after approval",
        ],
      },
      {
        id: "owner",
        label: "For the host",
        title: "One dashboard to follow up",
        points: [
          "All RSVP requests in one place",
          "Confirmed seats at a glance",
          "Approve or decline requests",
          "Private links with seat limits",
          "Day-of event follow-up",
        ],
      },
      {
        id: "gate",
        label: "At the gate",
        title: "Fast, organized entry",
        points: [
          "Scan QR or guest code",
          "Instant validation",
          "Remaining seats visible",
          "Check in individually or as a group",
          "Protection from wrong-event tickets",
        ],
      },
    ],
    previews: {
      guest: {
        label: "Invitation preview",
        title: "Wedding invite",
        openLabel: "Open invitation",
        rsvpButton: "Confirm attendance",
      },
      owner: {
        label: "Host dashboard",
        rows: ["New request · 3 seats", "Confirmed · 2 seats", "Pending · 1"],
        rowBadges: ["New", "✓", "…"],
        seatsLabel: "Confirmed seats: 12 / 50",
      },
      gate: {
        label: "Entry scanner",
        validStatus: "Valid · 3 seats · 2 remaining",
      },
    },
  },
  rsvpModes: {
    title: "Two ways to confirm attendance",
    subtitle:
      "We currently offer two clear RSVP modes for most events: a public invitation with host review, or a private personal link with pre-set seats. You can use one or combine both for the same event.",
    footnote:
      "In both cases: guests need no account and no app. After approval or confirmation they receive a personal code and QR for entry.",
    modes: [
      {
        id: "public",
        badge: "Mode one",
        title: "Public invitation with review",
        subtitle: "One invitation link; the host approves requests",
        bestFor:
          "Large weddings, open family invitations, or when you want to review every request before counting a seat.",
        guestFlow: [
          "Guest opens the invitation link on their phone",
          "Enters name, mobile number, and seats requested",
          "Submits the request and sees a pending status",
          "After host approval: personal code and QR appear on the same page",
        ],
        ownerFlow: [
          "Requests arrive in your dashboard",
          "Approve, decline, or adjust approved seat count",
          "Only approved seats count toward capacity",
          "Share the guest status link manually when needed",
        ],
        guestResult: "After approval: QR ticket ready for entry",
        accent: "#A67C2E",
      },
      {
        id: "controlled",
        badge: "Mode two",
        title: "Private personal link",
        subtitle: "A link per guest or group with a known seat limit",
        bestFor:
          "Named guests, families with fixed seats, VIP lists, or when you want instant confirmation without review.",
        guestFlow: [
          "Guest receives a private link (often via WhatsApp)",
          "Opens the invitation and completes details within the allowed limit",
          "Confirms attendance immediately without waiting for approval",
          "Personal code and QR appear right away",
        ],
        ownerFlow: [
          "Create private links from the dashboard",
          "Set seat count per link (optionally tied to groom, bride, or general)",
          "Disable links after use or when complete",
          "Track who confirmed and who has not",
        ],
        guestResult: "Instant confirmation with QR from the first moment",
        accent: "#8B6F4E",
      },
    ],
    compareRows: [
      { label: "Who gets the link?", public: "Public invitation link", controlled: "Private link per guest or group" },
      { label: "Host review", public: "Yes, before counting a seat", controlled: "No, instant within the limit" },
      { label: "Seat limit", public: "Guest request, then your approval", controlled: "Pre-set in the link" },
      { label: "When does QR appear?", public: "After approval", controlled: "Right after confirmation" },
      { label: "Best for", public: "Wide, flexible invites", controlled: "Precisely named guests" },
    ],
  },
  services: {
    title: "From design to arrival",
    subtitle: "Everything a premium event needs in one cohesive experience.",
    items: [
      {
        number: "01",
        title: "Digital invitation design",
        description: "A custom visual direction that reflects your event, not a generic template.",
      },
      {
        number: "02",
        title: "Cinematic experience",
        description: "Video, imagery, motion, and sound. Scenes that unfold like chapters.",
      },
      {
        number: "03",
        title: "RSVP",
        description: "Two modes: public with review, or private with instant confirmation. Details in the RSVP section.",
      },
      {
        number: "04",
        title: "Flexible invitations",
        description: "Combine a public invitation link with private family or VIP links for the same event.",
      },
      {
        number: "05",
        title: "QR and group tickets",
        description: "One QR for multiple seats, ideal for families and groups.",
      },
      {
        number: "06",
        title: "Entry management",
        description: "Fast gate scanner with partial or full check-in.",
      },
      {
        number: "07",
        title: "Host dashboard",
        description: "Track requests and notifications from phone or desktop.",
      },
    ],
  },
  bespoke: {
    title: "We do not refill a template",
    titleAccent: "We design a world for your event",
    body: "Every project has a different visual direction. Video, backgrounds, and motion are made for your occasion. What your guest sees is unique.",
    comparisonNote: "One team - but no two experiences look the same",
    variants: ["Royal", "Cinematic", "Modern"],
  },
  process: {
    title: "How to start",
    steps: [
      {
        number: "1",
        title: "We understand your event",
        description: "Occasion type, mood, identity, guest count, and needs.",
      },
      {
        number: "2",
        title: "We design the experience",
        description: "Visual direction, scenes, motion, and content.",
      },
      {
        number: "3",
        title: "We prepare the invitation",
        description: "Link, RSVP, QR, and host dashboard.",
      },
      {
        number: "4",
        title: "We support event day",
        description: "Tickets, scanning, and organized entry.",
      },
    ],
  },
  occasions: {
    title: "Occasions we design for",
    items: [
      {
        title: "Weddings",
        imageKey: "occasionWeddings",
        gradient: "linear-gradient(145deg, #FBF7F2 0%, #F0E6D8 50%, #E8D5A8 100%)",
      },
      {
        title: "Engagements",
        imageKey: "occasionEngagement",
        gradient: "linear-gradient(145deg, #FAF6F1 0%, #F2EBE2 50%, #E8C98A 100%)",
      },
      {
        title: "Newborns",
        imageKey: "occasionNewborns",
        gradient: "linear-gradient(145deg, #FDF5F7 0%, #F8E4EA 50%, #E8B8C8 100%)",
      },
      {
        title: "Graduations",
        imageKey: "occasionGraduation",
        gradient: "linear-gradient(145deg, #F7F4F0 0%, #EFEAE4 50%, #D4C5A0 100%)",
      },
      {
        title: "Private celebrations",
        imageKey: "occasionPrivate",
        gradient: "linear-gradient(145deg, #FBF7F2 0%, #F5EDE3 50%, #D4AF6A 100%)",
      },
      {
        title: "Corporate events",
        imageKey: "occasionCorporate",
        gradient: "linear-gradient(145deg, #F2EEE9 0%, #E8DDD0 50%, #A67C2E 100%)",
      },
    ],
  },
  additional: {
    title: "More than the invitation",
    subtitle: "Optional services that complete event day. Shown or hidden based on availability.",
    items: [
      { title: "Event photography", description: "Visual documentation worthy of the moment.", enabled: true },
      { title: "Video coverage and editing", description: "Short film or cinematic highlight.", enabled: true },
      { title: "Event content design", description: "Visual materials aligned with the invitation.", enabled: true },
      { title: "Newborn decor", description: "Celebratory setups for family occasions.", enabled: true },
      { title: "Favors and gifts", description: "Details that complete the guest experience.", enabled: true },
    ],
  },
  privacy: {
    title: "Privacy and control",
    subtitle: "Your event deserves security that is simple and clear.",
    points: [
      "Guests need no account or app.",
      "Private links can be limited by seat count.",
      "QR codes do not carry direct personal data.",
      "The host controls approvals.",
      "Every ticket is tied to a specific event.",
      "Seat limits cannot be exceeded.",
    ],
  },
  faq: [
    {
      question: "Is the design custom or a ready template?",
      answer: "Every invitation is made for your event. Visual direction, content, and motion differ from project to project.",
    },
    {
      question: "Does the invitation work on all phones?",
      answer: "Yes. The experience is mobile-first and runs in the browser on iOS and Android.",
    },
    {
      question: "Do guests need to download an app?",
      answer: "No. They open the link directly in the browser.",
    },
    {
      question: "Can invitations be sent via WhatsApp?",
      answer: "Yes. Share the link or guest code however you prefer.",
    },
    {
      question: "How does RSVP work?",
      answer:
        "Either public: guest requests, host approves, then QR appears. Or private: personal link with seat limit and instant confirmation with QR.",
    },
    {
      question: "Can seat counts be limited?",
      answer: "Yes, for both public and private invitations, with overall capacity control.",
    },
    {
      question: "How does QR work?",
      answer: "After approval the guest gets a code or QR scanned at the gate.",
    },
    {
      question: "Can we use the invitation without RSVP?",
      answer: "Yes. RSVP can be hidden and the interactive invitation used on its own.",
    },
    {
      question: "Can details be changed after setup?",
      answer: "Yes, within an agreed scope before final publish.",
    },
    {
      question: "What event types are supported?",
      answer: "Weddings, engagements, newborns, graduations, private celebrations, and premium corporate events.",
    },
  ],
  faqHeading: "Frequently asked questions",
  finalCta: {
    title: "Let's start from the first moment",
    body: "Tell us about your event and we will design an experience worthy of it.",
    primary: { label: "Request your invite", href: "#contact" },
    secondary: { label: "View demos", href: "#showcase" },
  },
  footer: {
    tagline: "Bespoke digital invitations, from the first moment to the gate.",
    copyright: `© ${year} Marasim. All rights reserved.`,
    privacyHref: "/en/privacy",
  },
};
