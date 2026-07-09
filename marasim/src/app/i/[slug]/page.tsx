import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocalInvitationSlugs } from "@/lib/invitation-config";
import { loadInvitationBySlug } from "@/lib/invitation-loader";
import InvitationRenderer from "@/components/invitation/InvitationRenderer";

interface Props {
  params: Promise<{ slug: string }>;
}

/** Allow slugs not in the static registry (Supabase-only invitations). */
export const dynamicParams = true;

export async function generateStaticParams() {
  return getLocalInvitationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = await loadInvitationBySlug(slug);
  return {
    title: config ? "دعوة خاصة" : "الصفحة غير موجودة",
    robots: { index: false, follow: false },
  };
}

export default async function InvitationPage({ params }: Props) {
  const { slug } = await params;
  const config = await loadInvitationBySlug(slug);

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
