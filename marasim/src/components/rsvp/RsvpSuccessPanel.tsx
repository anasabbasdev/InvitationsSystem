"use client";

import CopyCodeButton from "@/components/ui/CopyCodeButton";
import TicketQR from "@/components/rsvp/TicketQR";

export default function RsvpSuccessPanel({
  guestCode,
  status,
  primaryColor,
  textColor,
  approvedSeats,
}: {
  guestCode: string;
  status: string;
  primaryColor: string;
  textColor: string;
  approvedSeats?: number | null;
}) {
  const isPending = status === "pending";
  const isConfirmed = status === "confirmed" || status === "approved";

  return (
    <div
      className="flex flex-col items-center gap-4 rounded-lg p-6 text-center"
      style={{
        backgroundColor: `${primaryColor}18`,
        border: `1px solid ${primaryColor}44`,
        color: textColor,
      }}
      dir="rtl"
    >
      <div className="text-3xl">{isPending ? "⏳" : "✓"}</div>
      <h3 className="text-lg font-semibold" style={{ color: primaryColor }}>
        {isPending ? "تم استلام طلبك" : "تم تأكيد حضورك"}
      </h3>
      <p className="text-sm opacity-75 leading-relaxed max-w-xs">
        {isPending
          ? "طلبك قيد مراجعة المضيف. تابع الحالة من شريط «تحقق من حالة دعوتك» برقم جوالك أو رمز الدعوة."
          : isConfirmed
            ? `تم تأكيد ${approvedSeats ?? ""} مقعد/مقاعد. اعرض رمز الدعوة أو QR عند المدخل.`
            : "احتفظ برمز دعوتك للمتابعة لاحقاً."}
      </p>
      <div className="flex flex-col items-center gap-2 pt-2" dir="ltr">
        <span className="text-xs opacity-60" dir="rtl">
          رمز دعوتك
        </span>
        <div className="flex items-center gap-3">
          <span
            className="text-2xl font-bold tracking-[0.25em]"
            style={{ color: primaryColor }}
          >
            {guestCode}
          </span>
          <CopyCodeButton
            code={guestCode}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-black"
            style={{ backgroundColor: primaryColor }}
          />
        </div>
      </div>
      {isConfirmed && (
        <div className="flex flex-col items-center gap-2 pt-2">
          <TicketQR value={guestCode} size={160} />
          <p className="text-[11px] opacity-60">اعرض هذا الرمز عند المدخل</p>
        </div>
      )}
    </div>
  );
}
