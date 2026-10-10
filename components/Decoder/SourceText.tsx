"use client";

import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { LineStatus } from "@/lib/demo/sampleRun";

export type SourceLine = {
  id: string;
  span: [number, number];
  status: LineStatus;
  fields: { field: string; span?: [number, number] }[];
};

const LINE_TINT: Record<LineStatus, string> = {
  quoted: "bg-ok-tint",
  needs_clarification: "bg-hold-tint",
  no_match: "bg-line/70",
};
const LINE_RULE: Record<LineStatus, string> = {
  quoted: "decoration-ok",
  needs_clarification: "decoration-hold",
  no_match: "decoration-ink-faint",
};

/**
 * Renders the original RFQ with each detected line as a highlighted span and
 * the exact substrings behind each field underlined.
 */
export function SourceText({
  text,
  lines,
  activeLineId,
  activeField,
  onHoverLine,
  lineRef,
  className,
}: {
  text: string;
  lines: SourceLine[];
  activeLineId?: string | null;
  activeField?: string | null;
  onHoverLine?: (id: string | null) => void;
  lineRef?: (id: string, el: HTMLElement | null) => void;
  className?: string;
}) {
  const sorted = [...lines].sort((a, b) => a.span[0] - b.span[0]);
  const out: ReactNode[] = [];
  let pos = 0;

  for (const line of sorted) {
    if (line.span[0] > pos) out.push(text.slice(pos, line.span[0]));
    const active = activeLineId === line.id;
    const dim = activeLineId != null && !active;

    // field underlines inside the line
    const inner: ReactNode[] = [];
    let p = line.span[0];
    const fields = line.fields
      .filter((f) => f.span && f.span[0] >= line.span[0] && f.span[1] <= line.span[1])
      .sort((a, b) => a.span![0] - b.span![0]);
    for (const f of fields) {
      const [s, e] = f.span!;
      if (s < p) continue;
      if (s > p) inner.push(text.slice(p, s));
      const hot = active && activeField === f.field;
      inner.push(
        <span
          key={`${line.id}-${f.field}`}
          className={cn(
            "underline decoration-[1.5px] underline-offset-[4px] transition-[text-decoration-color,background-color]",
            LINE_RULE[line.status],
            hot && "rounded-[2px] bg-accent/15 decoration-accent decoration-2",
          )}
        >
          {text.slice(s, e)}
        </span>,
      );
      p = e;
    }
    if (p < line.span[1]) inner.push(text.slice(p, line.span[1]));

    out.push(
      <span
        key={line.id}
        ref={(el) => lineRef?.(line.id, el)}
        data-line={line.id}
        onMouseEnter={() => onHoverLine?.(line.id)}
        onMouseLeave={() => onHoverLine?.(null)}
        className={cn(
          "-mx-1 rounded-[3px] px-1 py-[3px] transition-[background-color,opacity,box-shadow] duration-200 [box-decoration-break:clone]",
          LINE_TINT[line.status],
          active && "shadow-[inset_0_0_0_1.5px_var(--accent)]",
          dim && "opacity-45",
        )}
      >
        {inner.map((n, i) => (
          <Fragment key={i}>{n}</Fragment>
        ))}
      </span>,
    );
    pos = line.span[1];
  }
  if (pos < text.length) out.push(text.slice(pos));

  return (
    <pre
      className={cn(
        "num whitespace-pre-wrap break-words text-[13px] leading-[1.75] text-ink",
        className,
      )}
    >
      {out.map((n, i) => (
        <Fragment key={i}>{n}</Fragment>
      ))}
    </pre>
  );
}
