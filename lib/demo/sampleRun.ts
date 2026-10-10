// Design-time fixture: one messy RFQ, decoded the way the pipeline will decode it.
// Prices and SKUs are synthetic sample data. Spans are computed from the text,
// so highlighting stays correct if the copy is edited.

export type Provenance = "ai_read" | "rule" | "catalog" | "benchmark";
export type LineStatus = "quoted" | "needs_clarification" | "no_match";

export type Chip = {
  field: string;
  label: string; // what the chip shows, e.g. "0.060 in"
  raw?: string; // exact substring in the RFQ
  source: Provenance;
  span?: [number, number];
};

export type Ambiguity = { field: string; reason: string; question: string; options?: string[] };

export type DemoLine = {
  id: string;
  n: number;
  rawText: string;
  span: [number, number];
  status: LineStatus;
  title: string;
  chips: Chip[];
  qty: number;
  unit: string;
  sku?: string;
  unitPrice?: number;
  extended?: number;
  deltaVsBenchmarkPct?: number;
  certs: string[];
  ambiguity?: Ambiguity;
  alternatives?: string[];
  resolvedWith?: string;
  /** what the line becomes when the buyer picks an option */
  resolvesTo?: Record<string, Partial<DemoLine>>;
};

export const SAMPLE_RFQ = `From: Dana Whitfield <dana@northbeam-fab.example>
Subject: RFQ: sheet + plate for Line 3 retrofit

Hi team, can you quote the below? Need by the 24th.

1) 304 SS sheet 16ga 4x8, qty 20
2) Stainless 304, 0.060 in, 48 x 96 - 10 sheets
3) SS sheet, 16ga, 48x96 - 12 pcs
4) 1/4 A36 plate 60x120, 4 ea
5) alu 6061 t6 .125 x 48 x 96, 15 sheets
6) 316L sheet 11ga 48 x 120 (48x100?) qty 6
7) Inconel 625 round bar 2" x 12ft, 3 pcs

Domestic melt please. MTRs on everything.

Thanks, Dana`;

function lineSpan(prefix: string): [number, number] {
  const start = SAMPLE_RFQ.indexOf(prefix);
  if (start < 0) throw new Error(`sample line not found: ${prefix}`);
  const end = SAMPLE_RFQ.indexOf("\n", start);
  return [start, end < 0 ? SAMPLE_RFQ.length : end];
}

function chip(lineStart: number, c: Omit<Chip, "span">): Chip {
  if (!c.raw) return c;
  const i = SAMPLE_RFQ.indexOf(c.raw, lineStart);
  return { ...c, span: i < 0 ? undefined : [i, i + c.raw.length] };
}

function build(
  prefix: string,
  rest: Omit<DemoLine, "span" | "rawText" | "chips"> & { chips: Omit<Chip, "span">[] },
): DemoLine {
  const span = lineSpan(prefix);
  return {
    ...rest,
    span,
    rawText: SAMPLE_RFQ.slice(span[0], span[1]),
    chips: rest.chips.map((c) => chip(span[0], c)),
  };
}

const money = (n: number) => Math.round(n * 100) / 100;

