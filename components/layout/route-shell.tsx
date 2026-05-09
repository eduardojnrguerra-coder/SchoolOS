import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

export function RouteShell({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="space-y-4">
      <PageHeader title={title} subtitle={subtitle} />
      <Card>
        <p className="text-sm text-slate-600">Module foundation ready. Data integrations and forms come next.</p>
      </Card>
      <EmptyState title="No records yet" description="Demo placeholders are in place for this module." />
    </div>
  );
}
