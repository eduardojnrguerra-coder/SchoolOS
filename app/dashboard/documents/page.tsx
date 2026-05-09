import { DashboardModuleGuard } from "@/components/auth/module-guard";
import { AdminDocumentsView } from "@/components/documents/admin-documents-view";

export default function Page() {
  return <DashboardModuleGuard><AdminDocumentsView /></DashboardModuleGuard>;
}
