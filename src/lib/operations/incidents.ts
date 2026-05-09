import { demoData } from "@/demo-data";
import { IncidentReport } from "@/types/domain";

export type IncidentType = "injury" | "behaviour" | "sick bay" | "bullying" | "medication" | "other";
export type IncidentSeverity = "low" | "medium" | "high";

export type IncidentDraft = {
  learnerId: string;
  type: IncidentType;
  severity: IncidentSeverity;
  staffUserId: string;
  notes: string;
  parentNotified: boolean;
  followUpRequired: boolean;
};

export type OperationalAuditEntry = {
  id: string;
  action: string;
  detail: string;
  at: string;
};

export const defaultIncidentDraft: IncidentDraft = {
  learnerId: demoData.learners[0]?.id ?? "",
  type: "injury",
  severity: "low",
  staffUserId: demoData.users[0]?.id ?? "",
  notes: "Demo incident note.",
  parentNotified: false,
  followUpRequired: false
};

export function learnerName(learnerId: string) {
  const learner = demoData.learners.find((item) => item.id === learnerId);
  return learner ? `${learner.firstName} ${learner.lastName}` : "Unknown learner";
}

export function staffName(userId: string) {
  return demoData.users.find((item) => item.id === userId)?.fullName ?? "Unknown staff";
}

export function createIncidentFromDraft(draft: IncidentDraft): IncidentReport {
  return {
    id: `inc_demo_${Date.now()}`,
    schoolId: demoData.school.id,
    learnerId: draft.learnerId,
    reportedByUserId: draft.staffUserId,
    severity: draft.severity.toUpperCase() as IncidentReport["severity"],
    category: draft.type === "injury" ? "SAFETY" : draft.type === "bullying" ? "BULLYING" : draft.type === "sick bay" ? "MEDICAL" : "BEHAVIOUR",
    summary: `${draft.type}: ${draft.notes}`,
    actionTaken: draft.followUpRequired ? "Follow-up required" : "Recorded for monitoring",
    occurredAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
}

export function incidentParentPreview(draft: IncidentDraft) {
  return `${learnerName(draft.learnerId)} had a ${draft.type} incident recorded today. A staff member will contact you if follow-up is required.`;
}

export function buildOperationalAudit(action: string, detail: string): OperationalAuditEntry {
  return { id: `aud_ops_${Date.now()}`, action, detail, at: new Date().toISOString() };
}
