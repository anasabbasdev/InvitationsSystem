import Link from "next/link";
import { APP_NAME } from "./layout";

const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim() || "https://wa.me/966500000000";

const DEMOS = [
  { slug: "ws-royal-demo", label: "زفاف ملكي — عاجي", desc: "Royal Light · Public RSVP" },
  { slug: "ws-floral-demo", label: "زفاف سينمائي — دافئ", desc: "Cinematic Warm · Event B" },
  { slug: "ws-minimal-demo", label: "زفاف عصري — Minimal", desc: "Minimal Modern" },
  { slug: "demo-wedding", label: "ديمو محلي (Legacy)", desc: "Local registry fallback" },
];

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1
            className="text-4xl font-bold tracking-wide sm:text-5xl"
            style={{ fontFamily: "var(--font-amiri)", color: "#A67C2E" }}
          >
            {APP_NAME}
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-[var(--muted)]">
            دعوات رقمية فاخرة تفاعلية — تصميم مخصص لكل مناسبة، مع RSVP ذكي، تذاكر QR
            جماعية، ولوحة تحكم للمالك.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/i/ws-royal-demo"
            className="rounded-full px-8 py-4 text-center text-base font-medium transition hover:opacity-90"
            style={{ backgroundColor: "#C9A24D", color: "#FFFBF5" }}
          >
            مشاهدة دعوة تجريبية
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[var(--border)] bg-white px-8 py-4 text-center text-base text-[var(--foreground)] transition hover:bg-[var(--surface-muted)]"
          >
            طلب عرض سعر
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { title: "دعوات تفاعلية", body: "مشاهد مصممة خصيصاً — ليست قالباً عاماً." },
            { title: "RSVP وموافقة", body: "طلب عام أو رابط خاص مع حد مقاعد." },
            { title: "تذكرة QR جماعية", body: "QR واحد لعدة مقاعد — check-in جزئي." },
            { title: "لوحة المالك", body: "موافقة، رفض، ماسح، إشعارات." },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-sm"
            >
              <h2 className="mb-1 text-sm font-semibold" style={{ color: "#A67C2E" }}>
                {item.title}
              </h2>
              <p className="text-sm text-[var(--muted)]">{item.body}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-[var(--foreground)]">الديموهات</h2>
          <ul className="flex flex-col gap-2">
            {DEMOS.map((demo) => (
              <li key={demo.slug}>
                <Link
                  href={`/i/${demo.slug}`}
                  className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-white px-4 py-3 shadow-sm transition hover:border-amber-400/60 hover:bg-[var(--surface-muted)]"
                >
                  <div>
                    <p className="font-medium">{demo.label}</p>
                    <p className="text-xs text-[var(--muted)]">{demo.desc}</p>
                  </div>
                  <span className="text-xs text-amber-700">فتح ←</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-white p-5 text-sm text-[var(--muted)] shadow-sm">
          <h2 className="mb-2 font-semibold text-[var(--foreground)]">خدمات إضافية (مراسِم)</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>تصوير المناسبات والفيديو</li>
            <li>ديكور الولادة والاحتفالات</li>
            <li>التوزيعات والهدايا</li>
          </ul>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-xs text-stone-500">
          <Link href="/owner/login" className="hover:text-stone-700">
            دخول المالك
          </Link>
          {process.env.NODE_ENV !== "production" && (
            <Link href="/lab/test-hub" className="hover:text-stone-700">
              Test Hub (dev)
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
