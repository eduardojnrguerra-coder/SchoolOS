import { DashboardModuleGuard } from "@/components/auth/module-guard";
import { LearnersAdminView } from "@/components/admin/learners-admin-view";

export default function Page() {
  return <DashboardModuleGuard><LearnersAdminView /></DashboardModuleGuard>;
}
