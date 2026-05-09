"use client";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import {
  getClassLabel,
  getLearnerFeeSummary,
  getLearnerTransportState,
  getPrimaryGuardianName,
  getTodayAttendanceStatus,
  learnerFullName
} from "@/lib/school-relations";
import { Learner } from "@/types/domain";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

export function LearnersAdminView() {
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [classFilter, setClassFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [learners, setLearners] = useState(demoData.learners);
  const [selectedLearnerId, setSelectedLearnerId] = useState<string | null>(demoData.learners[0]?.id ?? null);
  const [showAdd, setShowAdd] = useState(false);

  const grades = demoData.grades;
  const classes = demoData.classes;

  const filtered = useMemo(() => {
    return learners.filter((l) => {
      const full = learnerFullName(l.firstName, l.lastName).toLowerCase();
      const gradeOk = gradeFilter === "ALL" || l.gradeId === gradeFilter;
      const classOk = classFilter === "ALL" || l.classId === classFilter;
      const statusOk = statusFilter === "ALL" || l.status === statusFilter;
      const searchOk = !search || full.includes(search.toLowerCase()) || l.learnerCode.toLowerCase().includes(search.toLowerCase());
      return gradeOk && classOk && statusOk && searchOk;
    });
  }, [learners, gradeFilter, classFilter, statusFilter, search]);

  const selectedLearner = learners.find((l) => l.id === selectedLearnerId) ?? null;

  function addLearner(formData: FormData) {
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const gradeId = String(formData.get("gradeId") ?? "");
    const classId = String(formData.get("classId") ?? "");
    if (!firstName || !lastName || !gradeId || !classId) return;
    const id = `lrn_demo_${Date.now()}`;
    const newLearner: Learner = {
      id,
      schoolId: demoData.school.id,
      learnerCode: `HVA-LD${String(learners.length + 1).padStart(3, "0")}`,
      firstName,
      lastName,
      gradeId,
      classId,
      enrollmentDate: new Date().toISOString().slice(0, 10),
      status: "ACTIVE"
    };
    setLearners((prev) => [newLearner, ...prev]);
    setSelectedLearnerId(id);
    setShowAdd(false);
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Learners" subtitle="Search, filter, and manage learner operations." />

      <Card className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 lg:max-w-md">
            <Search className="h-4 w-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search learners..." className="w-full bg-transparent text-sm outline-none" />
          </div>
          <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-xl bg-pine-900 px-3 py-2 text-sm text-white">
            <Plus className="h-4 w-4" />
            Add Learner (Demo)
          </button>
        </div>

        <div className="grid gap-2 md:grid-cols-3">
          <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
            <option value="ALL">All grades</option>
            {grades.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
          </select>
          <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option value="ALL">All classes</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.className}</option>)}
          </select>
          <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 overflow-x-auto">
          {filtered.length === 0 ? (
            <EmptyState title="No learners found" description="Adjust filters or add a learner in demo mode." />
          ) : (
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-3 py-2">Learner</th>
                  <th className="px-3 py-2">Grade/Class</th>
                  <th className="px-3 py-2">Primary Parent</th>
                  <th className="px-3 py-2">Attendance</th>
                  <th className="px-3 py-2">Fee Status</th>
                  <th className="px-3 py-2">Transport</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((learner) => {
                  const fee = getLearnerFeeSummary(learner.id);
                  return (
                    <tr key={learner.id} className="cursor-pointer border-b border-slate-100 hover:bg-slate-50" onClick={() => setSelectedLearnerId(learner.id)}>
                      <td className="px-3 py-3">
                        <p className="font-medium text-slate-900">{learnerFullName(learner.firstName, learner.lastName)}</p>
                        <p className="text-xs text-slate-500">{learner.learnerCode}</p>
                      </td>
                      <td className="px-3 py-3">{getClassLabel(learner.classId)}</td>
                      <td className="px-3 py-3">{getPrimaryGuardianName(learner.id)}</td>
                      <td className="px-3 py-3"><StatusBadge label={getTodayAttendanceStatus(learner.id)} tone="info" /></td>
                      <td className="px-3 py-3"><StatusBadge label={fee.status} tone={fee.outstanding > 0 ? "warning" : "success"} /></td>
                      <td className="px-3 py-3"><StatusBadge label={getLearnerTransportState(learner.id)} tone="info" /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>

        <Card>
          {!selectedLearner ? (
            <EmptyState title="No learner selected" description="Select a learner to open profile details." />
          ) : (
            <LearnerProfile learner={selectedLearner} />
          )}
        </Card>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-semibold text-pine-900">Add Learner (Demo Mode)</h3>
            <p className="mb-4 text-sm text-slate-500">Role-aware placeholder: SCHOOL_ADMIN/PRINCIPAL only in production.</p>
            <form action={addLearner} className="grid gap-3">
              <input name="firstName" placeholder="First name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <input name="lastName" placeholder="Last name" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <select name="gradeId" className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option value="">Select grade</option>
                {grades.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
              </select>
              <select name="classId" className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option value="">Select class</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.className}</option>)}
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="rounded-xl bg-pine-900 px-3 py-2 text-sm text-white">Save Learner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function LearnerProfile({ learner }: { learner: Learner }) {
  const attendance = demoData.attendanceRecords.filter((a) => a.learnerId === learner.id).slice(-5);
  const guardians = demoData.learnerGuardianLinks
    .filter((link) => link.learnerId === learner.id)
    .map((link) => ({ ...link, guardian: demoData.guardians.find((g) => g.id === link.guardianId) }))
    .filter((g) => g.guardian);
  const fee = demoData.feeAccounts.find((f) => f.learnerId === learner.id);
  const incidents = demoData.incidentReports.filter((i) => i.learnerId === learner.id);
  const submissions = demoData.consentSubmissions.filter((s) => s.learnerId === learner.id);
  const transport = demoData.learnerTransportStatuses.find((t) => t.learnerId === learner.id);
  const aftercare = demoData.aftercareSessions.find((a) => a.learnerId === learner.id);

  return (
    <div className="space-y-4 text-sm">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Learner Profile</p>
        <h3 className="text-lg font-semibold text-pine-900">{learnerFullName(learner.firstName, learner.lastName)}</h3>
        <p className="text-xs text-slate-500">{learner.learnerCode} · {getClassLabel(learner.classId)}</p>
      </div>
      <Section title="Personal Details">{learner.status} · Enrolled {learner.enrollmentDate}</Section>
      <Section title="Parent/Guardian Links">{guardians.map((g) => g.guardian?.fullName).join(", ") || "No guardians linked"}</Section>
      <Section title="Medical Notes Summary">{learner.medicalAlertSummary ?? "No active medical notes"}</Section>
      <Section title="Attendance History">{attendance.map((a) => `${a.date}: ${a.status}`).join(" | ") || "No records"}</Section>
      <Section title="Fee Summary">{fee ? `Balance R${fee.currentBalance}` : "No fee account"}</Section>
      <Section title="Documents">Code of Conduct, Fee Policy (demo placeholders)</Section>
      <Section title="Incidents">{incidents.length ? `${incidents.length} logged` : "No incidents"}</Section>
      <Section title="Consent Form Status">{submissions.length ? `${submissions.length} submissions` : "Awaiting submissions"}</Section>
      <Section title="Transport/Aftercare Status">{transport ? transport.morningStatus : "No transport"} · {aftercare ? "Aftercare enrolled" : "No aftercare"}</Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-1 text-slate-700">{children}</p>
    </div>
  );
}
