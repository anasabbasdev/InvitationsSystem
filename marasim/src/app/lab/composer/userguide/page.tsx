import type { Metadata } from "next";
import ComposerGuideContent from "@/components/lab/composer-userguide/ComposerGuideContent";

export const metadata: Metadata = {
  title: "دليل Scene Composer",
  description: "دليل استخدام داخلي لأداة Composer — مراسِم",
  robots: { index: false, follow: false },
};

export default function ComposerUserGuidePage() {
  return <ComposerGuideContent />;
}
