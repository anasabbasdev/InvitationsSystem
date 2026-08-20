import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/owner/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "استعادة كلمة المرور",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold" style={{ color: "#A67C2E" }}>
          نسيت كلمة المرور
        </h1>
        <p className="text-sm text-stone-500">لوحة تحكم صاحب المناسبة</p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
