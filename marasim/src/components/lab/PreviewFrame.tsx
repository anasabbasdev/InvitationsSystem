"use client";

import React from "react";
import type { InvitationConfig } from "@/types/invitation";
import { buildInvitationCssVars } from "@/lib/theme-vars";

interface PreviewFrameProps {
  config: InvitationConfig;
  children: React.ReactNode;
  minHeight?: number | string;
}

/** Mobile frame wrapper — applies invitation CSS vars for real scene components. */
export default function PreviewFrame({
  config,
  children,
  minHeight = 700,
}: PreviewFrameProps) {
  const { theme, layout, direction } = config;

  const cssVars = buildInvitationCssVars(theme);

  return (
    <div
      className="mx-auto overflow-hidden rounded-2xl border border-zinc-600 shadow-2xl"
      style={{ width: layout.mobileMaxWidth }}
    >
      <div
        className="inv-root relative w-full overflow-hidden"
        style={{
          minHeight,
          maxWidth: layout.mobileMaxWidth,
          backgroundColor: theme.backgroundColor,
          color: theme.textColor ?? "#F5F0E8",
          fontFamily: "var(--font-tajawal)",
          direction,
          ...cssVars,
        }}
      >
        {children}
      </div>
    </div>
  );
}
