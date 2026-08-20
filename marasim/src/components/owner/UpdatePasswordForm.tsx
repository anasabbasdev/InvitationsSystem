"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOwnerPassword } from "@/app/owner/recovery-actions";

export default function UpdatePasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await updateOwnerPassword(new FormData(e.currentTarget));
    if (!result.ok) {
      setLoading(false);
      setError(result.message);
      return;
    }
    router.push("/owner/events");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm text-stone-600">
          كلمة المرور الجديدة
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          disabled={loading}
          className="rounded-md border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none focus:border-amber-500"
          dir="ltr"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirm" className="text-sm text-stone-600">
          تأكيد كلمة المرور
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          disabled={loading}
          className="rounded-md border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none focus:border-amber-500"
          dir="ltr"
        />
      </div>
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-amber-500 px-4 py-3 text-sm font-medium text-black disabled:opacity-60"
      >
        {loading ? "جاري الحفظ..." : "حفظ كلمة المرور"}
      </button>
    </form>
  );
}
