import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchEventByScannerToken } from "@/lib/repositories";
import ScannerClient from "@/components/owner/ScannerClient";

interface Props {
  params: Promise<{ token: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const event = await fetchEventByScannerToken(token);
  return {
    title: event ? `ماسح — ${event.title}` : "الماسح غير موجود",
    robots: { index: false, follow: false },
  };
}

export default async function PublicScannerPage({ params }: Props) {
  const { token } = await params;
  const event = await fetchEventByScannerToken(token);

  if (!event) {
    notFound();
  }

  return (
    <main
      className="min-h-dvh px-4 py-8"
      style={{ backgroundColor: "#0a0a0a", color: "#f5f5f5" }}
      dir="rtl"
    >
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <header className="text-center">
          <p className="text-xs text-zinc-500">ماسح الدخول</p>
          <h1 className="mt-1 text-xl font-bold" style={{ color: "#C9A24D" }}>
            {event.title}
          </h1>
        </header>
        <ScannerClient mode={{ type: "public", scannerToken: token }} eventTitle={event.title} />
      </div>
    </main>
  );
}
