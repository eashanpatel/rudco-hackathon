import { CircleCheck, TriangleAlert, OctagonMinus, CircleDashed, CircleSlash } from "lucide-react";
import { cn } from "@/lib/cn";

export type BadgeStatus = "quoted" | "needs_clarification" | "no_match" | "review" | "processing";

const MAP: Record<BadgeStatus, { label: string; Icon: typeof CircleCheck; cls: string }> = {
  quoted: { label: "Quoted", Icon: CircleCheck, cls: "text-ok bg-ok-tint" },
  review: { label: "Review", Icon: TriangleAlert, cls: "text-warn bg-warn-tint" },
  needs_clarification: { label: "Held", Icon: OctagonMinus, cls: "text-hold bg-hold-tint" },
  no_match: { label: "No match", Icon: CircleSlash, cls: "text-ink-muted bg-line/60" },
  processing: { label: "Processing", Icon: CircleDashed, cls: "text-info bg-info-tint" },
};

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: BadgeStatus;
  label?: string;
  className?: string;
}) {
  const { label: l, Icon, cls } = MAP[status];
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-[4px] px-2 text-xs font-medium whitespace-nowrap",
        cls,
        className,
      )}
    >
      <Icon
        aria-hidden
        className={cn("size-3.5", status === "processing" && "animate-[spin_3s_linear_infinite]")}
        strokeWidth={2.25}
      />
      {label ?? l}
    </span>
  );
}
