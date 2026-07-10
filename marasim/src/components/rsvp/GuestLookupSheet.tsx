"use client";

import { useState } from "react";
import type { GuestLookupResult } from "@/types/rsvp";
import PhoneInput, { defaultPhoneValue, phoneValueToRaw } from "@/components/ui/PhoneInput";
import GuestStatusCard from "@/components/rsvp/GuestStatusCard";
import { normalizeGuestCodeInput } from "@/lib/guest-code";

interface Props {
  slug: string;
  primaryColor?: string;
  textColor?: string;
}

export default function GuestLookupSheet({ slug, primaryColor = "#C9A84C", textColor = "#F5F0E8" }: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState(defaultPhoneValue);
  const [guestCode, setGuestCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GuestLookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body =
        mode === "phone"
          ? { slug, phone: phoneValueToRaw(phone) }
          : { slug, guestCode: normalizeGuestCodeInput(guestCode) };

      const res = await fetch("/api/guest/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as GuestLookupResult;
      setResult(data);
      if (!data.found) {
        setError(data.message ?? "لم يُعثر على طلب مطابق");
      }
    } catch {
      setError("تعذر الاتصال. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  function handleOpen() {
    setOpen(true);
    setResult(null);
    setError(null);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex w-full max-w-[430px] items-center justify-center gap-2 border-t px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-md"
        style={{
          backgroundColor: "rgba(14, 12, 10, 0.92)",
          borderColor: `${primaryColor}44`,
          color: textColor,
        }}
      >
        <span aria-hidden>🔍</span>
        تحقق من حالة دعوتك
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
          onClick={handleClose}
          role="presentation"
        >
          <div
            className="w-full max-w-[390px] rounded-t-2xl sm:rounded-2xl p-5 pb-8 shadow-xl"
            style={{ backgroundColor: "#141210", color: textColor }}
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">حالة الدعوة</h2>
              <button type="button" onClick={handleClose} className="text-sm opacity-60">
                إغلاق
              </button>
            </div>

            {!result?.found && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex gap-2 text-xs">
                  <TabButton
                    active={mode === "phone"}
                    onClick={() => setMode("phone")}
                    color={primaryColor}
                  >
                    برقم الجوال
                  </TabButton>
                  <TabButton
                    active={mode === "code"}
                    onClick={() => setMode("code")}
                    color={primaryColor}
                  >
                    برمز الدعوة
                  </TabButton>
                </div>

                {mode === "phone" ? (
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    disabled={loading}
                    inputStyle={{
                      padding: "12px 14px",
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: textColor,
                      borderRadius: 8,
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                ) : (
                  <input
                    value={guestCode}
                    onChange={(e) => setGuestCode(e.target.value.toUpperCase())}
                    placeholder="مثال: K7M3X2"
                    maxLength={6}
                    dir="ltr"
                    className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-center text-lg tracking-[0.3em] outline-none"
                    style={{ color: textColor }}
                    disabled={loading}
                    required
                  />
                )}

                {error && <p className="text-sm text-red-300 text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg py-3 text-sm font-medium text-black disabled:opacity-60"
                  style={{ backgroundColor: primaryColor }}
                >
                  {loading ? "جاري التحقق..." : "عرض الحالة"}
                </button>
              </form>
            )}

            {result && <GuestStatusCard result={result} onClose={() => setResult(null)} />}
          </div>
        </div>
      )}
    </>
  );
}

function TabButton({
  active,
  onClick,
  children,
  color,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 rounded-md py-2 transition-opacity"
      style={{
        backgroundColor: active ? `${color}33` : "transparent",
        border: `1px solid ${active ? color : "rgba(255,255,255,0.15)"}`,
        color: active ? color : "inherit",
      }}
    >
      {children}
    </button>
  );
}
