"use client";

import type { GuestLookupResult } from "@/types/rsvp";
import TicketQR from "@/components/rsvp/TicketQR";
import CopyCodeButton from "@/components/ui/CopyCodeButton";

const STATUS_COPY: Record<
  NonNullable<GuestLookupResult["status"]>,
  { title: string; body: string; tone: "pending" | "success" | "rejected" }
> = {
  pending: {
    title: "طلبك قيد المراجعة",
    body: "تم استلام طلب حضورك. سيتم إعلامك عند موافقة المضيف.",
    tone: "pending",
  },
  approved: {
    title: "تمت الموافقة على حضورك",
    body: "اعرض رمز الدعوة أو QR عند المدخل.",
    tone: "success",
  },
  confirmed: {
    title: "تم تأكيد حضورك",
    body: "اعرض رمز الدعوة أو QR عند المدخل.",
    tone: "success",
  },
  rejected: {
    title: "تعذر قبول الطلب",
    body: "نعتذر، لم يتم قبول طلب الحضور.",
    tone: "rejected",
  },
};

const TONE_STYLES = {
  pending: { accent: "#C9A84C", bg: "rgba(201,168,76,0.12)", border: "rgba(201,168,76,0.35)" },
  success: { accent: "#4CAF7D", bg: "rgba(76,175,125,0.12)", border: "rgba(76,175,125,0.35)" },
  rejected: { accent: "#C45C5C", bg: "rgba(196,92,92,0.12)", border: "rgba(196,92,92,0.35)" },
};

export default function GuestStatusCard({
  result,
  onClose,
}: {
  result: GuestLookupResult;
  onClose?: () => void;
}) {
  if (!result.found || !result.status) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-950/30 p-4 text-center text-sm text-red-200">
        {result.message ?? "لم يُعثر على طلب مطابق"}
      </div>
    );
  }

  const copy = STATUS_COPY[result.status];
  const tone = TONE_STYLES[copy.tone];
  const showTicket =
    (result.status === "approved" || result.status === "confirmed") &&
    result.guestCode &&
    result.ticket &&
    result.ticket.status === "active";

  return (
    <div
      className="flex flex-col gap-4 rounded-lg p-5"
      style={{ backgroundColor: tone.bg, border: `1px solid ${tone.border}` }}
      dir="rtl"
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="self-end text-xs opacity-60 hover:opacity-100"
        >
          إغلاق
        </button>
      )}

      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold" style={{ color: tone.accent }}>
          {copy.title}
        </h3>
        <p className="text-sm opacity-75 leading-relaxed">{copy.body}</p>
      </div>

      <div className="space-y-2 text-sm">
        <Row label="الاسم" value={result.name ?? "—"} />
        <Row label="المقاعد المطلوبة" value={String(result.requestedSeats ?? "—")} />
        {(result.status === "approved" || result.status === "confirmed") &&
          result.approvedSeats != null && (
            <Row label="المقاعد المعتمدة" value={String(result.approvedSeats)} />
          )}
      </div>

      {result.guestCode && (
        <div
          className="flex flex-col items-center gap-3 pt-3 border-t"
          style={{ borderColor: tone.border }}
        >
          <p className="text-xs opacity-60">رمز دعوتك</p>
          <div className="flex items-center gap-3" dir="ltr">
            <span
              className="text-2xl font-bold tracking-[0.25em]"
              style={{ color: tone.accent }}
            >
              {result.guestCode}
            </span>
            <CopyCodeButton
              code={result.guestCode}
              className="rounded-md px-3 py-1.5 text-xs font-medium text-black"
              style={{ backgroundColor: tone.accent }}
            />
          </div>
          {showTicket && (
            <>
              <p className="text-xs opacity-60">
                متبقي {result.ticket!.remainingEntries} من {result.ticket!.maxEntries} مقعد
              </p>
              <TicketQR value={result.guestCode} size={160} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="opacity-60">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
