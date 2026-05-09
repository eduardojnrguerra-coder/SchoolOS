"use client";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import { getRouteDriver, getRouteVehicle, transportPreview } from "@/src/lib/operations/transport";
import { Bus, Clock, MapPin } from "lucide-react";

export function ParentTransportView() {
  const linkedLearnerId = demoData.learnerGuardianLinks.find((link) => link.guardianId === demoData.guardians[0]?.id)?.learnerId;
  const learner = demoData.learners.find((item) => item.id === linkedLearnerId) ?? demoData.learners[0];
  const status = demoData.learnerTransportStatuses.find((item) => item.learnerId === learner.id) ?? demoData.learnerTransportStatuses[0];
  const route = demoData.transportRoutes.find((item) => item.id === status.routeId) ?? demoData.transportRoutes[0];
  const stop = demoData.transportStops.find((item) => item.id === status.stopId);
  const driver = getRouteDriver(route.id);
  const vehicle = getRouteVehicle(route.id);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-pine-900 p-5 text-white">
        <div className="flex items-center gap-2">
          <Bus className="h-5 w-5" />
          <h1 className="text-xl font-semibold">Transport</h1>
        </div>
        <p className="mt-1 text-sm text-white/75">{learner.firstName} {learner.lastName}</p>
        <p className="mt-4 text-2xl font-semibold">{route.routeName}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">Today status</p>
          <p className="mt-2 text-xl font-semibold text-pine-900">{status.morningStatus} / {status.afternoonStatus}</p>
          <StatusBadge label="Updated demo status" tone="info" />
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">Driver</p>
          <p className="mt-2 font-semibold text-pine-900">{driver?.fullName}</p>
          <p className="text-sm text-slate-600">{driver?.phone}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-slate-500">Vehicle</p>
          <p className="mt-2 font-semibold text-pine-900">{vehicle?.label}</p>
          <p className="text-sm text-slate-600">{vehicle?.registrationCode}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-pine-900">Pickup/drop-off timeline</h2>
        <div className="mt-4 space-y-3">
          <Timeline icon={<Clock className="h-4 w-4" />} title="Pickup" body={`${stop?.stopName ?? "Assigned stop"} at ${stop?.pickupTime ?? route.morningDepartureTime}`} />
          <Timeline icon={<MapPin className="h-4 w-4" />} title="Drop-off" body={`${stop?.stopName ?? "Assigned stop"} at ${stop?.dropoffTime ?? route.afternoonDepartureTime}`} />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-pine-900">Delay notifications</h2>
        <p className="mt-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{transportPreview("delayed", route.routeName)}</p>
      </Card>
    </div>
  );
}

function Timeline({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 p-3 text-sm">
      <div className="mt-0.5 text-pine-800">{icon}</div>
      <div>
        <p className="font-medium text-slate-900">{title}</p>
        <p className="text-slate-600">{body}</p>
      </div>
    </div>
  );
}
