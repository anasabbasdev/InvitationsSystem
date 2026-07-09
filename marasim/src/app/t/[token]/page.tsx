import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTicketByToken } from "@/lib/tickets";
import { getSiteOrigin } from "@/lib/site-url";
import TicketPageView from "@/components/rsvp/TicketPageView";

interface Props {
  params: Promise<{ token: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const info = await getTicketByToken(token);
  return {
    title: info ? "تذكرة الدخول" : "الصفحة غير موجودة",
    robots: { index: false, follow: false },
  };
}

export default async function TicketPage({ params }: Props) {
  const { token } = await params;
  const info = await getTicketByToken(token);

  if (!info) {
    notFound();
  }

  const origin = await getSiteOrigin();
  const ticketPageUrl = `${origin}/t/${token}`;
  const ticketQrUrl = ticketPageUrl;

  return (
    <TicketPageView info={info} ticketPageUrl={ticketPageUrl} ticketQrUrl={ticketQrUrl} />
  );
}
