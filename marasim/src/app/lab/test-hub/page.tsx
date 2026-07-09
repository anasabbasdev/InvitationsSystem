import { notFound } from "next/navigation";
import Link from "next/link";

/** Static demo links — safe on Cloudflare Workers (no node:fs). */
const STATIC_LINKS: Array<{ label: string; href: string; note?: string }> = [
  { label: "Landing", href: "/" },
  { label: "Public invitation (Royal)", href: "/i/ws-royal-demo" },
  { label: "Public invitation (Floral / Event B)", href: "/i/ws-floral-demo" },
  { label: "Owner login", href: "/owner/login" },
  { label: "Owner dashboard", href: "/owner/events" },
  { label: "Admin", href: "/admin" },
  { label: "Composer", href: "/lab/composer" },
];

function isTestHubEnabled(): boolean {
  if (process.env.ENABLE_TEST_HUB === "true") return true;
  return process.env.NODE_ENV !== "production";
}

export default function TestHubPage() {
  if (!isTestHubEnabled()) {
    notFound();
  }

  return (
    <main className="min-h-dvh bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#C9A24D" }}>
            Marasim Test Hub
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            روابط التجربة السريعة. على الإنتاج: عيّن{" "}
            <code className="text-zinc-400">ENABLE_TEST_HUB=true</code> في Cloudflare Worker
            لإظهار هذه الصفحة.
          </p>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-400">
          <p>بيانات الدخول التجريبية (بعد seed):</p>
          <p dir="ltr" className="mt-1">
            owner@marasim.local / MarasimDemo123!
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            روابط RSVP/Ticket الدقيقة من seed محلياً في <code>.seed-data.local</code>
          </p>
        </div>

        <ul className="flex flex-col gap-2">
          {STATIC_LINKS.map((link) => (
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
