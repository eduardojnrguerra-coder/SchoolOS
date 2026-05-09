import { demoData } from "@/demo-data";

export function learnerFullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`;
}

export function getClassLabel(classId: string) {
  const classItem = demoData.classes.find((c) => c.id === classId);
  const grade = demoData.grades.find((g) => g.id === classItem?.gradeId);
  if (!classItem || !grade) return "Unassigned";
  return `${grade.label} · ${classItem.classCode}`;
}

export function getPrimaryGuardianName(learnerId: string) {
  const primaryLink = demoData.learnerGuardianLinks.find(
    (link) => link.learnerId === learnerId && link.custodyLevel === "PRIMARY"
  );
  const guardian = demoData.guardians.find((g) => g.id === primaryLink?.guardianId);
  return guardian?.fullName ?? "Not linked";
}

export function getTodayAttendanceStatus(learnerId: string) {
  const latestDate = demoData.attendanceRecords[demoData.attendanceRecords.length - 1]?.date;
  const record = demoData.attendanceRecords.find(
    (a) => a.learnerId === learnerId && a.date === latestDate
  );
  return record?.status ?? "UNKNOWN";
}

export function getLearnerFeeSummary(learnerId: string) {
  const fee = demoData.feeAccounts.find((f) => f.learnerId === learnerId);
  if (!fee) return { status: "No account", outstanding: 0 };
  return {
    status: fee.currentBalance > 0 ? "Outstanding" : "Up to date",
    outstanding: fee.currentBalance
  };
}

export function getLearnerTransportState(learnerId: string) {
  const transport = demoData.learnerTransportStatuses.find((t) => t.learnerId === learnerId);
  if (!transport) return "Not enrolled";
  return transport.morningStatus;
}
