import { DashboardModuleGuard } from "@/components/auth/module-guard";
import { AdminNoticesView } from "@/components/notifications/admin-notices-view";

export default function Page() {
  return <DashboardModuleGuard><AdminNoticesView /></DashboardModuleGuard>;
}
