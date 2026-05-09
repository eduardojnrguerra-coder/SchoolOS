"use client";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import { learnerFullName } from "@/lib/school-relations";
import { ClipboardCheck } from "lucide-react";
import { useMemo, useState } from "react";

export function ClassesAdminView() {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(demoData.classes[0]?.id ?? null);

  const classCards = useMemo(() => {
    const latestDate = demoData.attendanceRecords[demoData.attendanceRecords.length - 1]?.date;
    return demoData.classes.map((cls) => {
      const grade = demoData.grades.find((g) => g.id === cls.gradeId);
      const teacher = demoData.teachers.find((t) => t.id === cls.teacherId);
      const teacherUser = demoData.users.find((u) => u.id === teacher?.userId);
      const learners = demoData.learners.filter((l) => l.classId === cls.id);
      const attendance = demoData.attendanceRecords.filter((a) => a.classId === cls.id && a.date === latestDate);
      const present = attendance.filter((a) => a.status === "PRESENT").length;
      const percent = learners.length ? Math.round((present / learners.length) * 100) : 0;
      return {
        classId: cls.id,
        label: `${grade?.label ?? "Unknown"} · ${cls.classCode}`,
        className: cls.className,
        teacher: teacherUser?.fullName ?? "Unassigned",
        learnerCount: learners.length,
        attendancePercent: percent
      };
    });
  }, []);

  const selected = classCards.find((c) => c.classId === selectedClassId) ?? null;
  const classLearners = demoData.learners.filter((l) => l.classId === selectedClassId);

  return (
    <div className="space-y-5">
      <PageHeader title="Classes" subtitle="Class operations, attendance health, and teacher assignment." />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {classCards.map((item) => (
          <Card key={item.classId} className={`cursor-pointer transition hover:shadow-xl ${selectedClassId === item.classId ? "ring-2 ring-pine-300" : ""}`} >
            <button className="w-full text-left" onClick={() => setSelectedClassId(item.classId)}>
              <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
              <h3 className="mt-1 text-lg font-semibold text-pine-900">{item.className}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.teacher}</p>
              <div className="mt-3 flex items-center justify-between">
                <StatusBadge label={`${item.learnerCount} learners`} tone="info" />
                <StatusBadge label={`${item.attendancePercent}% present`} tone={item.attendancePercent >= 85 ? "success" : "warning"} />
              </div>
              <div className="mt-3">
                <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50">
                  <ClipboardCheck className="h-3 w-3" /> Open Attendance Register
                </button>
              </div>
            </button>
          </Card>
        ))}
      </section>

      <Card>
        {!selected ? (
          <EmptyState title="No class selected" description="Select a class to view learner list." />
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-pine-900">{selected.className}</h3>
                <p className="text-sm text-slate-600">{selected.teacher}</p>
              </div>
              <StatusBadge label={`${selected.attendancePercent}% attendance today`} tone="info" />
            </div>
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {classLearners.map((learner) => (
                <div key={learner.id} className="rounded-xl border border-slate-200 p-3 text-sm">
                  <p className="font-medium text-slate-900">{learnerFullName(learner.firstName, learner.lastName)}</p>
                  <p className="text-xs text-slate-500">{learner.learnerCode}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
