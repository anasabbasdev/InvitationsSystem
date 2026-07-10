import Link from "next/link";
import { requireEventOwnership } from "@/lib/auth";
import { listTicketsForEvent, listCheckinsForEvent } from "@/lib/repositories";

const STATUS_LABELS: Record<string, { label: string; bg: string; fg: string }> = {
  active: { label: "نشطة", bg: "#1e3a8a", fg: "#93c5fd" },
  revoked: { label: "ملغاة", bg: "#450a0a", fg: "#fca5a5" },
  fully_used: { label: "مستخدمة بالكامل", bg: "#3f3f46", fg: "#d4d4d8" },
};

export default async function OwnerTicketsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  await requireEventOwnership(eventId);

  const [tickets, checkins] = await Promise.all([
    listTicketsForEvent(eventId),
    listCheckinsForEvent(eventId),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href={`/owner/events/${eventId}`} className="text-xs text-stone-500 hover:text-stone-700">
          ← المناسبة
        </Link>
        <h1 className="mt-1 text-xl font-bold" style={{ color: "#C9A24D" }}>
          التذاكر
        </h1>
      </div>

      {tickets.length === 0 ? (
        <p className="rounded-lg border border-stone-200 bg-white p-6 text-center text-sm text-stone-500">
          لا توجد تذاكر بعد — تُنشأ التذكرة تلقائياً عند الموافقة على طلب حضور.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {tickets.map((ticket) => {
            const status = STATUS_LABELS[ticket.status] ?? STATUS_LABELS.active;
            return (
              <li
                key={ticket.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-stone-200 bg-white p-3 text-sm"
              >
                <div>
                  <p className="font-medium text-stone-800">{ticket.guestName || "—"}</p>
                  <p className="text-xs text-stone-500">
                    {ticket.usedEntries} / {ticket.maxEntries} مستخدم
                  </p>
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                  style={{ backgroundColor: status.bg, color: status.fg }}
                >
                  {status.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <div>
        <h2 className="mb-2 text-sm font-semibold text-stone-700">سجل تسجيل الدخول (Check-in)</h2>
        {checkins.length === 0 ? (
          <p className="rounded-lg border border-stone-200 bg-white p-4 text-center text-xs text-stone-500">
            لا يوجد تسجيل دخول بعد.
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5 text-xs">
            {checkins.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-md border border-stone-200 bg-white px-3 py-2"
              >
                <span className="text-stone-700">{c.guestName || "—"}</span>
                <span className="text-stone-500">{c.entriesCount} داخل</span>
                <span className="text-stone-500" dir="ltr">
                  {new Date(c.createdAt).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
