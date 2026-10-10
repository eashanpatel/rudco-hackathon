"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { Cpu, RotateCcw } from "lucide-react";
import { AppBar } from "@/components/AppBar";
import { SourceText } from "@/components/Decoder/SourceText";
import { PipelineStrip, STAGES } from "@/components/Pipeline/PipelineStrip";
import { LineCard, LineCardSkeleton } from "@/components/Lines/LineCard";
import { QuoteLedger } from "@/components/Ledger/QuoteLedger";
import { ClarificationComposer, draftClarification } from "@/components/Clarify/ClarificationComposer";
import { DEMO_RUN, SAMPLE_RFQ, fmtUsd, type DemoLine, type LineStatus } from "@/lib/demo/sampleRun";
import { useDemoLines, useTween } from "@/lib/demo/useDemoLines";
import { cn } from "@/lib/cn";

// Simulated stage timings for the design fixture; Phase 3 replaces this with SSE.
const PLAYBACK = [1500, 350, 400, 300, 300];

const LANES: { status: LineStatus; title: string; empty: string }[] = [
  { status: "needs_clarification", title: "Needs your buyer", empty: "Nothing held. Every line was clear." },
  { status: "quoted", title: "Quoted", empty: "No lines quoted yet." },
  { status: "no_match", title: "No match", empty: "Every line matched the catalog." },
];

export function Workspace() {
  const { lines, resolve, reset, justResolved } = useDemoLines();
  const [stage, setStage] = useState(0);
  const [hot, setHot] = useState<string | null>(null);
  const [hotField, setHotField] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const srcEls = useRef(new Map<string, HTMLElement>());

  // play the pipeline once
  useEffect(() => {
    if (stage >= STAGES.length) return;
    const t = setTimeout(() => setStage((s) => s + 1), PLAYBACK[stage]);
    return () => clearTimeout(t);
  }, [stage]);

  const decided = stage >= STAGES.length;
  const ms = useMemo(() => DEMO_RUN.stagesMs, []);

  // hover a card -> bring its source line into view
  useEffect(() => {
    if (!hot) return;
    srcEls.current.get(hot)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [hot]);

  // J / K move between lines
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key !== "j" && e.key !== "k") return;
      const ids = LANES.flatMap((ln) => lines.filter((l) => l.status === ln.status).map((l) => l.id));
      const i = hot ? ids.indexOf(hot) : -1;
      const next = ids[Math.max(0, Math.min(ids.length - 1, i + (e.key === "j" ? 1 : -1)))];
      const el = document.querySelector<HTMLElement>(`[data-line-card="${next}"]`);
      el?.focus();
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lines, hot]);

  const quotedCount = lines.filter((l) => l.status === "quoted").length;
  const draft = draftClarification(lines, "Dana", quotedCount, lines.length);
  const visibleStatus = (l: DemoLine): LineStatus => (decided ? l.status : "quoted");

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg">
      <AppBar>
        <span className="num hidden items-center gap-1.5 rounded-[4px] border border-line px-2 py-1 text-[12px] text-ink-muted lg:inline-flex">
          <Cpu className="size-3.5" aria-hidden />
          {DEMO_RUN.model} via {DEMO_RUN.gateway} · ${DEMO_RUN.costUsd.toFixed(2)} est.
        </span>
      </AppBar>

      <div className="flex shrink-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line bg-surface px-4 pb-3 pt-4 sm:px-5">
        <div className="min-w-0">
          <h1 className="truncate text-[18px] font-semibold tracking-[-0.01em]">{DEMO_RUN.title}</h1>
          <p className="text-[12.5px] text-ink-muted">
            From {DEMO_RUN.buyer} · email · <span className="num">{lines.length}</span> lines · sample data
          </p>
        </div>
        {justResolved && (
          <button
            type="button"
            onClick={() => {
              reset();
              setStage(0);
            }}
            className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-muted hover:text-accent"
          >
            <RotateCcw className="size-3" aria-hidden /> Replay sample
          </button>
        )}
      </div>

      <PipelineStrip done={stage} ms={ms} />

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.3fr)_320px]">
        {/* Decoder */}
        <section aria-label="Original RFQ" className="hidden min-h-0 flex-col border-r border-line lg:flex">
          <div className="flex items-baseline justify-between border-b border-line px-5 py-2.5">
            <h2 className="text-[13px] font-semibold">Source</h2>
            <span className="text-[12px] text-ink-muted">hover a line to trace it</span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <SourceText
              text={SAMPLE_RFQ}
              lines={
                stage >= 1
                  ? lines.map((l) => ({
                      id: l.id,
                      span: l.span,
                      status: visibleStatus(l),
                      fields: l.chips.map((c) => ({ field: c.field, span: c.span })),
                    }))
                  : []
              }
              activeLineId={hot}
              activeField={hotField}
              onHoverLine={setHot}
              lineRef={(id, el) => {
                if (el) srcEls.current.set(id, el);
                else srcEls.current.delete(id);
              }}
            />
          </div>
        </section>

        {/* Lanes */}
        <section aria-label="Lines" className="min-h-0 overflow-y-auto px-4 py-4 sm:px-5">
          {stage < 1 ? (
            <div className="space-y-3">
              <LaneHeading title="Reading the RFQ" count={null} />
              {Array.from({ length: 5 }).map((_, i) => (
                <LineCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <LayoutGroup>
              {(decided ? LANES : [{ status: "quoted" as const, title: "Lines", empty: "" }]).map((lane) => {
                const inLane = lines.filter((l) => visibleStatus(l) === lane.status);
                return (
                  <div key={`${lane.status}-${decided}`} className="mb-7 last:mb-0">
                    <LaneHeading
                      title={lane.title}
                      count={inLane.length}
                      tone={lane.status === "needs_clarification" && inLane.length > 0 ? "hold" : undefined}
                      action={
                        lane.status === "needs_clarification" && inLane.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => setAsking(true)}
                            className="text-[12.5px] font-medium text-accent hover:underline"
                          >
                            Draft one email for all {inLane.length}
                          </button>
                        ) : undefined
                      }
                    />
                    {inLane.length === 0 ? (
                      <p className="rounded-md border border-dashed border-line-strong px-4 py-3 text-[13px] text-ink-muted">
                        {lane.empty}
                      </p>
                    ) : (
                      <ul className="space-y-3">
                        
                          {inLane.map((l) => (
                            <motion.li
                              key={l.id}
                              layout
                              layoutId={l.id}
                              transition={{ type: "spring", stiffness: 380, damping: 36 }}
                            >
                              <LineCard
                                line={l}
                                stage={stage}
                                active={hot === l.id}
                                activeField={hotField}
                                onHover={(on, f) => {
                                  setHot(on ? l.id : null);
                                  setHotField(on ? (f ?? null) : null);
                                }}
                                onResolve={(o) => resolve(l.id, o)}
                                onAsk={() => setAsking(true)}
                              />
                            </motion.li>
                          ))}
                        
                      </ul>
                    )}
                  </div>
                );
              })}
            </LayoutGroup>
          )}
        </section>

        {/* Ledger */}
        <aside aria-label="Quote ledger" className="hidden min-h-0 border-l border-line bg-surface lg:block">
          <QuoteLedger
            lines={lines}
            decided={decided}
            activeId={hot}
            onHover={setHot}
            onAsk={() => setAsking(true)}
          />
        </aside>
      </div>

      {/* Compact ledger for narrow screens */}
      <MobileTotal lines={lines} decided={decided} onAsk={() => setAsking(true)} />

      <ClarificationComposer
        open={asking}
        onClose={() => setAsking(false)}
        to={DEMO_RUN.buyer}
        subject={draft.subject}
        body={draft.body}
      />
    </div>
  );
}

