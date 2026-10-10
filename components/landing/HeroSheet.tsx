"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { SourceText } from "@/components/Decoder/SourceText";
import { SpecChip } from "@/components/Lines/SpecChip";
import { StatusBadge } from "@/components/Lines/StatusBadge";
import { SAMPLE_RFQ, fmtUsd, type DemoLine } from "@/lib/demo/sampleRun";
import { useDemoLines, useTween } from "@/lib/demo/useDemoLines";
import { cn } from "@/lib/cn";

type Leader = { id: string; d: string; x0: number; y0: number; x1: number; y1: number };

export function HeroSheet() {
  const { lines, resolve, reset, quoted, total, justResolved } = useDemoLines();
  const [hot, setHot] = useState<string | null>(null);
  const [hotField, setHotField] = useState<string | null>(null);
  const shown = useTween(total);

  const wrap = useRef<HTMLDivElement>(null);
  const srcEls = useRef(new Map<string, HTMLElement>());
  const rowEls = useRef(new Map<string, HTMLElement>());
  const srcPane = useRef<HTMLDivElement>(null);
  const [leaders, setLeaders] = useState<Leader[]>([]);

  const measure = useCallback(() => {
    const w = wrap.current;
    const pane = srcPane.current;
    if (!w || !pane) return;
    const base = w.getBoundingClientRect();
    const paneR = pane.getBoundingClientRect();
    const next: Leader[] = [];
    for (const l of lines) {
      const s = srcEls.current.get(l.id);
      const r = rowEls.current.get(l.id);
      if (!s || !r) continue;
      const sr = s.getClientRects()[0] ?? s.getBoundingClientRect();
      const rr = r.getBoundingClientRect();
      const x0 = paneR.right - base.left;
      const y0 = sr.top + sr.height / 2 - base.top;
      const x1 = rr.left - base.left;
      const y1 = rr.top + 22 - base.top;
      const mid = x0 + (x1 - x0) * 0.5;
      next.push({ id: l.id, x0, y0, x1, y1, d: `M${x0} ${y0} H${mid} V${y1} H${x1 - 6}` });
    }
    setLeaders(next);
  }, [lines]);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const held = lines.filter((l) => l.status === "needs_clarification").length;

  return (
    <div ref={wrap} className="relative">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14">
        {/* RFQ as received */}
        <div ref={srcPane} className="relative">
          <div className="mb-3 flex items-baseline justify-between text-xs text-ink-muted">
            <span className="font-medium text-ink">As received</span>
            <span className="num">email · {SAMPLE_RFQ.split("\n").length} lines</span>
          </div>
          <div className="rounded-md border border-line-strong bg-surface px-5 py-4 shadow-[0_1px_0_rgb(20_22_26/0.04)]">
            <SourceText
              text={SAMPLE_RFQ}
              lines={lines.map((l) => ({
                id: l.id,
                span: l.span,
                status: l.status,
                fields: l.chips.map((c) => ({ field: c.field, span: c.span })),
              }))}
              activeLineId={hot}
              activeField={hotField}
              onHoverLine={setHot}
              lineRef={(id, el) => {
                if (el) srcEls.current.set(id, el);
                else srcEls.current.delete(id);
              }}
              className="text-[12.5px]"
            />
          </div>
        </div>

        {/* Decoded ledger */}
        <div>
          <div className="mb-3 flex items-baseline justify-between text-xs text-ink-muted">
            <span className="font-medium text-ink">As quoted</span>
            <span className="num">
              {quoted.length} quoted · {held} held · {lines.length - quoted.length - held} no match
            </span>
          </div>
          <ol className="divide-y divide-line rounded-md border border-line-strong bg-surface">
            {lines.map((l) => (
              <HeroRow
                key={l.id}
                line={l}
                hot={hot === l.id}
                fresh={justResolved === l.id}
                onHover={(on, field) => {
                  setHot(on ? l.id : null);
                  setHotField(on ? (field ?? null) : null);
                }}
                onResolve={(opt) => resolve(l.id, opt)}
                rowRef={(el) => {
                  if (el) rowEls.current.set(l.id, el);
                  else rowEls.current.delete(l.id);
                }}
              />
            ))}
          </ol>
          <div className="mt-3 flex items-center justify-between gap-4 border-t-2 border-ink pt-3">
            <div className="text-xs text-ink-muted">
              Quote total
              <span className="ml-2 text-ink-faint">excludes held and unmatched lines</span>
            </div>
            <div className="num text-[22px] font-semibold tracking-[-0.02em] text-ink" aria-live="polite">
              {fmtUsd(shown)}
            </div>
          </div>
          {justResolved && (
            <button
              type="button"
              onClick={reset}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-accent"
            >
              <RotateCcw className="size-3" aria-hidden /> Reset the sample
            </button>
          )}
        </div>
      </div>

      {/* leader lines, drafting style */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible lg:block"
      >
        <defs>
          <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="currentColor" />
          </marker>
        </defs>
        {leaders.map((ld) => {
          const on = hot === ld.id;
          return (
            <g
              key={ld.id}
              className={cn(
                "transition-colors duration-200",
                on ? "text-accent" : "text-accent/30",
              )}
            >
              <circle cx={ld.x0} cy={ld.y0} r={2.25} fill="currentColor" />
              <path
                d={ld.d}
                fill="none"
                stroke="currentColor"
                strokeWidth={on ? 1.5 : 1}
                markerEnd="url(#arrow)"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function HeroRow({
  line,
  hot,
  fresh,
  onHover,
  onResolve,
  rowRef,
}: {
  line: DemoLine;
  hot: boolean;
  fresh: boolean;
  onHover: (on: boolean, field?: string) => void;
  onResolve: (opt: string) => void;
  rowRef: (el: HTMLLIElement | null) => void;
}) {
  const held = line.status === "needs_clarification";
  return (
    <li
      ref={rowRef}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={cn(
        "relative px-4 py-2.5 transition-colors duration-200",
        hot && "bg-accent-tint/60",
        held && "bg-hold-tint/60",
        fresh && "animate-[rise_500ms_cubic-bezier(0.16,1,0.3,1)]",
      )}
    >
      <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] items-start gap-x-3 gap-y-2 sm:grid-cols-[1.5rem_minmax(0,1fr)_auto]">
        <span className="num pt-1 text-xs text-ink-faint">{line.n}</span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {line.chips.map((c) => (
              <SpecChip
                key={c.field}
                field={c.field}
                label={c.label}
                source={c.source}
                missing={held && line.ambiguity?.field === c.field}
                onHover={(on) => onHover(on, c.field)}
              />
            ))}
          </div>
          {held && line.ambiguity && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px]">
              <span className="text-hold">{line.ambiguity.reason}</span>
              <span className="flex gap-1.5">
                {line.ambiguity.options?.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => onResolve(o)}
                    className="num h-7 rounded-[4px] border border-ink bg-surface px-2.5 text-[12.5px] font-medium text-ink transition-colors hover:bg-ink hover:text-surface"
                  >
                    {o}
                  </button>
                ))}
              </span>
            </div>
          )}
          {line.status === "no_match" && (
            <div className="mt-1.5 text-[13px] text-ink-muted">{line.alternatives?.[0]}</div>
          )}
        </div>
        <div className="col-start-2 flex items-center justify-between gap-2 sm:col-start-auto sm:flex-col sm:items-end sm:justify-start sm:gap-1">
          <StatusBadge
            status={line.status}
            label={held ? `Held: ${line.ambiguity?.field}` : undefined}
          />
          <span className={cn("num text-[13px]", line.extended ? "text-ink" : "text-ink-faint")}>
            {line.status === "quoted" && line.extended ? fmtUsd(line.extended) : "pending"}
          </span>
        </div>
      </div>
    </li>
  );
}

export function HeroCtas() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href="/runs/demo"
        className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-[15px] font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Try a sample RFQ <ArrowRight className="size-4" aria-hidden />
      </Link>
      <Link
        href="/app"
        className="inline-flex h-11 items-center rounded-md border border-ink/80 px-5 text-[15px] font-medium text-ink transition-colors hover:bg-ink hover:text-surface"
      >
        Paste your own
      </Link>
    </div>
  );
}
