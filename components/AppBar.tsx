import Link from "next/link";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/brand/Mark";

export function AppBar({ children }: { children?: ReactNode }) {
  return (
    <header className="no-print flex h-14 shrink-0 items-center gap-4 border-b border-line bg-surface px-4 sm:px-5">
      <Wordmark href="/" />
      <span aria-hidden className="h-5 w-px bg-line" />
      <nav className="flex items-center gap-1 text-[13.5px]">
        <Link href="/app" className="rounded-[4px] px-2.5 py-1.5 text-ink-muted hover:bg-bg hover:text-ink">
          New RFQ
        </Link>
        <Link href="/scorecard" className="rounded-[4px] px-2.5 py-1.5 text-ink-muted hover:bg-bg hover:text-ink">
          Scorecard
        </Link>
      </nav>
      <div className="ml-auto flex min-w-0 items-center gap-2">{children}</div>
    </header>
  );
}
