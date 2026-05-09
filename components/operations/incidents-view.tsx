"use client";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import {
  IncidentDraft,
  OperationalAuditEntry,
  buildOperationalAudit,
  createIncidentFromDraft,
  defaultIncidentDraft,
  incidentParentPreview,
  learnerName,
  staffName
} from "@/src/lib/operations/incidents";
import { IncidentReport } from "@/types/domain";
import { AlertTriangle, Plus, ShieldAlert } from "lucide-react";
import { useState } from "react";

export function IncidentsView() {
  const [incidents, setIncidents] = useState<IncidentReport[]>(demoData.incidentReports);
  const [draft, setDraft] = useState<IncidentDraft>(defaultIncidentDraft);
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [selectedId, setSelectedId] = useState(demoData.incidentReports[0]?.id ?? "");
  const [auditLogs, setAuditLogs] = useState<OperationalAuditEntry[]>([]);

  const filtered = incidents.filter((incident) => severityFilter === "ALL" || incident.severity === severityFilter);
  const selected = incidents.find((incident) => incident.id === selectedId) ?? incidents[0];

  function updateDraft(data: Partial<IncidentDraft>) {
    setDraft((prev) => ({ ...prev, ...data }));
  }

  function logIncident() {
    const incident = createIncidentFromDraft(draft);
    setIncidents((prev) => [incident, ...prev]);
    setSelectedId(incident.id);
    setAuditLogs((prev) => [buildOperationalAudit("INCIDENT_LOGGED", `${learnerName(draft.learnerId)} incident logged by ${staffName(draft.staffUserId)}`), ...prev]);
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Incidents" subtitle="Record sensitive incidents with role-aware visibility placeholders." />
      <Card className="border-amber-200 bg-amber-50">
        <div className="flex gap-3 text-sm text-amber-900">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          Sensitive data warning: incident detail is for authorized staff only. Parent portal visibility should require explicit parent-visible flags and policy review.
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h2 className="text-lg font-semibold text-pine-900">Log incident</h2>
          <div className="mt-4 grid gap-3">
            <select value={draft.learnerId} onChange={(e) => updateDraft({ learnerId: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
              {demoData.learners.map((learner) => <option key={learner.id} value={learner.id}>{learner.firstName} {learner.lastName}</option>)}
            </select>
            <div className="grid gap-3 md:grid-cols-2">
              <select value={draft.type} onChange={(e) => updateDraft({ type: e.target.value as IncidentDraft["type"] })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
                {["injury", "behaviour", "sick bay", "bullying", "medication", "other"].map((type) => <option key={type}>{type}</option>)}
              </select>
              <select value={draft.severity} onChange={(e) => updateDraft({ severity: e.target.value as IncidentDraft["severity"] })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
                {["low", "medium", "high"].map((severity) => <option key={severity}>{severity}</option>)}
              </select>
            </div>
            <select value={draft.staffUserId} onChange={(e) => updateDraft({ staffUserId: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
              {demoData.users.map((user) => <option key={user.id} value={user.id}>{user.fullName}</option>)}
            </select>
            <textarea value={draft.notes} onChange={(e) => updateDraft({ notes: e.target.value })} rows={4} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Notes" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.parentNotified} onChange={(e) => updateDraft({ parentNotified: e.target.checked })} /> Parent notified</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.followUpRequired} onChange={(e) => updateDraft({ followUpRequired: e.target.checked })} /> Follow-up required</label>
            <button onClick={logIncident} className="inline-flex w-fit items-center gap-2 rounded-xl bg-pine-900 px-3 py-2 text-sm text-white"><Plus className="h-4 w-4" /> Log incident</button>
          </div>
          <div className="mt-4 rounded-xl border border-slate-200 p-3 text-sm">
            <p className="font-medium text-slate-900">Parent notification preview</p>
            <p className="mt-1 text-slate-600">{incidentParentPreview(draft)}</p>
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-pine-900">Incident list</h2>
            <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option value="ALL">All severity</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div className="space-y-2">
            {filtered.map((incident) => (
              <button key={incident.id} onClick={() => setSelectedId(incident.id)} className="w-full text-left">
                <div className={`rounded-lg border p-3 ${selectedId === incident.id ? "border-pine-300 bg-pine-50" : "border-slate-200"}`}>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900">{learnerName(incident.learnerId)}</p>
                    <StatusBadge label={incident.severity} tone={incident.severity === "HIGH" ? "danger" : incident.severity === "MEDIUM" ? "warning" : "info"} />
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{incident.summary}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {selected && (
        <Card>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <div>
              <h2 className="text-lg font-semibold text-pine-900">Incident detail</h2>
              <p className="mt-2 text-sm text-slate-700">{selected.summary}</p>
              <p className="mt-1 text-sm text-slate-600">Learner: {learnerName(selected.learnerId)}</p>
              <p className="text-sm text-slate-600">Staff: {staffName(selected.reportedByUserId)}</p>
              <p className="text-sm text-slate-600">Action: {selected.actionTaken}</p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <h2 className="text-lg font-semibold text-pine-900">Incident audit log</h2>
        {auditLogs.length === 0 ? <p className="mt-2 text-sm text-slate-500">Audit entries appear when incidents are logged.</p> : auditLogs.map((log) => (
          <div key={log.id} className="mt-2 rounded-lg border border-slate-200 p-3 text-sm">
            <p className="font-medium">{log.action}</p>
            <p className="text-slate-600">{log.detail}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}
