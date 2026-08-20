import type { Metadata } from "next";
import ForgotAccountForm from "@/components/owner/ForgotAccountForm";

export const metadata: Metadata = {
  title: "نسيت بريد الدخول",
  robots: { index: false, follow: false },
};

export default function ForgotAccountPage() {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold" style={{ color: "#A67C2E" }}>
          نسيت بريد الدخول
        </h1>
        <p className="text-sm text-stone-500">استعادة الحساب باسم المناسبة</p>
      </div>
      <ForgotAccountForm />
    </div>
  );
}
