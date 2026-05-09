"use client";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { childName, formatRand, getChildSnapshot, getParentAppData } from "@/src/lib/parent";
import { Bell, Bus, CalendarDays, FileText, ShieldCheck, Signature, Wallet } from "lucide-react";
import Link from "next/link";

export function ParentHomeView() {
  const data = getParentAppData();
  const totalBalance = data.feeAccounts.reduce((sum, account) => sum + account.currentBalance, 0);
  const urgentNotices = data.notices.filter((notice) => notice.priority === "Urgent" || notice.requiresAction);
  const unsignedForms = data.forms.filter((form) => !form.signatureText).length;
  const nextEvents = data.events.slice(0, 3);
  const recentDocuments = data.documents.slice(0, 3);

  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-pine-900 p-5 text-white">
        <p className="text-sm text-white/70">Good day, {data.guardian.fullName}</p>
        <h1 className="mt-2 text-2xl font-semibold">Everything important, in one place.</h1>
        <div className="mt-4 rounded-2xl bg-white/10 p-3 text-sm">
          <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Today looks under control</div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        {data.children.map((child) => {
          if (!child) return null;
          const snapshot = getChildSnapshot(child.id);
          return (
            <Link key={child.id} href="/parent/children">
              <Card className="transition hover:shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Linked child</p>
                    <h2 className="mt-1 text-lg font-semibold text-pine-900">{childName(child)}</h2>
                    <p className="text-sm text-slate-600">Attendance: {snapshot.latestAttendance?.status ?? "No update"}</p>
                  </div>
                  <StatusBadge label="Safe" tone="success" />
                </div>
              </Card>
            </Link>
          );
        })}
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <QuickMetric href="/parent/fees" icon={<Wallet className="h-4 w-4" />} label="Balance" value={formatRand(totalBalance)} tone={totalBalance > 0 ? "warning" : "success"} />
        <QuickMetric href="/parent/forms" icon={<Signature className="h-4 w-4" />} label="Forms" value={`${unsignedForms} pending`} tone={unsignedForms > 0 ? "warning" : "success"} />
        <QuickMetric href="/parent/transport" icon={<Bus className="h-4 w-4" />} label="Transport" value={data.transportStatuses[0]?.morningStatus ?? "No route"} tone="info" />
        <QuickMetric href="/parent/notices" icon={<Bell className="h-4 w-4" />} label="Alerts" value={`${urgentNotices.length} urgent`} tone={urgentNotices.length ? "warning" : "success"} />
      </section>

      <AppSection title="Today and next" href="/parent/calendar" icon={<CalendarDays className="h-4 w-4" />}>
        {nextEvents.map((event) => (
          <Row key={event.id} title={event.title} meta={new Date(event.startsAt).toLocaleDateString("en-ZA")} />
        ))}
      </AppSection>

      <AppSection title="Urgent notices" href="/parent/notices" icon={<Bell className="h-4 w-4" />}>
        {urgentNotices.length ? urgentNotices.map((notice) => <Row key={notice.id} title={notice.title} meta={notice.priority} />) : <p className="text-sm text-slate-500">No urgent notices right now.</p>}
      </AppSection>

      <AppSection title="Recent documents" href="/parent/documents" icon={<FileText className="h-4 w-4" />}>
        {recentDocuments.map((document) => <Row key={document.id} title={document.title} meta={document.displayCategory} />)}
      </AppSection>

      <Card className="bg-white">
        <p className="font-semibold text-pine-900">Install app placeholder</p>
        <p className="mt-1 text-sm text-slate-600">Add Pine X School OS to your home screen when PWA install is enabled.</p>
      </Card>
      <Card className="bg-slate-50">
        <p className="font-semibold text-pine-900">Offline-friendly placeholder</p>
        <p className="mt-1 text-sm text-slate-600">Recent notices and documents can be cached later for poor signal days.</p>
      </Card>
    </div>
  );
}

function QuickMetric({ href, icon, label, value, tone }: { href: string; icon: React.ReactNode; label: string; value: string; tone: "info" | "success" | "warning" }) {
  return (
    <Link href={href}>
      <Card className="h-full transition hover:shadow-xl">
        <div className="text-pine-800">{icon}</div>
        <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 font-semibold text-pine-900">{value}</p>
        <div className="mt-2"><StatusBadge label="Open" tone={tone} /></div>
      </Card>
    </Link>
  );
}

function AppSection({ title, href, icon, children }: { title: string; href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-pine-900">{icon}{title}</div>
        <Link href={href} className="text-xs text-pine-800">View</Link>
      </div>
      <div className="space-y-2">{children}</div>
    </Card>
  );
}

function Row({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="flex justify-between gap-3 rounded-xl border border-slate-200 p-3 text-sm">
      <span className="font-medium text-slate-900">{title}</span>
      <span className="shrink-0 text-slate-500">{meta}</span>
    </div>
  );
}
