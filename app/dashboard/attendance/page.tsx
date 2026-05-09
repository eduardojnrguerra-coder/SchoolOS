import { DashboardModuleGuard } from "@/components/auth/module-guard";
import { AdminAttendanceView } from "@/components/attendance/admin-attendance-view";

export default function Page() {
  return <DashboardModuleGuard><AdminAttendanceView /></DashboardModuleGuard>;
}
