"use client";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import { getInitialEventMeta, getParentRelevantEvents } from "@/src/lib/events";
import { CalendarPlus, List, Table2 } from "lucide-react";
import { useMemo, useState } from "react";

export function ParentCalendarView() {
  const meta = useMemo(() => getInitialEventMeta(demoData.events), []);
  const events = useMemo(() => getParentRelevantEvents(demoData.events, meta), [meta]);
  const [view, setView] = useState<"feed" | "month">("feed");
  const [selectedId, setSelectedId] = useState(events[0]?.id ?? "");
  const selected = events.find((event) => event.id === selectedId) ?? events[0];
  const selectedMeta = meta.find((item) => item.eventId === selected?.id);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-pine-900 p-5 text-white">
        <h1 className="text-xl font-semibold">Calendar</h1>
        <p className="mt-1 text-sm text-white/75">Events relevant to your family.</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setView("feed")} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${view === "feed" ? "bg-pine-900 text-white" : "border border-slate-200 bg-white"}`}><List className="h-4 w-4" /> List</button>
        <button onClick={() => setView("month")} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${view === "month" ? "bg-pine-900 text-white" : "border border-slate-200 bg-white"}`}><Table2 className="h-4 w-4" /> Month</button>
      </div>

      <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <div className={view === "month" ? "grid grid-cols-2 gap-2" : "space-y-3"}>
          {events.map((event) => {
            const eventMeta = meta.find((item) => item.eventId === event.id);
            return (
              <button key={event.id} onClick={() => setSelectedId(event.id)} className="w-full text-left">
                <Card className={selected?.id === event.id ? "ring-2 ring-pine-300" : ""}>
                  <p className="text-xs text-slate-500">{new Date(event.startsAt).toLocaleDateString("en-ZA")}</p>
                  <p className="mt-1 font-semibold text-pine-900">{event.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{event.location}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {eventMeta?.consentRequired && <StatusBadge label="Consent" tone="warning" />}
                    {eventMeta?.paymentRequired && <StatusBadge label="Payment" tone="warning" />}
                    {eventMeta?.documentRequired && <StatusBadge label="Document" tone="info" />}
                  </div>
                </Card>
              </button>
            );
          })}
        </div>

        {selected && (
          <Card>
            <h2 className="text-xl font-semibold text-pine-900">{selected.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">{selected.description}</p>
            <div className="mt-4 rounded-xl border border-slate-200 p-3 text-sm">
              <p>{new Date(selected.startsAt).toLocaleString("en-ZA")}</p>
              <p>{selected.location}</p>
              {selectedMeta?.cost && <p>Cost: R{selectedMeta.cost}</p>}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge label={selectedMeta?.consentRequired ? "Consent required" : "No consent needed"} tone={selectedMeta?.consentRequired ? "warning" : "success"} />
              <StatusBadge label={selectedMeta?.paymentRequired ? "Payment required" : "No payment needed"} tone={selectedMeta?.paymentRequired ? "warning" : "success"} />
              <StatusBadge label={selectedMeta?.documentRequired ? "Document attached" : "No document"} tone="info" />
            </div>
            <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pine-900 px-4 py-3 text-sm text-white">
              <CalendarPlus className="h-4 w-4" />
              Add to calendar placeholder
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}
