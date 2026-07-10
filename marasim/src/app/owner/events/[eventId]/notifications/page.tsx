import Link from "next/link";
import { requireEventOwnership } from "@/lib/auth";
import { getNotifications } from "@/lib/notifications";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/app/owner/events/[eventId]/notifications/actions";

const TYPE_LABELS: Record<string, string> = {
  rsvp_pending: "طلب حضور جديد",
  rsvp_approved: "تمت الموافقة",
  rsvp_rejected: "تم الرفض",
  controlled_rsvp_confirmed: "تأكيد رابط خاص",
};

export default async function OwnerNotificationsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  await requireEventOwnership(eventId);

  const notifications = await getNotifications(eventId);
  const hasUnread = notifications.some((n) => !n.readAt);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <Link href={`/owner/events/${eventId}`} className="text-xs text-stone-500 hover:text-stone-700">
            ← المناسبة
          </Link>
          <h1 className="mt-1 text-xl font-bold" style={{ color: "#C9A24D" }}>
            الإشعارات
          </h1>
        </div>
        {hasUnread && (
          <form action={markAllNotificationsReadAction.bind(null, eventId)}>
            <button
              type="submit"
              className="rounded-md border border-stone-300 px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-100"
            >
              تحديد الكل كمقروء
            </button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="rounded-lg border border-stone-200 bg-white p-6 text-center text-sm text-stone-500">
          لا توجد إشعارات بعد.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`flex items-start justify-between gap-3 rounded-lg border p-3 text-sm ${
                n.readAt ? "border-stone-200 bg-white" : "border-amber-300 bg-amber-50"
              }`}
            >
              <div>
                <p className="font-medium text-stone-800">
                  {!n.readAt && <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-amber-400" />}
                  {TYPE_LABELS[n.type] ?? n.title}
                </p>
                {n.message && <p className="text-xs text-stone-500">{n.message}</p>}
                <p className="mt-1 text-[11px] text-stone-500" dir="ltr">
                  {new Date(n.createdAt).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" })}
                </p>
              </div>
              {!n.readAt && (
                <form action={markNotificationReadAction.bind(null, eventId, n.id)}>
                  <button
                    type="submit"
                    className="shrink-0 rounded-md border border-stone-300 px-2.5 py-1 text-[11px] text-stone-600 hover:bg-stone-100"
                  >
                    تحديد كمقروء
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
