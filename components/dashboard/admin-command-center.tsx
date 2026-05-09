"use client";

import { AttendanceOverviewChart, FeeCollectionChart } from "@/components/dashboard/charts";
import { GuidedDemo } from "@/components/demo/guided-demo";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDashboardSnapshot } from "@/lib/dashboard";
import { getDashboardNotificationCenterItems } from "@/src/lib/notifications";
import {
  AlertTriangle,
  Bus,
  CalendarClock,
  CheckCircle2,
  ClipboardPenLine,
  FilePlus2,
  GraduationCap,
  HandCoins,
  Megaphone,
  PlusCircle,
  Receipt,
  ShieldAlert,
  UserCheck,
  Users
} from "lucide-react";

const actionButtons = [
  { label: "Send Notice", icon: Megaphone },
  { label: "Mark Attendance", icon: UserCheck },
  { label: "Create Consent Form", icon: ClipboardPenLine },
  { label: "Upload Document", icon: FilePlus2 },
  { label: "Add Payment", icon: HandCoins },
  { label: "Log Incident", icon: ShieldAlert }
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(value);
}

export function AdminCommandCenter() {
  const snapshot = getDashboardSnapshot();
  const notificationCenterItems = getDashboardNotificationCenterItems();

  const kpis = [
    { label: "Total Learners", value: snapshot.kpis.totalLearners.toString(), icon: GraduationCap, tone: "info" as const },
    { label: "Present Today", value: snapshot.kpis.presentToday.toString(), icon: CheckCircle2, tone: "success" as const },
    { label: "Absent Today", value: snapshot.kpis.absentToday.toString(), icon: AlertTriangle, tone: "danger" as const },
    { label: "Outstanding Fees", value: formatCurrency(snapshot.kpis.outstandingFees), icon: Receipt, tone: "warning" as const },
    { label: "Unsigned Consent", value: snapshot.kpis.unsignedConsentForms.toString(), icon: ClipboardPenLine, tone: "warning" as const },
    { label: "Open Incidents", value: snapshot.kpis.openIncidents.toString(), icon: ShieldAlert, tone: "danger" as const },
    { label: "Transport Delays", value: snapshot.kpis.transportDelays.toString(), icon: Bus, tone: "warning" as const },
    { label: "Aftercare Check-ins", value: snapshot.kpis.aftercareCheckIns.toString(), icon: Users, tone: "info" as const }
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-pine-900 via-pine-800 to-slate-800 text-white">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/70">Welcome Back</p>
            <h1 className="mt-1 text-3xl font-semibold">{snapshot.schoolName}</h1>
            <p className="mt-2 text-sm text-white/80">{snapshot.todayLabel} · {snapshot.currentTerm}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {actionButtons.slice(0, 3).map((action) => (
              <button key={action.label} className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-sm transition hover:bg-white/20">
                <action.icon className="h-4 w-4" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <GuidedDemo />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="transition duration-300 hover:-translate-y-0.5 hover:shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{kpi.label}</p>
                <p className="mt-2 text-2xl font-semibold text-pine-900">{kpi.value}</p>
              </div>
              <div className="rounded-xl bg-pine-50 p-2 text-pine-800">
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <StatusBadge label="Live Demo Data" tone={kpi.tone} />
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="transition hover:shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-pine-900">Attendance Overview</h2>
            <StatusBadge label="Last 10 School Days" tone="info" />
          </div>
          <AttendanceOverviewChart data={snapshot.attendanceSeries} />
        </Card>

        <Card className="transition hover:shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-pine-900">Fee Collection Progress</h2>
            <StatusBadge label="Paid vs Outstanding" tone="warning" />
          </div>
          <FeeCollectionChart data={snapshot.feeCollectionSeries} />
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <NotificationCenter deliveries={notificationCenterItems} />

        <Card className="xl:col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-pine-800" />
            <h2 className="text-lg font-semibold text-pine-900">Today&apos;s Operations</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
              <span>Events Today</span>
              <span className="font-semibold text-pine-900">{snapshot.todaysOperations.eventsToday.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
              <span>Transport Routes Active</span>
              <span className="font-semibold text-pine-900">{snapshot.todaysOperations.activeRoutes}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
              <span>Aftercare Awaiting Pickup</span>
              <span className="font-semibold text-pine-900">{snapshot.todaysOperations.aftercareAwaitingPickup}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
              <span>Urgent Incidents</span>
              <span className="font-semibold text-rose-600">{snapshot.todaysOperations.urgentIncidents}</span>
            </div>
          </div>
        </Card>

        <Card className="xl:col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-pine-800" />
            <h2 className="text-lg font-semibold text-pine-900">Quick Actions</h2>
          </div>
          <div className="grid gap-2">
            {actionButtons.map((action) => (
              <button
                key={action.label}
                className="inline-flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 transition hover:border-pine-300 hover:bg-pine-50 hover:text-pine-900"
              >
                <span>{action.label}</span>
                <action.icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
