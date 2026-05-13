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

type PulseTone = "success" | "warning" | "danger" | "info";

type ImpactMetricId =
  | "messagesAvoided"
  | "formsSigned"
  | "proofsUploaded"
  | "noticeReadRate"
  | "absenceConfirmations"
  | "adminHoursSaved"
  | "paperFormsAvoided"
  | "paymentReminders";

type ImpactMetric = {
  id: ImpactMetricId;
  label: string;
  value: number;
  suffix?: string;
  helper: string;
  tone: PulseTone;
};

function getLearnerName(learnerId: string) {
  const learner = demoData.learners.find((item) => item.id === learnerId);
  return learner ? `${learner.firstName} ${learner.lastName}` : "Learner";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0
  }).format(value);
}

function formatShortDate(value: string) {
  return new Date(`${value.slice(0, 10)}T12:00:00+02:00`).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short"
  });
}

export function getDashboardSnapshot() {
  const today = demoData.attendanceRecords[demoData.attendanceRecords.length - 1]?.date;
  const operationalDate = today ?? new Date().toISOString().slice(0, 10);
  const todayAttendance = demoData.attendanceRecords.filter((record) => record.date === today);

  const presentToday = todayAttendance.filter((record) => record.status === "PRESENT").length;
  const absentToday = todayAttendance.filter((record) => record.status === "ABSENT").length;
  const lateToday = todayAttendance.filter((record) => record.status === "LATE").length;

  const totalLearners = demoData.learners.filter((learner) => learner.status === "ACTIVE").length;
  const attendanceRate = totalLearners > 0 ? Math.round((presentToday / totalLearners) * 100) : 0;
  const absentLearnerRecords = todayAttendance.filter((record) => record.status === "ABSENT");
  const unconfirmedAbsenceRecords = absentLearnerRecords.filter((record) => !record.note?.toLowerCase().includes("confirmed"));
  const firstUnconfirmedAbsence = unconfirmedAbsenceRecords[0];

  const unsignedConsentForms = demoData.consentForms.reduce((total, form) => {
    const submittedLearnerIds = new Set(
      demoData.consentSubmissions.filter((submission) => submission.consentFormId === form.id).map((submission) => submission.learnerId)
    );
    return total + demoData.learners.filter((learner) => !submittedLearnerIds.has(learner.id)).length;
  }, 0);
  const consentFormsDueToday = demoData.consentForms.filter((form) => form.closeAt.slice(0, 10) === operationalDate);
  const nextConsentForm = [...demoData.consentForms]
    .filter((form) => form.closeAt.slice(0, 10) >= operationalDate)
    .sort((a, b) => a.closeAt.localeCompare(b.closeAt))[0];

  const outstandingFees = demoData.feeAccounts.reduce((sum, account) => sum + account.currentBalance, 0);
  const overdueAccounts = demoData.feeAccounts.filter((account) => account.overdueAmount > 0);
  const firstOverdueAccount = [...overdueAccounts].sort((a, b) => b.overdueAmount - a.overdueAmount)[0];
  const openIncidents = demoData.incidentReports.length;
  const transportDelayNotifications = demoData.notifications.filter((n) =>
    `${n.title} ${n.body}`.toLowerCase().includes("delay")
  );
  const transportDelays = transportDelayNotifications.length;
  const delayedRoute = transportDelayNotifications[0]
    ? demoData.transportRoutes.find((route) =>
        transportDelayNotifications[0].body.toLowerCase().includes(route.routeName.split(" ")[0].toLowerCase())
      ) ?? demoData.transportRoutes[0]
    : undefined;
  const aftercareCheckIns = demoData.aftercareSessions.length;
  const aftercareAwaitingPickup = demoData.aftercareSessions.filter((session) => !session.checkOutAt).length;
  const urgentKeywords = ["urgent", "delay", "pending", "overdue", "incident", "proof", "consent"];
  const unreadUrgentNotifications = demoData.notifications.filter((notification) => {
    const text = `${notification.title} ${notification.body}`.toLowerCase();
    return !notification.readAt && urgentKeywords.some((keyword) => text.includes(keyword));
  });
  const incidentFollowUps = demoData.incidentReports.filter(
    (incident) =>
      incident.severity !== "LOW" ||
      incident.category === "BULLYING" ||
      incident.actionTaken.toLowerCase().includes("parent note")
  );
  const latestIncidentFollowUp = [...incidentFollowUps].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))[0];

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

  const signedConsentSubmissions = demoData.consentSubmissions.filter((submission) => submission.signatureText);
  const digitalFormsSigned = signedConsentSubmissions.length;
  const paymentProofsUploaded = demoData.proofsOfPayment.length;
  const totalNoticeRecipients = demoData.notices.length * demoData.guardians.length;
  const estimatedUnreadNoticeActions = unreadUrgentNotifications.length + unconfirmedAbsenceRecords.length;
  const projectedNoticeReads = Math.max(totalNoticeRecipients - estimatedUnreadNoticeActions, 0);
  const noticeReadRate = totalNoticeRecipients > 0 ? Math.round((projectedNoticeReads / totalNoticeRecipients) * 100) : 0;
  const totalAbsenceRecords = demoData.attendanceRecords.filter((record) => record.status === "ABSENT").length;
  const absenceConfirmationsReceived = Math.max(totalAbsenceRecords - unconfirmedAbsenceRecords.length, 0);
  const paymentRemindersAutomated = overdueAccounts.length;
  const paperFormsAvoided = digitalFormsSigned;
  const parentMessagesAvoided =
    projectedNoticeReads +
    digitalFormsSigned +
    paymentProofsUploaded +
    absenceConfirmationsReceived +
    demoData.learnerTransportStatuses.length +
    demoData.aftercareSessions.length;
  const estimatedAdminHoursSaved = Math.round(
    ((parentMessagesAvoided * 2 +
      digitalFormsSigned * 4 +
      paymentProofsUploaded * 3 +
      absenceConfirmationsReceived * 3 +
      paymentRemindersAutomated * 2) /
      60) *
      10
  ) / 10;

  const impactMetrics: ImpactMetric[] = [
    {
      id: "messagesAvoided",
      label: "Parent messages avoided",
      value: parentMessagesAvoided,
      helper: "Demo estimate from notices, confirmations, transport updates, and aftercare activity.",
      tone: "success"
    },
    {
      id: "formsSigned",
      label: "Digital forms signed",
      value: digitalFormsSigned,
      helper: "Signed consent submissions already captured in the demo school.",
      tone: "info"
    },
    {
      id: "proofsUploaded",
      label: "Payment proofs uploaded",
      value: paymentProofsUploaded,
      helper: "EFT proof uploads ready for finance review instead of email chasing.",
      tone: "warning"
    },
    {
      id: "noticeReadRate",
      label: "Notice read rate",
      value: noticeReadRate,
      suffix: "%",
      helper: "Projected from current notice reach and unresolved urgent items.",
      tone: noticeReadRate >= 85 ? "success" : "warning"
    },
    {
      id: "absenceConfirmations",
      label: "Absence confirmations received",
      value: absenceConfirmationsReceived,
      helper: "Projected from resolved historical absence alerts in the demo register.",
      tone: "success"
    },
    {
      id: "adminHoursSaved",
      label: "Estimated admin hours saved",
      value: estimatedAdminHoursSaved,
      suffix: "h",
      helper: "Demo estimate using conservative time savings per repeated admin task.",
      tone: "success"
    },
    {
      id: "paperFormsAvoided",
      label: "Paper forms avoided",
      value: paperFormsAvoided,
      helper: "Signed digital consent forms that no longer need printing or filing.",
      tone: "info"
    },
    {
      id: "paymentReminders",
      label: "Payment reminders automated",
      value: paymentRemindersAutomated,
      helper: "Overdue accounts ready for structured reminders instead of manual follow-up.",
      tone: "warning"
    }
  ];

  const noticeEngagement = demoData.notices.map((notice, index) => {
    const sent = demoData.guardians.length;
    const readRate = Math.max(noticeReadRate - (demoData.notices.length - index - 1) * 6, 62);
    const read = Math.min(sent, Math.round((sent * readRate) / 100));
    const actionRequired = Math.max(1, Math.round((sent - read) / 2));

    return {
      notice: notice.title.length > 18 ? `${notice.title.slice(0, 18)}...` : notice.title,
      sent,
      read,
      actionRequired
    };
  });

  const formTrendDates = attendanceSeries.slice(-5).map((point) => point.date);
  const formsSignedOverTime = formTrendDates.map((date, index) => ({
    date: formatShortDate(date),
    signed: signedConsentSubmissions.filter((_, submissionIndex) => submissionIndex % formTrendDates.length <= index).length
  }));

  const parentAppActivity = [
    { activity: "Notices read", count: projectedNoticeReads },
    { activity: "Forms signed", count: digitalFormsSigned },
    { activity: "Proof uploads", count: paymentProofsUploaded },
    { activity: "Transport views", count: demoData.learnerTransportStatuses.length * 2 },
    { activity: "Aftercare updates", count: demoData.aftercareSessions.length + demoData.aftercarePickups.length }
  ];

  const impactFeeCollection = feeCollectionSeries.map((point) => ({
    month: point.month,
    paid: point.paid,
    outstanding: point.outstanding,
    progress: point.target > 0 ? Math.round((point.paid / point.target) * 100) : 0
  }));

  const todayDate = new Date(`${operationalDate}T12:00:00+02:00`);
  const todaysEvents = demoData.events.filter((event) => event.startsAt.slice(0, 10) === operationalDate);
  const urgentIncidents = demoData.incidentReports.filter((incident) => incident.severity === "HIGH");
  const activeRoutes = demoData.transportRoutes.filter((route) => route.isActive).length;

  const needsAttention: Array<{
    title: string;
    detail: string;
    metric: string;
    href: string;
    tone: PulseTone;
  }> = [
    {
      title: "Absent learner not confirmed by parent",
      detail: firstUnconfirmedAbsence
        ? `${getLearnerName(firstUnconfirmedAbsence.learnerId)} is marked absent for ${formatShortDate(operationalDate)}. Confirmation is still pending.`
        : "No unconfirmed absences on the latest register.",
      metric: `${unconfirmedAbsenceRecords.length} pending`,
      href: "/dashboard/attendance",
      tone: unconfirmedAbsenceRecords.length > 0 ? "danger" : "success"
    },
    {
      title: "Fee account overdue",
      detail: firstOverdueAccount
        ? `${getLearnerName(firstOverdueAccount.learnerId)} has ${formatCurrency(firstOverdueAccount.overdueAmount)} overdue.`
        : "No overdue fee accounts in the demo data.",
      metric: `${overdueAccounts.length} overdue`,
      href: "/dashboard/fees",
      tone: overdueAccounts.length > 0 ? "warning" : "success"
    },
    {
      title: "Consent form due today",
      detail:
        consentFormsDueToday.length > 0
          ? `${consentFormsDueToday[0].title} closes today.`
          : nextConsentForm
            ? `No form closes today. Next deadline: ${nextConsentForm.title} on ${formatShortDate(nextConsentForm.closeAt)}.`
            : "No upcoming consent deadlines.",
      metric: consentFormsDueToday.length > 0 ? `${consentFormsDueToday.length} due today` : "Next deadline",
      href: "/dashboard/consent-forms",
      tone: consentFormsDueToday.length > 0 ? "danger" : "info"
    },
    {
      title: "Transport route delayed",
      detail: delayedRoute
        ? `${delayedRoute.routeName} is flagged from the latest transport notification.`
        : "No delayed routes currently flagged.",
      metric: transportDelays > 0 ? `${transportDelays} delayed` : "On time",
      href: "/dashboard/transport",
      tone: transportDelays > 0 ? "warning" : "success"
    },
    {
      title: "Incident follow-up pending",
      detail: latestIncidentFollowUp
        ? `${getLearnerName(latestIncidentFollowUp.learnerId)} has a ${latestIncidentFollowUp.severity.toLowerCase()} ${latestIncidentFollowUp.category.toLowerCase()} follow-up.`
        : "No incident follow-ups are pending.",
      metric: `${incidentFollowUps.length} follow-ups`,
      href: "/dashboard/incidents",
      tone: incidentFollowUps.length > 0 ? "danger" : "success"
    }
  ];

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
      totalLearners,
      presentToday,
      absentToday,
      lateToday,
      outstandingFees,
      unsignedConsentForms,
      openIncidents,
      transportDelays,
      aftercareCheckIns
    },
    schoolPulse: {
      operationalDate,
      attendance: {
        rate: attendanceRate,
        present: presentToday,
        absent: absentToday,
        late: lateToday,
        total: totalLearners
      },
      unconfirmedAbsences: {
        count: unconfirmedAbsenceRecords.length,
        featuredLearner: firstUnconfirmedAbsence ? getLearnerName(firstUnconfirmedAbsence.learnerId) : undefined
      },
      unreadUrgentNotices: {
        count: unreadUrgentNotifications.length,
        latestTitle: unreadUrgentNotifications[0]?.title
      },
      pendingConsentForms: {
        count: unsignedConsentForms,
        dueToday: consentFormsDueToday.length,
        nextDueTitle: nextConsentForm?.title,
        nextDueDate: nextConsentForm ? formatShortDate(nextConsentForm.closeAt) : undefined
      },
      outstandingFees: {
        amount: outstandingFees,
        overdueAccounts: overdueAccounts.length
      },
      transport: {
        activeRoutes,
        delayedRoutes: transportDelays,
        statusLabel: transportDelays > 0 ? "Route attention needed" : "Routes on schedule",
        featuredRoute: delayedRoute?.routeName
      },
      aftercare: {
        checkedIn: aftercareCheckIns,
        awaitingPickup: aftercareAwaitingPickup
      },
      incidentFollowUps: {
        count: incidentFollowUps.length,
        latestLearner: latestIncidentFollowUp ? getLearnerName(latestIncidentFollowUp.learnerId) : undefined
      },
      needsAttention
    },
    attendanceSeries,
    feeCollectionSeries,
    impactAnalytics: {
      summary:
        "Projected impact based on current demo activity. These estimates are for sales walkthroughs and should be calibrated with each school during onboarding.",
      metrics: impactMetrics,
      charts: {
        noticeEngagement,
        formsSignedOverTime,
        feeCollectionProgress: impactFeeCollection,
        parentAppActivity
      }
    },
    recentNotices: demoData.notices.slice(-3).reverse(),
    notificationActivity: demoData.notifications.slice(-4).reverse(),
    todaysOperations: {
      eventsToday: todaysEvents,
      activeRoutes,
      aftercareAwaitingPickup,
      urgentIncidents: urgentIncidents.length
    }
  };
}
