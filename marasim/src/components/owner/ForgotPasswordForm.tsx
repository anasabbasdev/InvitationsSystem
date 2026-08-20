"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordResetByEmail } from "@/app/owner/recovery-actions";

export default function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const result = await requestPasswordResetByEmail(new FormData(e.currentTarget));
    setLoading(false);
    if (result.ok) setMessage(result.message);
    else setError(result.message);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <p className="text-sm text-stone-500">
        أدخل البريد المسجّل لصاحب المناسبة. سنرسل رابطاً لتعيين كلمة مرور جديدة.
      </p>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm text-stone-600">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={loading}
          className="rounded-md border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none focus:border-amber-500"
          dir="ltr"
        />
      </div>
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {message && <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-amber-500 px-4 py-3 text-sm font-medium text-black disabled:opacity-60"
      >
        {loading ? "جاري الإرسال..." : "إرسال رابط الاستعادة"}
      </button>
      <p className="text-center text-sm text-stone-500">
        نسيت البريد أيضاً؟{" "}
        <Link href="/owner/forgot-account" className="text-amber-700 underline">
          استعد عبر اسم المناسبة
        </Link>
      </p>
      <Link href="/owner/login" className="text-center text-sm text-stone-500 hover:text-stone-700">
        العودة لتسجيل الدخول
      </Link>
    </form>
  );
}
