import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getInvitationBySlug, getAllInvitationSlugs } from "@/lib/invitation-config";
import InvitationRenderer from "@/components/invitation/InvitationRenderer";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllInvitationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = getInvitationBySlug(slug);
  return {
    title: config ? "دعوة خاصة" : "الصفحة غير موجودة",
    robots: { index: false, follow: false },
  };
}

export default async function InvitationPage({ params }: Props) {
  const { slug } = await params;
  const config = getInvitationBySlug(slug);

  if (!config) {
    notFound();
  }

  return (
    <div
      className="min-h-dvh"
      style={{ backgroundColor: "#000" }}
    >
      <InvitationRenderer config={config} />
    </div>
  );
}
