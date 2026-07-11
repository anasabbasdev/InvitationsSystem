import { APP_NAME } from "@/lib/app-brand";

type Props = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "text-lg",
  md: "text-xl sm:text-2xl",
  lg: "text-3xl sm:text-4xl md:text-5xl",
};

/** Wordmark — uses existing Amiri heading, no new logo asset */
export default function LandingLogo({ className = "", size = "md" }: Props) {
  return (
    <span
      className={`font-bold tracking-wide text-[var(--accent)] ${sizes[size]} ${className}`}
      style={{ fontFamily: "var(--font-amiri)" }}
    >
      {APP_NAME}
    </span>
  );
}
