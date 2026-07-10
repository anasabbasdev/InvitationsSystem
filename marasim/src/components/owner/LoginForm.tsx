"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient, isBrowserSupabaseConfigured } from "@/lib/supabase/browser";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/owner/events";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [configError] = useState(() =>
    isBrowserSupabaseConfigured()
      ? null
      : "إعداد Supabase غير مكتمل على السيرفر. أضف NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY في Cloudflare Worker ثم أعد النشر."
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (configError) return;
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
          : "تعذر تسجيل الدخول. حاول مرة أخرى."
      );
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm text-stone-600">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          disabled={loading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none focus:border-amber-500"
          dir="ltr"
          placeholder="owner@marasim.local"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm text-stone-600">
          كلمة المرور
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          disabled={loading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 outline-none focus:border-amber-500"
          dir="ltr"
        />
      </div>

      {configError && (
        <p className="rounded-md bg-amber-950/50 px-3 py-2 text-sm text-amber-800">{configError}</p>
      )}

      {error && (
        <p className="rounded-md bg-red-950/50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || Boolean(configError)}
        className="mt-2 rounded-md bg-amber-500 px-4 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
      </button>
    </form>
  );
}
