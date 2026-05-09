"use client";

import { RegisterEditor, RegisterRow } from "@/components/attendance/register-editor";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import {
  AlertQueueItem,
  buildAlertForStatus,
  createInitialRegister,
  getLatestAttendanceDate
} from "@/lib/attendance";
import { CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";

const demoTeacherUserId = "usr_003";

export function TeacherAttendanceView() {
  const teacher = demoData.teachers.find((t) => t.userId === demoTeacherUserId);
  const teacherClasses = demoData.classes.filter((cls) => cls.teacherId === teacher?.id);
  const [selectedClassId, setSelectedClassId] = useState(teacherClasses[0]?.id ?? "");
  const [rows, setRows] = useState<RegisterRow[]>(
    createInitialRegister(getLatestAttendanceDate(), teacherClasses[0]?.id ?? "")
  );
  const [submitted, setSubmitted] = useState(false);
  const [queue, setQueue] = useState<AlertQueueItem[]>([]);
  const date = getLatestAttendanceDate();

  function openRegister(classId: string) {
    setSelectedClassId(classId);
    setRows(createInitialRegister(date, classId));
    setSubmitted(false);
  }

  function changeRow(learnerId: string, data: Partial<RegisterRow>) {
    setRows((prev) => prev.map((r) => (r.learnerId === learnerId ? { ...r, ...data } : r)));
  }

  function submitRegister() {
    const now = new Date().toISOString();
    const notifications = rows
      .filter((r) => r.status === "ABSENT" || r.status === "LATE")
      .map((row) => ({
        id: `tq_${row.learnerId}_${Date.now()}`,
        learnerId: row.learnerId,
        learnerName: row.learnerName,
        status: row.status === "ABSENT" ? ("Action required" as const) : ("Pending" as const),
        message: buildAlertForStatus({ learnerName: row.learnerName, status: row.status, date }),
        createdAt: now
      }));
    setQueue((prev) => [...notifications, ...prev].slice(0, 15));
    setSubmitted(true);
  }

  const summary = useMemo(
    () => ({
      present: rows.filter((r) => r.status === "PRESENT").length,
      absent: rows.filter((r) => r.status === "ABSENT").length,
      late: rows.filter((r) => r.status === "LATE").length
    }),
    [rows]
  );

  return (
    <div className="space-y-4">
      <PageHeader title="Teacher Attendance" subtitle="Quick, classroom-first attendance capture for today." />
      <Card>
        <p className="text-xs uppercase tracking-wide text-slate-500">Assigned Classes</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {teacherClasses.map((cls) => (
            <button
              key={cls.id}
              onClick={() => openRegister(cls.id)}
              className={`rounded-xl px-3 py-2 text-sm ${selectedClassId === cls.id ? "bg-pine-900 text-white" : "border border-slate-200 text-slate-700"}`}
            >
              {cls.className}
            </button>
          ))}
          {teacherClasses.length === 0 && <EmptyState title="No assigned classes" description="Teacher assignment placeholder in demo mode." />}
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card><p className="text-xs text-slate-500">Present</p><p className="text-2xl font-semibold text-emerald-700">{summary.present}</p></Card>
        <Card><p className="text-xs text-slate-500">Absent</p><p className="text-2xl font-semibold text-rose-700">{summary.absent}</p></Card>
        <Card><p className="text-xs text-slate-500">Late</p><p className="text-2xl font-semibold text-amber-700">{summary.late}</p></Card>
      </div>

      <RegisterEditor rows={rows} onChangeRow={changeRow} compact />

      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={submitRegister} className="rounded-xl bg-pine-900 px-4 py-2 text-sm text-white">Submit Register</button>
          {submitted && (
            <span className="inline-flex items-center gap-1 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> Register submitted successfully.
            </span>
          )}
          <StatusBadge label="Mobile-first quick entry enabled" tone="info" />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-pine-900">Notification Queue Preview</h3>
        <div className="mt-2 space-y-2 text-sm">
          {queue.length === 0 ? (
            <p className="text-slate-500">No queued notifications yet. Submit with absent or late marks.</p>
          ) : (
            queue.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 p-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{item.learnerName}</p>
                  <StatusBadge label={item.status} tone={item.status === "Action required" ? "warning" : "info"} />
                </div>
                <p className="text-slate-600">{item.message}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
