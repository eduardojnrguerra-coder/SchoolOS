import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-card">
        <h1 className="text-2xl font-semibold text-pine-900">Access not available</h1>
        <p className="mt-2 text-sm text-slate-600">Your current role cannot open this part of Pine X School OS.</p>
        <Link href="/login" className="mt-5 inline-flex rounded-xl bg-pine-900 px-4 py-2 text-sm text-white">Back to login</Link>
      </div>
    </main>
  );
}
