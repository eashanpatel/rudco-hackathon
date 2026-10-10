import { Check, ScanText, Ruler, BookMarked, Scale, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";

export const STAGES = [
  { key: "read", name: "Read", by: "AI read", Icon: ScanText },
  { key: "normalize", name: "Normalize", by: "Rule", Icon: Ruler },
  { key: "match", name: "Match", by: "Catalog", Icon: BookMarked },
  { key: "price", name: "Price", by: "Benchmark", Icon: Scale },
  { key: "check", name: "Check", by: "Rule", Icon: ShieldCheck },
] as const;

export type StageKey = (typeof STAGES)[number]["key"];

/** `done` = number of completed stages; the stage at index `done` is running. */
export function PipelineStrip({
  done,
  ms,
}: {
  done: number;
  ms: Partial<Record<StageKey, number>>;
}) {
  return (
    <ol className="no-print grid grid-cols-5 border-b border-line bg-surface" aria-label="Pipeline progress">
      {STAGES.map((s, i) => {
        const state = i < done ? "done" : i === done ? "running" : "pending";
        return (
          <li
            key={s.key}
            aria-current={state === "running" ? "step" : undefined}
            className={cn(
              "relative flex min-w-0 items-center justify-center gap-2.5 px-2 py-2.5 sm:justify-start sm:px-4",
              i > 0 && "border-l border-line",
            )}
          >
            <span
              title={s.name}
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                state === "done" && "border-ok bg-ok text-white",
                state === "running" && "border-accent text-accent",
                state === "pending" && "border-line-strong text-ink-faint",
              )}
            >
              {state === "done" ? (
                <Check className="size-3.5" strokeWidth={2.75} aria-hidden />
              ) : (
                <s.Icon className="size-3.5" aria-hidden />
              )}
            </span>
            <div className="hidden min-w-0 sm:block">
              <div className={cn("text-[13px] font-medium", state === "pending" && "text-ink-faint")}>
                {s.name}
              </div>
              <div className="num hidden truncate text-[11px] text-ink-muted md:block">
                {s.by}
                {state === "done" && ms[s.key] !== undefined && ` · ${ms[s.key]} ms`}
                {state === "running" && " · running"}
              </div>
            </div>
            {state === "running" && (
              <span className="absolute inset-x-0 bottom-0 h-[2px] overflow-hidden bg-accent/15">
                <span className="block h-full w-1/3 animate-[pipe_1.1s_cubic-bezier(0.45,0,0.55,1)_infinite] bg-accent" />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
