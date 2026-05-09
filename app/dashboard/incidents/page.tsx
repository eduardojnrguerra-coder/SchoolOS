import { DashboardModuleGuard } from "@/components/auth/module-guard";
import { IncidentsView } from "@/components/operations/incidents-view";

export default function Page() {
  return <DashboardModuleGuard><IncidentsView /></DashboardModuleGuard>;
}
