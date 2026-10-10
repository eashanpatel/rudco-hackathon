import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const COLS = ["1", "2", "3", "4", "5", "6"];
const ROWS = ["A", "B", "C", "D"];

/** A drafting sheet border with zone references along the edges. */
export function DrawingFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative border border-ink/70 p-[18px]", className)}>
      {/* zone ticks: top + bottom */}
      {(["top-0", "bottom-0"] as const).map((pos) => (
        <div
          key={pos}
          aria-hidden
          className={cn("absolute inset-x-[18px] hidden h-[18px] grid-cols-6 sm:grid", pos)}
        >
          {COLS.map((c, i) => (
            <div
              key={c}
              className={cn(
                "num flex items-center justify-center text-[10px] text-ink-faint",
                i > 0 && "border-l border-ink/25",
              )}
            >
              {c}
            </div>
          ))}
        </div>
      ))}
      {/* zone ticks: left + right */}
      {(["left-0", "right-0"] as const).map((pos) => (
        <div
          key={pos}
          aria-hidden
          className={cn("absolute inset-y-[18px] hidden w-[18px] grid-rows-4 sm:grid", pos)}
        >
          {ROWS.map((r, i) => (
            <div
              key={r}
              className={cn(
                "num flex items-center justify-center text-[10px] text-ink-faint",
                i > 0 && "border-t border-ink/25",
              )}
            >
              {r}
            </div>
          ))}
        </div>
      ))}
      <div className="relative border-[1.5px] border-ink bg-bg">{children}</div>
    </div>
  );
}

export function TitleBlock({ rows, className }: { rows: [string, ReactNode][]; className?: string }) {
  return (
    <dl
      className={cn(
        "grid grid-cols-[auto_minmax(0,1fr)] border-l-[1.5px] border-t-[1.5px] border-ink bg-surface text-[11px]",
        className,
      )}
    >
      {rows.map(([k, v], i) => (
        <div key={k} className={cn("contents", i > 0 && "[&>*]:border-t [&>*]:border-ink/30")}>
          <dt className="border-r border-ink/30 px-2.5 py-1.5 uppercase tracking-[0.06em] text-ink-muted">
            {k}
          </dt>
          <dd className="num px-2.5 py-1.5 text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
