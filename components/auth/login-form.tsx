"use client";

import { AppRole, roleLabel } from "@/lib/auth";
import { useAuth } from "@/components/auth/auth-provider";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";

const demoRoles: Array<{ role: AppRole; label: string }> = [
  { role: "SCHOOL_ADMIN", label: "School Admin" },
  { role: "TEACHER", label: "Teacher" },
  { role: "PARENT", label: "Parent" },
  { role: "FINANCE", label: "Finance" },
  { role: "TRANSPORT_MANAGER", label: "Transport Manager" },
  { role: "AFTERCARE_STAFF", label: "Aftercare Staff" }
];

export function LoginForm() {
  const { loginDemo, loginWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const result = await loginWithEmail(email, password);
    if (result.error) setError(result.error);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#111c34_0%,#1b2a4f_48%,#f8fafc_48%,#eef2f7_100%)] p-4">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="flex flex-col justify-center text-white">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm">
              <ShieldCheck className="h-4 w-4" />
              Demo mode available
            </div>
            <h1 className="mt-6 text-4xl font-semibold">Pine X School OS</h1>
            <p className="mt-3 max-w-md text-white/75">Secure school operations for staff and a calm mobile portal for parents.</p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h2 className="text-2xl font-semibold text-pine-900">Sign in</h2>
            <p className="mt-1 text-sm text-slate-600">Use Supabase credentials or choose a demo role.</p>
            <form onSubmit={submit} className="mt-6 grid gap-3">
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                <LockKeyhole className="h-4 w-4 text-slate-400" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
              </label>
              <button className="rounded-xl bg-pine-900 px-4 py-3 text-sm font-medium text-white">Sign in with Supabase</button>
              {error && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{error}</p>}
            </form>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-wide text-slate-500">Demo login</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {demoRoles.map((item) => (
                  <button key={item.role} onClick={() => loginDemo(item.role)} className="rounded-xl border border-slate-200 px-3 py-2 text-left text-sm transition hover:border-pine-300 hover:bg-pine-50">
                    <span className="font-medium text-pine-900">{item.label}</span>
                    <span className="block text-xs text-slate-500">{roleLabel(item.role)}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