function MobileTotal({
  lines,
  decided,
  onAsk,
}: {
  lines: DemoLine[];
  decided: boolean;
  onAsk: () => void;
}) {
  const quoted = lines.filter((l) => l.status === "quoted");
  const held = lines.filter((l) => l.status === "needs_clarification").length;
  const total = decided ? quoted.reduce((s, l) => s + (l.extended ?? 0), 0) : 0;
  const shown = useTween(total);
  return (
    <div className="no-print flex shrink-0 items-center justify-between gap-3 border-t border-line bg-surface px-4 py-3 lg:hidden">
      <div>
        <div className="num text-[20px] font-semibold leading-none tracking-[-0.02em]">{fmtUsd(shown)}</div>
        <div className="mt-1 text-[12px] text-ink-muted">
          {decided ? `${quoted.length} quoted · ${held} held` : "Building…"}
        </div>
      </div>
      <button
        type="button"
        onClick={onAsk}
        disabled={!decided || held === 0}
        className="inline-flex h-9 items-center rounded-md bg-accent px-3.5 text-[13.5px] font-medium text-white disabled:bg-line-strong disabled:text-ink-muted"
      >
        Ask buyer{decided && held > 0 ? ` (${held})` : ""}
      </button>
    </div>
  );
}

function LaneHeading({
  title,
  count,
  tone,
  action,
}: {
  title: string;
  count: number | null;
  tone?: "hold";
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-2.5 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-[13px] font-semibold">
        {title}
        {count !== null && (
          <span
            className={cn(
              "num rounded-[4px] px-1.5 py-0.5 text-[11.5px] font-medium",
              tone === "hold" ? "bg-hold-tint text-hold" : "bg-line/70 text-ink-muted",
            )}
          >
            {count}
          </span>
        )}
      </h2>
      {action}
    </div>
  );
}
