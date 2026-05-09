"use client";

import { AppRole, canAccess } from "@/lib/auth";
import { useAuth } from "@/components/auth/auth-provider";
import { LoadingState } from "@/components/ui/loading-state";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    const allowed = allowedRoles ? allowedRoles.includes(user.role) : canAccess(user.role, area);
    if (!allowed) router.replace("/unauthorized");
  }, [allowedRoles, area, loading, router, user]);

  if (loading || !user) {
    return <div className="p-6"><LoadingState label="Checking access..." /></div>;
  }

  const allowed = allowedRoles ? allowedRoles.includes(user.role) : canAccess(user.role, area);
  if (!allowed) return <div className="p-6 text-sm text-slate-500">Redirecting...</div>;

  return <>{children}</>;
}
