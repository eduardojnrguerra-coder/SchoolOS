import { DashboardModuleGuard } from "@/components/auth/module-guard";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  CalendarCheck2,
  CheckCircle2,
  CircleDashed,
  ClipboardCheck,
  GraduationCap,
  Rocket,
  ShieldCheck,
  Sparkles,
  UsersRound
} from "lucide-react";

type SetupStatus = "complete" | "in-progress" | "pending";

type ChecklistItem = {
  label: string;
  description: string;
  status: SetupStatus;
};

const statusConfig: Record<
  SetupStatus,
  {
    label: string;
    tone: "success" | "warning" | "info";
    icon: typeof CheckCircle2;
    className: string;
  }
> = {
  complete: {
    label: "Complete",
    tone: "success",
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50"
  },
  "in-progress": {
    label: "In progress",
    tone: "warning",
    icon: CircleDashed,
    className: "border-amber-200 bg-amber-50"
  },
  pending: {
    label: "Pending",
    tone: "info",
    icon: CircleDashed,
    className: "border-slate-200 bg-white"
  }
};

const checklist: ChecklistItem[] = [
  {
    label: "School profile configured",
    description: "Core profile, contact details, timezone, and school identity are ready.",
    status: "complete"
  },
  {
    label: "Staff accounts created",
    description: "Admin, finance, transport, aftercare, and teacher roles are mapped.",
    status: "complete"
  },
  {
    label: "Learners imported",
    description: "Learner profiles are loaded with class and grade assignments.",
    status: "complete"
  },
  {
    label: "Parents linked",
    description: "Primary and secondary guardian links are connected to learners.",
    status: "complete"
  },
  {
    label: "Classes created",
    description: "Grades, classes, rooms, and homeroom teacher ownership are set up.",
    status: "complete"
  },
  {
    label: "Fee accounts configured",
    description: "Monthly accounts, balances, and proof-of-payment workflow are ready.",
    status: "complete"
  },
  {
    label: "Notice groups created",
    description: "Audience groups for grades, classes, transport, and aftercare are being refined.",
    status: "in-progress"
  },
  {
    label: "Consent form templates loaded",
    description: "Reusable consent and indemnity templates are available for review.",
    status: "complete"
  },
  {
    label: "Document categories loaded",
    description: "Policies, newsletters, reports, supply lists, and statements are organized.",
    status: "complete"
  },
  {
    label: "Transport routes configured",
    description: "Routes, drivers, vehicles, and stop structure are prepared.",
    status: "complete"
  },
  {
    label: "Aftercare rules configured",
    description: "Pickup, collector, meal, homework, and late-fee rules are being finalized.",
    status: "in-progress"
  },
  {
    label: "Parent app branding configured",
    description: "School-safe app presentation, welcome copy, and demo branding are in review.",
    status: "in-progress"
  },
  {
    label: "Training session scheduled",
    description: "Staff enablement session still needs calendar confirmation.",
    status: "pending"
  },
  {
    label: "Go-live date selected",
    description: "Final launch date should be selected after staff training is confirmed.",
    status: "pending"
  }
];

const timeline = [
  {
    week: "Week 1",
    title: "Setup",
    detail: "Configure school data, roles, learner imports, fees, and parent links.",
    icon: ClipboardCheck
  },
  {
    week: "Week 2",
    title: "Staff training",
    detail: "Train admin, teachers, finance, transport, and aftercare teams on daily workflows.",
    icon: GraduationCap
  },
  {
    week: "Week 3",
    title: "Parent onboarding",
    detail: "Invite families, explain the parent app, and migrate key notices/forms away from WhatsApp.",
    icon: UsersRound
  },
  {
    week: "Week 4",
    title: "Full launch",
    detail: "Run the school day from Pine X with attendance, notices, payments, transport, and aftercare live.",
    icon: Rocket
  }
];

function getProgressPercent(items: ChecklistItem[]) {
  const completedScore = items.reduce((score, item) => {
    if (item.status === "complete") return score + 1;
    if (item.status === "in-progress") return score + 0.5;
    return score;
  }, 0);

  return Math.round((completedScore / items.length) * 100);
}

