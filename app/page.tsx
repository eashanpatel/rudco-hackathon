import Link from "next/link";
import { ArrowRight, ScanText, Ruler, BookMarked, Scale, ShieldCheck, Check } from "lucide-react";
import { Wordmark } from "@/components/brand/Mark";
import { DrawingFrame, TitleBlock } from "@/components/landing/DrawingFrame";
import { HeroSheet, HeroCtas } from "@/components/landing/HeroSheet";
import { PriceReceipt } from "@/components/landing/PriceReceipt";

const STAGES = [
  {
    name: "Read",
    by: "AI read",
    Icon: ScanText,
    ai: true,
    input: "SS sheet, 16ga, 48x96",
    output: "grade: null · thickness: “16ga”",
    body: "The model splits the RFQ into lines and copies out each field with the exact text it came from. It never fills a blank.",
  },
  {
    name: "Normalize",
    by: "Rule",
    Icon: Ruler,
    input: "16ga · stainless",
    output: "0.0598 in",
    body: "Gauge tables, mm and ft to inches, grade aliases. Every conversion is logged as a step you can open.",
  },
  {
    name: "Match",
    by: "Catalog",
    Icon: BookMarked,
    input: "304 · sheet · 0.0598 × 48 × 96",
    output: "SS304-16G-48x96 · 0.97",
    body: "Hard filters on material, grade, form and tolerance first. Ranking only breaks ties between survivors.",
  },
  {
    name: "Price",
    by: "Benchmark",
    Icon: Scale,
    input: "79.63 lb × $2.87/lb",
    output: "$219.40 · 3.1% under",
    body: "Weight × rate × quantity break × form premium, checked against a benchmark band.",
  },
  {
    name: "Check",
    by: "Rule",
    Icon: ShieldCheck,
    input: "ASTM A240 · “MTRs on everything”",
    output: "MTR required · domestic melt",
    body: "Compliance rules fire with an ID and a plain reason: mill test reports, origin, DFARS.",
  },
];

const EVALS = [
  ["No guessing", "Every line with a missing required field is held, not quoted."],
  ["No silent defaults", "Low-confidence AI reads never reach a quoted line unflagged."],
  ["Normalization", "Thickness, width and length land within tolerance of ground truth."],
  ["Match accuracy", "The chosen SKU equals the expected SKU on matchable lines."],
  ["Price integrity", "Prices sit in the benchmark band; every number in the sentence exists in the math."],
  ["Compliance recall", "Expected flags are present, like MTR on A240 lines."],
  ["Hold precision", "Ambiguous lines are held, and clean lines are not held for no reason."],
];

