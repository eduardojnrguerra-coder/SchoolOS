import { demoData } from "@/demo-data";

type AttendancePoint = {
  date: string;
  present: number;
  absent: number;
  late: number;
};

type FeeCollectionPoint = {
  month: string;
  paid: number;
  outstanding: number;
  target: number;
};

export function getDashboardSnapshot() {
  const today = demoData.attendanceRecords[demoData.attendanceRecords.length - 1]?.date;
  const todayAttendance = demoData.attendanceRecords.filter((record) => record.date === today);

  const presentToday = todayAttendance.filter((record) => record.status === "PRESENT").length;
  const absentToday = todayAttendance.filter((record) => record.status === "ABSENT").length;
  const lateToday = todayAttendance.filter((record) => record.status === "LATE").length;

  const unsignedConsentForms = Math.max(demoData.learners.length - demoData.consentSubmissions.length, 0);
  const outstandingFees = demoData.feeAccounts.reduce((sum, account) => sum + account.currentBalance, 0);
  const openIncidents = demoData.incidentReports.length;
  const transportDelays = demoData.notifications.filter((n) =>
    n.title.toLowerCase().includes("delay")
  ).length;
  const aftercareCheckIns = demoData.aftercareSessions.length;

  const groupedAttendance = new Map<string, AttendancePoint>();
  for (const record of demoData.attendanceRecords) {
    if (!groupedAttendance.has(record.date)) {
      groupedAttendance.set(record.date, { date: record.date, present: 0, absent: 0, late: 0 });
    }
    const point = groupedAttendance.get(record.date)!;
    if (record.status === "PRESENT") point.present += 1;
    if (record.status === "ABSENT") point.absent += 1;
    if (record.status === "LATE") point.late += 1;
  }
  const attendanceSeries = [...groupedAttendance.values()].slice(-10);

  const monthMap = new Map<string, FeeCollectionPoint>();
  for (const payment of demoData.payments) {
    const month = payment.paidAt.slice(0, 7);
    if (!monthMap.has(month)) {
      monthMap.set(month, { month, paid: 0, outstanding: 0, target: 0 });
    }
    monthMap.get(month)!.paid += payment.amount;
  }
  for (const account of demoData.feeAccounts) {
    const month = account.updatedAt.slice(0, 7);
    if (!monthMap.has(month)) {
      monthMap.set(month, { month, paid: 0, outstanding: 0, target: 0 });
    }
    monthMap.get(month)!.outstanding += account.currentBalance;
  }
  for (const point of monthMap.values()) {
    point.target = point.paid + point.outstanding;
  }
  const feeCollectionSeries = [...monthMap.values()].sort((a, b) => a.month.localeCompare(b.month));

  const todayDate = new Date();
  const todayKey = todayDate.toISOString().slice(0, 10);
  const todaysEvents = demoData.events.filter((event) => event.startsAt.slice(0, 10) === todayKey);
  const urgentIncidents = demoData.incidentReports.filter((incident) => incident.severity === "HIGH");
  const aftercareAwaitingPickup = demoData.aftercareSessions.filter((session) => !session.checkOutAt).length;

  return {
    schoolName: demoData.school.name,
    todayLabel: todayDate.toLocaleDateString("en-ZA", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    }),
    currentTerm: "Term 2 (Placeholder)",
    kpis: {
      totalLearners: demoData.learners.length,
      presentToday,
      absentToday,
      lateToday,
      outstandingFees,
      unsignedConsentForms,
      openIncidents,
      transportDelays,
      aftercareCheckIns
    },
    attendanceSeries,
    feeCollectionSeries,
    recentNotices: demoData.notices.slice(-3).reverse(),
    notificationActivity: demoData.notifications.slice(-4).reverse(),
    todaysOperations: {
      eventsToday: todaysEvents,
      activeRoutes: demoData.transportRoutes.filter((route) => route.isActive).length,
      aftercareAwaitingPickup,
      urgentIncidents: urgentIncidents.length
    }
  };
}
