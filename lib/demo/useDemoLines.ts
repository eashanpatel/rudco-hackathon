"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEMO_LINES, type DemoLine } from "./sampleRun";

export function useDemoLines(initial: DemoLine[] = DEMO_LINES) {
  const [lines, setLines] = useState(initial);
  const [justResolved, setJustResolved] = useState<string | null>(null);

  const resolve = useCallback((id: string, option: string) => {
    setLines((prev) =>
      prev.map((l) => {
        if (l.id !== id || !l.resolvesTo?.[option]) return l;
        const chips = l.chips.map((c) =>
          c.field === l.ambiguity?.field
            ? { ...c, label: option, source: "rule" as const }
            : c,
        );
        return { ...l, ...l.resolvesTo[option], chips, resolvedWith: option };
      }),
    );
    setJustResolved(id);
  }, []);

  const reset = useCallback(() => {
    setLines(initial);
    setJustResolved(null);
  }, [initial]);

  const quoted = lines.filter((l) => l.status === "quoted");
  const total = quoted.reduce((s, l) => s + (l.extended ?? 0), 0);
  return { lines, resolve, reset, justResolved, quoted, total };
}

/** Eases a displayed number toward its target (exponential ease-out). */
export function useTween(target: number, ms = 700) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  const raf = useRef(0);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    cancelAnimationFrame(raf.current);
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / ms);
      const e = 1 - Math.pow(2, -10 * k);
      const cur = a + (target - a) * (k === 1 ? 1 : e);
      setV(cur);
      from.current = cur;
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, ms]);
  return v;
}
