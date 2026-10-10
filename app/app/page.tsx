"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, FileUp, FileText, Mail, Sheet as SheetIcon, Inbox } from "lucide-react";
import { AppBar } from "@/components/AppBar";
import { SAMPLES } from "@/lib/demo/samples";
import { cn } from "@/lib/cn";

const ACCEPT = ".pdf,.xlsx,.xls,.csv,.txt,.eml";

export default function Intake() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const ready = text.trim().length > 0 || file !== null;

  function run() {
    // Pipeline wiring lands in Phase 2; until then say so plainly.
    setNotice("The live pipeline isn’t connected yet. Try a sample RFQ to see a decoded run.");
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <AppBar />
      <main className="mx-auto grid w-full max-w-[1200px] flex-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12 lg:py-14">
        <section aria-labelledby="new-rfq">
          <h1 id="new-rfq" className="font-display text-[28px] font-[660] tracking-[-0.02em]">
            New RFQ
          </h1>
          <p className="mt-1.5 text-[14px] text-ink-muted">
            Drop the buyer’s file or paste the email. RudCo reads it, then shows you every line and
            where it came from.
          </p>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              const f = e.dataTransfer.files[0];
              if (f) setFile(f);
            }}
            className={cn(
              "mt-6 rounded-md border bg-surface transition-colors",
              drag ? "border-accent bg-accent-tint" : "border-line-strong",
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
              <div className="flex items-center gap-3 text-[13px] text-ink-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="size-3.5" aria-hidden /> Email or text
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="size-3.5" aria-hidden /> PDF
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <SheetIcon className="size-3.5" aria-hidden /> XLSX
                </span>
              </div>
              <button
                type="button"
                onClick={() => input.current?.click()}
                className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-line-strong px-2.5 text-[13px] font-medium hover:border-ink"
              >
                <FileUp className="size-3.5" aria-hidden /> Choose file
              </button>
              <input
                ref={input}
                type="file"
                accept={ACCEPT}
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>

            {file ? (
              <div className="flex items-center justify-between gap-3 px-4 py-6">
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-accent" aria-hidden />
                  <div>
                    <div className="text-[14px] font-medium">{file.name}</div>
                    <div className="num text-xs text-ink-muted">{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-[13px] text-ink-muted underline hover:text-ink"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="block">
                <span className="sr-only">RFQ text</span>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={"Paste the RFQ here, or drop a file anywhere in this box.\n\ne.g.  304 SS sheet 16ga 4x8, qty 20"}
                  rows={12}
                  className="num block w-full resize-y bg-transparent px-4 py-4 text-[13px] leading-[1.7] text-ink outline-none placeholder:text-ink-faint"
                />
              </label>
            )}

            <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
              <span className="text-xs text-ink-muted">
                Uncertain lines are held as questions, never guessed.
              </span>
              <button
                type="button"
                disabled={!ready}
                onClick={run}
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-4 text-[14px] font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-ink-muted"
              >
                Build quote <ArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          </div>
          {notice && (
            <p role="status" className="mt-3 rounded-md bg-warn-tint px-3 py-2 text-[13px] text-warn">
              {notice}
            </p>
          )}

          <h2 className="mt-12 text-[15px] font-semibold">Recent runs</h2>
          <div className="mt-3 flex items-center gap-3 rounded-md border border-dashed border-line-strong px-4 py-6 text-[13.5px] text-ink-muted">
            <Inbox className="size-4 shrink-0" aria-hidden />
            No runs yet. Quotes you build here will be listed with their quoted and held counts.
          </div>
        </section>

        <aside aria-labelledby="samples">
          <h2 id="samples" className="text-[15px] font-semibold">
            Try a sample RFQ
          </h2>
          <p className="mt-1 text-[13px] text-ink-muted">Real-world mess, synthetic data.</p>
          <ul className="mt-4 space-y-3">
            {SAMPLES.map((s, i) => (
              <li key={s.id}>
                <Link
                  href={i === 0 ? "/runs/demo" : `/runs/demo?sample=${s.id}`}
                  className="group block rounded-md border border-line-strong bg-surface p-4 transition-colors hover:border-accent"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[14px] font-medium">{s.name}</div>
                      <div className="mt-0.5 text-[12.5px] text-ink-muted">{s.summary}</div>
                    </div>
                    <ArrowRight className="mt-0.5 size-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
                  </div>
                  <pre className="num mt-3 line-clamp-3 overflow-hidden whitespace-pre-wrap border-t border-dashed border-line pt-3 text-[11.5px] leading-[1.6] text-ink-muted">
                    {s.text.split("\n").filter((l) => /\d/.test(l) && !l.startsWith("From")).slice(0, 3).join("\n")}
                  </pre>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </main>
    </div>
  );
}
