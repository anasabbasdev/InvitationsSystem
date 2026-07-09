import Link from "next/link";
import { requireOwnerSession } from "@/lib/auth";
import { listEventsForOwner, countRsvpsByStatusForEvent } from "@/lib/repositories";

export default async function OwnerEventsPage() {
  const user = await requireOwnerSession();
  const events = await listEventsForOwner(user.id);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <h1 className="text-xl font-bold" style={{ color: "#C9A24D" }}>
          مناسباتي
        </h1>
        <p className="max-w-xs text-sm text-zinc-500">
          لا توجد مناسبات مرتبطة بحسابك حتى الآن. تواصل مع الإدارة لربط مناسبتك.
        </p>
      </div>
    );
  }

  const withCounts = await Promise.all(
    events.map(async (event) => ({
      event,
      counts: await countRsvpsByStatusForEvent(event.id),
    }))
  );

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold" style={{ color: "#C9A24D" }}>
        مناسباتي
      </h1>

      <div className="flex flex-col gap-3">
        {withCounts.map(({ event, counts }) => {
          const remaining =
            event.totalCapacity != null
              ? Math.max(event.totalCapacity - event.confirmedSeats, 0)
              : null;

          return (
            <Link
              key={event.id}
              href={`/owner/events/${event.id}`}
              className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-amber-600/50"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-white">{event.title}</h2>
                  <p className="text-xs text-zinc-500">
                    {event.eventDate
                      ? new Date(event.eventDate).toLocaleDateString("ar-SA", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "بدون تاريخ"}
                    {event.venueName ? ` · ${event.venueName}` : ""}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium"
                  style={{
                    backgroundColor: event.status === "published" ? "#14532d" : "#3f3f46",
                    color: event.status === "published" ? "#86efac" : "#d4d4d8",
                  }}
                >
                  {event.status === "published" ? "منشورة" : event.status}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <Stat label="السعة" value={event.totalCapacity ?? "∞"} />
                <Stat label="مؤكدة" value={event.confirmedSeats} />
                <Stat label="متبقية" value={remaining ?? "∞"} />
                <Stat label="قيد المراجعة" value={counts.pending} highlight={counts.pending > 0} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg bg-zinc-800/60 px-1 py-2">
      <div
        className="text-sm font-semibold"
        style={{ color: highlight ? "#facc15" : "#F5F0E8" }}
      >
        {value}
      </div>
      <div className="text-[10px] text-zinc-500">{label}</div>
    </div>
  );
}
