"use client";

import { useState } from "react";
import type { DbInviteLinkRow } from "@/types/persistence";
import {
  createInviteLinkAction,
  disableInviteLinkAction,
} from "@/app/owner/events/[eventId]/invite-links-actions";

const SIDE_LABELS: Record<string, string> = {
  groom: "طرف العريس",
  bride: "طرف العروس",
  general: "عام",
  vip: "VIP",
};

const STATUS_LABELS: Record<string, string> = {
  active: "نشط",
  disabled: "معطّل",
  expired: "منتهي",
  confirmed: "تم التأكيد",
};

export default function InviteLinksPanel({
  eventId,
  invitationId,
  links,
  slug,
}: {
  eventId: string;
  invitationId: string | null;
  links: DbInviteLinkRow[];
  slug?: string;
}) {
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function buildInviteUrl(token: string): string {
    if (typeof window === "undefined" || !slug) return `/i/${slug}?t=${token}`;
    return `${window.location.origin}/i/${slug}?t=${token}`;
  }

  async function copyLink(id: string, token: string) {
    try {
      await navigator.clipboard.writeText(buildInviteUrl(token));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // clipboard unavailable — ignore silently
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-stone-700">روابط الدعوة الخاصة (Controlled Link)</h2>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          disabled={!slug}
          className="rounded-md border border-stone-300 px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-100 disabled:opacity-40"
        >
          {showForm ? "إغلاق" : "+ رابط جديد"}
        </button>
      </div>

      {!slug && (
        <p className="text-xs text-stone-500">لا توجد دعوة مرتبطة بهذه المناسبة بعد.</p>
      )}

      {showForm && (
        <form
          action={async (formData) => {
            await createInviteLinkAction(eventId, formData);
            setShowForm(false);
          }}
          className="flex flex-col gap-2 rounded-md bg-zinc-800/50 p-3"
        >
          <input type="hidden" name="invitationId" value={invitationId ?? ""} />
          <div className="grid grid-cols-2 gap-2">
            <input
              name="label"
              placeholder="التسمية (مثال: عائلة أحمد)"
              className="col-span-2 rounded-md border border-stone-300 bg-white px-3 py-2 text-xs text-stone-800 outline-none focus:border-amber-500"
            />
            <input
              name="guestName"
              placeholder="اسم الضيف (اختياري)"
              className="rounded-md border border-stone-300 bg-white px-3 py-2 text-xs text-stone-800 outline-none focus:border-amber-500"
            />
            <select
              name="side"
              defaultValue=""
              className="rounded-md border border-stone-300 bg-white px-3 py-2 text-xs text-stone-800 outline-none focus:border-amber-500"
            >
              <option value="">بدون طرف محدد</option>
              <option value="groom">طرف العريس</option>
              <option value="bride">طرف العروس</option>
              <option value="general">عام</option>
              <option value="vip">VIP</option>
            </select>
            <input
              name="maxSeats"
              type="number"
              min={1}
              max={50}
              defaultValue={2}
              required
              placeholder="عدد المقاعد"
              className="rounded-md border border-stone-300 bg-white px-3 py-2 text-xs text-stone-800 outline-none focus:border-amber-500"
            />
            <input
              name="expiresAt"
              type="date"
              className="rounded-md border border-stone-300 bg-white px-3 py-2 text-xs text-stone-800 outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            className="mt-1 rounded-md bg-amber-500 px-3 py-2 text-xs font-medium text-black hover:opacity-90"
          >
            إنشاء الرابط
          </button>
        </form>
      )}

      {links.length === 0 ? (
        <p className="text-xs text-stone-500">لا توجد روابط خاصة بعد.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {links.map((link) => (
            <li
              key={link.id}
              className="flex flex-col gap-1.5 rounded-md border border-stone-200 bg-stone-100/80 p-3 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-stone-700">
                  {link.label || "بدون تسمية"}
                  {link.side ? ` · ${SIDE_LABELS[link.side] ?? link.side}` : ""}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px]"
                  style={{
                    backgroundColor:
                      link.status === "confirmed"
                        ? "#14532d"
                        : link.status === "active"
                          ? "#1e3a8a"
                          : "#3f3f46",
                    color:
                      link.status === "confirmed"
                        ? "#86efac"
                        : link.status === "active"
                          ? "#93c5fd"
                          : "#d4d4d8",
                  }}
                >
                  {STATUS_LABELS[link.status] ?? link.status}
                </span>
              </div>
              <p className="text-stone-500">
                حد المقاعد: {link.max_seats}
                {link.confirmed_seats != null ? ` · تم تأكيد ${link.confirmed_seats}` : ""}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => copyLink(link.id, link.token)}
                  disabled={!slug}
                  className="rounded-md border border-stone-300 px-2.5 py-1 text-[11px] text-stone-700 hover:bg-stone-100 disabled:opacity-40"
                >
                  {copiedId === link.id ? "تم النسخ" : "نسخ الرابط"}
                </button>
                {link.status === "active" && (
                  <form action={disableInviteLinkAction.bind(null, eventId, link.id)}>
                    <button
                      type="submit"
                      className="rounded-md border border-red-900 px-2.5 py-1 text-[11px] text-red-700 hover:bg-red-950/50"
                    >
                      تعطيل
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
