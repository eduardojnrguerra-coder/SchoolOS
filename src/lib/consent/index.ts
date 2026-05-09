import { demoData } from "@/demo-data";
import { ConsentForm } from "@/types/domain";

export type ConsentQuestionType =
  | "Short answer"
  | "Yes/no"
  | "Checkbox"
  | "Multiple choice"
  | "Emergency contact confirmation";

export type ConsentSubmissionStatus = "Sent" | "Opened" | "Signed" | "Not signed" | "Overdue";
export type ConsentAudience = "Whole school" | "Grade" | "Class" | "Specific learner";

export type ConsentQuestion = {
  id: string;
  label: string;
  type: ConsentQuestionType;
  required: boolean;
  options?: string[];
};

export type ConsentFormDraft = {
  title: string;
  description: string;
  eventId: string;
  dueDate: string;
  audience: ConsentAudience;
  audienceTargetId: string;
  requiresSignature: boolean;
  indemnityText: string;
  questions: ConsentQuestion[];
};

export type ConsentSubmissionRecord = {
  id: string;
  formId: string;
  learnerId: string;
  guardianId: string;
  status: ConsentSubmissionStatus;
  openedAt?: string;
  signedAt?: string;
  acceptedAt?: string;
  acceptedByUserId?: string;
  signatureText?: string;
  ipAddressPlaceholder?: string;
  answers: Record<string, string>;
};

export type ConsentAuditEntry = {
  id: string;
  action: string;
  detail: string;
  at: string;
};

export const demoLegalPlaceholder =
  "DEMO PLACEHOLDER ONLY: I confirm that I have read this form and understand the school activity information. Schools must replace this with their own approved legal and indemnity wording.";

export const defaultConsentDraft: ConsentFormDraft = {
  title: "Class outing consent",
  description: "Permission request for a supervised school activity.",
  eventId: "",
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  audience: "Class",
  audienceTargetId: demoData.classes[0]?.id ?? "all",
  requiresSignature: true,
  indemnityText: demoLegalPlaceholder,
  questions: [
    { id: "q_emergency", label: "Emergency contact details are correct", type: "Emergency contact confirmation", required: true },
    { id: "q_medical", label: "Any important medical notes for this activity?", type: "Short answer", required: false },
    { id: "q_consent", label: "Do you consent to learner participation?", type: "Yes/no", required: true }
  ]
};

export function getInitialConsentSubmissions(forms: ConsentForm[]): ConsentSubmissionRecord[] {
  return demoData.consentSubmissions.map((submission, index) => ({
    id: submission.id,
    formId: submission.consentFormId,
    learnerId: submission.learnerId,
    guardianId: submission.guardianId,
    status: (index % 5 === 0 ? "Overdue" : submission.signatureText ? "Signed" : "Not signed") as ConsentSubmissionStatus,
    openedAt: "2026-05-05T13:40:00+02:00",
    signedAt: submission.signatureText ? submission.submittedAt : undefined,
    acceptedAt: submission.signatureText ? submission.submittedAt : undefined,
    acceptedByUserId: submission.signatureText ? submission.guardianId : undefined,
    signatureText: submission.signatureText,
    ipAddressPlaceholder: submission.signatureText ? "demo-ip-hash-1024" : undefined,
    answers: { q_consent: submission.response }
  })).filter((submission) => forms.some((form) => form.id === submission.formId));
}

export function createConsentFormFromDraft(draft: ConsentFormDraft): ConsentForm {
  return {
    id: `cf_demo_${Date.now()}`,
    schoolId: demoData.school.id,
    title: draft.title,
    description: draft.description,
    category: "GENERAL",
    requiresSignature: draft.requiresSignature,
    createdByUserId: "usr_001",
    openAt: new Date().toISOString(),
    closeAt: new Date(`${draft.dueDate}T23:59:00+02:00`).toISOString()
  };
}

export function createSubmissionTargets(formId: string, draft: ConsentFormDraft): ConsentSubmissionRecord[] {
  const learners = getAudienceLearners(draft);
  return learners.map((learner, index) => {
    const link = demoData.learnerGuardianLinks.find((item) => item.learnerId === learner.id && item.custodyLevel === "PRIMARY");
    return {
      id: `csub_demo_${formId}_${learner.id}`,
      formId,
      learnerId: learner.id,
      guardianId: link?.guardianId ?? demoData.guardians[index % demoData.guardians.length].id,
      status: "Sent",
      answers: {}
    };
  });
}

export function getConsentStatusCounts(submissions: ConsentSubmissionRecord[]) {
  return {
    sent: submissions.filter((item) => item.status === "Sent").length,
    opened: submissions.filter((item) => item.status === "Opened").length,
    signed: submissions.filter((item) => item.status === "Signed").length,
    notSigned: submissions.filter((item) => item.status === "Not signed").length,
    overdue: submissions.filter((item) => item.status === "Overdue").length
  };
}

export function buildConsentAudit(action: string, detail: string): ConsentAuditEntry {
  return { id: `aud_consent_${Date.now()}`, action, detail, at: new Date().toISOString() };
}

export function getLearnerName(learnerId: string) {
  const learner = demoData.learners.find((item) => item.id === learnerId);
  return learner ? `${learner.firstName} ${learner.lastName}` : "Unknown learner";
}

export function getGuardianName(guardianId: string) {
  return demoData.guardians.find((item) => item.id === guardianId)?.fullName ?? "Unknown guardian";
}

export function signConsentSubmission(args: {
  submission: ConsentSubmissionRecord;
  answers: Record<string, string>;
  signatureText: string;
}) {
  const now = new Date().toISOString();
  return {
    ...args.submission,
    status: "Signed" as const,
    answers: args.answers,
    signatureText: args.signatureText,
    signedAt: now,
    acceptedAt: now,
    acceptedByUserId: args.submission.guardianId,
    ipAddressPlaceholder: "demo-ip-hash-parent-session"
  };
}

function getAudienceLearners(draft: ConsentFormDraft) {
  if (draft.audience === "Grade") return demoData.learners.filter((learner) => learner.gradeId === draft.audienceTargetId);
  if (draft.audience === "Class") return demoData.learners.filter((learner) => learner.classId === draft.audienceTargetId);
  if (draft.audience === "Specific learner") return demoData.learners.filter((learner) => learner.id === draft.audienceTargetId);
  return demoData.learners;
}
