import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">404</p>
        <h1 className="mt-3 text-3xl font-bold text-pine-900">This school workspace page does not exist.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The link may be out of date, or the route may be reserved for a future Pine X module.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-pine-900 px-5 py-2 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-slate-900"
          >
            Go home
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:-translate-y-0.5 hover:bg-slate-100"
          >
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}
