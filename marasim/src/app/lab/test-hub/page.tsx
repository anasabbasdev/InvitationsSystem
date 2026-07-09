import { notFound } from "next/navigation";
import Link from "next/link";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function readSeedData(): Record<string, string> {
  const file = resolve(process.cwd(), ".seed-data.local");
  if (!existsSync(file)) return {};
  const out: Record<string, string> = {};
  for (const line of readFileSync(file, "utf8").split("\n")) {
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    out[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return out;
}

export default function TestHubPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const data = readSeedData();

  const links: Array<{ label: string; href: string; note?: string }> = [
    { label: "Landing", href: "/" },
    { label: "Public invitation (Royal)", href: "/i/ws-royal-demo" },
    { label: "Public invitation (Floral / Event B)", href: "/i/ws-floral-demo" },
    {
      label: "Controlled invitation",
      href: data.controlled_invitation_url ?? "/i/ws-royal-demo",
      note: data.controlled_invitation_url ? undefined : "Run npm run db:seed",
    },
    { label: "Owner login", href: "/owner/login", note: data.owner_email },
    {
      label: "Owner dashboard",
      href: data.royal_event_id ? `/owner/events/${data.royal_event_id}` : "/owner/events",
    },
    {
      label: "Scanner Event A (Royal)",
      href: data.royal_event_id ? `/owner/events/${data.royal_event_id}/scanner` : "#",
    },
    {
      label: "Scanner Event B (Floral)",
      href: data.floral_event_id ? `/owner/events/${data.floral_event_id}/scanner` : "#",
    },
    { label: "RSVP pending status", href: data.rsvp_pending_url ?? "#" },
    { label: "RSVP approved status", href: data.rsvp_approved_url ?? "#" },
    { label: "RSVP rejected status", href: data.rsvp_rejected_url ?? "#" },
    { label: "Active ticket", href: data.ticket_active_url ?? "#" },
    { label: "Partially used ticket", href: data.ticket_partial_url ?? "#" },
    { label: "Fully used ticket", href: data.ticket_full_url ?? "#" },
    {
      label: "Wrong-event ticket (scan on Event A)",
      href: data.ticket_wrong_event_url ?? "#",
      note: "Use Scanner Event A",
    },
    { label: "Admin", href: "/admin" },
    { label: "Composer", href: "/lab/composer" },
  ];

  return (
    <main className="min-h-dvh bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#C9A24D" }}>
            Marasim Test Hub
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Development only — run <code className="text-zinc-400">npm run db:seed</code> first.
          </p>
        </div>

        {data.owner_email && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm">
            <p>
              <span className="text-zinc-500">Owner: </span>
              <span dir="ltr">{data.owner_email}</span>
            </p>
            <p>
              <span className="text-zinc-500">Password: </span>
              <span dir="ltr">{data.owner_password ?? "(see SEED_OWNER_PASSWORD)"}</span>
            </p>
          </div>
        )}

        <ul className="flex flex-col gap-2">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="flex flex-col rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 transition hover:border-amber-600/40"
              >
                <span className="font-medium">{link.label}</span>
                <span className="text-xs text-zinc-500 break-all" dir="ltr">
                  {link.href}
                </span>
                {link.note && <span className="text-[11px] text-amber-500/80">{link.note}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
