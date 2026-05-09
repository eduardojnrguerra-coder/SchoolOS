"use client";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import { aftercarePickupPreview, getAuthorizedCollectors } from "@/src/lib/operations/aftercare";
import { learnerName } from "@/src/lib/operations/incidents";
import { AftercareSession } from "@/types/domain";
import { LogIn, LogOut, Utensils } from "lucide-react";
import { useState } from "react";

export function AftercareView() {
  const [sessions, setSessions] = useState<AftercareSession[]>(demoData.aftercareSessions);
  const [selectedLearnerId, setSelectedLearnerId] = useState(sessions[0]?.learnerId ?? demoData.learners[0]?.id ?? "");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const selectedSession = sessions.find((session) => session.learnerId === selectedLearnerId);
  const collectors = getAuthorizedCollectors(selectedLearnerId);
  const selectedLearnerName = learnerName(selectedLearnerId);
  const collectorName = collectors[0]?.fullName ?? "authorized collector";

  function checkIn() {
    if (selectedSession) return;
    setSessions((prev) => [{
      id: `acs_demo_${Date.now()}`,
      schoolId: demoData.school.id,
      learnerId: selectedLearnerId,
      date: new Date().toISOString().slice(0, 10),
      checkInAt: new Date().toISOString(),
      supervisorUserId: "usr_005",
      notes: notes[selectedLearnerId]
    }, ...prev]);
  }

  function checkOut() {
    setSessions((prev) => prev.map((session) => session.learnerId === selectedLearnerId ? { ...session, checkOutAt: new Date().toISOString(), notes: notes[selectedLearnerId] } : session));
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Aftercare" subtitle="Fast check-in, check-out, collectors, and pickup controls." />

      <section className="grid gap-4 md:grid-cols-3">
        <Kpi label="Checked in" value={sessions.length} />
        <Kpi label="Awaiting pickup" value={sessions.filter((session) => !session.checkOutAt).length} tone="warning" />
        <Kpi label="Checked out" value={sessions.filter((session) => session.checkOutAt).length} tone="success" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h2 className="text-lg font-semibold text-pine-900">Learners</h2>
          <div className="mt-3 space-y-2">
            {demoData.learners.slice(0, 16).map((learner) => {
              const session = sessions.find((item) => item.learnerId === learner.id);
              return (
                <button key={learner.id} onClick={() => setSelectedLearnerId(learner.id)} className="w-full text-left">
                  <div className={`rounded-lg border p-3 ${selectedLearnerId === learner.id ? "border-pine-300 bg-pine-50" : "border-slate-200"}`}>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900">{learner.firstName} {learner.lastName}</p>
                      <StatusBadge label={!session ? "Not checked in" : session.checkOutAt ? "Checked out" : "In aftercare"} tone={!session ? "info" : session.checkOutAt ? "success" : "warning"} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-pine-900">{selectedLearnerName}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <button onClick={checkIn} className="inline-flex items-center justify-center gap-2 rounded-xl bg-pine-900 px-3 py-3 text-sm text-white"><LogIn className="h-4 w-4" /> Check in</button>
            <button onClick={checkOut} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm"><LogOut className="h-4 w-4" /> Check out</button>
          </div>
          <div className="mt-4 rounded-xl border border-slate-200 p-3 text-sm">
            <p className="font-medium text-slate-900">Authorized collectors</p>
            <p className="mt-1 text-slate-600">{collectors.map((collector) => collector?.fullName).join(", ") || "No authorized collectors linked"}</p>
            <p className="mt-2 text-xs text-slate-500">Pickup PIN placeholder: 4821</p>
          </div>
          <label className="mt-4 block text-sm">
            <span className="mb-1 flex items-center gap-2 font-medium text-slate-900"><Utensils className="h-4 w-4" /> Meal/homework notes</span>
            <textarea value={notes[selectedLearnerId] ?? ""} onChange={(e) => setNotes((prev) => ({ ...prev, [selectedLearnerId]: e.target.value }))} rows={4} className="w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Meal, homework, or pickup notes" />
          </label>
          <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Late pickup fee placeholder: R50 after 17:30.</div>
          <div className="mt-4 rounded-xl border border-slate-200 p-3 text-sm">
            <p className="font-medium text-slate-900">Parent pickup notification preview</p>
            <p className="mt-1 text-slate-600">{aftercarePickupPreview(selectedLearnerName, collectorName)}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Kpi({ label, value, tone = "info" }: { label: string; value: number; tone?: "info" | "success" | "warning" }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-pine-900">{value}</p>
      <StatusBadge label="Today" tone={tone} />
    </Card>
  );
}