export const DEMO_LINES: DemoLine[] = [
  build("1) ", {
    id: "L1",
    n: 1,
    status: "quoted",
    title: "Stainless sheet",
    qty: 20,
    unit: "sheets",
    sku: "SS304-16G-48x96",
    unitPrice: 219.4,
    extended: money(219.4 * 20),
    deltaVsBenchmarkPct: -3.1,
    certs: ["MTR", "Domestic melt"],
    chips: [
      { field: "grade", label: "304", raw: "304", source: "ai_read" },
      { field: "thickness", label: "0.0598 in", raw: "16ga", source: "rule" },
      { field: "size", label: "48 × 96 in", raw: "4x8", source: "rule" },
      { field: "standard", label: "ASTM A240", source: "catalog" },
    ],
  }),
  build("2) ", {
    id: "L2",
    n: 2,
    status: "quoted",
    title: "Stainless sheet",
    qty: 10,
    unit: "sheets",
    sku: "SS304-060-48x96",
    unitPrice: 228.75,
    extended: money(228.75 * 10),
    deltaVsBenchmarkPct: -1.8,
    certs: ["MTR", "Domestic melt"],
    chips: [
      { field: "grade", label: "304", raw: "304", source: "ai_read" },
      { field: "thickness", label: "0.060 in", raw: "0.060 in", source: "ai_read" },
      { field: "size", label: "48 × 96 in", raw: "48 x 96", source: "ai_read" },
      { field: "standard", label: "ASTM A240", source: "catalog" },
    ],
  }),
  build("3) ", {
    id: "L3",
    n: 3,
    status: "needs_clarification",
    title: "Stainless sheet",
    qty: 12,
    unit: "pcs",
    certs: ["MTR", "Domestic melt"],
    chips: [
      { field: "grade", label: "grade?", raw: "SS", source: "ai_read" },
      { field: "thickness", label: "0.0598 in", raw: "16ga", source: "rule" },
      { field: "size", label: "48 × 96 in", raw: "48x96", source: "ai_read" },
    ],
    ambiguity: {
      field: "grade",
      reason: "“SS” without a grade: 304 and 316 both fit",
      question: "Line 3 says “SS sheet, 16ga”. Which grade: 304 or 316?",
      options: ["304", "316"],
    },
    resolvesTo: {
      "304": {
        status: "quoted",
        sku: "SS304-16G-48x96",
        unitPrice: 219.4,
        extended: money(219.4 * 12),
        deltaVsBenchmarkPct: -3.1,
      },
      "316": {
        status: "quoted",
        sku: "SS316-16G-48x96",
        unitPrice: 301.6,
        extended: money(301.6 * 12),
        deltaVsBenchmarkPct: -2.4,
      },
    },
  }),
  build("4) ", {
    id: "L4",
    n: 4,
    status: "quoted",
    title: "Carbon steel plate",
    qty: 4,
    unit: "ea",
    sku: "PL-A36-0250-60x120",
    unitPrice: 612.3,
    extended: money(612.3 * 4),
    deltaVsBenchmarkPct: -0.6,
    certs: ["MTR", "Domestic melt"],
    chips: [
      { field: "grade", label: "A36", raw: "A36", source: "ai_read" },
      { field: "thickness", label: "0.250 in", raw: "1/4", source: "rule" },
      { field: "size", label: "60 × 120 in", raw: "60x120", source: "ai_read" },
      { field: "standard", label: "ASTM A36", source: "catalog" },
    ],
  }),
  build("5) ", {
    id: "L5",
    n: 5,
    status: "quoted",
    title: "Aluminum sheet",
    qty: 15,
    unit: "sheets",
    sku: "AL6061T6-125-48x96",
    unitPrice: 188.9,
    extended: money(188.9 * 15),
    deltaVsBenchmarkPct: -2.2,
    certs: ["MTR", "Domestic melt"],
    chips: [
      { field: "grade", label: "6061-T6", raw: "6061 t6", source: "rule" },
      { field: "thickness", label: "0.125 in", raw: ".125", source: "ai_read" },
      { field: "size", label: "48 × 96 in", raw: "48 x 96", source: "ai_read" },
      { field: "standard", label: "ASTM B209", source: "catalog" },
    ],
  }),
  build("6) ", {
    id: "L6",
    n: 6,
    status: "needs_clarification",
    title: "Stainless sheet",
    qty: 6,
    unit: "sheets",
    certs: ["MTR", "Domestic melt"],
    chips: [
      { field: "grade", label: "316L", raw: "316L", source: "ai_read" },
      { field: "thickness", label: "0.1196 in", raw: "11ga", source: "rule" },
      { field: "size", label: "48 × 120 or 100?", raw: "48 x 120", source: "ai_read" },
    ],
    ambiguity: {
      field: "size",
      reason: "Two lengths on one line: 120 in and 100 in",
      question: "Line 6 lists 48 × 120 and 48 × 100. Which length do you need?",
      options: ["48 × 120", "48 × 100"],
    },
    resolvesTo: {
      "48 × 120": {
        status: "quoted",
        sku: "SS316L-11G-48x120",
        unitPrice: 742.1,
        extended: money(742.1 * 6),
        deltaVsBenchmarkPct: -1.2,
      },
      "48 × 100": {
        status: "quoted",
        sku: "SS316L-11G-48x120 cut",
        unitPrice: 668.4,
        extended: money(668.4 * 6),
        deltaVsBenchmarkPct: -0.9,
      },
    },
  }),
  build("7) ", {
    id: "L7",
    n: 7,
    status: "no_match",
    title: "Nickel alloy round bar",
    qty: 3,
    unit: "pcs",
    certs: ["MTR", "Domestic melt"],
    chips: [
      { field: "grade", label: "Inconel 625", raw: "Inconel 625", source: "ai_read" },
      { field: "size", label: "Ø 2.000 in × 144 in", raw: '2" x 12ft', source: "rule" },
    ],
    alternatives: ["No nickel alloys in catalog", "Closest: SS316-RB-2.000 (different alloy)"],
  }),
];

export const DEMO_RUN = {
  id: "demo",
  title: "Northbeam Fabrication · Line 3 retrofit",
  buyer: "Dana Whitfield, Northbeam Fabrication",
  model: "claude-sonnet-5",
  gateway: "Nicrron",
  costUsd: 0.02,
  stagesMs: { read: 2140, normalize: 12, match: 31, price: 4, check: 3 },
};

export const fmtUsd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });
