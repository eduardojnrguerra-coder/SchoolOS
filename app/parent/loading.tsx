import { LoadingState } from "@/components/ui/loading-state";

export default function ParentLoading() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6">
      <LoadingState label="Loading your school app..." />
    </main>
  );
}
