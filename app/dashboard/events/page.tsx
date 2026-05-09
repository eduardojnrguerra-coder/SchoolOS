import { DashboardModuleGuard } from "@/components/auth/module-guard";
import { AdminEventsView } from "@/components/events/admin-events-view";

export default function Page() {
  return <DashboardModuleGuard><AdminEventsView /></DashboardModuleGuard>;
}
