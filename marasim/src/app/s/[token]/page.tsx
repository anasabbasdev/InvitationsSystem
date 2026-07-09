import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRSVPStatusView } from "@/lib/rsvp";
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

  return <RSVPStatusView view={view} />;
}
