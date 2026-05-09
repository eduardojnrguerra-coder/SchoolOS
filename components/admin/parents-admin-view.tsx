"use client";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import { learnerFullName } from "@/lib/school-relations";
import { Search, Send } from "lucide-react";
import { useMemo, useState } from "react";

export function ParentsAdminView() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(demoData.guardians[0]?.id ?? null);
  const filtered = useMemo(
    () =>
      demoData.guardians.filter(
        (g) =>
          g.fullName.toLowerCase().includes(search.toLowerCase()) ||
          g.email.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const selected = demoData.guardians.find((g) => g.id === selectedId) ?? null;
  const selectedLinks = demoData.learnerGuardianLinks.filter((l) => l.guardianId === selected?.id);
  const selectedLearners = selectedLinks
    .map((l) => demoData.learners.find((lrn) => lrn.id === l.learnerId))
    .filter(Boolean);

  return (
    <div className="space-y-5">
      <PageHeader title="Parents & Guardians" subtitle="Family contacts, linked learners, and communication readiness." />
      <Card>
        <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 md:max-w-md">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search parents..." className="w-full bg-transparent text-sm outline-none" />
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 overflow-x-auto">
          {filtered.length === 0 ? (
            <EmptyState title="No parents found" description="Try another search term." />
          ) : (
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-3 py-2">Parent/Guardian</th>
                  <th className="px-3 py-2">Linked Learners</th>
                  <th className="px-3 py-2">Contact</th>
                  <th className="px-3 py-2">Communication Preference</th>
                  <th className="px-3 py-2">Outstanding</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((parent) => {
                  const links = demoData.learnerGuardianLinks.filter((l) => l.guardianId === parent.id);
                  const learners = links
                    .map((l) => demoData.learners.find((lrn) => lrn.id === l.learnerId))
                    .filter(Boolean);
                  const formsOutstanding = Math.max(learners.length - demoData.consentSubmissions.filter((s) => learners.some((lrn) => lrn?.id === s.learnerId)).length, 0);
                  const paymentsOutstanding = learners.reduce((sum, learner) => {
                    const fee = demoData.feeAccounts.find((f) => f.learnerId === learner?.id);
                    return sum + (fee?.currentBalance ?? 0);
                  }, 0);
                  return (
                    <tr key={parent.id} className="cursor-pointer border-b border-slate-100 hover:bg-slate-50" onClick={() => setSelectedId(parent.id)}>
                      <td className="px-3 py-3">
                        <p className="font-medium text-slate-900">{parent.fullName}</p>
                        <p className="text-xs text-slate-500">{parent.relationshipToLearner}</p>
                      </td>
                      <td className="px-3 py-3">{learners.length || 0}</td>
                      <td className="px-3 py-3">{parent.email}<br />{parent.phone}</td>
                      <td className="px-3 py-3">{parent.email.includes("@") ? "Email + In-app" : "SMS"}</td>
                      <td className="px-3 py-3">
                        <p>Forms: {formsOutstanding}</p>
                        <p>Fees: R{paymentsOutstanding}</p>
                      </td>
                      <td className="px-3 py-3">
                        <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50">
                          <Send className="h-3 w-3" /> Message
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>

        <Card>
          {!selected ? (
            <EmptyState title="No profile selected" description="Select a parent to view details." />
          ) : (
            <div className="space-y-3 text-sm">
              <h3 className="text-lg font-semibold text-pine-900">{selected.fullName}</h3>
              <p className="text-slate-600">{selected.email}<br />{selected.phone}</p>
              <StatusBadge label={selected.isPrimaryContact ? "Primary Contact" : "Secondary Contact"} tone="info" />
              <p className="text-xs uppercase tracking-wide text-slate-500">Linked Learners</p>
              {selectedLearners.length ? selectedLearners.map((learner) => (
                <div key={learner?.id} className="rounded-lg border border-slate-200 p-2">
                  {learner ? learnerFullName(learner.firstName, learner.lastName) : "Unknown learner"}
                </div>
              )) : <p className="text-slate-500">No linked learners</p>}
              <p className="text-xs text-slate-500">Role-aware placeholder: messaging available for SCHOOL_ADMIN/PRINCIPAL/TEACHER.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
