import { ProtectedRoute } from "@/components/auth/protected-route";
import { SchoolDataProvider } from "@/components/data/school-data-provider";
import { ParentBottomNav } from "@/components/layout/parent-bottom-nav";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute area="parent">
      <SchoolDataProvider>
        <div className="min-h-dvh bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_46%,#e8eef8_100%)] pb-24 md:pb-8">
          <main className="mx-auto max-w-md px-4 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] md:max-w-4xl md:pt-6">{children}</main>
          <ParentBottomNav />
        </div>
      </SchoolDataProvider>
    </ProtectedRoute>
  );
}
