"use client";

import { AppRole, canAccess } from "@/lib/auth";
import { useAuth } from "@/components/auth/auth-provider";
import { LoadingState } from "@/components/ui/loading-state";
import { getIsSalesDemoActive, salesDemoStateEventName } from "@/lib/sales-demo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ProtectedRoute({
  area,
  allowedRoles,
  children
}: {
  area: "dashboard" | "teacher" | "parent";
  allowedRoles?: AppRole[];
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [salesDemoActive, setSalesDemoActive] = useState(false);

  useEffect(() => {
    function syncSalesDemoState() {
      setSalesDemoActive(getIsSalesDemoActive());
    }
    syncSalesDemoState();
    window.addEventListener(salesDemoStateEventName, syncSalesDemoState);
    window.addEventListener("storage", syncSalesDemoState);
    return () => {
      window.removeEventListener(salesDemoStateEventName, syncSalesDemoState);
      window.removeEventListener("storage", syncSalesDemoState);
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    const allowed = allowedRoles ? allowedRoles.includes(user.role) : canAccess(user.role, area);
    // Demo-only sales walkthrough: allows a demo admin to preview the parent portal without changing auth roles.
    // Production data access still requires Supabase RLS and must never rely on this frontend convenience.
    const salesDemoAllowed = user.isDemo && salesDemoActive && area === "parent";
    if (!allowed && !salesDemoAllowed) router.replace("/unauthorized");
  }, [allowedRoles, area, loading, router, salesDemoActive, user]);

  if (loading || !user) {
    return <div className="p-6"><LoadingState label="Checking access..." /></div>;
  }

  const allowed = allowedRoles ? allowedRoles.includes(user.role) : canAccess(user.role, area);
  const salesDemoAllowed = user.isDemo && salesDemoActive && area === "parent";
  if (!allowed && !salesDemoAllowed) return <div className="p-6 text-sm text-slate-500">Redirecting...</div>;

  return <>{children}</>;
}
