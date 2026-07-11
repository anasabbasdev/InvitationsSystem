import Link from "next/link";
import { type ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  external?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:px-8 sm:py-4 sm:text-base";

const variants = {
  primary:
    "bg-[var(--accent)] text-[#FFFBF5] shadow-sm hover:shadow-md hover:brightness-105 active:scale-[0.98]",
  secondary:
    "border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--surface-muted)] active:scale-[0.98]",
  ghost:
    "border-b border-[var(--accent)] bg-transparent pb-1 text-[var(--foreground)] rounded-none px-0 hover:opacity-80",
};

export default function LandingButton({
  href,
  children,
  variant = "primary",
  className = "",
  external,
}: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;

  if (external || href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
