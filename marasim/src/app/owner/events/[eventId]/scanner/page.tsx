import Link from "next/link";
import { requireEventOwnership } from "@/lib/auth";
import { fetchEventById } from "@/lib/repositories";
import { mapEventRow } from "@/lib/repositories/events";
import ScannerClient from "@/components/owner/ScannerClient";

export default async function ScannerPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  await requireEventOwnership(eventId);

  const eventRow = await fetchEventById(eventId);
  const event = eventRow ? mapEventRow(eventRow) : null;

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

      <ScannerClient eventId={eventId} />
    </div>
  );
}
