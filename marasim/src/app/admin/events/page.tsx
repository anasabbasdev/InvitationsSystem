import Link from "next/link";
import { requireAdminSession } from "@/lib/auth";
import { listAllEvents } from "@/lib/repositories";

export default async function AdminEventsPage() {
  await requireAdminSession();
  const events = await listAllEvents();

  return (
    <main className="min-h-dvh bg-stone-50 px-6 py-10 text-stone-800">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-xs text-stone-500 hover:text-stone-700">
              ← Admin
            </Link>
            <h1 className="mt-1 text-xl font-bold" style={{ color: "#C9A24D" }}>
              المناسبات
            </h1>
          </div>
          <Link
            href="/admin/events/new"
            className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-black"
          >
            + جديد
          </Link>
        </div>

        <ul className="flex flex-col gap-2">
          {events.map((e) => (
            <li
              key={e.id}
              className="flex items-center justify-between rounded-lg border border-stone-200 bg-white px-4 py-3"
            >
              <div>
                <p className="font-medium">{e.title}</p>
                <p className="text-xs text-stone-500">
                  {e.slug} · {e.confirmed_seats}/{e.total_capacity ?? "∞"} مقعد
                </p>
              </div>
              <Link href={`/owner/events/${e.id}`} className="text-xs text-amber-400">
                فتح
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
