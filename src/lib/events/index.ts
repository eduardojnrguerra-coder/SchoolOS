import { demoData } from "@/demo-data";
import { Event } from "@/types/domain";

export type EventAudience = "Whole school" | "Grade" | "Class" | "Transport route" | "Aftercare group";

export type EventDraft = {
  title: string;
  description: string;
  audience: EventAudience;
  audienceTargetId: string;
  startsAt: string;
  endsAt: string;
  location: string;
  cost: string;
  consentRequired: boolean;
  attachmentName: string;
};

export type EventMeta = {
  eventId: string;
  audience: EventAudience;
  audienceTargetId: string;
  cost?: number;
  consentRequired: boolean;
  documentRequired: boolean;
  attachmentName?: string;
  paymentRequired: boolean;
};

export const defaultEventDraft: EventDraft = {
  title: "Foundation Phase picnic",
  description: "A supervised school activity for learners and families.",
  audience: "Class",
  audienceTargetId: demoData.classes[0]?.id ?? "all",
  startsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
  location: "School grounds",
  cost: "0",
  consentRequired: true,
  attachmentName: ""
};

export function getInitialEventMeta(events: Event[]): EventMeta[] {
  return events.map((event, index) => ({
    eventId: event.id,
    audience: event.visibility === "CLASS" ? "Class" : event.visibility === "PARENTS" ? "Whole school" : "Whole school",
    audienceTargetId: event.classId ?? "all",
    cost: index === 1 ? 45 : undefined,
    consentRequired: index === 1,
    documentRequired: index === 0,
    attachmentName: index === 0 ? "event-info-pack.pdf" : undefined,
    paymentRequired: index === 1
  }));
}

export function createEventFromDraft(draft: EventDraft): Event {
  return {
    id: `evt_demo_${Date.now()}`,
    schoolId: demoData.school.id,
    title: draft.title,
    description: draft.description,
    location: draft.location,
    startsAt: new Date(draft.startsAt).toISOString(),
    endsAt: new Date(draft.endsAt).toISOString(),
    visibility: draft.audience === "Class" ? "CLASS" : draft.audience === "Whole school" ? "ALL" : "PARENTS",
    classId: draft.audience === "Class" ? draft.audienceTargetId : undefined
  };
}

export function createEventMeta(eventId: string, draft: EventDraft): EventMeta {
  const cost = Number(draft.cost);
  return {
    eventId,
    audience: draft.audience,
    audienceTargetId: draft.audienceTargetId,
    cost: cost > 0 ? cost : undefined,
    consentRequired: draft.consentRequired,
    documentRequired: Boolean(draft.attachmentName),
    attachmentName: draft.attachmentName || undefined,
    paymentRequired: cost > 0
  };
}

export function getParentRelevantEvents(events: Event[], meta: EventMeta[]) {
  const linkedLearnerIds = demoData.learnerGuardianLinks
    .filter((link) => link.guardianId === demoData.guardians[0]?.id)
    .map((link) => link.learnerId);
  const linkedLearners = demoData.learners.filter((learner) => linkedLearnerIds.includes(learner.id));
  return events.filter((event) => {
    const eventMeta = meta.find((item) => item.eventId === event.id);
    if (!eventMeta || eventMeta.audience === "Whole school" || event.visibility === "ALL" || event.visibility === "PARENTS") return true;
    if (eventMeta.audience === "Class") return linkedLearners.some((learner) => learner.classId === eventMeta.audienceTargetId);
    if (eventMeta.audience === "Grade") return linkedLearners.some((learner) => learner.gradeId === eventMeta.audienceTargetId);
    return true;
  });
}
