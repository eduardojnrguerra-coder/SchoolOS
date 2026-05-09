"use client";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import { RouteStatus, getRouteDriver, getRouteLearners, getRouteVehicle, transportPreview } from "@/src/lib/operations/transport";
import { Bus, CheckCircle2, MapPinned, Navigation } from "lucide-react";
import { useState } from "react";

export function TransportAdminView() {
  const [selectedRouteId, setSelectedRouteId] = useState(demoData.transportRoutes[0]?.id ?? "");
  const [routeStatuses, setRouteStatuses] = useState<Record<string, RouteStatus>>({
    tr_001: "In progress",
    tr_002: "Not started"
  });
  const [checkedLearners, setCheckedLearners] = useState<Record<string, boolean>>({});
  const selectedRoute = demoData.transportRoutes.find((route) => route.id === selectedRouteId) ?? demoData.transportRoutes[0];
  const routeLearners = selectedRoute ? getRouteLearners(selectedRoute.id) : [];
  const vehicle = selectedRoute ? getRouteVehicle(selectedRoute.id) : undefined;
  const driver = selectedRoute ? getRouteDriver(selectedRoute.id) : undefined;

  function toggleLearner(learnerId: string) {
    setCheckedLearners((prev) => ({ ...prev, [learnerId]: !prev[learnerId] }));
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Transport" subtitle="Route operations, checklists, and parent transport alerts." />

      <section className="grid gap-4 xl:grid-cols-2">
        {demoData.transportRoutes.map((route) => {
          const status = routeStatuses[route.id] ?? "Not started";
          return (
            <Card key={route.id} className={selectedRouteId === route.id ? "ring-2 ring-pine-300" : ""}>
              <button onClick={() => setSelectedRouteId(route.id)} className="w-full text-left">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">{route.routeCode}</p>
                    <h2 className="text-lg font-semibold text-pine-900">{route.routeName}</h2>
                  </div>
                  <StatusBadge label={status} tone={status === "Delayed" ? "warning" : status === "Completed" ? "success" : "info"} />
                </div>
                <p className="mt-3 text-sm text-slate-600">Morning {route.morningDepartureTime} · Afternoon {route.afternoonDepartureTime}</p>
              </button>
            </Card>
          );
        })}
      </section>

      {selectedRoute && (
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-pine-900">{selectedRoute.routeName}</h2>
                <p className="text-sm text-slate-600">{driver?.fullName} · {vehicle?.label} · {vehicle?.registrationCode}</p>
              </div>
              <select value={routeStatuses[selectedRoute.id] ?? "Not started"} onChange={(e) => setRouteStatuses((prev) => ({ ...prev, [selectedRoute.id]: e.target.value as RouteStatus }))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
                {["Not started", "In progress", "Delayed", "Completed"].map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Info label="Vehicle" value={vehicle ? `${vehicle.label} (${vehicle.capacity})` : "Unassigned"} />
              <Info label="Driver" value={driver?.fullName ?? "Unassigned"} />
              <Info label="Learners" value={String(routeLearners.length)} />
            </div>
            <h3 className="mt-5 font-semibold text-pine-900">Pickup/drop-off checklist</h3>
            <div className="mt-3 space-y-2">
              {routeLearners.map((row) => (
                <button key={row.status.id} onClick={() => row.learner && toggleLearner(row.learner.id)} className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 text-left text-sm hover:bg-slate-50">
                  <span>{row.learner?.firstName} {row.learner?.lastName} · {row.stop?.stopName}</span>
                  {row.learner && checkedLearners[row.learner.id] ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <span className="h-5 w-5 rounded-full border border-slate-300" />}
                </button>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="bg-slate-950 text-white">
              <div className="flex items-center gap-2">
                <MapPinned className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Live tracking placeholder</h2>
              </div>
              <div className="mt-4 flex h-56 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                <Navigation className="h-10 w-10 text-white/70" />
              </div>
              <p className="mt-3 text-sm text-white/70">Future GPS, ETA, geofencing, and route replay area.</p>
            </Card>
            <Card>
              <h2 className="text-lg font-semibold text-pine-900">Parent notification previews</h2>
              <div className="mt-3 space-y-2 text-sm">
                <Preview text={transportPreview("picked up", selectedRoute.routeName)} />
                <Preview text={transportPreview("dropped off", selectedRoute.routeName)} />
                <Preview text={transportPreview("delayed", selectedRoute.routeName)} />
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-pine-900">{value}</p>
    </div>
  );
}

function Preview({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="mb-1 flex items-center gap-2 text-pine-900"><Bus className="h-4 w-4" /> Preview</div>
      <p className="text-slate-600">{text}</p>
    </div>
  );
}
