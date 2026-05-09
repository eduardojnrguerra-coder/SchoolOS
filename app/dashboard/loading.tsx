import { LoadingState } from "@/components/ui/loading-state";

export default function DashboardLoading() {
  return (
    <div className="p-6">
      <LoadingState label="Loading school command center..." />
    </div>
  );
}
