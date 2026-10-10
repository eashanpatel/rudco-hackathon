import Link from "next/link";
import { cn } from "@/lib/cn";

/** RudCo mark: a sheet in plan view with a dimension line across the top. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-6", className)} fill="none">
      <path d="M3 4.5h18M3 3v3M21 3v3" stroke="currentColor" strokeWidth="1.4" />
      <rect x="3" y="8.5" width="18" height="12.5" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 15.5h7.5" stroke="currentColor" strokeWidth="1.4" strokeDasharray="1.6 1.4" />
    </svg>
  );
}

export function Wordmark({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2 text-ink", className)}
      aria-label="RudCo home"
    >
      <Mark className="text-accent" />
      <span className="font-display text-[19px] font-[650] tracking-[-0.01em]">RudCo</span>
    </Link>
  );
}
