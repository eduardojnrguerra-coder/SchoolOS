"use client";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useFiveMinuteSchoolDemo } from "@/components/demo/five-minute-school-demo";
import { useToast } from "@/components/ui/toast-provider";
import { dispatchSalesDemoAction, SalesDemoAction } from "@/lib/sales-demo";
import { Bell, Bus, CheckCircle2, ClipboardPenLine, CreditCard, Megaphone, Route, ShieldCheck, UserMinus, Users } from "lucide-react";
import { useState } from "react";

type DemoEvent = {
  id: string;
  title: string;
  parentView: string;
  tone: "info" | "success" | "warning" | "danger";
};

const walkthrough = ["Pulse", "Attendance", "Parent app", "Notices", "Consent", "Fees", "Transport", "Aftercare", "Summary"];

const scenarios = [
  { label: "Mark learner absent", icon: UserMinus, action: "MARK_LEARNER_ABSENT" as SalesDemoAction, event: "Ariana Meyer marked absent", parentView: "Parent receives: Ariana Meyer was marked absent today. Please confirm if this is correct.", tone: "warning" as const },
  { label: "Send urgent notice", icon: Megaphone, action: "SEND_URGENT_GRADE3_NOTICE" as SalesDemoAction, event: "Urgent Grade 3 notice queued", parentView: "Parent sees a high-priority notice at the top of the app feed.", tone: "danger" as const },
  { label: "Create outing consent form", icon: ClipboardPenLine, action: "CREATE_OUTING_CONSENT_FORM" as SalesDemoAction, event: "Outing consent created", parentView: "Parent action center shows: Sign form required.", tone: "warning" as const },
  { label: "Upload parent proof of payment", icon: CreditCard, action: "UPLOAD_PROOF_OF_PAYMENT" as SalesDemoAction, event: "Proof uploaded for review", parentView: "Parent sees proof status: Pending finance review.", tone: "info" as const },
  { label: "Delay transport route", icon: Route, action: "MARK_TRANSPORT_DELAYED" as SalesDemoAction, event: "North route delayed", parentView: "Parent transport screen shows a delay notice and route reassurance.", tone: "warning" as const },
  { label: "Check learner into aftercare", icon: Users, action: "CHECK_LEARNER_INTO_AFTERCARE" as SalesDemoAction, event: "Learner checked into aftercare", parentView: "Parent receives: Your child has been checked into aftercare.", tone: "success" as const }
];

export function GuidedDemo() {
  const [step, setStep] = useState(0);
  const [events, setEvents] = useState<DemoEvent[]>([]);
  const { showToast } = useToast();
  const { startDemo, resetDemo } = useFiveMinuteSchoolDemo();

  function startLocalDemo() {
    setStep(0);
    startDemo();
  }

  function runScenario(scenario: (typeof scenarios)[number]) {
    dispatchSalesDemoAction(scenario.action);
    const event = { id: `demo_event_${Date.now()}`, title: scenario.event, parentView: scenario.parentView, tone: scenario.tone };
    setEvents((prev) => [event, ...prev].slice(0, 6));
    showToast({ title: scenario.event, description: scenario.parentView, tone: scenario.tone === "danger" ? "warning" : scenario.tone });
  }

  return (
    <Card className="border-pine-100 bg-white" data-demo="guided-demo-card">
      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div>
          <div className="flex items-center gap-2 text-pine-900">
            <ShieldCheck className="h-5 w-5" />
            <h2 className="text-lg font-semibold">5-Minute School Demo</h2>
          </div>
          <p className="mt-2 text-sm text-slate-600">A polished sales walkthrough showing one school day moving from dashboard action to parent reassurance.</p>
          <div className="mt-4 rounded-2xl border border-slate-200 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Current step</p>
            <p className="mt-1 text-xl font-semibold text-pine-900">{walkthrough[step]}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-pine-900 transition-all" style={{ width: `${((step + 1) / walkthrough.length) * 100}%` }} />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={startLocalDemo} className="rounded-xl bg-pine-900 px-3 py-2 text-sm text-white">Start Guided Demo</button>
            <button onClick={resetDemo} className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">Reset demo</button>
            <button onClick={() => setStep((current) => Math.min(current + 1, walkthrough.length - 1))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">Next step</button>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Bell className="h-5 w-5 text-pine-800" />
            <h3 className="font-semibold text-pine-900">Demo scenarios</h3>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {scenarios.map((scenario) => (
              <button key={scenario.label} onClick={() => runScenario(scenario)} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-3 text-left text-sm transition hover:-translate-y-0.5 hover:border-pine-300 hover:bg-pine-50">
                <span className="flex items-center gap-2"><scenario.icon className="h-4 w-4 text-pine-800" />{scenario.label}</span>
                <CheckCircle2 className="h-4 w-4 text-slate-300" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Bus className="h-5 w-5 text-pine-800" />
          <h3 className="font-semibold text-pine-900">What the parent would see</h3>
        </div>
        {events.length === 0 ? (
          <p className="text-sm text-slate-500">Run a scenario to show the parent-facing update here.</p>
        ) : (
          <div className="space-y-2">
            {events.map((event) => (
              <div key={event.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{event.title}</p>
                  <StatusBadge label="Parent app" tone={event.tone} />
                </div>
                <p className="mt-1 text-slate-600">{event.parentView}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
