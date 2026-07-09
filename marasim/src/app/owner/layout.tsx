import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { signOutAction } from "@/app/owner/actions";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <div className="min-h-dvh bg-zinc-950 text-white">
      {user && (
        <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
            <Link href="/owner/events" className="text-sm font-semibold" style={{ color: "#C9A24D" }}>
              مراسِم — لوحة التحكم
            </Link>
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-zinc-500 sm:inline" dir="ltr">
                {user.email}
              </span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
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
