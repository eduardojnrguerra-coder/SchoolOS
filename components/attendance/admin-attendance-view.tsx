"use client";

import { RegisterEditor, RegisterRow } from "@/components/attendance/register-editor";
import { ParentAppPreview } from "@/components/parent/parent-app-preview";
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
import { salesDemoActionEventName, SalesDemoActionPayload } from "@/lib/sales-demo";
import { useEffect, useMemo, useState } from "react";

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
  const [selectedPreviewLearnerId, setSelectedPreviewLearnerId] = useState("");

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

  useEffect(() => {
    function onDemoAction(event: Event) {
      const { type } = (event as CustomEvent<SalesDemoActionPayload>).detail ?? {};
      if (type === "RESET_DEMO") {
        setRegisterRows(createInitialRegister(selectedDate, selectedClassId));
        setSavedMessage("");
        setAuditTrail([]);
        return;
      }
      if (type !== "MARK_LEARNER_ABSENT") return;
      const target = registerRows[0];
      if (!target) return;
      const now = new Date().toISOString();
      const message = buildAlertForStatus({ learnerName: target.learnerName, status: "ABSENT", date: selectedDate });
      setRegisterRows((prev) =>
        prev.map((row, index) => index === 0 ? { ...row, status: "ABSENT", note: "Demo absence: awaiting parent confirmation." } : row)
      );
      setSelectedPreviewLearnerId(target.learnerId);
      setAlertQueue((prev) => [{
        id: `demo_absent_${Date.now()}`,
        learnerId: target.learnerId,
        learnerName: target.learnerName,
        status: "Action required" as const,
        message,
        createdAt: now
      }, ...prev].slice(0, 20));
      setAuditTrail((prev) => [{
        id: `audit_demo_${Date.now()}`,
        action: "DEMO_ATTENDANCE_ABSENCE_MARKED",
        detail: `${target.learnerName} marked absent for the 5-minute school demo.`,
        at: now
      }, ...prev].slice(0, 12));
      setSavedMessage(`${target.learnerName} marked absent and parent alert preview generated.`);
    }

    window.addEventListener(salesDemoActionEventName, onDemoAction);
    return () => window.removeEventListener(salesDemoActionEventName, onDemoAction);
  }, [registerRows, selectedClassId, selectedDate]);

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
  const alertPreviewRows = registerRows.filter((r) => r.status === "ABSENT" || r.status === "LATE");
  const selectedPreviewRow = alertPreviewRows.find((row) => row.learnerId === selectedPreviewLearnerId) ?? alertPreviewRows[0];

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

      <div data-demo="attendance-register">
        <RegisterEditor rows={registerRows} onChangeRow={onChangeRow} />
      </div>

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
          {selectedPreviewRow ? (
            <div className="mt-3 space-y-3">
              <div className="flex flex-wrap gap-2">
                {alertPreviewRows.map((row) => (
                  <button
                    key={row.learnerId}
                    onClick={() => setSelectedPreviewLearnerId(row.learnerId)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      selectedPreviewRow.learnerId === row.learnerId ? "border-pine-300 bg-pine-50 text-pine-900" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {row.learnerName}
                  </button>
                ))}
              </div>
              <ParentAppPreview
                action={selectedPreviewRow.status === "LATE" ? "ATTENDANCE_LATE" : "ABSENCE_ALERT"}
                learnerName={selectedPreviewRow.learnerName}
                title={selectedPreviewRow.status === "LATE" ? "Late arrival recorded" : "Absence confirmation needed"}
                message={buildAlertForStatus({ learnerName: selectedPreviewRow.learnerName, status: selectedPreviewRow.status, date: selectedDate })}
                timestamp={`${selectedDate}T${selectedPreviewRow.status === "LATE" ? "08:37" : "08:22"}:00+02:00`}
                meta={[
                  { label: "Register", value: selectedPreviewRow.status.replace("_", " "), tone: selectedPreviewRow.status === "ABSENT" ? "danger" : "warning" },
                  { label: "Date", value: selectedDate, tone: "info" }
                ]}
              />
            </div>
          ) : (
            <div className="mt-3">
              <EmptyState title="No alerts to preview" description="Alerts appear when learners are marked absent or late." />
            </div>
          )}
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
