import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { signOutAction } from "@/app/owner/actions";

/** Auth layout uses cookies — must not be statically prerendered on CI/Workers. */
export const dynamic = "force-dynamic";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <div className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      {user && (
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
            <Link href="/owner/events" className="text-sm font-semibold" style={{ color: "#A67C2E" }}>
              مراسِم — لوحة التحكم
            </Link>
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-[var(--muted)] sm:inline" dir="ltr">
                {user.email}
              </span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-md border border-[var(--border)] bg-white px-3 py-1.5 text-xs text-[var(--foreground)] hover:bg-[var(--surface-muted)]"
                >
                  تسجيل خروج
                </button>
              </form>
            </div>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
    </div>
  );
}
