"use client";

import { AppRole } from "@/lib/auth";
import { useAuth } from "@/components/auth/auth-provider";
import { LoadingState } from "@/components/ui/loading-state";
import { useEffect, useRef } from "react";

export function DemoEntry({ role, label }: { role: AppRole; label: string }) {
  const { loading, loginDemo } = useAuth();
  const started = useRef(false);

  useEffect(() => {
    if (loading || started.current) return;
    started.current = true;
    loginDemo(role);
  }, [loading, loginDemo, role]);

  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#07111f,#10243f)] p-6 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-6 text-center shadow-2xl backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-200">Public demo mode</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Opening {label}</h1>
        <p className="mt-3 text-sm leading-6 text-white/70">
          We are loading realistic demo data for Hermanus Valley Academy. No Supabase sign-in is required for this public walkthrough.
        </p>
        <div className="mt-6">
          <LoadingState label="Preparing demo workspace..." />
        </div>
      </div>
    </main>
  );
}
