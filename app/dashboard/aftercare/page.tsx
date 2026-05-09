import { DashboardModuleGuard } from "@/components/auth/module-guard";
import { AftercareView } from "@/components/operations/aftercare-view";
import { adminOnlyRoles } from "@/lib/auth";

export default function Page() {
  return <DashboardModuleGuard roles={[...adminOnlyRoles, "AFTERCARE_STAFF"]}><AftercareView /></DashboardModuleGuard>;
}
