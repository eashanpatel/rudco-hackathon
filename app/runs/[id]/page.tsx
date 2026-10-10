import Link from "next/link";
import { Suspense } from "react";
import { AppBar } from "@/components/AppBar";

export default function RunPage({ params }: PageProps<"/runs/[id]">) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <Run params={params} />
    </Suspense>
  );
}

async function Run({ params }: { params: PageProps<"/runs/[id]">["params"] }) {
  await params;

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <AppBar />
      <main className="mx-auto max-w-md flex-1 px-6 py-24 text-center">
        <h1 className="text-[20px] font-semibold">We couldn’t find that run</h1>
        <p className="mt-2 text-[14px] text-ink-muted">
          Runs are kept in memory, so they disappear when the server restarts. Start a new one or open
          the sample.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/app" className="inline-flex h-9 items-center rounded-md border border-ink/80 px-4 text-[14px] font-medium hover:bg-ink hover:text-surface">
            New RFQ
          </Link>
          <Link href="/runs/demo" className="inline-flex h-9 items-center rounded-md bg-accent px-4 text-[14px] font-medium text-white hover:bg-accent-hover">
            Open the sample
          </Link>
        </div>
      </main>
    </div>
  );
}
