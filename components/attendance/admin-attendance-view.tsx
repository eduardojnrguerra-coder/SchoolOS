"use client";

import { RegisterEditor, RegisterRow } from "@/components/attendance/register-editor";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import {
  AlertQueueItem,
  AttendanceMark,
  buildAlertForStatus,
  createInitialRegister,
  getLatestAttendanceDate
} from "@/lib/attendance";
import { useMemo, useState } from "react";

type AuditItem = { id: string; action: string; detail: string; at: string };

export function AdminAttendanceView() {
  const [selectedDate, setSelectedDate] = useState(getLatestAttendanceDate());
  const [selectedClassId, setSelectedClassId] = useState(demoData.classes[0]?.id ?? "");
  const [savedRegisters, setSavedRegisters] = useState<Record<string, RegisterRow[]>>({});
  const [registerRows, setRegisterRows] = useState<RegisterRow[]>(
    createInitialRegister(selectedDate, demoData.classes[0]?.id ?? "")
  );
  const [alertQueue, setAlertQueue] = useState<AlertQueueItem[]>([
    {
      id: "seed_queue_sent",
      learnerId: "demo_sent",
      learnerName: "Demo learner",
      status: "Sent",
      message: "Absence alert sent to primary guardian.",
      createdAt: new Date().toISOString()
    },
    {
      id: "seed_queue_read",
      learnerId: "demo_read",
      learnerName: "Demo learner",
      status: "Read",
      message: "Late arrival alert was opened in the parent portal.",
      createdAt: new Date().toISOString()
    }
  ]);
  const [auditTrail, setAuditTrail] = useState<AuditItem[]>([]);
  const [savedMessage, setSavedMessage] = useState("");

  function registerKey(date: string, classId: string) {
    return `${date}:${classId}`;
  }

  function refreshRegister(date: string, classId: string) {
    setRegisterRows(savedRegisters[registerKey(date, classId)] ?? createInitialRegister(date, classId));
    setSavedMessage("");
  }

  function onChangeRow(learnerId: string, data: Partial<RegisterRow>) {
    setRegisterRows((prev) => prev.map((row) => (row.learnerId === learnerId ? { ...row, ...data } : row)));
  }

  function markAllPresent() {
    setRegisterRows((prev) => prev.map((row) => ({ ...row, status: "PRESENT" })));
  }

  function saveRegister() {
    const now = new Date().toISOString();
    const className = demoData.classes.find((c) => c.id === selectedClassId)?.className ?? "Class";
    const newAudit: AuditItem = {
      id: `audit_${Date.now()}`,
      action: "ATTENDANCE_REGISTER_SAVED",
      detail: `${className} register saved for ${selectedDate}`,
      at: now
    };

    const queueItems: AlertQueueItem[] = [];
    for (const row of registerRows) {
      const alertText = buildAlertForStatus({
        learnerName: row.learnerName,
        status: row.status as AttendanceMark,
        date: selectedDate
      });
      if (alertText) {
        queueItems.push({
          id: `alert_${row.learnerId}_${Date.now()}`,
          learnerId: row.learnerId,
          learnerName: row.learnerName,
          status: row.status === "ABSENT" ? "Action required" : "Pending",
          message: alertText,
          createdAt: now
        });
      }
    }
    setSavedRegisters((prev) => ({ ...prev, [registerKey(selectedDate, selectedClassId)]: registerRows }));
    setAlertQueue((prev) => [...queueItems, ...prev].slice(0, 20));
    setAuditTrail((prev) => [newAudit, ...prev].slice(0, 12));
    setSavedMessage(`Saved ${registerRows.length} attendance rows for ${className}.`);
  }

  const dailySummary = useMemo(() => {
    const total = registerRows.length;
    const present = registerRows.filter((r) => r.status === "PRESENT").length;
    const absent = registerRows.filter((r) => r.status === "ABSENT").length;
    const late = registerRows.filter((r) => r.status === "LATE").length;
    const leftEarly = registerRows.filter((r) => r.status === "LEFT_EARLY").length;
    const sickBay = registerRows.filter((r) => r.status === "SICK_BAY").length;
    const excused = registerRows.filter((r) => r.status === "EXCUSED").length;
    return { total, present, absent, late, leftEarly, sickBay, excused };
  }, [registerRows]);

  const absentLearners = registerRows.filter((r) => r.status === "ABSENT");
  const lateLearners = registerRows.filter((r) => r.status === "LATE");

  return (
    <div className="space-y-5">
      <PageHeader title="Attendance Oversight" subtitle="Manage class registers, preview parent alerts, and track attendance changes." />
      <Card className="grid gap-3 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Date</label>
          <input type="date" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); refreshRegister(e.target.value, selectedClassId); }} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Class</label>
          <select value={selectedClassId} onChange={(e) => { setSelectedClassId(e.target.value); refreshRegister(selectedDate, e.target.value); }} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
            {demoData.classes.map((cls) => <option key={cls.id} value={cls.id}>{cls.className}</option>)}
          </select>
        </div>
        <div className="flex items-end gap-2 lg:col-span-2">
          <button onClick={markAllPresent} className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">Bulk Mark Present</button>
          <button onClick={saveRegister} className="rounded-xl bg-pine-900 px-3 py-2 text-sm text-white">Save Attendance</button>
          {savedMessage && <span className="text-xs text-emerald-700">{savedMessage}</span>}
        </div>
      </Card>

      <RegisterEditor rows={registerRows} onChangeRow={onChangeRow} />

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <h3 className="text-lg font-semibold text-pine-900">Daily Summary</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <Summary label="Total" value={dailySummary.total} />
            <Summary label="Present" value={dailySummary.present} />
            <Summary label="Absent" value={dailySummary.absent} />
            <Summary label="Late" value={dailySummary.late} />
            <Summary label="Left early" value={dailySummary.leftEarly} />
            <Summary label="Sick bay" value={dailySummary.sickBay} />
            <Summary label="Excused" value={dailySummary.excused} />
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-pine-900">Absent Learners</h3>
          <ListBlock items={absentLearners.map((l) => l.learnerName)} emptyLabel="No absences for this register." />
          <h3 className="mt-4 text-lg font-semibold text-pine-900">Late Learners</h3>
          <ListBlock items={lateLearners.map((l) => l.learnerName)} emptyLabel="No late learners for this register." />
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-pine-900">Parent Alert Preview</h3>
          <div className="mt-3 space-y-2">
            {registerRows
              .filter((r) => r.status === "ABSENT" || r.status === "LATE")
              .map((row) => (
                <div key={row.learnerId} className="rounded-xl border border-slate-200 p-3 text-sm">
                  <p className="font-medium text-slate-900">{row.learnerName}</p>
                  <p className="mt-1 text-slate-600">{buildAlertForStatus({ learnerName: row.learnerName, status: row.status, date: selectedDate })}</p>
                </div>
              ))}
            {!registerRows.some((r) => r.status === "ABSENT" || r.status === "LATE") && (
              <EmptyState title="No alerts to preview" description="Alerts appear when learners are marked absent or late." />
            )}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold text-pine-900">Notification Queue (Demo)</h3>
          <div className="mt-3 space-y-2 text-sm">
            {alertQueue.length === 0 ? (
              <EmptyState title="Queue is empty" description="Save a register with absent or late learners to generate notifications." />
            ) : (
              alertQueue.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900">{item.learnerName}</p>
                    <StatusBadge label={item.status} tone={item.status === "Action required" ? "warning" : item.status === "Read" ? "success" : "info"} />
                  </div>
                  <p className="mt-1 text-slate-600">{item.message}</p>
                </div>
              ))
            )}
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-pine-900">Attendance Audit Trail (Demo)</h3>
          <div className="mt-3 space-y-2 text-sm">
            {auditTrail.length === 0 ? (
              <EmptyState title="No audit entries" description="Audit entries are created when attendance changes are saved." />
            ) : (
              auditTrail.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                  <p className="font-medium text-slate-900">{item.action}</p>
                  <p className="text-slate-600">{item.detail}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 p-2">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-pine-900">{value}</p>
    </div>
  );
}

function ListBlock({ items, emptyLabel }: { items: string[]; emptyLabel: string }) {
  if (items.length === 0) return <p className="mt-2 text-sm text-slate-500">{emptyLabel}</p>;
  return (
    <ul className="mt-2 space-y-1 text-sm">
      {items.map((item) => (
        <li key={item} className="rounded-lg border border-slate-200 px-2 py-1">{item}</li>
      ))}
    </ul>
  );
}
