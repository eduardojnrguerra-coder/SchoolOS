import { demoData } from "@/demo-data";
import { getParentDocuments } from "@/src/lib/documents";
import { getInitialDocuments } from "@/src/lib/documents";
import { getInitialEventMeta, getParentRelevantEvents } from "@/src/lib/events";
import { getDemoParentNotices } from "@/src/lib/notifications";

const demoGuardian = demoData.guardians[0];

export function getParentAppData() {
  const links = demoData.learnerGuardianLinks.filter((link) => link.guardianId === demoGuardian.id);
  const children = links
    .map((link) => demoData.learners.find((learner) => learner.id === link.learnerId))
    .filter(Boolean);
  const childIds = children.map((child) => child!.id);
  const notices = getDemoParentNotices();
  const documents = getParentDocuments(getInitialDocuments());
  const eventMeta = getInitialEventMeta(demoData.events);
  const events = getParentRelevantEvents(demoData.events, eventMeta);
  const feeAccounts = demoData.feeAccounts.filter((account) => childIds.includes(account.learnerId));
  const forms = demoData.consentSubmissions.filter((submission) => childIds.includes(submission.learnerId));
  const transportStatuses = demoData.learnerTransportStatuses.filter((status) => childIds.includes(status.learnerId));
  return {
    guardian: demoGuardian,
    children,
    notices,
    documents,
    events,
    eventMeta,
    feeAccounts,
    forms,
    transportStatuses
  };
}

export function formatRand(value: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(value);
}

export function childName(child: NonNullable<ReturnType<typeof getParentAppData>["children"][number]>) {
  return `${child.firstName} ${child.lastName}`;
}

export function getChildSnapshot(childId: string) {
  const attendance = demoData.attendanceRecords.filter((record) => record.learnerId === childId);
  const latestAttendance = attendance[attendance.length - 1];
  const fee = demoData.feeAccounts.find((account) => account.learnerId === childId);
  const forms = demoData.consentSubmissions.filter((submission) => submission.learnerId === childId);
  const transport = demoData.learnerTransportStatuses.find((status) => status.learnerId === childId);
  return { attendance, latestAttendance, fee, forms, transport };
}
