import { SAMPLE_RFQ } from "./sampleRun";

// The three "Try a sample RFQ" inputs. Sample 1 is the fully decoded fixture;
// 2 and 3 become live runs once the pipeline is wired (Phase 2-3).
export const SAMPLES = [
  {
    id: "northbeam",
    name: "Northbeam Fabrication",
    kind: "Email",
    summary: "7 lines in 5 notations, one missing grade, one conflicting size",
    text: SAMPLE_RFQ,
  },
  {
    id: "harlan",
    name: "Harlan Marine Works",
    kind: "Email",
    summary: "Plate and bar with MTR and DFARS asks",
    text: `Subject: Quote request - hull repair stock

Pls quote:
- 3/8" A36 plate 96 x 240, 2 pcs
- 1018 CRS flat bar 1/2 x 2 x 12', 10 ea
- 316 SS plate .25 x 48 x 96 (2)
- aluminum 5052 sheet 0.090 x 48 x 144, 8 sheets

All items DFARS compliant, MTRs required. Ship to Groton CT.`,
  },
  {
    id: "keystone",
    name: "Keystone HVAC",
    kind: "Pasted list",
    summary: "Metric sizes and a bare quantity",
    text: `galv sheet 1219 x 2438 mm, 20ga - 40
304L sheet 1.5mm 1219x2438 x 25 sheets
SS tube 2" OD x .065 wall x 20 ft - 12
alum 6061 plate 1/2 x 24 x 36  50`,
  },
] as const;
