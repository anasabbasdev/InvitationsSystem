import type { PrivacyPolicyContent } from "./types";

export const privacyPolicyEn: PrivacyPolicyContent = {
  locale: "en",
  dir: "ltr",
  meta: {
    title: "Privacy Policy",
    lastUpdated: "2026-07-11",
    operatorName: "Marasim",
    operatorDescription:
      "A bespoke interactive digital invitation service for events, including RSVP and guest check-in.",
  },
  ui: {
    backToHome: "Back to home",
    lastUpdatedLabel: "Last updated",
    contactHeading: "Privacy contact",
    contactEmailLabel: "Email",
    contactWhatsappLabel: "WhatsApp",
    openWhatsapp: "Open chat",
    contactMissing: "Add contact details in your environment file (.env) before public launch.",
    langSwitchLabel: "العربية",
  },
  homeHref: "/en",
  alternatePrivacyHref: "/privacy",
  sections: [
    {
      id: "intro",
      title: "Introduction",
      paragraphs: [
        "At Marasim we respect your privacy and the privacy of your event guests. This policy explains how we handle information when you use our website, digital invitations, and host dashboard.",
        "By using our services you acknowledge that you have read this policy. If you use the service on behalf of an event host, you are responsible for informing your guests as required under your local regulations.",
      ],
    },
    {
      id: "scope",
      title: "Scope",
      paragraphs: ["This policy applies to:"],
      bullets: [
        "The Marasim marketing website.",
        "Digital invitation pages we prepare for clients.",
        "Guest status and digital ticket pages linked to an event.",
        "The host dashboard (requires sign-in).",
        "Scanning and check-in tools linked to an event.",
      ],
    },
    {
      id: "roles",
      title: "Roles: who we are and who you are",
      paragraphs: [
        "In most cases the event host (client) is responsible for inviting guests and for the data collected from them. We provide the technical platform to host the invitation and manage attendance according to the client's settings.",
        "Guests do not need a permanent account to use an invitation or submit an RSVP request.",
      ],
    },
    {
      id: "guest-data",
      title: "Data we may collect from guests",
      paragraphs: ["When RSVP or ticketing is enabled, a guest may be asked for information such as:"],
      bullets: [
        "Name.",
        "Mobile number (when enabled on the invitation).",
        "Number of seats requested.",
        "Optional note from the guest.",
        "Basic technical data for security and stability (such as general browser type and temporarily IP address for abuse protection).",
      ],
    },
    {
      id: "owner-data",
      title: "Host and organizer data",
      paragraphs: ["To use the dashboard we need:"],
      bullets: [
        "Email and password (via the authentication provider).",
        "Event data: title, date, venue, capacity, and RSVP settings.",
        "Records of requests, approvals, tickets, and check-ins linked to the event.",
      ],
    },
    {
      id: "tokens",
      title: "Personal links and codes",
      paragraphs: [
        "We use hard-to-guess random links and codes (such as a short guest code or personal status URL) so guests can follow their request or view a ticket without creating an account.",
        "The QR code used at the gate does not contain sensitive personal data by itself; it is used to validate the ticket through our systems.",
        "Guests and hosts should not share these links publicly if the event is limited or private.",
      ],
    },
    {
      id: "purposes",
      title: "Why we use data",
      paragraphs: ["We use data only for the following purposes:"],
      bullets: [
        "Displaying the invitation experience on mobile.",
        "Receiving and reviewing attendance requests by the host.",
        "Issuing digital tickets and organizing entry.",
        "Preventing abuse (such as excessive requests or wrong scans).",
        "Technical support and client communication about the project.",
        "Improving service quality and security in general.",
      ],
    },
    {
      id: "legal-basis",
      title: "Legal basis",
      paragraphs: [
        "We rely on legitimate grounds including performing the service requested by the host, our legitimate interest in securing the platform and preventing fraud, and guest consent when they voluntarily submit attendance details.",
      ],
    },
    {
      id: "sharing",
      title: "Sharing with third parties",
      paragraphs: ["We do not sell your personal data. We may share data only as follows:"],
      bullets: [
        "Infrastructure providers for hosting and database (such as Supabase and Cloudflare) as technical processors.",
        "The authentication provider for host accounts.",
        "Official authorities when required under applicable law.",
      ],
    },
    {
      id: "retention",
      title: "Retention",
      paragraphs: [
        "We retain event and RSVP data for the active project period and for a reasonable time afterward for backup, support, and legal obligations, unless the client requests deletion where the system allows it.",
        "Hosts may ask us to help manage or delete data for a specific event within platform capabilities.",
      ],
    },
    {
      id: "security",
      title: "Security",
      paragraphs: [
        "We apply reasonable technical and organizational measures to protect data, including access control, server secrets, and database-level protections where possible.",
        "However, no internet transmission can be guaranteed fully secure. We recommend private links for sensitive invitations and avoiding public group posts.",
      ],
    },
    {
      id: "rights",
      title: "Your rights",
      paragraphs: ["Depending on your location and applicable law, you may have the right to:"],
      bullets: [
        "Request access to or correction of your data.",
        "Request deletion within what the system and contractual obligations allow.",
        "Object to or restrict certain processing.",
        "Withdraw consent where processing is based on it.",
      ],
    },
    {
      id: "children",
      title: "Children",
      paragraphs: [
        "The service is intended for family and social event management and does not directly target collecting data from children without parental knowledge. For newborn or family invitations, the host is responsible for obtaining required consents.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and local storage",
      paragraphs: [
        "We may use cookies or local storage necessary to run the owner dashboard and secure sessions. We do not use third-party behavioral advertising in the current service version.",
        "Guest invitations do not require app installation and do not rely on guest marketing tracking.",
      ],
    },
    {
      id: "international",
      title: "Data transfers",
      paragraphs: [
        "Data may be stored on cloud provider servers in different regions. By using the service from the GCC or elsewhere, you acknowledge that processing may occur through approved international infrastructure.",
      ],
    },
    {
      id: "changes",
      title: "Policy updates",
      paragraphs: [
        "We may update this policy from time to time. We will change the last updated date at the top of the page. Continued use after an update means acceptance of the revised version unless applicable law provides otherwise.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      paragraphs: [
        "For privacy inquiries or to exercise your rights, contact us through official channels published on our site (email or business WhatsApp if available).",
        "When contacting us, please state the request type (guest / host) and the event reference or link if possible to speed up handling.",
      ],
    },
  ],
};
