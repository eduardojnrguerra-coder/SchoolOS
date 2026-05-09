"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { roleLabel } from "@/lib/auth";

export function TopNav() {
  const { user, logout } = useAuth();

  return (
    <div className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur">
      <div>
        <span className="font-semibold text-pine-900">Pine X School OS</span>
        {user && <span className="ml-2 hidden text-xs text-slate-500 sm:inline">{roleLabel(user.role)}</span>}
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm">{user?.schoolName ?? "School Selector"}</button>
        {user && <button onClick={logout} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm">Sign out</button>}
      </div>
    </div>
  );
}
