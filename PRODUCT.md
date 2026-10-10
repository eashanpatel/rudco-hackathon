# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two sides of an industrial metals RFQ, weighted equally:

- **The quoting side:** an inside-sales rep or estimator at a metals distributor or service center. They receive messy RFQs from buyers by email, PDF or spreadsheet, and need to turn them into an accurate quote fast without quietly guessing at specs.
- **The buying side:** an industrial purchasing professional who sends the RFQ. They see the quote, which lines are held and why, and the clarifying questions that come back to them.

Both are working professionals doing a precise, repetitive job where a wrong grade or thickness costs real money. They inspect and verify; they are not chatting with an AI.

Evaluating audiences right now: Get Hired Hack judges, who see a live 2–3 minute demo (laptop or projector) plus the Devpost page, and recruiters, since the project is also a portfolio piece for the team.

## Product Purpose

RudCo turns a messy RFQ into a ready-to-send quote. Every line is decoded into a standard spec, matched to a supplier catalog, priced against a benchmark with a visible explanation, and checked for compliance requirements (MTR, country of origin, DFARS, ASTM certs).

Success: a judge clicks a sample RFQ and, within 30 seconds, sees a quote with at least one held line, resolves it with one click, and exports the quote. Every number on it can be traced to where it came from.

## Positioning

"A quoting agent that would rather ask than guess."

The mechanism: the LLM only *extracts* fields from text. Unit and gauge math, grade resolution, catalog matching, pricing and compliance are plain deterministic code. Lines the system isn't sure of are never guessed; they are held back and turned into a specific clarifying question for the buyer. The quote is partial by design: its total visibly excludes held lines. Each value carries its provenance (AI read, Rule, Catalog, Benchmark).

This is the hackathon's "AI You Can Trust" answer to judges who reject thin prompt-and-print wrappers.

## Operating Context

- Input: RFQ as email text, PDF or XLSX, or one of three sample RFQs.
- Pipeline: Read (LLM) → Normalize → Match → Price → Check → Decide, streamed to the browser per line per stage.
- Line outcomes: Quoted, Needs clarification (held, with a drafted buyer question and one-tap options), No match (with closest alternatives).
- Output: a printable quote with compliance notes and a "lines pending clarification" appendix; a batched clarification email to the buyer.
- Trust proof: a Trust Scorecard of evaluator pass rates over 12 golden RFQs, including real failures.
- Domain vocabulary: gauge (ga), grade (304, 316L, 6061-T6, A36), form (sheet, plate, bar, tube), MTR (mill test report), CoC, DFARS, ASTM A240, SKU, $/lb, benchmark band.

## Capabilities and Constraints

- Next.js 16 (App Router), TypeScript, Tailwind 4. No database; catalog, pricing and rules are JSON files.
- All LLM calls go through the Nicrron gateway. Sponsor tools also include Ninoo (used to build parts of the project) and Block Convey (tracing and evaluators); all must be visibly used.
- Hard deadline: Sat Oct 10 2026, 4:30pm EDT.
- Full requirements live in the build spec (sections 1–17).

## Brand Commitments

"RudCo" is a hackathon project name, with no logo or brand assets yet. The voice is calm, precise and plain-spoken, like a purchasing professional's tool: "Held: needs a grade", not "Error"; no "magic" or AI-hype language.

## Evidence on Hand

- Catalog, prices and benchmarks are **synthetic sample data** and must be labelled as such. Never present them as real market prices.
- No customers, testimonials, pilots or adoption numbers exist. Do not fabricate any.
- Evaluator results on the Scorecard must be real runs, including failures.

## Product Principles

1. **Ask, don't guess.** Uncertainty becomes a visible, specific question, never a silent default.
2. **Every number has a receipt.** Any spec, price or flag can be traced to its source in two clicks or fewer.
3. **Show the work.** This is an inspection instrument, not a chat. Each value shows which step produced it.
4. **Partial is honest.** Confident lines ship; held lines are visibly excluded from the total.
5. **Measured, not claimed.** Trust is shown with real eval numbers, failures included.

## Accessibility & Inclusion

Status is never color alone: it is encoded with shape, color and a text label together. WCAG AA contrast, visible focus rings, aria-labels on chips, and keyboard navigation through lines.
