"use client";

import { AttendanceOverviewChart, FeeCollectionChart } from "@/components/dashboard/charts";
import { ImpactAnalytics } from "@/components/dashboard/impact-analytics";
import { GuidedDemo } from "@/components/demo/guided-demo";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDashboardSnapshot } from "@/lib/dashboard";
import { getDashboardNotificationCenterItems } from "@/src/lib/notifications";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  Bus,
  CalendarClock,
  CheckCircle2,
  ClipboardPenLine,
  FilePlus2,
  FileSignature,
  GraduationCap,
  HandCoins,
  Megaphone,
  PlusCircle,
  Receipt,
  Route,
  ShieldAlert,
  UserCheck,
  Users,
  Wallet,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";

type PulseTone = "success" | "warning" | "danger" | "info";

const actionButtons = [
  { label: "Send Notice", icon: Megaphone },
  { label: "Mark Attendance", icon: UserCheck },
  { label: "Create Consent Form", icon: ClipboardPenLine },
  { label: "Upload Document", icon: FilePlus2 },
  { label: "Add Payment", icon: HandCoins },
  { label: "Log Incident", icon: ShieldAlert }
];

const pulseToneStyles: Record<PulseTone, string> = {
  success: "border-emerald-300/25 bg-emerald-400/10 hover:border-emerald-200/50 hover:bg-emerald-400/15",
  warning: "border-amber-300/25 bg-amber-400/10 hover:border-amber-200/50 hover:bg-amber-400/15",
  danger: "border-rose-300/25 bg-rose-400/10 hover:border-rose-200/50 hover:bg-rose-400/15",
  info: "border-sky-300/25 bg-sky-400/10 hover:border-sky-200/50 hover:bg-sky-400/15"
};

const pulseIconStyles: Record<PulseTone, string> = {
  success: "bg-emerald-300/15 text-emerald-100 ring-1 ring-emerald-200/20",
  warning: "bg-amber-300/15 text-amber-100 ring-1 ring-amber-200/20",
  danger: "bg-rose-300/15 text-rose-100 ring-1 ring-rose-200/20",
  info: "bg-sky-300/15 text-sky-100 ring-1 ring-sky-200/20"
};

const attentionToneStyles: Record<PulseTone, string> = {
  success: "border-emerald-200 bg-emerald-50/70",
  warning: "border-amber-200 bg-amber-50/80",
  danger: "border-rose-200 bg-rose-50/80",
  info: "border-sky-200 bg-sky-50/80"
};

const attentionNumberStyles: Record<PulseTone, string> = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
  info: "bg-sky-100 text-sky-700"
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(value);
}

