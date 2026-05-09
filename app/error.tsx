"use client";

import Link from "next/link";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Something needs attention</p>
        <h1 className="mt-3 text-3xl font-bold text-pine-900">Pine X could not load this view.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This fallback keeps the app safe in production while the underlying error is logged by the hosting platform.
        </p>
        {error.digest ? <p className="mt-3 text-xs text-slate-500">Error reference: {error.digest}</p> : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-pine-900 px-5 py-2 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-slate-900"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:-translate-y-0.5 hover:bg-slate-100"
          >
            Back to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
