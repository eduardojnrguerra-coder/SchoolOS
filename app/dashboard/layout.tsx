import { ProtectedRoute } from "@/components/auth/protected-route";
import { SchoolDataProvider } from "@/components/data/school-data-provider";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { TopNav } from "@/components/layout/top-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute area="dashboard">
      <SchoolDataProvider>
        <div className="min-h-screen bg-slate-50">
          <TopNav />
          <div className="flex">
            <AdminSidebar />
            <main className="w-full p-4 md:p-6">{children}</main>
          </div>
        </div>
      </SchoolDataProvider>
    </ProtectedRoute>
  );
}
