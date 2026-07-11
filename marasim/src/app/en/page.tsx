import type { Metadata } from "next";
import { APP_NAME } from "@/lib/app-brand";
import { LANDING_ASSETS } from "@/data/landing-assets";
import { getLandingContent } from "@/data/landing";
import LandingPage from "@/components/landing/LandingPage";

const content = getLandingContent("en");

export const metadata: Metadata = {
  title: `${APP_NAME} | Bespoke digital invitations`,
  description: content.siteDescription,
  robots: { index: true, follow: true },
  openGraph: {
    title: `${APP_NAME} | Bespoke digital invitations`,
    description: content.siteDescription,
    locale: content.ogLocale,
    type: "website",
    images: [{ url: LANDING_ASSETS.ogImage, width: 1200, height: 630, alt: APP_NAME }],
  },
  alternates: {
    canonical: "/en",
    languages: {
      ar: "/",
      en: "/en",
    },
  },
};

export default function EnglishHomePage() {
  return <LandingPage content={content} />;
}
