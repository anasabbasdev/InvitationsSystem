"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createEventAction } from "@/app/admin/actions";

export default function AdminNewEventPage() {
  const [state, formAction, pending] = useActionState(createEventAction, null);

  return (
    <main className="min-h-dvh bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-md space-y-6">
        <div>
          <Link href="/admin/events" className="text-xs text-zinc-500 hover:text-zinc-300">
            ← المناسبات
          </Link>
          <h1 className="mt-1 text-xl font-bold" style={{ color: "#C9A24D" }}>
            مناسبة جديدة
          </h1>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <Field name="title" label="العنوان" required />
          <Field name="slug" label="Slug" required dir="ltr" />
          <Field name="ownerEmail" label="بريد المالك" required dir="ltr" placeholder="owner@marasim.local" />
          <Field name="totalCapacity" label="السعة" type="number" dir="ltr" />
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-400">RSVP Mode</span>
            <select
              name="rsvpMode"
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
              defaultValue="public_request"
            >
              <option value="public_request">Public Request</option>
              <option value="controlled_link">Controlled Link</option>
              <option value="none">None</option>
            </select>
          </label>

          {state?.ok === false && <p className="text-sm text-red-400">{state.message}</p>}
          {state?.ok === true && (
            <p className="text-sm text-green-400">تم إنشاء المناسبة بنجاح.</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-amber-500 py-3 text-sm font-medium text-black disabled:opacity-50"
          >
            {pending ? "جاري الحفظ..." : "إنشاء"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Field({
  name,
  label,
  required,
  type = "text",
  dir,
  placeholder,
}: {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  dir?: "ltr" | "rtl";
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-zinc-400">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        dir={dir}
        placeholder={placeholder}
        className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 outline-none focus:border-amber-500"
      />
    </label>
  );
}
