import Link from "next/link";
import { requireAdminSession } from "@/lib/auth";
import { listAllEvents, listAllInvitations } from "@/lib/repositories";

export default async function AdminPage() {
  await requireAdminSession();
  const [events, invitations] = await Promise.all([listAllEvents(), listAllInvitations()]);

  return (
    <main className="min-h-dvh bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#C9A24D" }}>
            لوحة الإدارة الداخلية
          </h1>
          <p className="text-sm text-zinc-500">إدارة المناسبات والدعوات — MVP</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="المناسبات" value={events.length} />
          <StatCard label="الدعوات" value={invitations.length} />
          <Link
            href="/lab/composer"
            className="flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-amber-400 hover:border-amber-600/40"
          >
            Composer →
          </Link>
        </div>

        <nav className="flex flex-wrap gap-2">
          <AdminLink href="/admin/events" label="المناسبات" />
          <AdminLink href="/admin/events/new" label="مناسبة جديدة" />
          <AdminLink href="/admin/invitations" label="الدعوات" />
          <AdminLink href="/owner/events" label="لوحة المالك" />
          {process.env.NODE_ENV !== "production" && (
            <AdminLink href="/lab/test-hub" label="Test Hub" />
          )}
        </nav>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-zinc-500">{label}</div>
    </div>
  );
}

function AdminLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-md border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900"
    >
      {label}
    </Link>
  );
}
