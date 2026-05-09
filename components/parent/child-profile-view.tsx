"use client";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { childName, formatRand, getChildSnapshot, getParentAppData } from "@/src/lib/parent";
import { FileText, Signature, StickyNote } from "lucide-react";
import { useState } from "react";

export function ChildProfileView() {
  const data = getParentAppData();
  const [selectedChildId, setSelectedChildId] = useState(data.children[0]?.id ?? "");
  const selectedChild = data.children.find((child) => child?.id === selectedChildId) ?? data.children[0];
  const snapshot = selectedChild ? getChildSnapshot(selectedChild.id) : null;
  const docs = data.documents.slice(0, 3);
  const forms = data.forms.filter((form) => form.learnerId === selectedChild?.id);

  if (!selectedChild || !snapshot) return <p className="text-sm text-slate-500">No linked children found.</p>;

  const presentCount = snapshot.attendance.filter((item) => item.status === "PRESENT").length;
  const attendancePercent = snapshot.attendance.length ? Math.round((presentCount / snapshot.attendance.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-pine-900 p-5 text-white">
        <p className="text-sm text-white/70">Child profile</p>
        <h1 className="mt-1 text-2xl font-semibold">{childName(selectedChild)}</h1>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {data.children.map((child) => child && (
          <button key={child.id} onClick={() => setSelectedChildId(child.id)} className={`shrink-0 rounded-full px-3 py-2 text-xs ${selectedChildId === child.id ? "bg-pine-900 text-white" : "bg-white text-slate-600"}`}>
            {child.firstName}
          </button>
        ))}
      </div>
      <section className="grid gap-3 md:grid-cols-3">
        <Metric label="Attendance" value={`${attendancePercent}%`} />
        <Metric label="Fee status" value={snapshot.fee ? formatRand(snapshot.fee.currentBalance) : "No account"} tone={snapshot.fee && snapshot.fee.currentBalance > 0 ? "warning" : "success"} />
        <Metric label="Transport" value={snapshot.transport?.morningStatus ?? "No route"} />
      </section>
      <Card>
        <h2 className="mb-3 font-semibold text-pine-900">Documents</h2>
        {docs.map((document) => <Line key={document.id} icon={<FileText className="h-4 w-4" />} title={document.title} meta={document.displayCategory} />)}
      </Card>
      <Card>
        <h2 className="mb-3 font-semibold text-pine-900">Forms</h2>
        {forms.length ? forms.map((form) => <Line key={form.id} icon={<Signature className="h-4 w-4" />} title={form.response ?? "Consent form"} meta={form.signatureText ? "Signed" : "Pending"} />) : <p className="text-sm text-slate-500">No forms for this child right now.</p>}
      </Card>
      <Card>
        <h2 className="mb-3 font-semibold text-pine-900">Recent notes</h2>
        <Line icon={<StickyNote className="h-4 w-4" />} title="No urgent staff notes" meta="Today" />
      </Card>
    </div>
  );
}

function Metric({ label, value, tone = "info" }: { label: string; value: string; tone?: "info" | "success" | "warning" }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-pine-900">{value}</p>
      <StatusBadge label="Current" tone={tone} />
    </Card>
  );
}

function Line({ icon, title, meta }: { icon: React.ReactNode; title: string; meta: string }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 text-sm">
      <div className="flex min-w-0 items-center gap-2 text-slate-900">{icon}<span className="truncate">{title}</span></div>
      <span className="shrink-0 text-slate-500">{meta}</span>
    </div>
  );
}
