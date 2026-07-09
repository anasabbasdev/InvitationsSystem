import Link from "next/link";
import { notFound } from "next/navigation";
import { requireEventOwnership } from "@/lib/auth";
import {
  fetchEventById,
  fetchEventSettings,
  fetchInvitationByEventId,
  countRsvpsByStatusForEvent,
  countUnreadNotifications,
  listInviteLinksForEvent,
} from "@/lib/repositories";
import { mapEventRow, mapEventSettingsRow } from "@/lib/repositories/events";
import InviteLinksPanel from "@/components/owner/InviteLinksPanel";

export default async function OwnerEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  await requireEventOwnership(eventId);

  const eventRow = await fetchEventById(eventId);
  if (!eventRow) notFound();

  const event = mapEventRow(eventRow);
  const settingsRow = await fetchEventSettings(eventId);
  const settings = settingsRow ? mapEventSettingsRow(settingsRow) : null;
  const invitation = await fetchInvitationByEventId(eventId);
  const counts = await countRsvpsByStatusForEvent(eventId);
  const unread = await countUnreadNotifications(eventId);
  const inviteLinks = await listInviteLinksForEvent(eventId);

  const remaining =
    event.totalCapacity != null
      ? Math.max(event.totalCapacity - event.confirmedSeats, 0)
      : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/owner/events" className="text-xs text-zinc-500 hover:text-zinc-300">
          ← مناسباتي
        </Link>
        <h1 className="mt-1 text-xl font-bold" style={{ color: "#C9A24D" }}>
          {event.title}
        </h1>
        <p className="text-xs text-zinc-500">
          {event.eventDate
            ? new Date(event.eventDate).toLocaleString("ar-SA", { dateStyle: "long", timeStyle: "short" })
            : "بدون تاريخ"}
          {event.venueName ? ` · ${event.venueName}` : ""}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="السعة الكلية" value={event.totalCapacity ?? "∞"} />
        <StatCard label="المقاعد المؤكدة" value={event.confirmedSeats} />
        <StatCard label="المقاعد المتبقية" value={remaining ?? "∞"} accent={remaining === 0} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <NavCard href={`/owner/events/${eventId}/rsvps`} label="طلبات الحضور" value={counts.pending} sub="قيد المراجعة" />
        <NavCard href={`/owner/events/${eventId}/rsvps`} label="موافق عليها" value={counts.approved + counts.confirmed} />
        <NavCard href={`/owner/events/${eventId}/tickets`} label="التذاكر" value="عرض" />
        <NavCard href={`/owner/events/${eventId}/notifications`} label="الإشعارات" value={unread} sub="غير مقروءة" />
      </div>

      <div className="flex flex-wrap gap-2">
        {invitation && (
          <Link
            href={`/i/${invitation.slug}`}
            target="_blank"
            className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-black hover:opacity-90"
          >
            فتح الدعوة
          </Link>
        )}
        <Link
          href={`/owner/events/${eventId}/scanner`}
          className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
        >
          فتح الماسح (Scanner)
        </Link>
      </div>

      {settings && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-400">
          <span className="text-zinc-500">RSVP: </span>
          {settings.rsvpEnabled ? (
            <span>
              مفعّل ({settings.rsvpMode === "public_request" ? "طلب عام" : settings.rsvpMode === "controlled_link" ? "رابط خاص" : "غير محدد"})
              {settings.rsvpMode === "public_request" ? ` · حد أقصى ${settings.maxPublicRequest} مقاعد` : ""}
            </span>
          ) : (
            <span>معطّل</span>
          )}
        </div>
      )}

      <InviteLinksPanel eventId={eventId} invitationId={invitation?.id ?? null} links={inviteLinks} slug={invitation?.slug} />
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-center">
      <div className="text-lg font-bold" style={{ color: accent ? "#f87171" : "#C9A24D" }}>
        {value}
      </div>
      <div className="text-[11px] text-zinc-500">{label}</div>
    </div>
  );
}

function NavCard({
  href,
  label,
  value,
  sub,
}: {
  href: string;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-3 transition hover:border-amber-600/50"
    >
      <span className="text-lg font-bold text-white">{value}</span>
      <span className="text-[11px] text-zinc-500">
        {label}
        {sub ? ` · ${sub}` : ""}
      </span>
    </Link>
  );
}
