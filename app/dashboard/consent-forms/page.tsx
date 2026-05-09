import { DashboardModuleGuard } from "@/components/auth/module-guard";
import { AdminConsentView } from "@/components/consent/admin-consent-view";

export default function Page() {
  return <DashboardModuleGuard><AdminConsentView /></DashboardModuleGuard>;
}
