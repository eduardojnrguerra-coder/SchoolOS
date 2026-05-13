"use client";

import { ParentAppPreview } from "@/components/parent/parent-app-preview";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import { RouteStatus, getRouteDriver, getRouteLearners, getRouteVehicle, transportPreview } from "@/src/lib/operations/transport";
import { salesDemoActionEventName, SalesDemoActionPayload } from "@/lib/sales-demo";
import { CheckCircle2, MapPinned, Navigation } from "lucide-react";
import { useEffect, useState } from "react";

type TransportPreviewMode = "delayed" | "picked up" | "dropped off";

export function TransportAdminView() {
  const [selectedRouteId, setSelectedRouteId] = useState(demoData.transportRoutes[0]?.id ?? "");
  const [routeStatuses, setRouteStatuses] = useState<Record<string, RouteStatus>>({
    tr_001: "In progress",
    tr_002: "Not started"
  });
  const [checkedLearners, setCheckedLearners] = useState<Record<string, boolean>>({});
  const [previewMode, setPreviewMode] = useState<TransportPreviewMode>("delayed");
  const selectedRoute = demoData.transportRoutes.find((route) => route.id === selectedRouteId) ?? demoData.transportRoutes[0];
  const routeLearners = selectedRoute ? getRouteLearners(selectedRoute.id) : [];
  const vehicle = selectedRoute ? getRouteVehicle(selectedRoute.id) : undefined;
  const driver = selectedRoute ? getRouteDriver(selectedRoute.id) : undefined;

  function toggleLearner(learnerId: string) {
    setCheckedLearners((prev) => ({ ...prev, [learnerId]: !prev[learnerId] }));
  }

  useEffect(() => {
    function onDemoAction(event: Event) {
      const { type } = (event as CustomEvent<SalesDemoActionPayload>).detail ?? {};
      if (type === "RESET_DEMO") {
        setSelectedRouteId(demoData.transportRoutes[0]?.id ?? "");
        setRouteStatuses({ tr_001: "In progress", tr_002: "Not started" });
        setCheckedLearners({});
        setPreviewMode("delayed");
        return;
      }
      if (type !== "MARK_TRANSPORT_DELAYED") return;
      const route = demoData.transportRoutes[0];
      if (!route) return;
      setSelectedRouteId(route.id);
      setRouteStatuses((prev) => ({ ...prev, [route.id]: "Delayed" }));
      setPreviewMode("delayed");
    }

    window.addEventListener(salesDemoActionEventName, onDemoAction);
    return () => window.removeEventListener(salesDemoActionEventName, onDemoAction);
  }, []);

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
          <Card data-demo="transport-route-control">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-pine-900">{selectedRoute.routeName}</h2>
                <p className="text-sm text-slate-600">{driver?.fullName} · {vehicle?.label} · {vehicle?.registrationCode}</p>
              </div>
              <select
                value={routeStatuses[selectedRoute.id] ?? "Not started"}
                onChange={(e) => {
                  const nextStatus = e.target.value as RouteStatus;
                  setRouteStatuses((prev) => ({ ...prev, [selectedRoute.id]: nextStatus }));
                  if (nextStatus === "Delayed") setPreviewMode("delayed");
                  if (nextStatus === "Completed") setPreviewMode("dropped off");
                }}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
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
              <h2 className="text-lg font-semibold text-pine-900">Parent notification preview</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { label: "Route delayed", value: "delayed" as const },
                  { label: "Picked up", value: "picked up" as const },
                  { label: "Dropped off", value: "dropped off" as const }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setPreviewMode(item.value)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      previewMode === item.value ? "border-pine-300 bg-pine-50 text-pine-900" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <ParentAppPreview
                className="mt-4"
                action={previewMode === "delayed" ? "TRANSPORT_DELAY" : "PICKUP_DROPOFF_UPDATE"}
                title={previewMode === "delayed" ? "Route delay update" : previewMode === "picked up" ? "Picked up on route" : "Dropped off from route"}
                message={transportPreview(previewMode, selectedRoute.routeName)}
                statusLabel={previewMode === "delayed" ? "Delayed" : "Confirmed"}
                statusTone={previewMode === "delayed" ? "warning" : "success"}
                actionLabel="View transport"
                meta={[
                  { label: "Route", value: selectedRoute.routeCode, tone: "info" },
                  { label: "Driver", value: driver?.fullName ?? "Driver", tone: "success" }
                ]}
              />
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
