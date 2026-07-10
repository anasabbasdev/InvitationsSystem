import Link from "next/link";
import { requireAdminSession } from "@/lib/auth";
import { listAllInvitations } from "@/lib/repositories";

export default async function AdminInvitationsPage() {
  await requireAdminSession();
  const invitations = await listAllInvitations();

  return (
    <main className="min-h-dvh bg-stone-50 px-6 py-10 text-stone-800">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <Link href="/admin" className="text-xs text-stone-500 hover:text-stone-700">
            ← Admin
          </Link>
          <h1 className="mt-1 text-xl font-bold" style={{ color: "#C9A24D" }}>
            الدعوات
          </h1>
          <p className="text-xs text-stone-500">
            للإنشاء والنشر استخدم Composer أو seed. Publish يُنشئ snapshot مجمدة.
          </p>
        </div>

        <ul className="flex flex-col gap-2">
          {invitations.map((inv) => (
            <li
              key={inv.id}
              className="flex items-center justify-between rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium">{inv.slug}</p>
                <p className="text-xs text-stone-500">
                  {inv.status}
                  {inv.published_snapshot_id ? " · published" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/i/${inv.slug}`} className="text-xs text-amber-400" target="_blank">
                  فتح
                </Link>
                <Link href="/lab/composer" className="text-xs text-stone-600">
                  Composer
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
