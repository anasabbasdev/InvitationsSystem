import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocalInvitationSlugs } from "@/lib/invitation-config";
import {
  isDraftPreviewRequired,
  loadInvitation,
} from "@/lib/invitation-loader";
import { isInvitationLoaded } from "@/types/invitation-load";
import InvitationRenderer from "@/components/invitation/InvitationRenderer";
import { resolveInviteLinkContext } from "@/lib/rsvp";
import type { InviteLinkContext } from "@/lib/rsvp";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string; t?: string }>;
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams() {
  return getLocalInvitationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { preview } = await searchParams;
  const result = await loadInvitation(slug, { previewToken: preview ?? null });
  return {
    title: isInvitationLoaded(result) ? "دعوة خاصة" : "الصفحة غير موجودة",
    robots: { index: false, follow: false },
  };
}

export default async function InvitationPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { preview, t: inviteTokenFromUrl } = await searchParams;

  const result = await loadInvitation(slug, { previewToken: preview ?? null });

  if (result.status === "not_found" || result.status === "not_configured") {
    notFound();
  }

  if (result.status === "database_error") {
    if (isDraftPreviewRequired(result)) {
      notFound();
    }
    notFound();
  }

  if (!isInvitationLoaded(result)) {
    notFound();
  }

  let inviteLinkContext: InviteLinkContext | null = null;
  if (inviteTokenFromUrl) {
    inviteLinkContext = await resolveInviteLinkContext(inviteTokenFromUrl, slug);
  }

  return (
    <div className="min-h-dvh" style={{ backgroundColor: "#000" }}>
      <InvitationRenderer
        config={result.config}
        inviteToken={inviteTokenFromUrl ?? null}
        inviteLinkContext={inviteLinkContext}
      />
    </div>
  );
}
