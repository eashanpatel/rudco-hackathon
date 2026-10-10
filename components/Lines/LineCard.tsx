"use client";

import { BookMarked, FileCheck2, Send } from "lucide-react";
import { SpecChip } from "./SpecChip";
import { StatusBadge } from "./StatusBadge";
import { fmtUsd, type DemoLine } from "@/lib/demo/sampleRun";
import { cn } from "@/lib/cn";

export function LineCard({
  line,
  active,
  activeField,
  stage,
  onHover,
  onResolve,
  onAsk,
}: {
  line: DemoLine;
  active: boolean;
  activeField?: string | null;
  /** completed pipeline stages; controls what's revealed */
  stage: number;
  onHover: (on: boolean, field?: string) => void;
  onResolve: (opt: string) => void;
  onAsk?: () => void;
}) {
  const decided = stage >= 5;
  const priced = stage >= 4;
  const matched = stage >= 3;
  const held = decided && line.status === "needs_clarification";
  const status = decided ? line.status : "processing";

  return (
    <article
      tabIndex={0}
      data-line-card={line.id}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      aria-label={`Line ${line.n}, ${line.title}`}
      className={cn(
        "rounded-md border bg-surface outline-none transition-[border-color,box-shadow] duration-200",
        active ? "border-accent shadow-[0_0_0_3px_var(--accent-tint)]" : "border-line-strong",
        held && !active && "border-hold/40",
      )}
    >
      <header className="flex items-start justify-between gap-3 px-4 pt-3">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2.5">
          <span className="num text-xs text-ink-faint">{String(line.n).padStart(2, "0")}</span>
          <h3 className="text-[14px] font-medium sm:truncate">{line.title}</h3>
          <span className="num shrink-0 text-[12.5px] text-ink-muted">
            {line.qty} {line.unit}
          </span>
        </div>
        <StatusBadge
          status={status}
          label={held ? `Held: needs ${line.ambiguity?.field}` : undefined}
        />
      </header>

      <div className="flex flex-wrap gap-1.5 px-4 pb-3 pt-2.5">
        {line.chips.map((c) =>
          (c.source === "catalog" && !matched) ? null : (
            <SpecChip
              key={c.field}
              field={c.field}
              label={c.label}
              source={stage < 2 && c.source === "rule" ? "ai_read" : c.source}
              missing={held && line.ambiguity?.field === c.field}
              active={active && activeField === c.field}
              onHover={(on) => onHover(on, c.field)}
            />
          ),
        )}
      </div>

      {held && line.ambiguity && (
        <div className="border-t border-hold/20 bg-hold-tint/50 px-4 py-3">
          <p className="text-[13px] text-hold">{line.ambiguity.reason}</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-ink-muted">Buyer answered?</span>
            {line.ambiguity.options?.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => onResolve(o)}
                className="num h-7 rounded-[4px] border border-ink bg-surface px-2.5 text-[12.5px] font-medium transition-colors hover:bg-ink hover:text-surface"
              >
                {o}
              </button>
            ))}
            {onAsk && (
              <button
                type="button"
                onClick={onAsk}
                className="ml-auto inline-flex h-7 items-center gap-1.5 rounded-[4px] px-2 text-[12.5px] font-medium text-accent hover:bg-accent-tint"
              >
                <Send className="size-3.5" aria-hidden /> Ask buyer
              </button>
            )}
          </div>
        </div>
      )}

      {decided && line.status === "no_match" && (
        <div className="border-t border-line px-4 py-3 text-[13px] text-ink-muted">
          {line.alternatives?.map((a) => <div key={a}>{a}</div>)}
        </div>
      )}

      {line.status === "quoted" && matched && (
        <footer className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 border-t border-line px-4 py-2.5">
          <span className="num inline-flex min-w-0 items-center gap-1.5 truncate text-[12.5px] text-ink-muted">
            <BookMarked className="size-3 shrink-0" aria-hidden />
            {line.sku}
          </span>
          <span className="num text-right text-[13.5px] font-medium">
            {priced && line.extended ? fmtUsd(line.extended) : <span className="text-ink-faint">pricing…</span>}
          </span>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ink-muted">
            {line.certs.map((c) => (
              <span key={c} className="inline-flex items-center gap-1">
                <FileCheck2 className="size-3 text-info" aria-hidden /> {c}
              </span>
            ))}
          </span>
          {priced && line.unitPrice !== undefined && (
            <span className="num text-right text-[12px] text-ink-muted">
              {fmtUsd(line.unitPrice)} × {line.qty}
              {line.deltaVsBenchmarkPct !== undefined && (
                <span className="ml-2 text-ok">
                  {line.deltaVsBenchmarkPct > 0 ? "+" : "−"}
                  {Math.abs(line.deltaVsBenchmarkPct).toFixed(1)}%
                </span>
              )}
            </span>
          )}
        </footer>
      )}
    </article>
  );
}

export function LineCardSkeleton() {
  return (
    <div className="rounded-md border border-line bg-surface px-4 py-3" aria-hidden>
      <div className="flex justify-between">
        <div className="h-3.5 w-40 animate-pulse rounded bg-line" />
        <div className="h-5 w-20 animate-pulse rounded bg-line/70" />
      </div>
      <div className="mt-3 flex gap-1.5">
        {[56, 76, 84].map((w) => (
          <div key={w} className="h-7 animate-pulse rounded-[4px] bg-line/70" style={{ width: w }} />
        ))}
      </div>
    </div>
  );
}
