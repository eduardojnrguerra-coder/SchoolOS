"use client";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import { childName, formatRand, getChildSnapshot, getParentAppData } from "@/src/lib/parent";
import {
  AlertTriangle,
  Bell,
  Bus,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileSignature,
  HeartHandshake,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  UserCheck,
  Wallet
} from "lucide-react";
import Link from "next/link";

type BadgeTone = "info" | "success" | "warning" | "danger";

function formatDate(value?: string) {
  if (!value) return "Today";
  return new Date(value).toLocaleDateString("en-ZA", { day: "2-digit", month: "short" });
}

function formatTime(value?: string) {
  if (!value) return "Now";
  return new Date(value).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
}

export function ParentHomeView() {
  const data = getParentAppData();
  const primaryChild = data.children[0];
  const snapshot = primaryChild ? getChildSnapshot(primaryChild.id) : undefined;
  const primaryChildName = primaryChild ? childName(primaryChild) : "Your child";
  const latestAttendance = snapshot?.latestAttendance;
  const totalBalance = data.feeAccounts.reduce((sum, account) => sum + account.currentBalance, 0);
  const urgentNotices = data.notices.filter((notice) => notice.priority === "Urgent" || notice.requiresAction);
  const pendingSubmission = data.forms.find((form) => !form.signatureText);
  const pendingConsentForm = demoData.consentForms.find((form) => form.id === pendingSubmission?.consentFormId);
  const pendingFormsCount = data.forms.filter((form) => !form.signatureText).length;
  const transportStatus = primaryChild ? data.transportStatuses.find((status) => status.learnerId === primaryChild.id) : undefined;
  const route = demoData.transportRoutes.find((item) => item.id === transportStatus?.routeId);
  const routeDelay = route && demoData.notifications.some((notification) =>
    `${notification.title} ${notification.body}`.toLowerCase().includes("delay") &&
    `${notification.title} ${notification.body}`.toLowerCase().includes(route.routeName.split(" ")[0].toLowerCase())
  );
  const aftercareSession = primaryChild ? demoData.aftercareSessions.find((session) => session.learnerId === primaryChild.id) : undefined;
  const upcomingEvent = data.events[0];
  const attendanceTone: BadgeTone = latestAttendance?.status === "PRESENT" ? "success" : latestAttendance?.status === "ABSENT" ? "danger" : "warning";
  const childSafe = latestAttendance?.status !== "ABSENT";
  const actionItems = [
    latestAttendance?.status === "ABSENT" ? { href: "/parent/notices", label: "Confirm absence", detail: `${primaryChildName} was marked absent`, tone: "danger" as const } : null,
    pendingFormsCount > 0 ? { href: "/parent/forms", label: "Sign consent form", detail: pendingConsentForm?.title ?? "Consent form pending", tone: "warning" as const } : null,
    totalBalance > 0 ? { href: "/parent/fees", label: "Review fee balance", detail: `${formatRand(totalBalance)} outstanding`, tone: "warning" as const } : null,
    urgentNotices.length > 0 ? { href: "/parent/notices", label: "Read urgent notice", detail: urgentNotices[0]?.title ?? "Urgent school notice", tone: "danger" as const } : null,
    routeDelay ? { href: "/parent/transport", label: "Check transport ETA", detail: `${route?.routeName} has a delay update`, tone: "warning" as const } : null
  ].filter(Boolean) as Array<{ href: string; label: string; detail: string; tone: BadgeTone }>;

  const timeline = [
    {
      time: "07:45",
      title: latestAttendance?.status === "ABSENT" ? "Attendance needs confirmation" : "Arrival captured",
      detail: latestAttendance?.status ? `${primaryChildName}: ${latestAttendance.status.replace("_", " ")}` : "Attendance will appear here",
      tone: attendanceTone
    },
    {
      time: route?.afternoonDepartureTime ?? "14:15",
      title: routeDelay ? "Transport delay update" : "Transport monitored",
      detail: route ? `${route.routeName} | ${routeDelay ? "running 8 minutes late" : "on schedule"}` : "No transport route linked",
      tone: routeDelay ? "warning" as const : "success" as const
    },
    {
      time: aftercareSession ? formatTime(aftercareSession.checkInAt) : "14:30",
      title: aftercareSession ? "Aftercare checked in" : "Aftercare not active",
      detail: aftercareSession ? (aftercareSession.checkOutAt ? "Collection completed" : "Awaiting pickup") : "No aftercare session today",
      tone: aftercareSession?.checkOutAt ? "success" as const : aftercareSession ? "warning" as const : "info" as const
    }
  ];

  return (
    <div className="space-y-4 pb-2" data-demo="parent-home">
      <section className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_right,_rgba(110,231,183,0.25),_transparent_32%),linear-gradient(135deg,#07111f_0%,#10243f_58%,#0f172a_100%)] p-5 text-white shadow-2xl">
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/10" />
        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-white/65">Good day, {data.guardian.fullName}</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">Today at school</h1>
            </div>
            <Link href="/parent/notices" className="relative rounded-2xl bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/15" aria-label="Open notifications">
              <Bell className="h-5 w-5" />
              {urgentNotices.length > 0 && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-amber-300 ring-2 ring-pine-900" />}
            </Link>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-300/15 text-emerald-100 ring-1 ring-white/10">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">Child status</p>
                  <h2 className="text-lg font-semibold">{primaryChildName}</h2>
                </div>
              </div>
              <StatusBadge label={childSafe ? "Safe" : "Check"} tone={childSafe ? "success" : "danger"} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <MiniAnswer icon={<UserCheck className="h-4 w-4" />} label="Present?" value={latestAttendance?.status === "PRESENT" ? "Present" : latestAttendance?.status?.replace("_", " ") ?? "Pending"} tone={attendanceTone} />
              <MiniAnswer icon={<Wallet className="h-4 w-4" />} label="Fees?" value={totalBalance > 0 ? formatRand(totalBalance) : "Clear"} tone={totalBalance > 0 ? "warning" : "success"} />
              <MiniAnswer icon={<FileSignature className="h-4 w-4" />} label="Forms?" value={pendingFormsCount > 0 ? `${pendingFormsCount} due` : "Signed"} tone={pendingFormsCount > 0 ? "warning" : "success"} />
              <MiniAnswer icon={<Bus className="h-4 w-4" />} label="Transport?" value={routeDelay ? "Delayed" : "On time"} tone={routeDelay ? "warning" : "success"} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2">
        <TopSignal href="/parent/notices" label="Urgent" value={String(urgentNotices.length)} tone={urgentNotices.length ? "danger" : "success"} />
        <TopSignal href="/parent/forms" label="To sign" value={String(pendingFormsCount)} tone={pendingFormsCount ? "warning" : "success"} />
        <TopSignal href="/parent/messages" label="Contact" value="Open" tone="info" />
      </section>

      <Card className="bg-white shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Today timeline</p>
            <h2 className="mt-1 text-lg font-semibold text-pine-900">What happened today</h2>
          </div>
          <StatusBadge label="Live demo" tone="info" />
        </div>
        <div className="space-y-3">
          {timeline.map((item, index) => (
            <TimelineItem key={`${item.time}-${item.title}`} {...item} isLast={index === timeline.length - 1} />
          ))}
        </div>
      </Card>

      <Card className="bg-white shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Action required</p>
            <h2 className="mt-1 text-lg font-semibold text-pine-900">Needs your attention</h2>
          </div>
          {actionItems.length > 0 && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">{actionItems.length}</span>}
        </div>
        <div className="mt-4 space-y-2">
          {actionItems.length ? actionItems.slice(0, 4).map((item) => (
            <ActionRow key={`${item.label}-${item.detail}`} {...item} />
          )) : (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
              Nothing urgent right now. We will alert you if anything changes.
            </div>
          )}
        </div>
      </Card>

      <section className="grid gap-3 md:grid-cols-2">
        <InfoCard
          href="/parent/notices"
          icon={<Bell className="h-5 w-5" />}
          title="Urgent notices"
          value={urgentNotices[0]?.title ?? "No urgent notices"}
          detail={urgentNotices.length ? `${urgentNotices.length} notice needs attention` : "All notices are calm"}
          tone={urgentNotices.length ? "danger" : "success"}
          badge={urgentNotices.length ? String(urgentNotices.length) : undefined}
        />
        <InfoCard
          href="/parent/fees"
          icon={<Wallet className="h-5 w-5" />}
          title="Fee balance"
          value={totalBalance > 0 ? formatRand(totalBalance) : "Paid up"}
          detail={totalBalance > 0 ? "View statement or upload proof" : "No outstanding balance"}
          tone={totalBalance > 0 ? "warning" : "success"}
        />
        <InfoCard
          href="/parent/forms"
          icon={<FileSignature className="h-5 w-5" />}
          title="Consent form due"
          value={pendingConsentForm?.title ?? "No forms due"}
          detail={pendingConsentForm ? `Due ${formatDate(pendingConsentForm.closeAt)}` : "Everything is signed"}
          tone={pendingFormsCount > 0 ? "warning" : "success"}
          badge={pendingFormsCount > 0 ? String(pendingFormsCount) : undefined}
        />
        <InfoCard
          href="/parent/transport"
          icon={<Bus className="h-5 w-5" />}
          title="Transport status"
          value={routeDelay ? "Route delayed" : "On time"}
          detail={route?.routeName ?? "No route assigned"}
          tone={routeDelay ? "warning" : "success"}
        />
        <InfoCard
          href="/parent/messages"
          icon={<HeartHandshake className="h-5 w-5" />}
          title="Aftercare status"
          value={aftercareSession ? (aftercareSession.checkOutAt ? "Collected" : "In aftercare") : "Not checked in"}
          detail={aftercareSession ? (aftercareSession.checkOutAt ? `Collected ${formatTime(aftercareSession.checkOutAt)}` : "Awaiting pickup") : "No aftercare booking today"}
          tone={aftercareSession?.checkOutAt ? "success" : aftercareSession ? "warning" : "info"}
        />
        <InfoCard
          href="/parent/calendar"
          icon={<CalendarDays className="h-5 w-5" />}
          title="Upcoming event"
          value={upcomingEvent?.title ?? "No upcoming events"}
          detail={upcomingEvent ? `${formatDate(upcomingEvent.startsAt)} | ${upcomingEvent.location}` : "Calendar is clear"}
          tone="info"
        />
      </section>

      <Link href="/parent/messages" className="flex items-center justify-between rounded-[1.5rem] bg-pine-900 p-4 text-white shadow-xl transition hover:bg-pine-800">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 p-3">
            <PhoneCall className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">Contact school</p>
            <p className="text-sm text-white/65">Admin, teacher, finance, transport, or aftercare</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-white/70" />
      </Link>

      <div className="rounded-3xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-600">
        <div className="flex items-start gap-3">
          <MessageCircle className="mt-0.5 h-5 w-5 text-pine-800" />
          <p>Recent updates stay available here even when your day gets busy. Offline-friendly caching can be enabled later for poor signal areas.</p>
        </div>
      </div>
    </div>
  );
}

function MiniAnswer({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: BadgeTone }) {
  const toneClass = tone === "success" ? "text-emerald-100" : tone === "danger" ? "text-rose-100" : tone === "warning" ? "text-amber-100" : "text-sky-100";
  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <div className={`flex items-center gap-1.5 text-xs ${toneClass}`}>{icon}{label}</div>
      <p className="mt-1 truncate text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function TopSignal({ href, label, value, tone }: { href: string; label: string; value: string; tone: BadgeTone }) {
  return (
    <Link href={href} className="relative rounded-3xl border border-slate-200 bg-white p-3 text-center shadow-sm transition hover:shadow-lg">
      {tone !== "success" && <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-amber-400" />}
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-pine-900">{value}</p>
    </Link>
  );
}

function TimelineItem({ time, title, detail, tone, isLast }: { time: string; title: string; detail: string; tone: BadgeTone; isLast: boolean }) {
  const dotClass = tone === "success" ? "bg-emerald-500" : tone === "danger" ? "bg-rose-500" : tone === "warning" ? "bg-amber-500" : "bg-sky-500";
  return (
    <div className="grid grid-cols-[52px_20px_1fr] gap-3">
      <p className="pt-0.5 text-xs font-semibold text-slate-400">{time}</p>
      <div className="flex flex-col items-center">
        <span className={`mt-1 h-3 w-3 rounded-full ${dotClass}`} />
        {!isLast && <span className="mt-1 h-full w-px bg-slate-200" />}
      </div>
      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-slate-900">{title}</p>
          <StatusBadge label={tone === "success" ? "OK" : tone === "danger" ? "Check" : tone === "warning" ? "Watch" : "Info"} tone={tone} />
        </div>
        <p className="mt-1 text-sm text-slate-600">{detail}</p>
      </div>
    </div>
  );
}

function ActionRow({ href, label, detail, tone }: { href: string; label: string; detail: string; tone: BadgeTone }) {
  const Icon = tone === "danger" ? AlertTriangle : tone === "warning" ? Clock3 : CheckCircle2;
  return (
    <Link href={href} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:bg-white hover:shadow-md">
      <div className="flex min-w-0 items-center gap-3">
        <div className="rounded-2xl bg-white p-2 text-pine-900 shadow-sm">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{label}</p>
          <p className="truncate text-sm text-slate-500">{detail}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
    </Link>
  );
}

function InfoCard({
  href,
  icon,
  title,
  value,
  detail,
  tone,
  badge
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  value: string;
  detail: string;
  tone: BadgeTone;
  badge?: string;
}) {
  return (
    <Link href={href}>
      <Card className="relative h-full bg-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
        {badge && <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">{badge}</span>}
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pine-50 text-pine-800">
          {icon}
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.16em] text-slate-400">{title}</p>
        <p className="mt-1 line-clamp-2 text-lg font-semibold leading-tight text-pine-900">{value}</p>
        <p className="mt-2 text-sm text-slate-600">{detail}</p>
        <div className="mt-4 flex items-center justify-between">
          <StatusBadge label="Open" tone={tone} />
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </div>
      </Card>
    </Link>
  );
}
