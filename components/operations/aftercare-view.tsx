"use client";

import { ParentAppPreview } from "@/components/parent/parent-app-preview";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import { aftercarePickupPreview, getAuthorizedCollectors } from "@/src/lib/operations/aftercare";
import { learnerName } from "@/src/lib/operations/incidents";
import { AftercareSession } from "@/types/domain";
import { salesDemoActionEventName, SalesDemoActionPayload } from "@/lib/sales-demo";
import { LogIn, LogOut, Utensils } from "lucide-react";
import { useEffect, useState } from "react";

export function AftercareView() {
  const [sessions, setSessions] = useState<AftercareSession[]>(demoData.aftercareSessions);
  const [selectedLearnerId, setSelectedLearnerId] = useState(sessions[0]?.learnerId ?? demoData.learners[0]?.id ?? "");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState<"checked in" | "checked out">("checked in");
  const selectedSession = sessions.find((session) => session.learnerId === selectedLearnerId);
  const collectors = getAuthorizedCollectors(selectedLearnerId);
  const selectedLearnerName = learnerName(selectedLearnerId);
  const collectorName = collectors[0]?.fullName ?? "authorized collector";

  function checkIn() {
    if (selectedSession) return;
    setPreviewMode("checked in");
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
    setPreviewMode("checked out");
    setSessions((prev) => prev.map((session) => session.learnerId === selectedLearnerId ? { ...session, checkOutAt: new Date().toISOString(), notes: notes[selectedLearnerId] } : session));
  }

  useEffect(() => {
    function onDemoAction(event: Event) {
      const { type } = (event as CustomEvent<SalesDemoActionPayload>).detail ?? {};
      if (type === "RESET_DEMO") {
        setSessions(demoData.aftercareSessions);
        setSelectedLearnerId(demoData.aftercareSessions[0]?.learnerId ?? demoData.learners[0]?.id ?? "");
        setNotes({});
        setPreviewMode("checked in");
        return;
      }
      if (type !== "CHECK_LEARNER_INTO_AFTERCARE" && type !== "CONFIRM_AFTERCARE_PICKUP") return;
      const learner = demoData.learners[11] ?? demoData.learners[0];
      if (!learner) return;
      setSelectedLearnerId(learner.id);
      setPreviewMode(type === "CONFIRM_AFTERCARE_PICKUP" ? "checked out" : "checked in");
      setSessions((prev) => {
        const existing = prev.find((session) => session.learnerId === learner.id && !session.checkOutAt);
        if (type === "CONFIRM_AFTERCARE_PICKUP" && existing) {
          return prev.map((session) =>
            session.id === existing.id ? { ...session, checkOutAt: new Date().toISOString(), notes: "Sales demo pickup confirmed." } : session
          );
        }
        if (type === "CONFIRM_AFTERCARE_PICKUP" && !existing) {
          return [{
            id: `acs_sales_demo_${Date.now()}`,
            schoolId: demoData.school.id,
            learnerId: learner.id,
            date: new Date().toISOString().slice(0, 10),
            checkInAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            checkOutAt: new Date().toISOString(),
            supervisorUserId: "usr_005",
            notes: "Sales demo pickup confirmed."
          }, ...prev];
        }
        if (existing) return prev;
        return [{
          id: `acs_sales_demo_${Date.now()}`,
          schoolId: demoData.school.id,
          learnerId: learner.id,
          date: new Date().toISOString().slice(0, 10),
          checkInAt: new Date().toISOString(),
          supervisorUserId: "usr_005",
          notes: "Sales demo check-in."
        }, ...prev];
      });
    }

    window.addEventListener(salesDemoActionEventName, onDemoAction);
    return () => window.removeEventListener(salesDemoActionEventName, onDemoAction);
  }, []);

  return (
    <div className="space-y-5">
      <PageHeader title="Aftercare" subtitle="Fast check-in, check-out, collectors, and pickup controls." />

      <section className="grid gap-4 md:grid-cols-3">
        <Kpi label="Checked in" value={sessions.length} />
        <Kpi label="Awaiting pickup" value={sessions.filter((session) => !session.checkOutAt).length} tone="warning" />
        <Kpi label="Checked out" value={sessions.filter((session) => session.checkOutAt).length} tone="success" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card data-demo="aftercare-checkin-control">
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
          <ParentAppPreview
            className="mt-4"
            action="AFTERCARE_CHECK_IN_OUT"
            learnerName={selectedLearnerName}
            title={previewMode === "checked out" ? "Aftercare collection confirmed" : "Checked into aftercare"}
            message={
              previewMode === "checked out"
                ? aftercarePickupPreview(selectedLearnerName, collectorName)
                : `${selectedLearnerName} has been checked into aftercare. Staff will update you when collection is complete.`
            }
            timestamp={previewMode === "checked out" ? selectedSession?.checkOutAt : selectedSession?.checkInAt}
            statusLabel={previewMode === "checked out" ? "Collected" : selectedSession ? "Checked in" : "Preview"}
            statusTone={previewMode === "checked out" ? "success" : "warning"}
            actionLabel="View aftercare"
            meta={[
              { label: "Collector", value: collectorName, tone: "success" },
              { label: "Pickup PIN", value: "4821", tone: "info" }
            ]}
          />
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
