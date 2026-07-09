import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRSVPStatusView } from "@/lib/rsvp";
import { getSiteOrigin } from "@/lib/site-url";
import RSVPStatusView from "@/components/rsvp/RSVPStatusView";

interface Props {
  params: Promise<{ token: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const view = await getRSVPStatusView(token);
  return {
    title: view ? "حالة طلب الحضور" : "الصفحة غير موجودة",
    robots: { index: false, follow: false },
  };
}

export default async function RsvpStatusPage({ params }: Props) {
  const { token } = await params;
  const view = await getRSVPStatusView(token);

  if (!view) {
    notFound();
  }

  const origin = await getSiteOrigin();
  const ticketPageUrl = view.ticket?.token ? `${origin}/t/${view.ticket.token}` : null;
  const ticketQrUrl = ticketPageUrl;

  return (
    <RSVPStatusView view={view} ticketPageUrl={ticketPageUrl} ticketQrUrl={ticketQrUrl} />
  );
}
