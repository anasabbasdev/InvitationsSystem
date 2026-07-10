"use client";

import { useState } from "react";

export default function ScannerShareCard({
  scannerUrl,
  eventTitle,
}: {
  scannerUrl: string;
  eventTitle: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(scannerUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(
      `رابط ماسح الدخول لمناسبة «${eventTitle}»:\n${scannerUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
      <div>
        <h2 className="text-sm font-semibold text-amber-400">رابط الماسح للموظفين</h2>
        <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
          شارك هذا الرابط مع موظف الاستقبال. لا يحتاج تسجيل دخول — خاص بهذه المناسبة فقط.
        </p>
      </div>
      <code
        className="block break-all rounded-md bg-zinc-950 px-3 py-2 text-xs text-zinc-300"
        dir="ltr"
      >
        {scannerUrl}
      </code>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyLink}
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-black hover:opacity-90"
        >
          {copied ? "تم النسخ ✓" : "نسخ الرابط"}
        </button>
        <button
          type="button"
          onClick={shareWhatsApp}
          className="rounded-md border border-amber-500/50 px-4 py-2 text-sm text-amber-300 hover:bg-amber-500/10"
        >
          مشاركة واتساب
        </button>
      </div>
    </div>
  );
}
