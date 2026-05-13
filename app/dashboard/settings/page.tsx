import { DashboardModuleGuard } from "@/components/auth/module-guard";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import {
  Archive,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Eye,
  EyeOff,
  FileCheck2,
  FilePenLine,
  History,
  LockKeyhole,
  ShieldCheck,
  SlidersHorizontal,
  UserCog,
  UsersRound
} from "lucide-react";

type AccessLevel = "Full" | "Scoped" | "Assigned" | "Own linked" | "Hidden" | "Review";

const accessTone: Record<AccessLevel, "success" | "info" | "warning" | "danger"> = {
  Full: "success",
  Scoped: "info",
  Assigned: "info",
  "Own linked": "warning",
  Hidden: "danger",
  Review: "warning"
};

const accessMatrix = [
  {
    role: "School Admin",
    learnerInfo: "Full",
    attendance: "Full",
    fees: "Scoped",
    incidents: "Scoped",
    transport: "Full",
    aftercare: "Full"
  },
  {
    role: "Principal",
    learnerInfo: "Full",
    attendance: "Full",
    fees: "Review",
    incidents: "Full",
    transport: "Full",
    aftercare: "Full"
  },
  {
    role: "Teacher",
    learnerInfo: "Assigned",
    attendance: "Assigned",
    fees: "Hidden",
    incidents: "Scoped",
    transport: "Hidden",
    aftercare: "Hidden"
  },
  {
    role: "Finance",
    learnerInfo: "Scoped",
    attendance: "Hidden",
    fees: "Full",
    incidents: "Hidden",
    transport: "Hidden",
    aftercare: "Hidden"
  },
  {
    role: "Transport Manager",
    learnerInfo: "Scoped",
    attendance: "Hidden",
    fees: "Hidden",
    incidents: "Hidden",
    transport: "Full",
    aftercare: "Hidden"
  },
  {
    role: "Aftercare Staff",
    learnerInfo: "Scoped",
    attendance: "Review",
    fees: "Hidden",
    incidents: "Scoped",
    transport: "Hidden",
    aftercare: "Full"
  },
  {
    role: "Parent",
    learnerInfo: "Own linked",
    attendance: "Own linked",
    fees: "Own linked",
    incidents: "Review",
    transport: "Own linked",
    aftercare: "Own linked"
  }
] as const;

const permissionEditorPlaceholders = [
  "Send urgent notices",
  "Approve proof of payment",
  "View sensitive incident notes",
  "Export learner data",
  "Manage transport route status",
  "Override aftercare pickup"
];

const parentVisibilityRules = [
  "Parent users can only view learners linked to their profile.",
  "Parents see finance, consent, transport, documents, and messages only for their own linked learners.",
  "Medical and incident information is summarized for parents unless a staff member marks a parent-visible version.",
  "Contact details, custody notes, and staff-only notes stay inside authorised school roles."
];

const privacyRequests = [
  {
    title: "Parent data correction request",
    description: "Placeholder workflow for parents to request updates to contact details, linked learner information, or communication preferences.",
    icon: FilePenLine,
    status: "Workflow placeholder"
  },
  {
    title: "Consent and privacy notice acknowledgement",
    description: "Placeholder for tracking parent acknowledgement of school privacy notices, platform terms, and consent updates.",
    icon: FileCheck2,
    status: "Template needed"
  },
  {
    title: "Data export request",
    description: "Placeholder for controlled export requests with approval, identity verification, and audit trail before release.",
    icon: Download,
    status: "Admin review"
  },
  {
    title: "Data retention policy",
    description: "Placeholder for school-defined retention periods for attendance, finance, incidents, documents, and messages.",
    icon: Archive,
    status: "Policy pending"
  }
];

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function getActorName(userId: string) {
  return demoData.users.find((user) => user.id === userId)?.fullName ?? "System user";
}

export const metadata = {
  title: "Settings | Pine X School OS"
};

