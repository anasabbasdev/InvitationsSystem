import Link from "next/link";
import { notFound } from "next/navigation";
import { requireEventOwnership } from "@/lib/auth";
import { fetchEventById } from "@/lib/repositories";
import { mapEventRow } from "@/lib/repositories/events";
import { getSiteOrigin } from "@/lib/site-url";
import ScannerClient from "@/components/owner/ScannerClient";
import ScannerShareCard from "@/components/owner/ScannerShareCard";

export default async function ScannerPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  await requireEventOwnership(eventId);

  const eventRow = await fetchEventById(eventId);
  if (!eventRow) notFound();
  const event = mapEventRow(eventRow);

  const origin = await getSiteOrigin();
  const scannerToken = event.scannerPublicToken ?? eventRow.scanner_public_token;
  const scannerUrl = scannerToken ? `${origin}/scan/${scannerToken}` : null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link href={`/owner/events/${eventId}`} className="text-xs text-zinc-500 hover:text-zinc-300">
          ← المناسبة
        </Link>
        <h1 className="mt-1 text-xl font-bold" style={{ color: "#C9A24D" }}>
          فحص التذاكر
        </h1>
        {event && <p className="text-xs text-zinc-500">{event.title}</p>}
      </div>

      {scannerUrl ? (
        <ScannerShareCard scannerUrl={scannerUrl} eventTitle={event.title} />
      ) : (
        <p className="text-sm text-amber-300">رابط الماسح غير متاح — طبّق migration الأخيرة.</p>
      )}

      {scannerToken ? (
        <ScannerClient
          mode={{ type: "public", scannerToken }}
          eventTitle={event.title}
        />
      ) : (
        <ScannerClient mode={{ type: "owner", eventId }} eventTitle={event.title} />
      )}
    </div>
  );
}
