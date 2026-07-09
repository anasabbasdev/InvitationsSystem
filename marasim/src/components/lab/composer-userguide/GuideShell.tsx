"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export type TocItem = { id: string; title: string; level?: 1 | 2 };

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="absolute left-2 top-2 rounded bg-zinc-700 px-2 py-0.5 text-xs text-zinc-300 hover:bg-zinc-600"
    >
      {copied ? "تم النسخ" : "نسخ"}
    </button>
  );
}

export function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="relative my-4">
      {title && (
        <p className="mb-1 text-xs font-medium text-amber-400/80" dir="ltr">
          {title}
        </p>
      )}
      <CopyButton text={children} />
      <pre
        className="overflow-x-auto rounded-lg border border-zinc-700 bg-zinc-950 p-4 pt-10 text-xs leading-relaxed text-green-300"
        dir="ltr"
      >
        {children}
      </pre>
    </div>
  );
}

export function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "warn" | "tip";
  children: React.ReactNode;
}) {
  const styles = {
    info: "border-sky-600/50 bg-sky-950/30 text-sky-100",
    warn: "border-amber-600/50 bg-amber-950/30 text-amber-100",
    tip: "border-emerald-600/50 bg-emerald-950/30 text-emerald-100",
  };
  return (
    <div className={`my-4 rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>{children}</div>
  );
}

export function GuideTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-zinc-700">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="border-b border-zinc-700 bg-zinc-900/80">
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 text-right font-medium text-amber-400">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-zinc-800 even:bg-zinc-900/40">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 align-top text-zinc-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mb-4 mt-10 scroll-mt-24 border-b border-zinc-700 pb-2 text-xl font-bold text-amber-400">
      {children}
    </h2>
  );
}

export function H3({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="mb-3 mt-6 scroll-mt-24 text-lg font-semibold text-zinc-100">
      {children}
    </h3>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 leading-8 text-zinc-300">{children}</p>;
}

export function Ul({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mb-4 list-disc space-y-2 pr-5 text-zinc-300">
      {items.map((item, i) => (
        <li key={i} className="leading-7">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Ol({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="mb-4 list-decimal space-y-2 pr-5 text-zinc-300">
      {items.map((item, i) => (
        <li key={i} className="leading-7">
          {item}
        </li>
      ))}
    </ol>
  );
}

interface GuideShellProps {
  toc: TocItem[];
  children: React.ReactNode;
}

export default function GuideShell({ toc, children }: GuideShellProps) {
  const [activeId, setActiveId] = useState(toc[0]?.id ?? "");

  useEffect(() => {
    const ids = toc.map((t) => t.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <Link href="/lab/composer" className="text-lg font-semibold text-amber-400 hover:text-amber-300">
            ← Scene Composer
          </Link>
          <span className="text-zinc-600">|</span>
          <h1 className="text-sm font-medium text-zinc-300">دليل الاستخدام الداخلي</h1>
          <span className="rounded bg-red-900/40 px-2 py-0.5 text-xs text-red-300">داخلي — Phase 2.9.x</span>
          <div className="flex-1" />
          <Link
            href="/lab/composer"
            className="rounded bg-amber-600 px-3 py-1.5 text-sm font-medium hover:bg-amber-500"
          >
            فتح Composer
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">المحتويات</p>
            <ul className="space-y-1">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`block rounded px-2 py-1.5 transition ${
                      item.level === 2 ? "pr-5 text-xs" : "text-sm"
                    } ${
                      activeId === item.id
                        ? "bg-amber-600/20 text-amber-300"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    }`}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className="min-w-0 max-w-3xl pb-24">{children}</article>
      </div>
    </div>
  );
}
