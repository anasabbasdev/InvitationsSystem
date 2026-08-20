import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import UpdatePasswordForm from "@/components/owner/UpdatePasswordForm";

export const metadata: Metadata = {
  title: "تعيين كلمة مرور جديدة",
  robots: { index: false, follow: false },
};

export default async function UpdatePasswordPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/owner/forgot-password");
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold" style={{ color: "#A67C2E" }}>
          كلمة مرور جديدة
        </h1>
        <p className="text-sm text-stone-500" dir="ltr">
          {user.email}
        </p>
      </div>
      <UpdatePasswordForm />
    </div>
  );
}
