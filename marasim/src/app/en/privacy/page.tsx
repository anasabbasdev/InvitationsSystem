import type { Metadata } from "next";
import { APP_NAME } from "@/lib/app-brand";
import { getPrivacyPolicy } from "@/data/privacy-policy";
import PrivacyPolicyView from "@/components/privacy/PrivacyPolicyView";

const policy = getPrivacyPolicy("en");

export const metadata: Metadata = {
  title: policy.meta.title,
  description: `Privacy policy for ${APP_NAME} — digital invitations and RSVP.`,
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/en/privacy",
    languages: {
      ar: "/privacy",
      en: "/en/privacy",
    },
  },
};

export default function EnglishPrivacyPolicyPage() {
  return <PrivacyPolicyView policy={policy} />;
}
