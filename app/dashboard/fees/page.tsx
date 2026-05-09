import { DashboardModuleGuard } from "@/components/auth/module-guard";
import { AdminFeesView } from "@/components/finance/admin-fees-view";
import { adminOnlyRoles } from "@/lib/auth";

export default function Page() {
  return <DashboardModuleGuard roles={[...adminOnlyRoles, "FINANCE"]}><AdminFeesView /></DashboardModuleGuard>;
}
