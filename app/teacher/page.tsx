import { ProtectedRoute } from "@/components/auth/protected-route";
import { TeacherAttendanceView } from "@/components/attendance/teacher-attendance-view";
import { SchoolDataProvider } from "@/components/data/school-data-provider";
import { TopNav } from "@/components/layout/top-nav";

export default function TeacherPage() {
  return (
    <ProtectedRoute area="teacher">
      <SchoolDataProvider>
        <div className="min-h-screen bg-slate-50">
          <TopNav />
          <main className="p-4 md:p-6">
            <TeacherAttendanceView />
          </main>
        </div>
      </SchoolDataProvider>
    </ProtectedRoute>
  );
}
