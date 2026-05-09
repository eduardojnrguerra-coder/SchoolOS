"use client";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import {
  EventDraft,
  EventMeta,
  createEventFromDraft,
  createEventMeta,
  defaultEventDraft,
  getInitialEventMeta
} from "@/src/lib/events";
import { Event } from "@/types/domain";
import { Bell, CalendarDays, List, Plus, Send } from "lucide-react";
import { useState } from "react";

export function AdminEventsView() {
  const [events, setEvents] = useState<Event[]>(demoData.events);
  const [meta, setMeta] = useState<EventMeta[]>(getInitialEventMeta(demoData.events));
  const [view, setView] = useState<"list" | "calendar">("list");
  const [draft, setDraft] = useState<EventDraft>(defaultEventDraft);
  const [showCreate, setShowCreate] = useState(false);
  const [message, setMessage] = useState("");

  function updateDraft(data: Partial<EventDraft>) {
    setDraft((prev) => ({ ...prev, ...data }));
  }

  function createEvent() {
    const event = createEventFromDraft(draft);
    setEvents((prev) => [event, ...prev]);
    setMeta((prev) => [createEventMeta(event.id, draft), ...prev]);
    setShowCreate(false);
    setMessage("Event created and visible in demo mode.");
  }

  function sendReminder(event: Event) {
    setMessage(`Reminder queued for ${event.title}. No real message was sent.`);
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Events & Calendar" subtitle="Plan events, target families, and prepare parent-facing details." />
      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex gap-2">
          <button onClick={() => setView("list")} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${view === "list" ? "bg-pine-900 text-white" : "border border-slate-200"}`}><List className="h-4 w-4" /> List</button>
          <button onClick={() => setView("calendar")} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${view === "calendar" ? "bg-pine-900 text-white" : "border border-slate-200"}`}><CalendarDays className="h-4 w-4" /> Calendar</button>
        </div>
        <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 rounded-xl bg-pine-900 px-3 py-2 text-sm text-white"><Plus className="h-4 w-4" /> Create event</button>
      </div>
      {message && <p className="text-sm text-emerald-700">{message}</p>}

      {view === "list" ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {events.map((event) => <EventCard key={event.id} event={event} meta={meta.find((item) => item.eventId === event.id)} onReminder={sendReminder} />)}
        </div>
      ) : (
        <Card>
          <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-4">
            {events.map((event) => (
              <div key={event.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                <p className="text-xs text-slate-500">{new Date(event.startsAt).toLocaleDateString("en-ZA")}</p>
                <p className="font-medium text-pine-900">{event.title}</p>
                <p className="text-slate-600">{event.location}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-4">
          <div className="mx-auto my-6 grid max-w-5xl gap-4 rounded-2xl bg-white p-5 shadow-2xl xl:grid-cols-[1fr_0.75fr]">
            <div>
              <h3 className="text-lg font-semibold text-pine-900">Create event</h3>
              <div className="mt-4 grid gap-3">
                <input value={draft.title} onChange={(e) => updateDraft({ title: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Title" />
                <textarea value={draft.description} onChange={(e) => updateDraft({ description: e.target.value })} rows={3} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Description" />
                <div className="grid gap-3 md:grid-cols-2">
                  <select value={draft.audience} onChange={(e) => updateDraft({ audience: e.target.value as EventDraft["audience"] })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
                    {["Whole school", "Grade", "Class", "Transport route", "Aftercare group"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                  <input value={draft.audienceTargetId} onChange={(e) => updateDraft({ audienceTargetId: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Target id placeholder" />
                  <input type="datetime-local" value={draft.startsAt} onChange={(e) => updateDraft({ startsAt: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                  <input type="datetime-local" value={draft.endsAt} onChange={(e) => updateDraft({ endsAt: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                  <input value={draft.location} onChange={(e) => updateDraft({ location: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Location" />
                  <input value={draft.cost} onChange={(e) => updateDraft({ cost: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Cost optional" />
                </div>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.consentRequired} onChange={(e) => updateDraft({ consentRequired: e.target.checked })} /> Consent required</label>
                <input value={draft.attachmentName} onChange={(e) => updateDraft({ attachmentName: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Document attachment placeholder" />
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button onClick={() => setShowCreate(false)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">Cancel</button>
                <button onClick={createEvent} className="inline-flex items-center gap-2 rounded-xl bg-pine-900 px-3 py-2 text-sm text-white"><Send className="h-4 w-4" /> Create event</button>
              </div>
            </div>
            <ParentPreview draft={draft} />
          </div>
        </div>
      )}
    </div>
  );
}

function EventCard({ event, meta, onReminder }: { event: Event; meta?: EventMeta; onReminder: (event: Event) => void }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-pine-900">{event.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{event.description}</p>
        </div>
        <StatusBadge label={meta?.audience ?? event.visibility} tone="info" />
      </div>
      <div className="mt-3 space-y-1 text-sm text-slate-600">
        <p>{new Date(event.startsAt).toLocaleString("en-ZA")}</p>
        <p>{event.location}</p>
        {meta?.cost && <p>Cost: R{meta.cost}</p>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {meta?.consentRequired && <StatusBadge label="Consent required" tone="warning" />}
        {meta?.paymentRequired && <StatusBadge label="Payment required" tone="warning" />}
        {meta?.documentRequired && <StatusBadge label="Document attached" tone="info" />}
      </div>
      <button onClick={() => onReminder(event)} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm"><Bell className="h-4 w-4" /> Queue reminder</button>
    </Card>
  );
}

function ParentPreview({ draft }: { draft: EventDraft }) {
  return (
    <div className="rounded-2xl bg-slate-950 p-4 text-white">
      <p className="text-xs uppercase tracking-wide text-white/60">Parent preview</p>
      <div className="mt-4 rounded-2xl bg-white p-4 text-slate-900">
        <StatusBadge label={draft.audience} tone="info" />
        <h3 className="mt-4 text-lg font-semibold text-pine-900">{draft.title}</h3>
        <p className="mt-2 text-sm text-slate-600">{draft.description}</p>
        <p className="mt-3 text-sm">{draft.location} · {draft.startsAt}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {draft.consentRequired && <StatusBadge label="Consent required" tone="warning" />}
          {Number(draft.cost) > 0 && <StatusBadge label="Payment required" tone="warning" />}
          {draft.attachmentName && <StatusBadge label="Document attached" tone="info" />}
        </div>
        <button className="mt-4 w-full rounded-xl bg-pine-900 px-3 py-2 text-sm text-white">Add to calendar</button>
      </div>
    </div>
  );
}
