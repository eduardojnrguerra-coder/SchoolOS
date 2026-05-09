"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { adminOnlyRoles, AppRole } from "@/lib/auth";

export function DashboardModuleGuard({
  roles = adminOnlyRoles,
  children
}: {
  roles?: AppRole[];
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute area="dashboard" allowedRoles={roles}>
      {children}
    </ProtectedRoute>
  );
}
