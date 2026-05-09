import { DashboardModuleGuard } from "@/components/auth/module-guard";
import { RouteShell } from "@/components/layout/route-shell";
export default function Page() { return <DashboardModuleGuard><RouteShell title="Settings" subtitle="School profile, users, and configuration." /></DashboardModuleGuard>; }
