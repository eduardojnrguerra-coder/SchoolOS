"use client";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { ParentAppPreview } from "@/components/parent/parent-app-preview";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import {
  ConsentAuditEntry,
  ConsentFormDraft,
  ConsentQuestionType,
  ConsentSubmissionRecord,
  buildConsentAudit,
  createConsentFormFromDraft,
  createSubmissionTargets,
  defaultConsentDraft,
  demoLegalPlaceholder,
  getConsentStatusCounts,
  getGuardianName,
  getInitialConsentSubmissions,
  getLearnerName
} from "@/src/lib/consent";
import { ConsentForm } from "@/types/domain";
import { Bell, Download, Plus, Send } from "lucide-react";
import { salesDemoActionEventName, SalesDemoActionPayload } from "@/lib/sales-demo";
import { useCallback, useEffect, useMemo, useState } from "react";

const questionTypes: ConsentQuestionType[] = ["Short answer", "Yes/no", "Checkbox", "Multiple choice", "Emergency contact confirmation"];

export function AdminConsentView() {
  const [forms, setForms] = useState<ConsentForm[]>(demoData.consentForms);
  const [submissions, setSubmissions] = useState<ConsentSubmissionRecord[]>(getInitialConsentSubmissions(demoData.consentForms));
  const [selectedFormId, setSelectedFormId] = useState(demoData.consentForms[0]?.id ?? "");
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState<ConsentFormDraft>(defaultConsentDraft);
  const [auditLogs, setAuditLogs] = useState<ConsentAuditEntry[]>([]);
  const [notice, setNotice] = useState("");

  const selectedForm = forms.find((form) => form.id === selectedFormId) ?? forms[0];
  const formSubmissions = submissions.filter((submission) => submission.formId === selectedForm?.id);
  const counts = useMemo(() => getConsentStatusCounts(formSubmissions), [formSubmissions]);
  const selectedSubmission = submissions.find((submission) => submission.id === selectedSubmissionId) ?? formSubmissions[0];

  function updateDraft(data: Partial<ConsentFormDraft>) {
    setDraft((prev) => ({ ...prev, ...data }));
  }

  function updateQuestion(index: number, data: Partial<ConsentFormDraft["questions"][number]>) {
    setDraft((prev) => ({
      ...prev,
      questions: prev.questions.map((question, qIndex) => qIndex === index ? { ...question, ...data } : question)
    }));
  }

  function addQuestion() {
    setDraft((prev) => ({
      ...prev,
      questions: [...prev.questions, { id: `q_${Date.now()}`, label: "New question", type: "Short answer", required: false }]
    }));
  }

  const createFormFromDraft = useCallback((nextDraft: ConsentFormDraft) => {
    const form = createConsentFormFromDraft(nextDraft);
    const targets = createSubmissionTargets(form.id, nextDraft);
    setForms((prev) => [form, ...prev]);
    setSubmissions((prev) => [...targets, ...prev]);
    setSelectedFormId(form.id);
    setAuditLogs((prev) => [buildConsentAudit("CONSENT_FORM_CREATED", `${form.title} sent to ${targets.length} recipients`), ...prev]);
    setShowCreate(false);
    setNotice("Consent form created and queued in demo mode.");
  }, []);

  function createForm() {
    createFormFromDraft(draft);
  }

  function sendReminder() {
    if (!selectedForm) return;
    const pending = formSubmissions.filter((submission) => submission.status !== "Signed").length;
    setAuditLogs((prev) => [buildConsentAudit("CONSENT_REMINDER_SENT", `${selectedForm.title}: ${pending} reminders queued`), ...prev]);
    setNotice(`Reminder queued for ${pending} unsigned submissions. No real message was sent.`);
  }

  useEffect(() => {
    function onDemoAction(event: Event) {
      const { type } = (event as CustomEvent<SalesDemoActionPayload>).detail ?? {};
      if (type === "RESET_DEMO") {
        setForms(demoData.consentForms);
        setSubmissions(getInitialConsentSubmissions(demoData.consentForms));
        setSelectedFormId(demoData.consentForms[0]?.id ?? "");
        setAuditLogs([]);
        setNotice("");
        setDraft(defaultConsentDraft);
        return;
      }
      if (type !== "CREATE_OUTING_CONSENT_FORM") return;
      const outingDraft: ConsentFormDraft = {
        ...defaultConsentDraft,
        title: "Grade 3 Nature Walk Consent",
        description: "Permission request for the Grade 3 coastal nature walk and packed lunch outing.",
        audience: "Grade",
        dueDate: "2026-05-20",
        requiresSignature: true,
        questions: [
          { id: "q_demo_1", label: "Do you give permission for your child to attend?", type: "Yes/no", required: true },
          { id: "q_demo_2", label: "Please confirm emergency contact details are up to date.", type: "Emergency contact confirmation", required: true }
        ]
      };
      setDraft(outingDraft);
      createFormFromDraft(outingDraft);
    }

    window.addEventListener(salesDemoActionEventName, onDemoAction);
    return () => window.removeEventListener(salesDemoActionEventName, onDemoAction);
  }, [createFormFromDraft]);

  return (
    <div className="space-y-5">
      <PageHeader title="Digital Consent Forms" subtitle="Create forms, track signatures, and review submissions." />

      <div className="flex flex-wrap gap-2">
        <button data-demo="consent-create" onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 rounded-xl bg-pine-900 px-3 py-2 text-sm text-white">
          <Plus className="h-4 w-4" />
          Create form
        </button>
        <button onClick={sendReminder} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm">
          <Bell className="h-4 w-4" />
          Send reminder
        </button>
        <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm">
          <Download className="h-4 w-4" />
          Export submissions placeholder
        </button>
      </div>
      {notice && <p className="text-sm text-emerald-700">{notice}</p>}

      <section className="grid gap-4 md:grid-cols-5">
        <Kpi label="Sent" value={counts.sent} />
        <Kpi label="Opened" value={counts.opened} />
        <Kpi label="Signed" value={counts.signed} tone="success" />
        <Kpi label="Not signed" value={counts.notSigned} tone="warning" />
        <Kpi label="Overdue" value={counts.overdue} tone="danger" />
      </section>

      <div className="grid gap-4 xl:grid-cols-[0.85fr_1fr_0.85fr]">
        <Card>
          <h2 className="mb-3 text-lg font-semibold text-pine-900">Forms</h2>
          <div className="space-y-2">
            {forms.map((form) => (
              <button key={form.id} onClick={() => setSelectedFormId(form.id)} className="w-full text-left">
                <div className={`rounded-lg border p-3 ${selectedFormId === form.id ? "border-pine-300 bg-pine-50" : "border-slate-200"}`}>
                  <p className="font-medium text-slate-900">{form.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{form.description}</p>
                  <div className="mt-2 flex gap-2">
                    <StatusBadge label={form.category} tone="info" />
                    {form.requiresSignature && <StatusBadge label="Signature required" tone="warning" />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-pine-900">Submission Detail</h2>
          {!selectedSubmission ? (
            <EmptyState title="No submissions" description="Create or select a consent form to view submissions." />
          ) : (
            <div className="mt-3 space-y-3 text-sm">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="font-medium text-slate-900">{getLearnerName(selectedSubmission.learnerId)}</p>
                <p className="text-slate-600">{getGuardianName(selectedSubmission.guardianId)}</p>
                <div className="mt-2"><StatusBadge label={selectedSubmission.status} tone={selectedSubmission.status === "Signed" ? "success" : selectedSubmission.status === "Overdue" ? "danger" : "warning"} /></div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {formSubmissions.map((submission) => (
                  <button key={submission.id} onClick={() => setSelectedSubmissionId(submission.id)} className="rounded-lg border border-slate-200 p-3 text-left hover:bg-slate-50">
                    <p className="font-medium">{getLearnerName(submission.learnerId)}</p>
                    <p className="text-xs text-slate-500">{submission.status}</p>
                  </button>
                ))}
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="font-medium text-slate-900">Compliance metadata</p>
                <p>Accepted at: {selectedSubmission.acceptedAt ?? "Not accepted"}</p>
                <p>Accepted by: {selectedSubmission.acceptedByUserId ?? "Pending"}</p>
                <p>IP placeholder: {selectedSubmission.ipAddressPlaceholder ?? "Pending"}</p>
              </div>
            </div>
          )}
        </Card>

        <ParentAppPreview
          action="CONSENT_FORM_REQUEST"
          learnerName={selectedSubmission ? getLearnerName(selectedSubmission.learnerId) : "Selected learner"}
          title={selectedForm ? `Consent due: ${selectedForm.title}` : "Consent form request"}
          message={selectedForm ? selectedForm.description : "Please review and sign the school consent form before the due date."}
          timestamp={selectedForm?.openAt}
          statusLabel={selectedSubmission?.status ?? "Signature needed"}
          statusTone={selectedSubmission?.status === "Signed" ? "success" : selectedSubmission?.status === "Overdue" ? "danger" : "warning"}
          actionLabel={selectedSubmission?.status === "Signed" ? "View signed copy" : "Sign form"}
          meta={[
            { label: "Due date", value: selectedForm?.closeAt.slice(0, 10) ?? "Pending", tone: "warning" },
            { label: "Signature", value: selectedForm?.requiresSignature ? "Required" : "Not required", tone: selectedForm?.requiresSignature ? "warning" : "info" }
          ]}
          footerNote="Legal and indemnity wording is placeholder/demo text only."
        />
      </div>

      <Card>
        <h2 className="mb-3 text-lg font-semibold text-pine-900">Consent Audit Log</h2>
        {auditLogs.length === 0 ? <p className="text-sm text-slate-500">Audit entries appear after forms are created, reminders are sent, or signatures are submitted.</p> : auditLogs.map((log) => (
          <div key={log.id} className="mb-2 rounded-lg border border-slate-200 p-3 text-sm">
            <p className="font-medium text-slate-900">{log.action}</p>
            <p className="text-slate-600">{log.detail}</p>
          </div>
        ))}
      </Card>

      {showCreate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-4">
          <div className="mx-auto my-6 max-w-3xl rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-semibold text-pine-900">Create consent form</h3>
            <p className="mt-1 text-sm text-amber-700">Legal and indemnity wording is demo placeholder text only.</p>
            <div className="mt-4 grid gap-3">
              <input value={draft.title} onChange={(e) => updateDraft({ title: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Title" />
              <textarea value={draft.description} onChange={(e) => updateDraft({ description: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" rows={3} placeholder="Description" />
              <div className="grid gap-3 md:grid-cols-3">
                <select value={draft.eventId} onChange={(e) => updateDraft({ eventId: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
                  <option value="">No event link</option>
                  {demoData.events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
                </select>
                <input type="date" value={draft.dueDate} onChange={(e) => updateDraft({ dueDate: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                <select value={draft.audience} onChange={(e) => updateDraft({ audience: e.target.value as ConsentFormDraft["audience"] })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
                  {["Whole school", "Grade", "Class", "Specific learner"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={draft.requiresSignature} onChange={(e) => updateDraft({ requiresSignature: e.target.checked })} />
                Required parent signature
              </label>
              <textarea value={draft.indemnityText || demoLegalPlaceholder} onChange={(e) => updateDraft({ indemnityText: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" rows={4} />
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium text-slate-900">Questions</p>
                  <button onClick={addQuestion} className="rounded-lg border border-slate-200 px-2 py-1 text-xs">Add question</button>
                </div>
                <div className="space-y-2">
                  {draft.questions.map((question, index) => (
                    <div key={question.id} className="grid gap-2 rounded-lg border border-slate-200 p-3 md:grid-cols-[1fr_220px_90px]">
                      <input value={question.label} onChange={(e) => updateQuestion(index, { label: e.target.value })} className="rounded-lg border border-slate-200 px-2 py-1 text-sm" />
                      <select value={question.type} onChange={(e) => updateQuestion(index, { type: e.target.value as ConsentQuestionType })} className="rounded-lg border border-slate-200 px-2 py-1 text-sm">
                        {questionTypes.map((type) => <option key={type}>{type}</option>)}
                      </select>
                      <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={question.required} onChange={(e) => updateQuestion(index, { required: e.target.checked })} /> Required</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setShowCreate(false)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">Cancel</button>
              <button onClick={createForm} className="inline-flex items-center gap-2 rounded-xl bg-pine-900 px-3 py-2 text-sm text-white"><Send className="h-4 w-4" /> Create and send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Kpi({ label, value, tone = "info" }: { label: string; value: number; tone?: "info" | "success" | "warning" | "danger" }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-pine-900">{value}</p>
      <StatusBadge label="Submissions" tone={tone} />
    </Card>
  );
}
