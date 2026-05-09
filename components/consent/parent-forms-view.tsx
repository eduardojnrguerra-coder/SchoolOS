"use client";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import {
  ConsentAuditEntry,
  ConsentSubmissionRecord,
  buildConsentAudit,
  defaultConsentDraft,
  getGuardianName,
  getInitialConsentSubmissions,
  getLearnerName,
  signConsentSubmission
} from "@/src/lib/consent";
import { CheckCircle2, Download, PenLine } from "lucide-react";
import { useMemo, useState } from "react";

export function ParentFormsView() {
  const [submissions, setSubmissions] = useState<ConsentSubmissionRecord[]>(getInitialConsentSubmissions(demoData.consentForms));
  const [selectedId, setSelectedId] = useState(submissions[0]?.id ?? "");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [signature, setSignature] = useState("");
  const [auditLogs, setAuditLogs] = useState<ConsentAuditEntry[]>([]);
  const [confirmation, setConfirmation] = useState("");

  const selected = submissions.find((submission) => submission.id === selectedId) ?? submissions[0];
  const selectedForm = demoData.consentForms.find((form) => form.id === selected?.formId);

  const sorted = useMemo(() => {
    return [...submissions].sort((a, b) => {
      const order = { Overdue: 0, "Not signed": 1, Sent: 2, Opened: 3, Signed: 4 };
      return order[a.status] - order[b.status];
    });
  }, [submissions]);

  function openSubmission(id: string) {
    setSelectedId(id);
    setConfirmation("");
    setSubmissions((prev) => prev.map((submission) => submission.id === id && submission.status === "Sent" ? { ...submission, status: "Opened", openedAt: new Date().toISOString() } : submission));
  }

  function submitForm() {
    if (!selected || !signature.trim()) return;
    const signed = signConsentSubmission({ submission: selected, answers, signatureText: signature });
    setSubmissions((prev) => prev.map((submission) => submission.id === selected.id ? signed : submission));
    setAuditLogs((prev) => [buildConsentAudit("CONSENT_SUBMITTED_SIGNED", `${selectedForm?.title ?? "Consent form"} signed by ${getGuardianName(selected.guardianId)}`), ...prev]);
    setConfirmation("Form submitted and signed in demo mode.");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-pine-900 p-5 text-white">
        <div className="flex items-center gap-2">
          <PenLine className="h-5 w-5" />
          <h1 className="text-xl font-semibold">Forms</h1>
        </div>
        <p className="mt-1 text-sm text-white/75">Review, sign, and keep copies of school consent forms.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-3">
          {sorted.map((submission) => {
            const form = demoData.consentForms.find((item) => item.id === submission.formId);
            return (
              <button key={submission.id} onClick={() => openSubmission(submission.id)} className="w-full text-left">
                <Card className={selected?.id === submission.id ? "ring-2 ring-pine-300" : ""}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-pine-900">{form?.title ?? "Consent form"}</p>
                      <p className="mt-1 text-sm text-slate-600">{getLearnerName(submission.learnerId)}</p>
                    </div>
                    <StatusBadge label={submission.status} tone={submission.status === "Signed" ? "success" : submission.status === "Overdue" ? "danger" : "warning"} />
                  </div>
                </Card>
              </button>
            );
          })}
        </div>

        {selected && selectedForm && (
          <Card>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-pine-900">{selectedForm.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{selectedForm.description}</p>
              </div>
              {selected.status === "Signed" && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
            </div>
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Demo legal wording only. Your school must provide its own approved consent and indemnity wording.
            </div>
            <div className="mt-4 space-y-3">
              {defaultConsentDraft.questions.map((question) => (
                <label key={question.id} className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-900">{question.label}</span>
                  {question.type === "Yes/no" || question.type === "Emergency contact confirmation" ? (
                    <select value={answers[question.id] ?? ""} onChange={(e) => setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2">
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  ) : (
                    <input value={answers[question.id] ?? ""} onChange={(e) => setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2" />
                  )}
                </label>
              ))}
            </div>
            <label className="mt-4 block text-sm">
              <span className="mb-1 block font-medium text-slate-900">Digital signature</span>
              <input value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Type your full name" className="w-full rounded-xl border border-slate-200 px-3 py-2" />
            </label>
            <button onClick={submitForm} className="mt-4 w-full rounded-xl bg-pine-900 px-4 py-3 text-sm font-medium text-white">Submit signed form</button>
            {confirmation && <p className="mt-3 text-sm text-emerald-700">{confirmation}</p>}
            {selected.status === "Signed" && (
              <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <Download className="h-4 w-4" />
                Download signed copy placeholder
              </button>
            )}
            <div className="mt-4 rounded-lg border border-slate-200 p-3 text-xs text-slate-500">
              <p>Accepted at: {selected.acceptedAt ?? "Pending"}</p>
              <p>Accepted by: {selected.acceptedByUserId ?? "Pending"}</p>
              <p>Learner: {getLearnerName(selected.learnerId)}</p>
              <p>IP placeholder: {selected.ipAddressPlaceholder ?? "Pending"}</p>
            </div>
          </Card>
        )}
      </div>

      {auditLogs.length > 0 && (
        <Card>
          <h2 className="text-lg font-semibold text-pine-900">Submission audit</h2>
          {auditLogs.map((log) => (
            <div key={log.id} className="mt-2 rounded-lg border border-slate-200 p-3 text-sm">
              <p className="font-medium">{log.action}</p>
              <p className="text-slate-600">{log.detail}</p>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
