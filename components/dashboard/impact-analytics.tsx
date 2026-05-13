"use client";

import type { getDashboardSnapshot } from "@/lib/dashboard";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Activity,
  Bell,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileSignature,
  Send,
  TrendingUp,
  UploadCloud,
  UserCheck,
  type LucideIcon
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type ImpactAnalyticsData = ReturnType<typeof getDashboardSnapshot>["impactAnalytics"];
type ImpactMetric = ImpactAnalyticsData["metrics"][number];

const metricIcons: Record<ImpactMetric["id"], LucideIcon> = {
  messagesAvoided: Send,
  formsSigned: FileSignature,
  proofsUploaded: UploadCloud,
  noticeReadRate: Bell,
  absenceConfirmations: UserCheck,
  adminHoursSaved: Clock3,
  paperFormsAvoided: ClipboardCheck,
  paymentReminders: CheckCircle2
};

function formatMetricValue(metric: ImpactMetric) {
  const value = new Intl.NumberFormat("en-ZA", {
    maximumFractionDigits: metric.suffix === "h" ? 1 : 0
  }).format(metric.value);

  return `${value}${metric.suffix ?? ""}`;
}

type TooltipValue = number | string | Array<number | string>;

function formatCompact(value: TooltipValue) {
  if (Array.isArray(value)) return value.join(" - ");
  if (typeof value !== "number") return value;

  return new Intl.NumberFormat("en-ZA", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

function formatCurrency(value: TooltipValue) {
  if (Array.isArray(value)) return value.join(" - ");
  if (typeof value !== "number") return value;

  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

function ImpactChartCard({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border border-white/10 bg-white/[0.06] p-4 text-white shadow-none ring-1 ring-white/10">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-300">{subtitle}</p>
        </div>
        <Activity className="h-4 w-4 shrink-0 text-emerald-200" />
      </div>
      {children}
    </Card>
  );
}

export function ImpactAnalytics({ data }: { data: ImpactAnalyticsData }) {
  return (
    <section
      className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_right,_rgba(20,184,166,0.28),_transparent_34%),linear-gradient(135deg,#07111f_0%,#0f2339_52%,#172033_100%)] p-4 text-white shadow-2xl sm:p-6"
      data-demo="impact-analytics"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-50">
            <TrendingUp className="h-3.5 w-3.5" />
            Impact Analytics
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">Projected admin relief, in school-day terms</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-200">{data.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge label="Demo estimate" tone="info" />
          <StatusBadge label="Not a live ROI claim" tone="warning" />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => {
          const Icon = metricIcons[metric.id];

          return (
            <div
              key={metric.id}
              className="group rounded-3xl border border-white/10 bg-white/[0.07] p-4 transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.11] hover:shadow-2xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-2xl bg-emerald-300/15 p-2.5 text-emerald-100 ring-1 ring-emerald-200/20">
                  <Icon className="h-5 w-5" />
                </div>
                <StatusBadge label="Projected" tone={metric.tone} />
              </div>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-slate-300">{metric.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{formatMetricValue(metric)}</p>
              <p className="mt-2 min-h-[56px] text-sm leading-5 text-slate-300">{metric.helper}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <ImpactChartCard title="Notice engagement" subtitle="Projected reach, reads, and unresolved action items by notice.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts.noticeEngagement}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,232,240,0.16)" />
                <XAxis dataKey="notice" tick={{ fill: "#cbd5e1", fontSize: 11 }} />
                <YAxis tick={{ fill: "#cbd5e1", fontSize: 11 }} />
                <Tooltip formatter={formatCompact} cursor={{ fill: "rgba(255,255,255,0.06)" }} />
                <Legend />
                <Bar dataKey="sent" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                <Bar dataKey="read" fill="#34d399" radius={[8, 8, 0, 0]} />
                <Bar dataKey="actionRequired" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ImpactChartCard>

        <ImpactChartCard title="Forms signed over time" subtitle="Cumulative digital consent progress from current demo submissions.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.charts.formsSignedOverTime}>
                <defs>
                  <linearGradient id="formsSignedGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.58} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,232,240,0.16)" />
                <XAxis dataKey="date" tick={{ fill: "#cbd5e1", fontSize: 11 }} />
                <YAxis tick={{ fill: "#cbd5e1", fontSize: 11 }} />
                <Tooltip formatter={formatCompact} />
                <Area type="monotone" dataKey="signed" stroke="#34d399" strokeWidth={2.5} fill="url(#formsSignedGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ImpactChartCard>

        <ImpactChartCard title="Fee collection progress" subtitle="Paid and outstanding balances from demo fee accounts and payments.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts.feeCollectionProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,232,240,0.16)" />
                <XAxis dataKey="month" tick={{ fill: "#cbd5e1", fontSize: 11 }} />
                <YAxis tick={{ fill: "#cbd5e1", fontSize: 11 }} />
                <Tooltip formatter={formatCurrency} cursor={{ fill: "rgba(255,255,255,0.06)" }} />
                <Legend />
                <Bar dataKey="paid" stackId="fees" fill="#2dd4bf" radius={[8, 8, 0, 0]} />
                <Bar dataKey="outstanding" stackId="fees" fill="#64748b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ImpactChartCard>

        <ImpactChartCard title="Parent app activity" subtitle="High-signal actions that would otherwise become calls, WhatsApps, or paper admin.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.charts.parentAppActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,232,240,0.16)" />
                <XAxis dataKey="activity" tick={{ fill: "#cbd5e1", fontSize: 11 }} />
                <YAxis tick={{ fill: "#cbd5e1", fontSize: 11 }} />
                <Tooltip formatter={formatCompact} />
                <Line type="monotone" dataKey="count" stroke="#fbbf24" strokeWidth={3} dot={{ r: 4, fill: "#fbbf24" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ImpactChartCard>
      </div>
    </section>
  );
}