function getStatusCounts(items: ChecklistItem[]) {
  return items.reduce(
    (counts, item) => ({
      ...counts,
      [item.status]: counts[item.status] + 1
    }),
    { complete: 0, "in-progress": 0, pending: 0 } as Record<SetupStatus, number>
  );
}

export const metadata = {
  title: "Implementation Readiness | Pine X School OS"
};

export default function ImplementationPage() {
  const progress = getProgressPercent(checklist);
  const statusCounts = getStatusCounts(checklist);
  const nextRecommendedStep = checklist.find((item) => item.status !== "complete");

  return (
    <DashboardModuleGuard>
      <div className="space-y-6">
        <PageHeader
          title="Implementation Readiness"
          subtitle="A professional onboarding plan to move the school from demo-ready to launch-ready."
        />

        <Card className="overflow-hidden border-0 bg-[radial-gradient(circle_at_top_right,_rgba(20,184,166,0.2),_transparent_32%),linear-gradient(135deg,#07111f_0%,#0f2339_58%,#172033_100%)] p-0 text-white shadow-2xl">
          <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-50">
                <ShieldCheck className="h-3.5 w-3.5" />
                Launch readiness
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">Hermanus Valley Academy implementation plan</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200">
                A calm, operational view of what is ready, what needs attention, and what should happen next before the school goes live.
              </p>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-300">Overall setup progress</span>
                  <span className="font-semibold text-white">{progress}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-300 shadow-[0_0_24px_rgba(45,212,191,0.55)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 ring-1 ring-white/10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">Next recommended step</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{nextRecommendedStep?.label ?? "Ready for go-live"}</h3>
                </div>
                <Sparkles className="h-5 w-5 text-amber-200" />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                {nextRecommendedStep?.description ??
                  "All readiness items are complete. Confirm launch communications and begin live rollout."}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-lg font-semibold text-emerald-100">{statusCounts.complete}</p>
                  <p className="text-slate-300">Complete</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-lg font-semibold text-amber-100">{statusCounts["in-progress"]}</p>
                  <p className="text-slate-300">In progress</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-lg font-semibold text-sky-100">{statusCounts.pending}</p>
                  <p className="text-slate-300">Pending</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card className="border border-slate-200 bg-white shadow-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-pine-900">Onboarding Checklist</h2>
                <p className="mt-1 text-sm text-slate-600">Each item maps to a launch dependency that should be checked before parent rollout.</p>
              </div>
              <StatusBadge label={`${progress}% ready`} tone={progress >= 80 ? "success" : "warning"} />
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {checklist.map((item) => {
                const status = statusConfig[item.status];
                const Icon = status.icon;

                return (
                  <div key={item.label} className={`rounded-2xl border p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg ${status.className}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="rounded-2xl bg-white p-2 text-pine-800 shadow-sm">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-950">{item.label}</h3>
                          <p className="mt-1 text-sm leading-5 text-slate-600">{item.description}</p>
                        </div>
                      </div>
                      <StatusBadge label={status.label} tone={status.tone} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="border border-slate-200 bg-white shadow-xl">
              <div className="mb-4 flex items-center gap-2">
                <CalendarCheck2 className="h-5 w-5 text-pine-800" />
                <h2 className="text-lg font-semibold text-pine-900">Go-live Timeline</h2>
              </div>
              <div className="space-y-3">
                {timeline.map((step, index) => (
                  <div key={step.week} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    {index < timeline.length - 1 ? <span className="absolute -bottom-3 left-8 h-3 w-px bg-slate-300" /> : null}
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-pine-900 text-white">
                        <step.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{step.week}</p>
                        <h3 className="mt-1 text-sm font-semibold text-slate-950">{step.title}</h3>
                        <p className="mt-1 text-sm leading-5 text-slate-600">{step.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border border-emerald-200 bg-emerald-50/80">
              <h2 className="text-lg font-semibold text-emerald-950">Implementation note</h2>
              <p className="mt-2 text-sm leading-6 text-emerald-800">
                Use this page during client onboarding calls to keep launch responsibilities visible, reduce uncertainty, and make go-live feel controlled rather than rushed.
              </p>
            </Card>
          </div>
        </section>
      </div>
    </DashboardModuleGuard>
  );
}
