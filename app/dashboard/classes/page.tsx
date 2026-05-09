import { DashboardModuleGuard } from "@/components/auth/module-guard";
import { ClassesAdminView } from "@/components/admin/classes-admin-view";

export default function Page() {
  return <DashboardModuleGuard><ClassesAdminView /></DashboardModuleGuard>;
}