export function AdminCommandCenter() {
  const snapshot = getDashboardSnapshot();
  const notificationCenterItems = getDashboardNotificationCenterItems();
  const pulse = snapshot.schoolPulse;

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

  const pulseCards: Array<{
    label: string;
    value: string;
    detail: string;
    href: string;
    icon: LucideIcon;
    tone: PulseTone;
  }> = [
    {
      label: "Attendance status",
      value: `${pulse.attendance.rate}% present`,
      detail: `${pulse.attendance.present} present | ${pulse.attendance.absent} absent | ${pulse.attendance.late} late`,
      href: "/dashboard/attendance",
      icon: Activity,
      tone: pulse.attendance.rate >= 90 ? "success" : pulse.attendance.rate >= 85 ? "warning" : "danger"
    },
    {
      label: "Unconfirmed absences",
      value: pulse.unconfirmedAbsences.count.toString(),
      detail: pulse.unconfirmedAbsences.featuredLearner
        ? `${pulse.unconfirmedAbsences.featuredLearner} needs parent confirmation`
        : "All absences confirmed",
      href: "/dashboard/attendance",
      icon: AlertTriangle,
      tone: pulse.unconfirmedAbsences.count > 0 ? "danger" : "success"
    },
    {
      label: "Unread urgent notices",
      value: pulse.unreadUrgentNotices.count.toString(),
      detail: pulse.unreadUrgentNotices.latestTitle ?? "No urgent unread notifications",
      href: "/dashboard/notices",
      icon: Bell,
      tone: pulse.unreadUrgentNotices.count > 0 ? "warning" : "success"
    },
    {
      label: "Pending consent forms",
      value: pulse.pendingConsentForms.count.toString(),
      detail: pulse.pendingConsentForms.dueToday
        ? `${pulse.pendingConsentForms.dueToday} due today`
        : pulse.pendingConsentForms.nextDueTitle
          ? `Next: ${pulse.pendingConsentForms.nextDueTitle} | ${pulse.pendingConsentForms.nextDueDate}`
          : "No pending consent deadlines",
      href: "/dashboard/consent-forms",
      icon: FileSignature,
      tone: pulse.pendingConsentForms.dueToday > 0 ? "danger" : pulse.pendingConsentForms.count > 0 ? "warning" : "success"
    },
    {
      label: "Outstanding fees",
      value: formatCurrency(pulse.outstandingFees.amount),
      detail: `${pulse.outstandingFees.overdueAccounts} overdue accounts need finance follow-up`,
      href: "/dashboard/fees",
      icon: Wallet,
      tone: pulse.outstandingFees.overdueAccounts > 0 ? "warning" : "success"
    },
    {
      label: "Transport route status",
      value: pulse.transport.delayedRoutes > 0 ? `${pulse.transport.delayedRoutes} delayed` : "On schedule",
      detail: pulse.transport.featuredRoute ?? `${pulse.transport.activeRoutes} active routes`,
      href: "/dashboard/transport",
      icon: Route,
      tone: pulse.transport.delayedRoutes > 0 ? "warning" : "success"
    },
    {
      label: "Aftercare check-ins",
      value: pulse.aftercare.checkedIn.toString(),
      detail: `${pulse.aftercare.awaitingPickup} learners awaiting pickup`,
      href: "/dashboard/aftercare",
      icon: Users,
      tone: pulse.aftercare.awaitingPickup > 0 ? "info" : "success"
    },
    {
      label: "Incident follow-ups",
      value: pulse.incidentFollowUps.count.toString(),
      detail: pulse.incidentFollowUps.latestLearner
        ? `${pulse.incidentFollowUps.latestLearner} needs follow-up`
        : "No pending incident follow-ups",
      href: "/dashboard/incidents",
      icon: ShieldAlert,
      tone: pulse.incidentFollowUps.count > 0 ? "danger" : "success"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-pine-900 via-pine-800 to-slate-800 text-white">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/70">Welcome Back</p>
            <h1 className="mt-1 text-3xl font-semibold">{snapshot.schoolName}</h1>
            <p className="mt-2 text-sm text-white/80">{snapshot.todayLabel} | {snapshot.currentTerm}</p>
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

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]" data-demo="school-pulse">
        <Card className="overflow-hidden border-0 bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.18),_transparent_32%),linear-gradient(135deg,#07111f_0%,#10243f_54%,#0f172a_100%)] p-0 text-white shadow-2xl">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-50">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.95)]" />
                  Live school day
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">Today&apos;s School Pulse</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
                  A control-room view of attendance, parent actions, money movement, transport, aftercare, and sensitive follow-ups.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100">
                <p className="text-xs uppercase tracking-wide text-slate-300">Operational date</p>
                <p className="mt-1 font-semibold text-white">{snapshot.todayLabel}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 p-4 sm:p-6 md:grid-cols-2 2xl:grid-cols-4">
            {pulseCards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                data-demo={card.label === "Unconfirmed absences" ? "unconfirmed-absence" : undefined}
                className={`group rounded-2xl border p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl ${pulseToneStyles[card.tone]}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`rounded-2xl p-2.5 ${pulseIconStyles[card.tone]}`}>
                    <card.icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/45 transition group-hover:translate-x-0.5 group-hover:text-white" />
                </div>
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-slate-300">{card.label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{card.value}</p>
                <p className="mt-2 min-h-[40px] text-sm leading-5 text-slate-300">{card.detail}</p>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Priority queue</p>
              <h2 className="mt-2 text-xl font-semibold text-pine-900">Needs Attention</h2>
              <p className="mt-1 text-sm text-slate-500">The five items most likely to interrupt the school day.</p>
            </div>
            <StatusBadge label="Live demo" tone="warning" />
          </div>

          <div className="mt-5 space-y-3">
            {pulse.needsAttention.map((item, index) => (
              <Link
                key={item.title}
                href={item.href}
                data-demo={item.title === "Absent learner not confirmed by parent" ? "unconfirmed-absence-detail" : undefined}
                className={`group block rounded-2xl border p-3.5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg ${attentionToneStyles[item.tone]}`}
              >
                <div className="flex items-start gap-3">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${attentionNumberStyles[item.tone]}`}>
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-950">{item.title}</h3>
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-pine-800" />
                    </div>
                    <p className="mt-1 text-sm leading-5 text-slate-600">{item.detail}</p>
                    <div className="mt-3">
                      <StatusBadge label={item.metric} tone={item.tone} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </section>

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

      <ImpactAnalytics data={snapshot.impactAnalytics} />

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