export default function SettingsPage() {
  return (
    <DashboardModuleGuard>
      <div className="space-y-6">
        <PageHeader
          title="Settings"
          subtitle="School profile, users, privacy controls, and launch-safe operating rules."
        />

        <Card className="overflow-hidden border-0 bg-[radial-gradient(circle_at_top_right,_rgba(20,184,166,0.22),_transparent_34%),linear-gradient(135deg,#07111f_0%,#10243f_58%,#172033_100%)] p-0 text-white shadow-2xl">
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-50">
                <ShieldCheck className="h-3.5 w-3.5" />
                POPIA-conscious architecture
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">Privacy & Access Control</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200">
                Designed to support privacy-aware operations for schools by combining role-based access, parent visibility rules, sensitive-data controls, and auditability.
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                This demo does not guarantee legal compliance. Production policies, POPIA obligations, contracts, and retention periods must be reviewed by the school and its legal advisors.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 ring-1 ring-white/10">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">Privacy posture</p>
              <div className="mt-4 space-y-3 text-sm text-slate-100">
                <div className="flex gap-3">
                  <LockKeyhole className="mt-0.5 h-4 w-4 text-emerald-200" />
                  <p>Only authorised staff can access learner information.</p>
                </div>
                <div className="flex gap-3">
                  <UsersRound className="mt-0.5 h-4 w-4 text-sky-200" />
                  <p>Parent users can only view learners linked to their profile.</p>
                </div>
                <div className="flex gap-3">
                  <EyeOff className="mt-0.5 h-4 w-4 text-amber-200" />
                  <p>Sensitive incident notes are hidden unless marked parent-visible.</p>
                </div>
                <div className="flex gap-3">
                  <History className="mt-0.5 h-4 w-4 text-emerald-200" />
                  <p>Important actions are logged for accountability.</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          <Card className="border border-slate-200 bg-white shadow-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-pine-900">Role-Based Access Matrix</h2>
                <p className="mt-1 text-sm text-slate-600">Demo access model showing how school data should be scoped by role and learner relationship.</p>
              </div>
              <StatusBadge label="RLS must enforce this" tone="warning" />
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="min-w-[860px] w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-3 pr-4 font-semibold">Role</th>
                    <th className="px-3 py-3 font-semibold">Learners</th>
                    <th className="px-3 py-3 font-semibold">Attendance</th>
                    <th className="px-3 py-3 font-semibold">Fees</th>
                    <th className="px-3 py-3 font-semibold">Incidents</th>
                    <th className="px-3 py-3 font-semibold">Transport</th>
                    <th className="px-3 py-3 font-semibold">Aftercare</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {accessMatrix.map((row) => (
                    <tr key={row.role} className="transition hover:bg-slate-50">
                      <td className="py-3 pr-4 font-medium text-slate-950">{row.role}</td>
                      <td className="px-3 py-3"><StatusBadge label={row.learnerInfo} tone={accessTone[row.learnerInfo]} /></td>
                      <td className="px-3 py-3"><StatusBadge label={row.attendance} tone={accessTone[row.attendance]} /></td>
                      <td className="px-3 py-3"><StatusBadge label={row.fees} tone={accessTone[row.fees]} /></td>
                      <td className="px-3 py-3"><StatusBadge label={row.incidents} tone={accessTone[row.incidents]} /></td>
                      <td className="px-3 py-3"><StatusBadge label={row.transport} tone={accessTone[row.transport]} /></td>
                      <td className="px-3 py-3"><StatusBadge label={row.aftercare} tone={accessTone[row.aftercare]} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="border border-slate-200 bg-white shadow-xl">
              <div className="mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-pine-800" />
                <h2 className="text-lg font-semibold text-pine-900">Staff Permission Editor</h2>
              </div>
              <p className="text-sm leading-6 text-slate-600">
                Placeholder for production permission groups. Frontend role checks are helpful for UX, but Supabase RLS must enforce access server-side.
              </p>
              <div className="mt-4 grid gap-2">
                {permissionEditorPlaceholders.map((permission, index) => (
                  <div key={permission} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <span className="text-sm font-medium text-slate-700">{permission}</span>
                    <StatusBadge label={index < 2 ? "Enabled demo" : "Needs policy"} tone={index < 2 ? "success" : "warning"} />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border border-amber-200 bg-amber-50/80">
              <div className="mb-3 flex items-center gap-2">
                <Eye className="h-5 w-5 text-amber-700" />
                <h2 className="text-lg font-semibold text-amber-950">Sensitive Incident Controls</h2>
              </div>
              <p className="text-sm leading-6 text-amber-900">
                Sensitive incident notes are internal by default. A separate parent-visible summary should be created when the school chooses to notify guardians.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge label="Internal notes hidden" tone="warning" />
                <StatusBadge label="Parent-visible summary required" tone="info" />
                <StatusBadge label="Principal review" tone="danger" />
              </div>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card className="border border-slate-200 bg-white shadow-xl">
            <div className="mb-4 flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-pine-800" />
              <h2 className="text-lg font-semibold text-pine-900">Parent Data Visibility Rules</h2>
            </div>
            <div className="space-y-3">
              {parentVisibilityRules.map((rule) => (
                <div key={rule} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <p className="text-sm leading-5 text-slate-700">{rule}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border border-slate-200 bg-white shadow-xl">
            <div className="mb-4 flex items-center gap-2">
              <History className="h-5 w-5 text-pine-800" />
              <h2 className="text-lg font-semibold text-pine-900">Audit Log Viewer</h2>
            </div>
            <div className="space-y-3">
              {demoData.auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{log.action.replaceAll("_", " ")}</p>
                      <p className="mt-1 text-xs text-slate-500">{getActorName(log.actorUserId)} | {formatDateTime(log.createdAt)}</p>
                    </div>
                    <StatusBadge label={log.entityType} tone="info" />
                  </div>
                  <p className="mt-2 text-sm leading-5 text-slate-600">{log.reason}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {privacyRequests.map((request) => (
            <Card key={request.title} className="border border-slate-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-2xl bg-pine-50 p-2.5 text-pine-800">
                  <request.icon className="h-5 w-5" />
                </div>
                <StatusBadge label={request.status} tone="warning" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-pine-900">{request.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{request.description}</p>
            </Card>
          ))}
        </section>

        <Card className="border border-emerald-200 bg-emerald-50/80">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-emerald-700" />
                <h2 className="text-lg font-semibold text-emerald-950">Production privacy reminder</h2>
              </div>
              <p className="text-sm leading-6 text-emerald-800">
                This page demonstrates privacy-aware operating patterns. Before launch, align school policies, Supabase RLS policies, parent notices, data retention rules, and staff training with professional legal guidance.
              </p>
            </div>
            <StatusBadge label="Designed to support privacy-aware operations" tone="success" />
          </div>
        </Card>
      </div>
    </DashboardModuleGuard>
  );
}
