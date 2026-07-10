import type { TicketDisplayInfo } from "@/types/tickets";
import TicketQR from "@/components/rsvp/TicketQR";
import CopyCodeButton from "@/components/ui/CopyCodeButton";

interface Props {
  info: TicketDisplayInfo;
}

export default function TicketPageView({ info }: Props) {
  const { ticket, event, guest } = info;
  const isRevoked = ticket.status === "revoked";
  const isFullyUsed = ticket.status === "fully_used";
  const guestCode = guest.guestCode;

  return (
    <main
      className="min-h-dvh flex items-center justify-center px-6 py-12"
      style={{ backgroundColor: "#0E0C0A", color: "#F5F0E8" }}
      dir="rtl"
    >
      <div className="w-full max-w-[390px] flex flex-col gap-6 rounded-sm border border-zinc-800 bg-zinc-950/80 p-8">
        <div className="text-center space-y-1">
          <p className="text-xs text-zinc-500 uppercase tracking-widest">تذكرة الدخول</p>
          <h1 className="text-xl font-bold" style={{ color: "#C9A84C" }}>
            {event.title}
          </h1>
          {event.eventDate && (
            <p className="text-xs text-zinc-400">
              {new Date(event.eventDate).toLocaleString("ar-SA", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>
          )}
          {event.venueName && <p className="text-xs text-zinc-500">{event.venueName}</p>}
        </div>

        {isRevoked ? (
          <StatusBanner tone="error" message="تم إلغاء هذه التذكرة ولا يمكن استخدامها." />
        ) : isFullyUsed ? (
          <StatusBanner tone="warning" message="تم استخدام جميع المقاعد المسموحة." />
        ) : (
          <StatusBanner tone="success" message="التذكرة صالحة للدخول." />
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info label="الضيف" value={guest.name || "—"} />
          {guest.side && <Info label="الطرف" value={guest.side} />}
          <Info label="المقاعد" value={String(ticket.maxEntries)} />
          <Info label="المستخدم" value={String(ticket.usedEntries)} />
          <Info label="المتبقي" value={String(ticket.remainingEntries)} />
          <Info label="الحالة" value={statusLabel(ticket.status)} />
        </div>

        {guestCode && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-zinc-500">رمز الدعوة</p>
            <div className="flex items-center gap-2" dir="ltr">
              <span className="text-lg font-bold tracking-[0.2em] text-amber-400">{guestCode}</span>
              <CopyCodeButton
                code={guestCode}
                className="rounded-md bg-amber-500 px-2 py-1 text-[11px] text-black"
              />
            </div>
          </div>
        )}

        {!isRevoked && !isFullyUsed && guestCode && (
          <div className="flex flex-col items-center gap-3 pt-2">
            <TicketQR value={guestCode} size={200} />
            <p className="text-[11px] text-zinc-500 text-center">اعرض هذا الرمز عند المدخل</p>
          </div>
        )}
      </div>
    </main>
  );
}

function StatusBanner({
  tone,
  message,
}: {
  tone: "success" | "warning" | "error";
  message: string;
}) {
  const colors = {
    success: { bg: "rgba(76,175,125,0.15)", border: "#4CAF7D", text: "#86efac" },
    warning: { bg: "rgba(251,191,36,0.12)", border: "#fbbf24", text: "#fcd34d" },
    error: { bg: "rgba(196,92,92,0.12)", border: "#C45C5C", text: "#fca5a5" },
  }[tone];

  return (
    <p
      className="rounded-md px-3 py-2 text-sm text-center"
      style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
    >
      {message}
    </p>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-zinc-900/80 px-3 py-2">
      <div className="text-[10px] text-zinc-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function statusLabel(status: string): string {
  if (status === "active") return "نشطة";
  if (status === "revoked") return "ملغاة";
  if (status === "fully_used") return "مستخدمة بالكامل";
  return status;
}
