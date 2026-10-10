import { ScanText, Ruler, BookMarked, Scale } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Provenance } from "@/lib/demo/sampleRun";

export const PROVENANCE: Record<Provenance, { label: string; Icon: typeof Ruler }> = {
  ai_read: { label: "AI read", Icon: ScanText },
  rule: { label: "Rule", Icon: Ruler },
  catalog: { label: "Catalog", Icon: BookMarked },
  benchmark: { label: "Benchmark", Icon: Scale },
};

export function ProvenanceGlyph({ source, className }: { source: Provenance; className?: string }) {
  const { Icon, label } = PROVENANCE[source];
  return <Icon aria-label={label} className={cn("size-3 shrink-0", className)} strokeWidth={2} />;
}

export function SpecChip({
  label,
  field,
  source,
  missing,
  active,
  onHover,
  onClick,
}: {
  label: string;
  field: string;
  source: Provenance;
  missing?: boolean;
  active?: boolean;
  onHover?: (on: boolean) => void;
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      onMouseEnter={onHover && (() => onHover(true))}
      onMouseLeave={onHover && (() => onHover(false))}
      onFocus={onHover && (() => onHover(true))}
      onBlur={onHover && (() => onHover(false))}
      aria-label={`${field}: ${label}, source ${PROVENANCE[source].label}`}
      title={`${field} · ${PROVENANCE[source].label}`}
      className={cn(
        "num inline-flex h-7 items-center whitespace-nowrap gap-1.5 rounded-[4px] border px-2 text-[12.5px] leading-none transition-colors",
        missing
          ? "border-dashed border-hold/50 bg-hold-tint text-hold"
          : "border-line-strong bg-surface text-ink",
        active && !missing && "border-accent bg-accent-tint",
        onClick && "cursor-pointer hover:border-accent",
      )}
    >
      <ProvenanceGlyph source={source} className={missing ? "text-hold" : "text-ink-faint"} />
      {label}
    </Comp>
  );
}
