// Static receipt for sample line 1. All numbers come from one breakdown object
// and the sentence is built from it, mirroring how explain.ts will work.

const B = {
  weightLb: 79.63, // 48 × 96 × 0.0598 in × 0.289 lb/in³
  basePerLb: 2.87,
  qtyBreakPct: 4,
  formPremiumPct: 0,
  bandLow: 2.7,
  bandMid: 2.843,
  bandHigh: 3.05,
};
const gross = B.weightLb * B.basePerLb; // 228.54
const discount = gross * (B.qtyBreakPct / 100); // 9.14
const final = gross - discount; // 219.40
const effPerLb = final / B.weightLb; // 2.755
const delta = ((effPerLb - B.bandMid) / B.bandMid) * 100; // -3.1

const usd = (n: number) => `$${n.toFixed(2)}`;

export function PriceReceipt() {
  const steps = [
    { k: "Weight", v: `${B.weightLb.toFixed(2)} lb`, note: "48 × 96 × 0.0598 in × 0.289 lb/in³" },
    { k: "Base rate", v: `${usd(B.basePerLb)}/lb`, note: "304 sheet, pricing table" },
    { k: "Gross", v: usd(gross), bar: gross },
    { k: "Qty break", v: `−${usd(discount)}`, note: `${B.qtyBreakPct}% for 10–49 sheets`, bar: -discount },
    { k: "Form premium", v: usd(0), note: "none for stock sheet" },
    { k: "Unit price", v: usd(final), bar: final, strong: true },
  ];
  const max = gross;
  // band scale for the benchmark strip
  const lo = 2.5;
  const hi = 3.2;
  const pct = (x: number) => ((x - lo) / (hi - lo)) * 100;

  return (
    <div className="rounded-md border border-line-strong bg-surface">
      <div className="flex items-baseline justify-between border-b border-line px-5 py-3">
        <div className="text-[13px] font-medium">Line 1 · SS304-16G-48x96</div>
        <div className="num text-xs text-ink-muted">per sheet</div>
      </div>
      <dl className="divide-y divide-line">
        {steps.map((s) => (
          <div
            key={s.k}
            className="grid grid-cols-[7.5rem_minmax(0,1fr)_6.5rem] items-center gap-4 px-5 py-2.5"
          >
            <dt className="text-[13px] text-ink-muted">{s.k}</dt>
            <div className="min-w-0">
              {s.bar !== undefined ? (
                <div className="relative h-3">
                  {s.bar < 0 ? (
                    <div
                      className="absolute inset-y-0 rounded-[2px] bg-hold/70"
                      style={{ left: `${((max + s.bar) / max) * 100}%`, width: `${(-s.bar / max) * 100}%` }}
                    />
                  ) : (
                    <div
                      className={s.strong ? "absolute inset-y-0 left-0 rounded-[2px] bg-accent" : "absolute inset-y-0 left-0 rounded-[2px] bg-ink/25"}
                      style={{ width: `${(s.bar / max) * 100}%` }}
                    />
                  )}
                </div>
              ) : (
                <span className="text-xs text-ink-faint">{s.note}</span>
              )}
              {s.bar !== undefined && s.note && (
                <span className="mt-1 block text-xs text-ink-faint">{s.note}</span>
              )}
            </div>
            <dd className={`num text-right text-[13.5px] ${s.strong ? "font-semibold text-ink" : "text-ink"}`}>
              {s.v}
            </dd>
          </div>
        ))}
      </dl>

      <div className="border-t border-line px-5 pb-5 pt-4">
        <div className="mb-2 flex justify-between text-xs text-ink-muted">
          <span>Benchmark band, $/lb</span>
          <span className="num">sample data</span>
        </div>
        <div className="relative h-9">
          <div className="absolute inset-x-0 top-4 h-px bg-line-strong" />
          <div
            className="absolute top-2 h-5 rounded-[3px] bg-info-tint ring-1 ring-info/30"
            style={{ left: `${pct(B.bandLow)}%`, width: `${pct(B.bandHigh) - pct(B.bandLow)}%` }}
          />
          <div className="absolute top-1.5 h-6 w-px bg-info" style={{ left: `${pct(B.bandMid)}%` }} />
          <div
            className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${pct(effPerLb)}%` }}
          >
            <div className="h-8 w-[2px] bg-accent" />
          </div>
        </div>
        <div className="num mt-1 flex justify-between text-[11px] text-ink-faint">
          <span>{usd(lo)}</span>
          <span>{usd(hi)}</span>
        </div>
        <p className="mt-4 text-[14px] leading-relaxed text-ink">
          Priced at <span className="num font-medium">{usd(effPerLb)}/lb</span>,{" "}
          <span className="num font-medium">{Math.abs(delta).toFixed(1)}%</span> under the benchmark mid of{" "}
          <span className="num">{usd(B.bandMid)}/lb</span>, after a{" "}
          <span className="num">{B.qtyBreakPct}%</span> break for 20 sheets.
        </p>
      </div>
    </div>
  );
}
