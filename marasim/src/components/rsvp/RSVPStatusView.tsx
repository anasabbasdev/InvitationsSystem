import type { RSVPStatusView } from "@/types/rsvp";

const STATUS_COPY: Record<
  RSVPStatusView["status"],
  { title: string; body: string; tone: "pending" | "success" | "rejected" }
> = {
  pending: {
    title: "طلبك قيد المراجعة",
    body: "تم استلام طلب حضورك. سيتم إعلامك عند موافقة المضيف. احتفظ بهذه الصفحة لمتابعة حالة طلبك.",
    tone: "pending",
  },
  approved: {
    title: "تمت الموافقة على حضورك",
    body: "يسعدنا تأكيد حضورك. ستظهر تذكرتك هنا في المرحلة القادمة.",
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
  view: RSVPStatusView;
}

export default function RSVPStatusView({ view }: Props) {
  const copy = STATUS_COPY[view.status];
  const tone = TONE_STYLES[copy.tone];

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
          <p
            className="text-center text-xs tracking-widest uppercase opacity-60"
            style={{ fontFamily: "var(--font-body, inherit)" }}
          >
            {view.eventTitle}
          </p>
        )}

        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
            style={{ backgroundColor: tone.bg, color: tone.accent, border: `1px solid ${tone.border}` }}
          >
            {view.status === "pending" ? "⏳" : view.status === "approved" ? "✓" : "✕"}
          </div>
          <h1
            className="text-2xl"
            style={{ color: tone.accent, fontFamily: "var(--font-heading, inherit)" }}
          >
            {copy.title}
          </h1>
          <p className="text-sm leading-relaxed opacity-75 max-w-xs">{copy.body}</p>
        </div>

        <div
          className="flex flex-col gap-3 pt-4 border-t text-sm"
          style={{ borderColor: tone.border }}
        >
          <div className="flex justify-between gap-4">
            <span className="opacity-60">الاسم</span>
            <span className="font-medium">{view.name}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="opacity-60">المقاعد المطلوبة</span>
            <span className="font-medium">{view.requestedSeats}</span>
          </div>
          {view.status === "approved" && view.approvedSeats != null && (
            <div className="flex justify-between gap-4">
              <span className="opacity-60">المقاعد المعتمدة</span>
              <span className="font-medium">{view.approvedSeats}</span>
            </div>
          )}
          {view.guestNote && (
            <div className="flex flex-col gap-1 pt-1">
              <span className="opacity-60">ملاحظتك</span>
              <span className="opacity-90 leading-relaxed">{view.guestNote}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
