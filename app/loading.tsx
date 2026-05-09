import { LoadingState } from "@/components/ui/loading-state";

export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <LoadingState label="Preparing Pine X School OS..." />
    </main>
  );
}
