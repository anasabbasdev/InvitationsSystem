import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/owner/LoginForm";

export const metadata: Metadata = {
  title: "تسجيل دخول المالك",
  robots: { index: false, follow: false },
};

export default function OwnerLoginPage() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-8 bg-black px-6 py-12 text-white">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold" style={{ color: "#C9A24D" }}>
          لوحة تحكم مراسِم
        </h1>
        <p className="text-sm text-zinc-500">تسجيل دخول صاحب المناسبة</p>
      </div>

      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
