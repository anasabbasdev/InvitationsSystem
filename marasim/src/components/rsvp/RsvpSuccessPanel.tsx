"use client";

import CopyCodeButton from "@/components/ui/CopyCodeButton";

export default function RsvpSuccessPanel({
  guestCode,
  status,
  primaryColor,
  textColor,
}: {
  guestCode: string;
  status: string;
  primaryColor: string;
  textColor: string;
}) {
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
      <div className="text-3xl">✓</div>
      <h3 className="text-lg font-semibold" style={{ color: primaryColor }}>
        {status === "pending" ? "تم استلام طلبك" : "تم التأكيد"}
      </h3>
      <p className="text-sm opacity-75 leading-relaxed max-w-xs">
        احتفظ برمز دعوتك. يمكنك متابعة الحالة من شريط «تحقق من حالة دعوتك» أسفل
        الدعوة برقم جوالك أو هذا الرمز.
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
    </div>
  );
}
