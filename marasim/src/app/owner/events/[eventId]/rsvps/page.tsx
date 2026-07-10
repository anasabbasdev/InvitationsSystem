import Link from "next/link";
import { requireEventOwnership } from "@/lib/auth";
import { listOwnerRsvpsForEvent } from "@/lib/repositories";
import RsvpRow from "@/components/owner/RsvpRow";

export default async function OwnerRSVPsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  await requireEventOwnership(eventId);

  const rsvps = await listOwnerRsvpsForEvent(eventId);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link href={`/owner/events/${eventId}`} className="text-xs text-stone-500 hover:text-stone-700">
          ← المناسبة
        </Link>
        <h1 className="mt-1 text-xl font-bold" style={{ color: "#C9A24D" }}>
          طلبات الحضور
        </h1>
      </div>

      {rsvps.length === 0 ? (
        <p className="rounded-lg border border-stone-200 bg-white p-6 text-center text-sm text-stone-500">
          لا توجد طلبات حضور حتى الآن.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rsvps.map((rsvp) => (
            <RsvpRow key={rsvp.id} eventId={eventId} rsvp={rsvp} />
          ))}
        </ul>
      )}
    </div>
  );
}
