import Link from "next/link";
import type { RSVPStatusView as RSVPStatusViewType } from "@/types/rsvp";
import TicketQR from "@/components/rsvp/TicketQR";
import CopyCodeButton from "@/components/ui/CopyCodeButton";

const STATUS_COPY: Record<
  RSVPStatusViewType["status"],
  { title: string; body: string; tone: "pending" | "success" | "rejected" }
> = {
  pending: {
    title: "طلبك قيد المراجعة",
    body: "تم استلام طلب حضورك. يمكنك متابعة الحالة من الدعوة برقم جوالك أو رمز الدعوة.",
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
    body: "نعتذر، لم يتم قبول طلب الحضور. للاستفسار يرجى التواصل مع المضيف مباشرة.",
    tone: "rejected",
  },
};

const TONE_STYLES = {
  pending: {
    accent: "#C9A84C",
    bg: "rgba(201, 168, 76, 0.12)",
    border: "rgba(201, 168, 76, 0.35)",
  },
  success: {
    accent: "#4CAF7D",
    bg: "rgba(76, 175, 125, 0.12)",
    border: "rgba(76, 175, 125, 0.35)",
  },
  rejected: {
    accent: "#C45C5C",
    bg: "rgba(196, 92, 92, 0.12)",
    border: "rgba(196, 92, 92, 0.35)",
  },
};

interface Props {
  view: RSVPStatusViewType;
}

export default function RSVPStatusView({ view }: Props) {
  const copy = STATUS_COPY[view.status];
  const tone = TONE_STYLES[copy.tone];
  const hasTicket =
    (view.status === "approved" || view.status === "confirmed") &&
    view.ticket &&
    view.ticket.status !== "revoked";

  const showQr =
    hasTicket && view.guestCode && view.ticket!.status === "active";
  const ticketRevoked = view.ticket?.status === "revoked";
  const ticketFullyUsed = view.ticket?.status === "fully_used";

  return (
    <main
      className="min-h-dvh flex items-center justify-center px-6 py-12"
      style={{ backgroundColor: "#0E0C0A", color: "#F5F0E8" }}
      dir="rtl"
    >
      <div
        className="w-full max-w-[390px] flex flex-col gap-6 rounded-sm p-8"
        style={{
          backgroundColor: tone.bg,
          border: `1px solid ${tone.border}`,
        }}
      >
        {view.eventTitle && (
          <p className="text-center text-xs tracking-widest uppercase opacity-60">{view.eventTitle}</p>
        )}

        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
            style={{ backgroundColor: tone.bg, color: tone.accent, border: `1px solid ${tone.border}` }}
          >
            {view.status === "pending" ? "⏳" : view.status === "rejected" ? "✕" : "✓"}
          </div>
          <h1 className="text-2xl" style={{ color: tone.accent }}>
            {copy.title}
          </h1>
          <p className="text-sm leading-relaxed opacity-75 max-w-xs">{copy.body}</p>
        </div>

        {(view.eventDate || view.venueName) && (
          <div className="text-center text-xs opacity-60 space-y-1">
            {view.eventDate && (
              <p>
                {new Date(view.eventDate).toLocaleString("ar-SA", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            )}
            {view.venueName && <p>{view.venueName}</p>}
          </div>
        )}

        <div
          className="flex flex-col gap-3 pt-4 border-t text-sm"
          style={{ borderColor: tone.border }}
        >
          <Row label="الاسم" value={view.name} />
          <Row label="المقاعد المطلوبة" value={String(view.requestedSeats)} />
          {(view.status === "approved" || view.status === "confirmed") &&
            view.approvedSeats != null && (
              <Row label="المقاعد المعتمدة" value={String(view.approvedSeats)} />
            )}
          {view.guestNote && (
            <div className="flex flex-col gap-1 pt-1">
              <span className="opacity-60">ملاحظتك</span>
              <span className="opacity-90 leading-relaxed">{view.guestNote}</span>
            </div>
          )}
        </div>

        {view.guestCode && (
          <div
            className="flex flex-col items-center gap-3 pt-4 border-t"
            style={{ borderColor: tone.border }}
          >
            <p className="text-xs opacity-60">رمز دعوتك</p>
            <div className="flex items-center gap-3" dir="ltr">
              <span className="text-xl font-bold tracking-[0.2em]" style={{ color: tone.accent }}>
                {view.guestCode}
              </span>
              <CopyCodeButton
                code={view.guestCode}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-black"
                style={{ backgroundColor: tone.accent }}
              />
            </div>
          </div>
        )}

        {hasTicket && view.ticket && (
          <div
            className="flex flex-col items-center gap-4 pt-4 border-t"
            style={{ borderColor: tone.border }}
          >
            {ticketRevoked && (
              <p className="text-sm text-red-300 text-center">تم إلغاء التذكرة.</p>
            )}
            {ticketFullyUsed && (
              <p className="text-sm text-amber-200 text-center">تم استخدام جميع المقاعد.</p>
            )}
            {!ticketRevoked && !ticketFullyUsed && (
              <>
                <p className="text-xs opacity-60">
                  متبقي {view.ticket.remainingEntries} من {view.ticket.maxEntries} مقعد
                </p>
                {showQr && <TicketQR value={view.guestCode!} size={180} />}
              </>
            )}
          </div>
        )}
      </div>
    </main>
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
