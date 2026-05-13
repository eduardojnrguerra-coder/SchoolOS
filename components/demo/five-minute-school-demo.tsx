"use client";

import { ParentAppPreview, ParentAppPreviewAction } from "@/components/parent/parent-app-preview";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast-provider";
import { dispatchSalesDemoAction, SalesDemoAction, setSalesDemoActive } from "@/lib/sales-demo";
import { ArrowRight, CheckCircle2, RotateCcw, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type DemoStep = {
  id: string;
  route: string;
  title: string;
  description: string;
  selector?: string;
  primaryLabel?: string;
  scenarioAction?: SalesDemoAction;
  previewAction?: ParentAppPreviewAction;
  final?: boolean;
};

type DemoContextValue = {
  active: boolean;
  startDemo: () => void;
  resetDemo: () => void;
  runScenarioAction: (action: SalesDemoAction) => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

const steps: DemoStep[] = [
  {
    id: "school-pulse",
    route: "/dashboard",
    selector: '[data-demo="school-pulse"]',
    title: "Today's School Pulse",
    description: "Start with the principal's live command centre: attendance, fees, forms, transport, aftercare, and incidents in one calm view."
  },
  {
    id: "unconfirmed-absence",
    route: "/dashboard",
    selector: '[data-demo="unconfirmed-absence"]',
    title: "Spot an unconfirmed absence",
    description: "The system surfaces the operational issue before it becomes a parent complaint."
  },
  {
    id: "open-attendance",
    route: "/dashboard/attendance",
    selector: '[data-demo="attendance-register"]',
    title: "Open the attendance register",
    description: "Move from oversight into the register where staff can capture the day's attendance."
  },
  {
    id: "mark-absent",
    route: "/dashboard/attendance",
    selector: '[data-demo="attendance-register"]',
    title: "Mark learner absent",
    description: "Run the demo action to mark a learner absent and create the parent-facing alert preview.",
    scenarioAction: "MARK_LEARNER_ABSENT",
    primaryLabel: "Mark learner absent"
  },
  {
    id: "absence-preview",
    route: "/dashboard/attendance",
    selector: '[data-demo="parent-app-preview"]',
    title: "Parent notification is generated",
    description: "The school sees exactly what the parent will receive before anything goes out.",
    previewAction: "ABSENCE_ALERT"
  },
  {
    id: "parent-portal",
    route: "/parent",
    selector: '[data-demo="parent-home"]',
    title: "Switch to the parent portal",
    description: "The same school-day event appears inside the mobile-first parent experience."
  },
  {
    id: "parent-confirms",
    route: "/parent/notices",
    selector: '[data-demo="parent-notification-inbox"]',
    title: "Parent confirms the absence",
    description: "The parent can open the alert, confirm the update, and reduce admin follow-up.",
    scenarioAction: "PARENT_CONFIRM_ABSENCE",
    primaryLabel: "Confirm absence"
  },
  {
    id: "open-notices",
    route: "/dashboard/notices",
    selector: '[data-demo="notice-composer"]',
    title: "Send a targeted urgent notice",
    description: "Return to the school dashboard and prepare a Grade 3 notice without touching WhatsApp groups."
  },
  {
    id: "urgent-grade3",
    route: "/dashboard/notices",
    selector: '[data-demo="notice-composer"]',
    title: "Send urgent notice to Grade 3 parents",
    description: "Queue a realistic urgent notice and show the parent app preview at the same time.",
    scenarioAction: "SEND_URGENT_GRADE3_NOTICE",
    primaryLabel: "Send Grade 3 notice",
    previewAction: "URGENT_NOTICE"
  },
  {
    id: "notice-tracking",
    route: "/dashboard/notices",
    selector: '[data-demo="notice-tracking"]',
    title: "Track reads and acknowledgements",
    description: "The admin team can see delivery/read/action-required status instead of guessing who saw the message."
  },
  {
    id: "open-consent",
    route: "/dashboard/consent-forms",
    selector: '[data-demo="consent-create"]',
    title: "Create a digital consent form",
    description: "Now move from communication to action: a parent can sign directly from the phone."
  },
  {
    id: "create-consent",
    route: "/dashboard/consent-forms",
    selector: '[data-demo="consent-create"]',
    title: "Create outing consent form",
    description: "Generate a demo outing consent form and queue it to parents.",
    scenarioAction: "CREATE_OUTING_CONSENT_FORM",
    primaryLabel: "Create outing form",
    previewAction: "CONSENT_FORM_REQUEST"
  },
  {
    id: "parent-signing",
    route: "/dashboard/consent-forms",
    selector: '[data-demo="parent-app-preview"]',
    title: "Parent signs from the phone",
    description: "The parent flow is clear: read, sign, submit, and retain an audit-friendly timestamp.",
    previewAction: "CONSENT_FORM_REQUEST"
  },
  {
    id: "open-fees",
    route: "/dashboard/fees",
    selector: '[data-demo="overdue-fee-account"]',
    title: "Find the overdue account",
    description: "Finance can see overdue accounts clearly and send helpful reminders without scary language.",
    scenarioAction: "SHOW_OVERDUE_FEE",
    primaryLabel: "Select overdue account"
  },
  {
    id: "fee-reminder",
    route: "/dashboard/fees",
    selector: '[data-demo="parent-app-preview"]',
    title: "Send payment reminder",
    description: "The parent sees the balance, the next step, and a calm proof-upload path.",
    previewAction: "FEE_REMINDER"
  },
  {
    id: "proof-upload",
    route: "/dashboard/fees",
    selector: '[data-demo="parent-app-preview"]',
    title: "Parent uploads proof of payment",
    description: "Run the proof upload scenario so finance has a reviewable demo item.",
    scenarioAction: "UPLOAD_PROOF_OF_PAYMENT",
    primaryLabel: "Upload proof",
    previewAction: "FEE_REMINDER"
  },
  {
    id: "open-transport",
    route: "/dashboard/transport",
    selector: '[data-demo="transport-route-control"]',
    title: "Open transport control",
    description: "Transport becomes a mini control room with drivers, vehicles, route status, and parent updates."
  },
  {
    id: "delay-route",
    route: "/dashboard/transport",
    selector: '[data-demo="transport-route-control"]',
    title: "Mark route delayed",
    description: "Update the route once and prepare the parent-facing delay notification.",
    scenarioAction: "MARK_TRANSPORT_DELAYED",
    primaryLabel: "Mark route delayed",
    previewAction: "TRANSPORT_DELAY"
  },
  {
    id: "transport-timeline",
    route: "/dashboard/transport",
    selector: '[data-demo="parent-app-preview"]',
    title: "Parent sees transport timeline",
    description: "Parents get reassurance instead of uncertainty: route, driver, and delay context in one place.",
    previewAction: "TRANSPORT_DELAY"
  },
  {
    id: "open-aftercare",
    route: "/dashboard/aftercare",
    selector: '[data-demo="aftercare-checkin-control"]',
    title: "Open aftercare check-in",
    description: "Aftercare staff get a pressure-friendly check-in/check-out workflow."
  },
  {
    id: "aftercare-checkin",
    route: "/dashboard/aftercare",
    selector: '[data-demo="aftercare-checkin-control"]',
    title: "Check learner into aftercare",
    description: "Run the scenario so the parent receives a reassuring aftercare update.",
    scenarioAction: "CHECK_LEARNER_INTO_AFTERCARE",
    primaryLabel: "Check into aftercare",
    previewAction: "AFTERCARE_CHECK_IN_OUT"
  },
  {
    id: "pickup-confirmation",
    route: "/dashboard/aftercare",
    selector: '[data-demo="parent-app-preview"]',
    title: "Show pickup confirmation",
    description: "The parent can see collection status, collector context, and school-safe reassurance.",
    scenarioAction: "CONFIRM_AFTERCARE_PICKUP",
    primaryLabel: "Confirm pickup",
    previewAction: "AFTERCARE_CHECK_IN_OUT"
  },
  {
    id: "summary",
    route: "/dashboard",
    title: "One school day. One system. Every parent informed.",
    description: "Attendance, notices, consent, fees, transport, and aftercare all worked together without paper chasing or WhatsApp chaos.",
    final: true
  }
];

function getRect(selector?: string) {
  if (!selector) return null;
  const element = document.querySelector(selector);
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return {
    top: Math.max(rect.top - 8, 8),
    left: Math.max(rect.left - 8, 8),
    width: Math.min(rect.width + 16, window.innerWidth - Math.max(rect.left - 8, 8) - 8),
    height: Math.min(rect.height + 16, window.innerHeight - Math.max(rect.top - 8, 8) - 8)
  };
}

export function FiveMinuteSchoolDemoProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [highlightRect, setHighlightRect] = useState<ReturnType<typeof getRect>>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const currentStep = steps[stepIndex];

  const updateHighlight = useCallback(() => {
    if (!active || currentStep.final) {
      setHighlightRect(null);
      return;
    }
    setHighlightRect(getRect(currentStep.selector));
  }, [active, currentStep]);

  useEffect(() => {
    if (!active) return;
    if (currentStep.route && pathname !== currentStep.route) router.push(currentStep.route);
  }, [active, currentStep.route, pathname, router]);

  useEffect(() => {
    if (!active) return;
    const timeout = window.setTimeout(() => {
      const element = currentStep.selector ? document.querySelector(currentStep.selector) : null;
      element?.scrollIntoView({ block: "center", behavior: "smooth" });
      updateHighlight();
    }, 260);
    window.addEventListener("resize", updateHighlight);
    window.addEventListener("scroll", updateHighlight, true);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("resize", updateHighlight);
      window.removeEventListener("scroll", updateHighlight, true);
    };
  }, [active, currentStep.selector, pathname, updateHighlight]);

  function runScenarioAction(action: SalesDemoAction) {
    dispatchSalesDemoAction(action);
    const toastCopy: Record<SalesDemoAction, string> = {
      MARK_LEARNER_ABSENT: "Learner marked absent and parent alert preview generated.",
      PARENT_CONFIRM_ABSENCE: "Parent confirmation captured in the demo inbox.",
      SEND_URGENT_GRADE3_NOTICE: "Urgent Grade 3 notice queued with delivery tracking.",
      CREATE_OUTING_CONSENT_FORM: "Outing consent form created and queued.",
      SHOW_OVERDUE_FEE: "Overdue account selected for finance follow-up.",
      UPLOAD_PROOF_OF_PAYMENT: "Parent proof of payment uploaded for review.",
      MARK_TRANSPORT_DELAYED: "Transport route marked delayed.",
      CHECK_LEARNER_INTO_AFTERCARE: "Learner checked into aftercare.",
      CONFIRM_AFTERCARE_PICKUP: "Aftercare pickup confirmation captured.",
      RESET_DEMO: "Demo state reset."
    };
    showToast({ title: "Demo action", description: toastCopy[action], tone: action === "RESET_DEMO" ? "info" : "success" });
  }

  function startDemo() {
    setSalesDemoActive(true);
    setActive(true);
    setStepIndex(0);
    router.push("/dashboard");
    showToast({ title: "5-Minute School Demo started", description: "Follow the guided story from dashboard to parent app.", tone: "success" });
  }

  function resetDemo() {
    dispatchSalesDemoAction("RESET_DEMO");
    setSalesDemoActive(false);
    setActive(false);
    setStepIndex(0);
    setHighlightRect(null);
    router.push("/dashboard");
    showToast({ title: "Guided demo reset", description: "Demo state has been cleared for the next client walkthrough.", tone: "info" });
  }

  function nextStep() {
    if (currentStep.scenarioAction) runScenarioAction(currentStep.scenarioAction);
    if (stepIndex >= steps.length - 1) {
      resetDemo();
      return;
    }
    setStepIndex((index) => index + 1);
  }

  function previousStep() {
    setStepIndex((index) => Math.max(index - 1, 0));
  }

  const value: DemoContextValue = { active, startDemo, resetDemo, runScenarioAction };
  const progress = ((stepIndex + 1) / steps.length) * 100;

  return (
    <DemoContext.Provider value={value}>
      {children}
      {active && (
        <div className="fixed inset-0 z-[80] pointer-events-none">
          <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]" />
          {highlightRect && (
            <div
              className="absolute rounded-[1.75rem] border-2 border-emerald-300 shadow-[0_0_0_9999px_rgba(2,6,23,0.5),0_0_40px_rgba(110,231,183,0.55)] transition-all duration-500"
              style={{
                top: highlightRect.top,
                left: highlightRect.left,
                width: highlightRect.width,
                height: highlightRect.height
              }}
            />
          )}

          <div className="pointer-events-auto absolute bottom-4 left-4 right-4 mx-auto max-w-xl rounded-[2rem] border border-white/15 bg-white p-4 text-slate-950 shadow-2xl md:bottom-6 md:left-auto md:right-6 md:mx-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge label="5-Minute School Demo" tone="info" />
                  <span className="text-xs font-medium text-slate-500">Step {stepIndex + 1} of {steps.length}</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-pine-900">{currentStep.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{currentStep.description}</p>
              </div>
              <button onClick={resetDemo} className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50" aria-label="Close guided demo">
                <X className="h-4 w-4" />
              </button>
            </div>

            {currentStep.previewAction && !currentStep.final && (
              <ParentAppPreview
                className="mt-4 max-h-[520px] overflow-hidden"
                action={currentStep.previewAction}
                learnerName="Ariana Meyer"
                footerNote="This is the parent-facing side of the same school action."
              />
            )}

            {currentStep.final && (
              <div className="mt-4 rounded-3xl bg-pine-900 p-5 text-white">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  <p className="text-sm font-semibold">Demo complete</p>
                </div>
                <p className="mt-3 text-2xl font-semibold leading-tight">One school day. One system. Every parent informed.</p>
                <p className="mt-2 text-sm text-white/70">The principal saw the whole operation, staff acted from the right module, and parents stayed informed from one polished app.</p>
              </div>
            )}

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-pine-900 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <button onClick={resetDemo} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                <RotateCcw className="h-4 w-4" />
                Reset demo
              </button>
              <div className="flex gap-2">
                <button onClick={previousStep} disabled={stepIndex === 0} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40">
                  Back
                </button>
                <button onClick={nextStep} className="inline-flex items-center gap-2 rounded-xl bg-pine-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-pine-800">
                  {currentStep.final ? "Finish demo" : currentStep.primaryLabel ?? "Continue"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DemoContext.Provider>
  );
}

export function useFiveMinuteSchoolDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useFiveMinuteSchoolDemo must be used inside FiveMinuteSchoolDemoProvider");
  return context;
}
