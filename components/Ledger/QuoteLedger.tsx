"use client";

import { FileCheck2, Printer, Send } from "lucide-react";
import { fmtUsd, type DemoLine } from "@/lib/demo/sampleRun";
import { useTween } from "@/lib/demo/useDemoLines";
import { cn } from "@/lib/cn";

export function QuoteLedger({
  lines,
  decided,
  activeId,
  onHover,
  onAsk,
}: {
  lines: DemoLine[];
  decided: boolean;
  activeId: string | null;
  onHover: (id: string | null) => void;
  onAsk: () => void;
}) {
  const quoted = lines.filter((l) => l.status === "quoted");
  const held = lines.filter((l) => l.status === "needs_clarification");
  const none = lines.filter((l) => l.status === "no_match");
  const total = decided ? quoted.reduce((s, l) => s + (l.extended ?? 0), 0) : 0;
  const shown = useTween(total);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-5 py-5">
        <div className="text-xs text-ink-muted">Quote total</div>
        <div className="num mt-1 text-[30px] font-semibold leading-none tracking-[-0.02em]" aria-live="polite">
          {fmtUsd(shown)}
        </div>
        <div className="mt-2 text-xs text-ink-muted">
          {decided ? (
            <>
              <span className="num">{quoted.length}</span> of <span className="num">{lines.length}</span> lines.
              Held lines are not included.
            </>
          ) : (
            "Building…"
          )}
        </div>

        {/* composition bar */}
        <div className="mt-4 flex h-2 gap-[2px] overflow-hidden rounded-full" aria-hidden>
          {decided ? (
            lines.map((l) => (
              <span
                key={l.id}
                className={cn(
                  "h-full flex-1 transition-colors duration-500",
                  l.status === "quoted" && "bg-ok",
                  l.status === "needs_clarification" && "bg-hold/70",
                  l.status === "no_match" && "bg-line-strong",
                )}
              />
            ))
          ) : (
            <span className="h-full flex-1 animate-pulse bg-line" />
          )}
        </div>
        <dl className="num mt-2.5 flex gap-4 text-[12px]">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-ok" />
            <dt className="sr-only">Quoted</dt>
            <dd>{decided ? quoted.length : "–"} quoted</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-hold/70" />
            <dt className="sr-only">Held</dt>
            <dd>{decided ? held.length : "–"} held</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-line-strong" />
            <dt className="sr-only">No match</dt>
            <dd>{decided ? none.length : "–"} no match</dd>
          </div>
        </dl>
      </div>

      <ol className="flex-1 overflow-y-auto px-2 py-2">
        {lines.map((l) => {
          const q = decided && l.status === "quoted";
          return (
            <li key={l.id}>
              <button
                type="button"
                onMouseEnter={() => onHover(l.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(l.id)}
                onBlur={() => onHover(null)}
                onClick={() =>
                  document
                    .querySelector(`[data-line-card="${l.id}"]`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" })
                }
                className={cn(
                  "grid w-full grid-cols-[1.75rem_minmax(0,1fr)_auto] items-baseline gap-2 rounded-[4px] px-3 py-2 text-left transition-colors",
                  activeId === l.id ? "bg-accent-tint" : "hover:bg-bg",
                )}
              >
                <span className="num text-xs text-ink-faint">{String(l.n).padStart(2, "0")}</span>
                <span className={cn("truncate text-[13px]", !q && "text-ink-muted")}>
                  {q ? l.sku : l.title}
                </span>
                <span className={cn("num text-[13px]", q ? "text-ink" : "text-ink-faint")}>
                  {!decided
                    ? "…"
                    : q
                      ? fmtUsd(l.extended ?? 0)
                      : l.status === "needs_clarification"
                        ? "pending buyer"
                        : "not quoted"}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="border-t border-line px-5 py-4">
        <div className="text-xs font-medium text-ink-muted">Compliance on this quote</div>
        <ul className="mt-2 space-y-1.5 text-[13px]">
          <li className="flex items-center gap-2">
            <FileCheck2 className="size-3.5 text-info" aria-hidden /> Mill test reports, all lines
          </li>
          <li className="flex items-center gap-2">
            <FileCheck2 className="size-3.5 text-info" aria-hidden /> Domestic melt documentation
          </li>
        </ul>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onAsk}
            disabled={!decided || held.length === 0}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-ink/80 text-[13.5px] font-medium transition-colors hover:bg-ink hover:text-surface disabled:cursor-not-allowed disabled:border-line disabled:text-ink-faint disabled:hover:bg-transparent"
          >
            <Send className="size-3.5" aria-hidden /> Ask buyer
            {decided && held.length > 0 && <span className="num">({held.length})</span>}
          </button>
          <button
            type="button"
            disabled={!decided}
            onClick={() => window.print()}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-accent text-[13.5px] font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-line-strong"
          >
            <Printer className="size-3.5" aria-hidden /> Export
          </button>
        </div>
      </div>
    </div>
  );
}
