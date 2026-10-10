"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Mail, X, Check } from "lucide-react";
import type { DemoLine } from "@/lib/demo/sampleRun";

export function draftClarification(lines: DemoLine[], buyerFirst: string, quotedCount: number, total: number) {
  const held = lines.filter((l) => l.status === "needs_clarification" && l.ambiguity);
  const subject = `${held.length === 1 ? "One question" : `${held.length} questions`} on your RFQ`;
  const body = [
    `Hi ${buyerFirst},`,
    "",
    `${quotedCount} of ${total} lines are quoted and attached. ${held.length === 1 ? "One needs" : `${held.length} need`} a quick answer before we can price ${held.length === 1 ? "it" : "them"}:`,
    "",
    ...held.flatMap((l, i) => [
      `${i + 1}. ${l.ambiguity!.question}`,
      ...(l.ambiguity!.options?.length ? [`   Options: ${l.ambiguity!.options.join(" / ")}`] : []),
      "",
    ]),
    "Reply with the line number and your choice and we’ll send the updated quote.",
    "",
    "Thanks,",
  ].join("\n");
  return { subject, body };
}

export function ClarificationComposer({
  open,
  onClose,
  to,
  subject: initialSubject,
  body: initialBody,
}: {
  open: boolean;
  onClose: () => void;
  to: string;
  subject: string;
  body: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSubject(initialSubject);
    setBody(initialBody);
  }, [initialSubject, initialBody]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="composer-title"
      className="m-auto w-[min(640px,calc(100vw-32px))] rounded-md border border-line-strong bg-surface p-0 text-ink shadow-[0_24px_48px_-12px_rgb(20_22_26/0.25)] backdrop:bg-ink/30"
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <h2 id="composer-title" className="text-[15px] font-semibold">
          Questions for the buyer
        </h2>
        <button type="button" onClick={onClose} aria-label="Close" className="rounded-[4px] p-1 text-ink-muted hover:bg-bg hover:text-ink">
          <X className="size-4" />
        </button>
      </div>
      <div className="space-y-3 px-5 py-4">
        <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2 text-[13px]">
          <span className="text-ink-muted">To</span>
          <span>{to}</span>
          <label htmlFor="subj" className="text-ink-muted">
            Subject
          </label>
          <input
            id="subj"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="h-8 rounded-[4px] border border-line-strong px-2 outline-none focus:border-accent"
          />
        </div>
        <label htmlFor="body" className="sr-only">
          Message
        </label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={14}
          className="block w-full resize-y rounded-[4px] border border-line-strong px-3 py-2.5 text-[13.5px] leading-relaxed outline-none focus:border-accent"
        />
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-3">
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line-strong px-3.5 text-[13.5px] font-medium hover:border-ink"
        >
          {copied ? <Check className="size-3.5 text-ok" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
        <a
          href={`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3.5 text-[13.5px] font-medium text-white hover:bg-accent-hover"
        >
          <Mail className="size-3.5" aria-hidden /> Open in mail
        </a>
      </div>
    </dialog>
  );
}
