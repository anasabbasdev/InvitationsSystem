"use client";

import { useState } from "react";

export default function CopyCodeButton({
  code,
  label = "نسخ",
  className,
  style,
}: {
  code: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={className}
      style={style}
    >
      {copied ? "تم النسخ ✓" : label}
    </button>
  );
}
