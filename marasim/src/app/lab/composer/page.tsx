import type { Metadata } from "next";
import ComposerApp from "@/components/lab/ComposerApp";

export const metadata: Metadata = {
  title: "Scene Composer (Internal)",
  robots: { index: false, follow: false },
};

export default function ComposerPage() {
  return <ComposerApp />;
}
