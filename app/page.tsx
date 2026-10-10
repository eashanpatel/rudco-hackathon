export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <p className="text-xs uppercase tracking-wider text-ink-muted">RudCo</p>
      <h1 className="mt-2 text-xl font-semibold">RFQ to Quote</h1>
      <p className="mt-2 text-ink-muted">A quoting agent that would rather ask than guess.</p>
      <div className="mt-8 flex flex-wrap gap-2">
        <span className="num rounded-md border border-line bg-surface px-2 py-1 text-xs">304</span>
        <span className="num rounded-md border border-line bg-surface px-2 py-1 text-xs">0.060 in</span>
        <span className="num rounded-md border border-line bg-surface px-2 py-1 text-xs">48 × 96 in</span>
        <span className="rounded-md bg-ok-tint px-2 py-1 text-xs text-ok">Quoted</span>
        <span className="rounded-md bg-warn-tint px-2 py-1 text-xs text-warn">Review</span>
        <span className="rounded-md bg-hold-tint px-2 py-1 text-xs text-hold">Held: needs a grade</span>
      </div>
    </main>
  );
}
