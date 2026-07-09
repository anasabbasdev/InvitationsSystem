import Link from "next/link";
import { APP_NAME } from "./layout";

export default function HomePage() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-8 bg-black text-white text-center px-6">
      <div className="flex flex-col items-center gap-3">
        <h1
          className="text-4xl font-bold tracking-wide"
          style={{ fontFamily: "var(--font-amiri)", color: "#C9A24D" }}
        >
          {APP_NAME}
        </h1>
        <p className="text-gray-400 text-base max-w-xs leading-relaxed">
          دعوات رقمية فاخرة تفاعلية — محرك دعوات قابل للتخصيص
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/i/demo-wedding"
          className="w-full px-8 py-4 rounded-full text-base font-medium text-center transition-opacity hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#C9A24D", color: "#0F0B08" }}
        >
          مشاهدة ديمو الزفاف
        </Link>
      </div>

      <p className="text-xs text-gray-600 mt-4">
        Next.js {/* version shown in dev only */}· React · TypeScript · Tailwind
      </p>
    </main>
  );
}
