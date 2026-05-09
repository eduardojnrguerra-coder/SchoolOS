import { DashboardModuleGuard } from "@/components/auth/module-guard";
import { ParentsAdminView } from "@/components/admin/parents-admin-view";

export default function Page() {
  return <DashboardModuleGuard><ParentsAdminView /></DashboardModuleGuard>;
}
