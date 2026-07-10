"use client";

import { useActionState, useState } from "react";
import type { OwnerRSVPRow } from "@/types/rsvp";
import {
  approveRsvpAction,
  rejectRsvpAction,
  type RsvpActionResult,
} from "@/app/owner/events/[eventId]/rsvps/actions";

const STATUS_LABELS: Record<string, { label: string; bg: string; fg: string }> = {
  pending: { label: "قيد المراجعة", bg: "#78350f", fg: "#fcd34d" },
  approved: { label: "تمت الموافقة", bg: "#14532d", fg: "#86efac" },
  rejected: { label: "مرفوض", bg: "#450a0a", fg: "#fca5a5" },
  confirmed: { label: "مؤكد (رابط خاص)", bg: "#1e3a8a", fg: "#93c5fd" },
};

export default function RsvpRow({
  eventId,
  rsvp,
}: {
  eventId: string;
  rsvp: OwnerRSVPRow;
}) {
  const [approveState, approveFormAction, approvePending] = useActionState<
    RsvpActionResult,
    FormData
  >(approveRsvpAction, null);
  const [rejectState, rejectFormAction, rejectPending] = useActionState<
    RsvpActionResult,
    FormData
  >(rejectRsvpAction, null);
  const [seats, setSeats] = useState(
    String(rsvp.approvedSeats ?? rsvp.requestedSeats)
  );

  const statusInfo = STATUS_LABELS[rsvp.status] ?? STATUS_LABELS.pending;
  const canApprove = rsvp.status === "pending" || rsvp.status === "rejected";
  const canEdit = rsvp.status === "approved";
  const canReject = rsvp.status === "pending" || rsvp.status === "approved";

  return (
    <li className="flex flex-col gap-2 rounded-lg border border-stone-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-stone-800">{rsvp.name}</p>
          {rsvp.phone && <p className="text-xs text-stone-500" dir="ltr">{rsvp.phone}</p>}
          <p className="text-xs text-stone-500">
            {new Date(rsvp.createdAt).toLocaleString("ar-SA", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium"
          style={{ backgroundColor: statusInfo.bg, color: statusInfo.fg }}
        >
          {statusInfo.label}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-stone-600">
        <span>مطلوب: {rsvp.requestedSeats} مقعد</span>
        {rsvp.approvedSeats != null && <span>معتمد: {rsvp.approvedSeats} مقعد</span>}
        {rsvp.guestCode && (
          <span dir="ltr" className="font-mono text-amber-400/80">
            رمز: {rsvp.guestCode}
          </span>
        )}
        {rsvp.ticketToken && <span>حالة التذكرة: {rsvp.ticketStatus}</span>}
      </div>

      {rsvp.guestNote && (
        <p className="rounded-md bg-zinc-800/60 p-2 text-xs text-stone-600">{rsvp.guestNote}</p>
      )}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {(canApprove || canEdit) && (
          <form action={approveFormAction} className="flex items-center gap-2">
            <input type="hidden" name="eventId" value={eventId} />
            <input type="hidden" name="rsvpId" value={rsvp.id} />
            <input
              type="number"
              name="approvedSeats"
              min={1}
              max={rsvp.requestedSeats}
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              className="w-16 rounded-md border border-stone-300 bg-stone-50 px-2 py-1.5 text-xs text-stone-800 outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={approvePending}
              className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-medium text-black hover:opacity-90 disabled:opacity-50"
            >
              {approvePending ? "..." : canEdit ? "تعديل المقاعد" : "موافقة"}
            </button>
          </form>
        )}

        {canReject && (
          <form action={rejectFormAction}>
            <input type="hidden" name="eventId" value={eventId} />
            <input type="hidden" name="rsvpId" value={rsvp.id} />
            <button
              type="submit"
              disabled={rejectPending}
              className="rounded-md border border-red-900 px-3 py-1.5 text-xs text-red-700 hover:bg-red-950/50 disabled:opacity-50"
            >
              {rejectPending ? "..." : "رفض"}
            </button>
          </form>
        )}
      </div>

      {approveState?.ok === false && (
        <p className="text-xs text-red-400">{approveState.message}</p>
      )}
      {rejectState?.ok === false && (
        <p className="text-xs text-red-400">{rejectState.message}</p>
      )}
    </li>
  );
}
