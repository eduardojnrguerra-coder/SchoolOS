import { DashboardModuleGuard } from "@/components/auth/module-guard";
import { TransportAdminView } from "@/components/operations/transport-admin-view";
import { adminOnlyRoles } from "@/lib/auth";

export default function Page() {
  return <DashboardModuleGuard roles={[...adminOnlyRoles, "TRANSPORT_MANAGER"]}><TransportAdminView /></DashboardModuleGuard>;
}
