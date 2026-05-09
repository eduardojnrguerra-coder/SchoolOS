import { demoData } from "@/demo-data";
import { AttendanceRecord } from "@/types/domain";

export type AttendanceMark = AttendanceRecord["status"];
export type QueueStatus = "Pending" | "Sent" | "Read" | "Action required";

export type AlertQueueItem = {
  id: string;
  learnerId: string;
  learnerName: string;
  status: QueueStatus;
  message: string;
  createdAt: string;
};

export function getLatestAttendanceDate() {
  return demoData.attendanceRecords[demoData.attendanceRecords.length - 1]?.date ?? new Date().toISOString().slice(0, 10);
}

export function attendanceLabel(status: AttendanceMark) {
  return status.replace("_", " ");
}

export function buildAlertForStatus(args: { learnerName: string; status: AttendanceMark; date: string }) {
  const time = new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
  if (args.status === "ABSENT") {
    return `${args.learnerName} was marked absent today. Please confirm if this is correct.`;
  }
  if (args.status === "LATE") {
    return `${args.learnerName} was marked late today at ${time}.`;
  }
  return "";
}

export function createInitialRegister(date: string, classId: string): Array<{
  learnerId: string;
  learnerName: string;
  note: string;
  status: AttendanceMark;
}> {
  const learners = demoData.learners.filter((l) => l.classId === classId);
  const existing = demoData.attendanceRecords.filter((r) => r.date === date && r.classId === classId);
  return learners.map((learner) => ({
    learnerId: learner.id,
    learnerName: `${learner.firstName} ${learner.lastName}`,
    note: "",
    status: existing.find((e) => e.learnerId === learner.id)?.status ?? "PRESENT"
  }));
}
