import { LoadingState } from "@/components/ui/loading-state";

export default function TeacherLoading() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <LoadingState label="Loading teacher tools..." />
    </main>
  );
}