export default function Landing() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Nav */}
      <header className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8">
        <Wordmark />
        <nav className="flex items-center gap-1 text-[14px] sm:gap-6">
          <a href="#how" className="hidden px-2 py-1 text-ink-muted hover:text-ink sm:inline">
            How it works
          </a>
          <a href="#trust" className="hidden px-2 py-1 text-ink-muted hover:text-ink sm:inline">
            Trust
          </a>
          <Link href="/scorecard" className="hidden px-2 py-1 text-ink-muted hover:text-ink md:inline">
            Scorecard
          </Link>
          <Link
            href="/app"
            className="inline-flex h-9 items-center rounded-md border border-ink/80 px-3.5 font-medium text-ink transition-colors hover:bg-ink hover:text-surface"
          >
            Open app
          </Link>
        </nav>
      </header>

      {/* Hero sheet */}
      <section className="mx-auto w-full max-w-[1440px] px-3 sm:px-6">
        <DrawingFrame>
          <div className="sheet-grid relative px-5 pb-0 pt-8 sm:px-10 sm:pt-12">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-end">
              <h1 className="font-display text-[44px] font-[680] leading-[0.98] tracking-[-0.03em] text-ink [text-wrap:balance] sm:text-[64px] xl:text-[76px]">
                Quotes that ask before they guess.
              </h1>
              <div className="max-w-[34rem] lg:pb-2">
                <p className="text-[17px] leading-[1.55] text-ink-muted">
                  RudCo turns a messy RFQ into a ready-to-send quote. Every line is decoded, matched to
                  the catalog and priced with a receipt. Anything uncertain is held back as a
                  one-click question to the buyer.
                </p>
                <div className="mt-6">
                  <HeroCtas />
                </div>
              </div>
            </div>

            <div className="mt-12 sm:mt-14">
              <HeroSheet />
            </div>

            <div className="mt-10 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-end sm:justify-between">
              <p className="pb-5 text-xs text-ink-muted sm:max-w-sm">
                Hover a line to trace it back to the email. Pick a grade on line 3 to resolve it.
                Catalog and prices are synthetic sample data.
              </p>
              <TitleBlock
                className="-mr-5 sm:-mr-10 sm:w-[360px]"
                rows={[
                  ["Title", "RFQ to Quote"],
                  ["Buyer", "Northbeam Fab · Line 3"],
                  ["Model", "claude-sonnet-5 via Nicrron"],
                  ["Data", "Synthetic sample"],
                  ["Sheet", "1 of 1"],
                ]}
              />
            </div>
          </div>
        </DrawingFrame>
      </section>

      {/* Pipeline */}
      <section id="how" className="mx-auto w-full max-w-[1280px] scroll-mt-8 px-5 pt-28 sm:px-8 sm:pt-36">
        <div className="max-w-3xl">
          <h2 className="font-display text-[34px] font-[660] leading-[1.05] tracking-[-0.025em] [text-wrap:balance] sm:text-[44px]">
            One step reads. Four steps compute.
          </h2>
          <p className="mt-4 max-w-[60ch] text-[16px] leading-relaxed text-ink-muted">
            The model only extracts what the buyer wrote. Unit math, catalog matching, pricing and
            compliance are plain code you can audit, so no number on the quote was made up by an
            LLM.
          </p>
        </div>

        <ol className="mt-14 grid border-y-[1.5px] border-ink md:grid-cols-5">
          {STAGES.map((s, i) => (
            <li
              key={s.name}
              className={`relative flex flex-col gap-4 py-6 md:px-5 ${i > 0 ? "border-t border-line md:border-l md:border-t-0" : ""} ${s.ai ? "md:bg-accent-tint" : ""}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-[22px] font-[650] tracking-[-0.01em]">{s.name}</h3>
                {i < STAGES.length - 1 && (
                  <ArrowRight className="hidden size-4 text-ink-faint md:block" aria-hidden />
                )}
              </div>
              <span
                className={`inline-flex w-fit items-center gap-1.5 rounded-[4px] px-2 py-1 text-xs font-medium ${s.ai ? "bg-accent text-white" : "border border-line-strong bg-surface text-ink-muted"}`}
              >
                <s.Icon className="size-3.5" aria-hidden /> {s.by}
              </span>
              <p className="text-[14px] leading-relaxed text-ink-muted">{s.body}</p>
              <div className="mt-auto space-y-1 border-t border-dashed border-line-strong pt-3">
                <div className="num text-[12px] text-ink-faint">{s.input}</div>
                <div className="num text-[12.5px] text-ink">→ {s.output}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Receipt + clarification */}
      <section className="mx-auto w-full max-w-[1280px] px-5 pt-28 sm:px-8 sm:pt-36">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-[34px] font-[660] leading-[1.05] tracking-[-0.025em] sm:text-[40px]">
              Every number has a receipt.
            </h2>
            <p className="mb-8 mt-4 max-w-[52ch] text-[16px] leading-relaxed text-ink-muted">
              Click any price to see the math behind it and where it lands against the benchmark.
              The sentence is written from the numbers, never the other way round.
            </p>
            <PriceReceipt />
          </div>

          <div>
            <h2 className="font-display text-[34px] font-[660] leading-[1.05] tracking-[-0.025em] sm:text-[40px]">
              Questions instead of guesses.
            </h2>
            <p className="mb-8 mt-4 max-w-[52ch] text-[16px] leading-relaxed text-ink-muted">
              Held lines become one numbered email to the buyer, each with the options that fit.
              The quote goes out with what is certain; the rest follows the answer.
            </p>
            <div className="rounded-md border border-line-strong bg-surface">
              <div className="space-y-1 border-b border-line px-5 py-3 text-[13px]">
                <div className="flex gap-3">
                  <span className="w-14 text-ink-faint">To</span>
                  <span>Dana Whitfield</span>
                </div>
                <div className="flex gap-3">
                  <span className="w-14 text-ink-faint">Subject</span>
                  <span>Two questions on your Line 3 RFQ</span>
                </div>
              </div>
              <div className="space-y-4 px-5 py-5 text-[14px] leading-relaxed">
                <p>Hi Dana, five of seven lines are quoted and attached. Two need a quick answer:</p>
                <ol className="space-y-4">
                  <li className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-2">
                    <span className="num text-ink-faint">1.</span>
                    <div>
                      Line 3 says <span className="num">“SS sheet, 16ga, 48x96”</span>. Which grade do
                      you need?
                      <div className="mt-2 flex gap-1.5">
                        {["304", "316"].map((o) => (
                          <span key={o} className="num rounded-[4px] border border-line-strong px-2 py-0.5 text-[12.5px]">
                            {o}
                          </span>
                        ))}
                      </div>
                    </div>
                  </li>
                  <li className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-2">
                    <span className="num text-ink-faint">2.</span>
                    <div>
                      Line 6 lists <span className="num">48 × 120</span> and{" "}
                      <span className="num">48 × 100</span>. Which length?
                      <div className="mt-2 flex gap-1.5">
                        {["48 × 120", "48 × 100"].map((o) => (
                          <span key={o} className="num rounded-[4px] border border-line-strong px-2 py-0.5 text-[12.5px]">
                            {o}
                          </span>
                        ))}
                      </div>
                    </div>
                  </li>
                </ol>
                <p className="text-ink-muted">
                  Line 7 (Inconel 625 bar) isn’t something we stock, so it’s left off this quote.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section id="trust" className="mx-auto w-full max-w-[1280px] scroll-mt-8 px-5 pt-28 sm:px-8 sm:pt-36">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <h2 className="font-display text-[34px] font-[660] leading-[1.05] tracking-[-0.025em] [text-wrap:balance] sm:text-[44px]">
              Trust you can measure.
            </h2>
            <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-ink-muted">
              Seven checks run against twelve golden RFQs with known answers, traced end to end. The
              Scorecard shows the real pass rates, failures included.
            </p>
            <Link
              href="/scorecard"
              className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-accent underline decoration-accent/40 hover:decoration-accent"
            >
              Open the Scorecard <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <ul className="border-t-[1.5px] border-ink">
            {EVALS.map(([name, desc]) => (
              <li key={name} className="grid grid-cols-[1.5rem_11rem_minmax(0,1fr)] items-baseline gap-3 border-b border-line py-3.5 max-sm:grid-cols-[1.5rem_minmax(0,1fr)]">
                <Check className="size-4 translate-y-0.5 text-accent" aria-hidden />
                <span className="text-[15px] font-medium">{name}</span>
                <span className="text-[14px] text-ink-muted max-sm:col-start-2">{desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Close */}
      <section className="mx-auto w-full max-w-[1440px] px-3 pt-28 sm:px-6 sm:pt-36">
        <div className="bg-ink px-6 py-16 text-surface sm:px-12 sm:py-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="font-display max-w-[16ch] text-[40px] font-[680] leading-[1] tracking-[-0.03em] sm:text-[60px]">
              Bring the messiest RFQ you have.
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/runs/demo"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-surface px-5 text-[15px] font-medium text-ink transition-colors hover:bg-bg"
              >
                Try a sample RFQ <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/app"
                className="inline-flex h-12 items-center rounded-md border border-surface/50 px-5 text-[15px] font-medium text-surface transition-colors hover:border-surface"
              >
                Paste your own
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto mt-auto flex w-full max-w-[1440px] flex-col gap-3 px-5 py-8 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3">
          <Wordmark className="scale-90" />
          <span>Built at Get Hired Hack, Columbia Startup Lab, 2026</span>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          <span>Catalog and prices are synthetic sample data</span>
          <span>LLM calls via Nicrron</span>
        </div>
      </footer>
    </div>
  );
}
