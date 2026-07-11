import type { Metadata } from "next";
import { APP_NAME } from "@/lib/app-brand";
import { getPrivacyPolicy } from "@/data/privacy-policy";
import PrivacyPolicyView from "@/components/privacy/PrivacyPolicyView";

const policy = getPrivacyPolicy("ar");

export const metadata: Metadata = {
  title: policy.meta.title,
  description: `سياسة الخصوصية لخدمة ${APP_NAME} — دعوات رقمية وتأكيد حضور.`,
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/privacy",
    languages: {
      ar: "/privacy",
      en: "/en/privacy",
    },
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyView policy={policy} />;
}
