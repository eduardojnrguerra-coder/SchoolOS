import {
  AftercarePickup,
  AftercareSession,
  AttendanceRecord,
  AuditLog,
  Class,
  ConsentForm,
  ConsentSubmission,
  DemoDataBundle,
  Document,
  Driver,
  Event,
  FeeAccount,
  Grade,
  IncidentReport,
  Learner,
  LearnerGuardianLink,
  LearnerTransportStatus,
  Message,
  MessageThread,
  Notice,
  Notification,
  ParentGuardian,
  Payment,
  ProofOfPayment,
  Role,
  School,
  Teacher,
  TransportRoute,
  TransportStop,
  TransportVehicle,
  User
} from "@/types/domain";

const now = "2026-05-07T09:00:00+02:00";

const school: School = {
  id: "school_hva",
  name: "Hermanus Valley Academy",
  shortCode: "HVA",
  educationPhase: "ECD",
  timezone: "Africa/Johannesburg",
  countryCode: "ZA",
  province: "Western Cape",
  town: "Hermanus",
  supportEmail: "support@demo.hva.school",
  supportPhone: "+27-000-100-2000",
  createdAt: "2024-01-15T08:00:00+02:00"
};

const roles: Role[] = [
  { id: "role_super_admin", code: "SUPER_ADMIN", label: "Super Admin", description: "Multi-school platform oversight" },
  { id: "role_school_admin", code: "SCHOOL_ADMIN", label: "School Admin", description: "School-wide administration" },
  { id: "role_principal", code: "PRINCIPAL", label: "Principal", description: "Academic and operational leadership" },
  { id: "role_teacher", code: "TEACHER", label: "Teacher", description: "Teaching and classroom operations" },
  { id: "role_finance", code: "FINANCE", label: "Finance", description: "Billing and fee operations" },
  { id: "role_transport_manager", code: "TRANSPORT_MANAGER", label: "Transport Manager", description: "Transport coordination" },
  { id: "role_aftercare_staff", code: "AFTERCARE_STAFF", label: "Aftercare Staff", description: "Aftercare supervision" },
  { id: "role_parent", code: "PARENT", label: "Parent", description: "Guardian portal user" }
];

const users: User[] = [
  { id: "usr_001", schoolId: school.id, roleCode: "SCHOOL_ADMIN", fullName: "Ava Petersen", email: "ava.petersen@demo.hva.school", phone: "+27-000-100-0001", isActive: true, lastLoginAt: "2026-05-07T07:20:00+02:00", createdAt: now },
  { id: "usr_002", schoolId: school.id, roleCode: "PRINCIPAL", fullName: "Liam Fourie", email: "liam.fourie@demo.hva.school", phone: "+27-000-100-0002", isActive: true, lastLoginAt: "2026-05-07T06:45:00+02:00", createdAt: now },
  { id: "usr_003", schoolId: school.id, roleCode: "TEACHER", fullName: "Mia Roman", email: "mia.roman@demo.hva.school", phone: "+27-000-100-0003", isActive: true, createdAt: now },
  { id: "usr_004", schoolId: school.id, roleCode: "TEACHER", fullName: "Noah Isaacs", email: "noah.isaacs@demo.hva.school", phone: "+27-000-100-0004", isActive: true, createdAt: now },
  { id: "usr_005", schoolId: school.id, roleCode: "TEACHER", fullName: "Zoe van Wyk", email: "zoe.vanwyk@demo.hva.school", phone: "+27-000-100-0005", isActive: true, createdAt: now },
  { id: "usr_006", schoolId: school.id, roleCode: "TEACHER", fullName: "Caleb Ruiters", email: "caleb.ruiters@demo.hva.school", phone: "+27-000-100-0006", isActive: true, createdAt: now },
  { id: "usr_007", schoolId: school.id, roleCode: "TEACHER", fullName: "Ella Smit", email: "ella.smit@demo.hva.school", phone: "+27-000-100-0007", isActive: true, createdAt: now },
  { id: "usr_008", schoolId: school.id, roleCode: "TEACHER", fullName: "Ruben Naude", email: "ruben.naude@demo.hva.school", phone: "+27-000-100-0008", isActive: true, createdAt: now }
];

const grades: Grade[] = [
  { id: "gr_r", schoolId: school.id, code: "R", label: "Grade R", sortOrder: 1 },
  { id: "gr_1", schoolId: school.id, code: "1", label: "Grade 1", sortOrder: 2 },
  { id: "gr_2", schoolId: school.id, code: "2", label: "Grade 2", sortOrder: 3 },
  { id: "gr_3", schoolId: school.id, code: "3", label: "Grade 3", sortOrder: 4 }
];

const teachers: Teacher[] = [
  { id: "t_001", schoolId: school.id, userId: "usr_003", employeeCode: "HVA-T001", specialization: "Foundation Literacy", homeroomClassId: "cls_rA" },
  { id: "t_002", schoolId: school.id, userId: "usr_004", employeeCode: "HVA-T002", specialization: "Numeracy", homeroomClassId: "cls_1A" },
  { id: "t_003", schoolId: school.id, userId: "usr_005", employeeCode: "HVA-T003", specialization: "Life Skills", homeroomClassId: "cls_2A" },
  { id: "t_004", schoolId: school.id, userId: "usr_006", employeeCode: "HVA-T004", specialization: "Language Development", homeroomClassId: "cls_3A" },
  { id: "t_005", schoolId: school.id, userId: "usr_007", employeeCode: "HVA-T005", specialization: "Arts & Culture" },
  { id: "t_006", schoolId: school.id, userId: "usr_008", employeeCode: "HVA-T006", specialization: "Sport & Wellness" }
];

const classes: Class[] = [
  { id: "cls_rA", schoolId: school.id, gradeId: "gr_r", classCode: "R-A", className: "Grade R A", roomLabel: "Sunbird 1", teacherId: "t_001" },
  { id: "cls_1A", schoolId: school.id, gradeId: "gr_1", classCode: "1-A", className: "Grade 1 A", roomLabel: "Kingfisher 2", teacherId: "t_002" },
  { id: "cls_2A", schoolId: school.id, gradeId: "gr_2", classCode: "2-A", className: "Grade 2 A", roomLabel: "Protea 3", teacherId: "t_003" },
  { id: "cls_3A", schoolId: school.id, gradeId: "gr_3", classCode: "3-A", className: "Grade 3 A", roomLabel: "Fynbos 4", teacherId: "t_004" }
];

const learnerNames = [
  ["Ariana", "Meyer"], ["Buhle", "Khumalo"], ["Callum", "Adams"], ["Demi", "Steyn"], ["Ethan", "Pillay"], ["Farah", "Davids"],
  ["Gideon", "Louw"], ["Hana", "Mahlobo"], ["Izaan", "Swanepoel"], ["Jada", "Mentoor"], ["Kian", "Lawrence"], ["Lena", "Janse van Rensburg"],
  ["Mika", "Ndlovu"], ["Nora", "Fraser"], ["Owen", "Le Roux"], ["Priya", "Naicker"], ["Quinn", "Maree"], ["Rhea", "Mthembu"],
  ["Seth", "Hendricks"], ["Talia", "Koen"], ["Umar", "Padayachee"], ["Vera", "Brits"], ["Wyatt", "Samuels"], ["Yara", "Botha"]
] as const;

const learners: Learner[] = learnerNames.map(([firstName, lastName], index) => {
  const classRef = classes[Math.floor(index / 6)];
  return {
    id: `lrn_${String(index + 1).padStart(3, "0")}`,
    schoolId: school.id,
    learnerCode: `HVA-L${String(index + 1).padStart(4, "0")}`,
    firstName,
    lastName,
    gradeId: classRef.gradeId,
    classId: classRef.id,
    enrollmentDate: "2026-01-15",
    status: "ACTIVE",
    medicalAlertSummary: index % 7 === 0 ? "Carries allergy action plan on file." : undefined
  };
});

const guardians: ParentGuardian[] = Array.from({ length: 30 }).map((_, index) => ({
  id: `gdn_${String(index + 1).padStart(3, "0")}`,
  schoolId: school.id,
  fullName: `Guardian ${index + 1}`,
  relationshipToLearner: (["MOTHER", "FATHER", "GUARDIAN", "AUNT", "UNCLE", "GRANDPARENT"] as const)[index % 6],
  email: `guardian${index + 1}@demo.family.local`,
  phone: `+27-000-200-${String(index + 1).padStart(4, "0")}`,
  isPrimaryContact: index % 3 === 0,
  receivesBilling: index % 2 === 0
}));

const learnerGuardianLinks: LearnerGuardianLink[] = learners.flatMap((learner, index) => {
  const first = guardians[index % guardians.length];
  const second = guardians[(index + 9) % guardians.length];
  return [
    { id: `lgl_${learner.id}_1`, learnerId: learner.id, guardianId: first.id, custodyLevel: "PRIMARY", pickupAuthorized: true },
    { id: `lgl_${learner.id}_2`, learnerId: learner.id, guardianId: second.id, custodyLevel: "SHARED", pickupAuthorized: index % 4 !== 0 }
  ];
});

function getPastSchoolDates(endDate: string, count: number): string[] {
  const dates: string[] = [];
  const cursor = new Date(`${endDate}T00:00:00+02:00`);
  while (dates.length < count) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() - 1);
  }
  return dates.reverse();
}

const attendanceDates = getPastSchoolDates("2026-05-07", 10);

const attendanceRecords: AttendanceRecord[] = attendanceDates.flatMap((date, dIdx) =>
  learners.map((learner, lIdx) => {
    const mod = (dIdx + lIdx) % 11;
    const status = mod === 0 ? "ABSENT" : mod === 1 ? "LATE" : mod === 2 ? "EXCUSED" : "PRESENT";
    return {
      id: `att_${date}_${learner.id}`,
      schoolId: school.id,
      learnerId: learner.id,
      classId: learner.classId,
      date,
      status,
      capturedByUserId: "usr_006",
      note: status === "ABSENT" ? "Parent notified school app." : undefined,
      capturedAt: `${date}T08:15:00+02:00`
    };
  })
);

const notices: Notice[] = [
  { id: "ntc_001", schoolId: school.id, title: "Winter Uniform Update", body: "Blazers are compulsory from Monday 11 May.", audience: "PARENTS", createdByUserId: "usr_001", publishedAt: "2026-05-05T10:00:00+02:00" },
  { id: "ntc_002", schoolId: school.id, title: "Staff Development Friday", body: "Classes close at 12:00 for internal training.", audience: "ALL", createdByUserId: "usr_002", publishedAt: "2026-05-04T09:00:00+02:00" },
  { id: "ntc_003", schoolId: school.id, title: "Grade 2 Reading Week", body: "Daily reading challenge starts next week.", audience: "CLASS", classId: "cls_2A", createdByUserId: "usr_008", publishedAt: "2026-05-06T07:30:00+02:00" }
];

const feeAccounts: FeeAccount[] = learners.map((learner, i) => ({
  id: `fa_${learner.id}`,
  schoolId: school.id,
  learnerId: learner.id,
  accountCode: `ACC-${learner.learnerCode}`,
  billingCycle: "MONTHLY",
  currency: "ZAR",
  currentBalance: 2800 + (i % 5) * 350,
  overdueAmount: i % 6 === 0 ? 700 : 0,
  updatedAt: "2026-05-07T09:00:00+02:00"
}));

const payments: Payment[] = learners.flatMap((learner, i) => {
  const base = 1200 + (i % 3) * 200;
  return [
    { id: `pmt_${learner.id}_1`, schoolId: school.id, feeAccountId: `fa_${learner.id}`, amount: base, currency: "ZAR", paidAt: "2026-03-29T11:30:00+02:00", method: "EFT", reference: `EFT-${learner.learnerCode}-0329` },
    { id: `pmt_${learner.id}_2`, schoolId: school.id, feeAccountId: `fa_${learner.id}`, amount: base, currency: "ZAR", paidAt: "2026-04-28T10:20:00+02:00", method: "CARD", reference: `CRD-${learner.learnerCode}-0428`, capturedByUserId: "usr_003" }
  ];
});

const proofsOfPayment: ProofOfPayment[] = payments.slice(0, 18).map((payment, i) => ({
  id: `pop_${payment.id}`,
  schoolId: school.id,
  paymentId: payment.id,
  uploadedByUserId: i % 2 === 0 ? "usr_003" : "usr_001",
  fileName: `proof-${payment.reference}.pdf`,
  filePath: `proofs/${payment.id}.pdf`,
  verifiedByUserId: i % 3 === 0 ? "usr_003" : undefined,
  verifiedAt: i % 3 === 0 ? "2026-05-01T15:00:00+02:00" : undefined,
  status: i % 3 === 0 ? "VERIFIED" : "PENDING"
}));

const consentForms: ConsentForm[] = [
  { id: "cf_001", schoolId: school.id, title: "Photo and Media Consent 2026", description: "Permission to use learner photos in school channels.", category: "MEDIA", requiresSignature: true, createdByUserId: "usr_001", openAt: "2026-01-20T08:00:00+02:00", closeAt: "2026-12-01T23:59:00+02:00" },
  { id: "cf_002", schoolId: school.id, title: "Zoo Excursion Consent", description: "Grade outing to Cape Nature Centre.", category: "EXCURSION", requiresSignature: true, createdByUserId: "usr_002", openAt: "2026-05-02T08:00:00+02:00", closeAt: "2026-05-20T23:59:00+02:00" }
];

const consentSubmissions: ConsentSubmission[] = learners.slice(0, 16).map((learner, i) => {
  const link = learnerGuardianLinks.find((l) => l.learnerId === learner.id);
  return {
    id: `csub_${learner.id}`,
    schoolId: school.id,
    consentFormId: i % 2 === 0 ? "cf_001" : "cf_002",
    learnerId: learner.id,
    guardianId: link ? link.guardianId : guardians[0].id,
    response: i % 7 === 0 ? "DECLINED" : "APPROVED",
    submittedAt: "2026-05-05T14:20:00+02:00",
    signatureText: i % 7 === 0 ? undefined : "Signed in-app"
  };
});

const events: Event[] = [
  { id: "evt_001", schoolId: school.id, title: "Open Day", description: "Prospective family open day.", location: "Main Hall", startsAt: "2026-05-18T09:00:00+02:00", endsAt: "2026-05-18T12:00:00+02:00", visibility: "ALL" },
  { id: "evt_002", schoolId: school.id, title: "Grade R Story Morning", description: "Parents invited for reading hour.", location: "Sunbird 1", startsAt: "2026-05-14T08:30:00+02:00", endsAt: "2026-05-14T09:30:00+02:00", visibility: "CLASS", classId: "cls_rA" },
  { id: "evt_003", schoolId: school.id, title: "Finance Q&A Session", description: "Fee policy and payment support.", location: "Online", startsAt: "2026-05-21T18:00:00+02:00", endsAt: "2026-05-21T19:00:00+02:00", visibility: "PARENTS" }
];

const documents: Document[] = [
  { id: "doc_001", schoolId: school.id, title: "Code of Conduct", category: "POLICY", audience: "ALL", filePath: "documents/policies/code-of-conduct-2026.pdf", uploadedByUserId: "usr_001", uploadedAt: "2026-01-10T08:00:00+02:00" },
  { id: "doc_002", schoolId: school.id, title: "Fee Policy", category: "FINANCE", audience: "PARENTS", filePath: "documents/finance/fee-policy-2026.pdf", uploadedByUserId: "usr_003", uploadedAt: "2026-01-10T08:15:00+02:00" },
  { id: "doc_003", schoolId: school.id, title: "Transport Handbook", category: "TRANSPORT", audience: "PARENTS", filePath: "documents/transport/transport-handbook.pdf", uploadedByUserId: "usr_004", uploadedAt: "2026-02-02T10:30:00+02:00" }
];

const incidentReports: IncidentReport[] = [
  { id: "inc_001", schoolId: school.id, learnerId: "lrn_004", reportedByUserId: "usr_006", severity: "LOW", category: "BEHAVIOUR", summary: "Classroom disruption during group activity.", actionTaken: "Learner reflection and parent note sent.", occurredAt: "2026-05-02T10:10:00+02:00", createdAt: "2026-05-02T11:00:00+02:00" },
  { id: "inc_002", schoolId: school.id, learnerId: "lrn_015", reportedByUserId: "usr_007", severity: "MEDIUM", category: "SAFETY", summary: "Minor fall on playground.", actionTaken: "First aid provided; guardian notified.", occurredAt: "2026-05-03T13:20:00+02:00", createdAt: "2026-05-03T13:45:00+02:00" },
  { id: "inc_003", schoolId: school.id, learnerId: "lrn_020", reportedByUserId: "usr_008", severity: "LOW", category: "BULLYING", summary: "Name-calling reported in line.", actionTaken: "Restorative conversation completed.", occurredAt: "2026-05-04T09:10:00+02:00", createdAt: "2026-05-04T10:05:00+02:00" }
];

const transportVehicles: TransportVehicle[] = [
  { id: "veh_001", schoolId: school.id, label: "Shuttle 1", registrationCode: "DEMO-BUS-01", capacity: 22, isActive: true },
  { id: "veh_002", schoolId: school.id, label: "Shuttle 2", registrationCode: "DEMO-BUS-02", capacity: 16, isActive: true }
];

const drivers: Driver[] = [
  { id: "drv_001", schoolId: school.id, fullName: "Driver Daniel", phone: "+27-000-300-0001", licenseCode: "ZA-C1-DEM-01", isActive: true },
  { id: "drv_002", schoolId: school.id, fullName: "Driver Thando", phone: "+27-000-300-0002", licenseCode: "ZA-C1-DEM-02", isActive: true }
];

const transportRoutes: TransportRoute[] = [
  { id: "tr_001", schoolId: school.id, routeCode: "HVA-NORTH", routeName: "North Hermanus Loop", vehicleId: "veh_001", driverId: "drv_001", morningDepartureTime: "06:45", afternoonDepartureTime: "14:15", isActive: true },
  { id: "tr_002", schoolId: school.id, routeCode: "HVA-SOUTH", routeName: "South Hermanus Loop", vehicleId: "veh_002", driverId: "drv_002", morningDepartureTime: "06:50", afternoonDepartureTime: "14:20", isActive: true }
];

const transportStops: TransportStop[] = [
  { id: "st_001", schoolId: school.id, routeId: "tr_001", stopName: "Fernkloof Gate", sequence: 1, pickupTime: "06:55", dropoffTime: "14:40" },
  { id: "st_002", schoolId: school.id, routeId: "tr_001", stopName: "Village Square", sequence: 2, pickupTime: "07:05", dropoffTime: "14:50" },
  { id: "st_003", schoolId: school.id, routeId: "tr_002", stopName: "Sandbaai Circle", sequence: 1, pickupTime: "06:58", dropoffTime: "14:42" },
  { id: "st_004", schoolId: school.id, routeId: "tr_002", stopName: "Onrus Beach Turn", sequence: 2, pickupTime: "07:08", dropoffTime: "14:52" }
];

const learnerTransportStatuses: LearnerTransportStatus[] = learners.slice(0, 12).map((learner, index) => ({
  id: `lts_${learner.id}`,
  schoolId: school.id,
  learnerId: learner.id,
  routeId: index % 2 === 0 ? "tr_001" : "tr_002",
  stopId: index % 2 === 0 ? "st_001" : "st_003",
  statusDate: "2026-05-07",
  morningStatus: index % 5 === 0 ? "ABSENT" : "BOARDED",
  afternoonStatus: index % 4 === 0 ? "AFTERCARE" : "DROPPED"
}));

const aftercareSessions: AftercareSession[] = learners.slice(0, 10).map((learner, index) => ({
  id: `acs_${learner.id}`,
  schoolId: school.id,
  learnerId: learner.id,
  date: "2026-05-07",
  checkInAt: "2026-05-07T14:20:00+02:00",
  checkOutAt: index % 3 === 0 ? undefined : "2026-05-07T16:45:00+02:00",
  supervisorUserId: "usr_005",
  notes: index % 3 === 0 ? "Awaiting pickup." : undefined
}));

const aftercarePickups: AftercarePickup[] = aftercareSessions
  .filter((s) => s.checkOutAt)
  .map((session, index) => ({
    id: `acp_${session.id}`,
    schoolId: school.id,
    aftercareSessionId: session.id,
    collectedByName: `Collector ${index + 1}`,
    relationship: "Parent",
    verifiedByUserId: "usr_005",
    pickupAt: session.checkOutAt as string
  }));

const notifications: Notification[] = [
  { id: "nfy_001", schoolId: school.id, userId: "usr_001", channel: "IN_APP", title: "3 consent forms pending", body: "Parents still need to respond before closing date.", createdAt: "2026-05-07T08:10:00+02:00" },
  { id: "nfy_002", schoolId: school.id, userId: "usr_003", channel: "EMAIL", title: "Proof of payment uploaded", body: "A new proof document needs verification.", createdAt: "2026-05-07T08:30:00+02:00" },
  { id: "nfy_003", schoolId: school.id, userId: "usr_004", channel: "SMS", title: "Route delay reported", body: "North loop is running 8 minutes late.", createdAt: "2026-05-07T07:10:00+02:00", readAt: "2026-05-07T07:15:00+02:00" }
];

const auditLogs: AuditLog[] = [
  { id: "aud_001", schoolId: school.id, actorUserId: "usr_003", action: "FEE_ACCOUNT_BALANCE_UPDATED", entityType: "FeeAccount", entityId: "fa_lrn_006", reason: "Applied verified EFT payment", ipHash: "hash_9f12ab", createdAt: "2026-05-01T15:12:00+02:00" },
  { id: "aud_002", schoolId: school.id, actorUserId: "usr_001", action: "INCIDENT_REPORT_VIEWED", entityType: "IncidentReport", entityId: "inc_002", reason: "Principal escalation follow-up", ipHash: "hash_c781de", createdAt: "2026-05-03T14:00:00+02:00" },
  { id: "aud_003", schoolId: school.id, actorUserId: "usr_005", action: "AFTERCARE_PICKUP_OVERRIDE", entityType: "AftercareSession", entityId: "acs_lrn_003", reason: "Alternate authorized collector confirmed", ipHash: "hash_0ac55f", createdAt: "2026-05-06T17:01:00+02:00" }
];

const messageThreads: MessageThread[] = [
  { id: "thr_001", schoolId: school.id, subject: "Transport timing update for Ariana Meyer", createdByUserId: "usr_004", participantUserIds: ["usr_004", "usr_001"], createdAt: "2026-05-06T16:00:00+02:00" },
  { id: "thr_002", schoolId: school.id, subject: "Fee statement clarification", createdByUserId: "usr_003", participantUserIds: ["usr_003", "usr_001"], createdAt: "2026-05-05T11:20:00+02:00" }
];

const messages: Message[] = [
  { id: "msg_001", schoolId: school.id, threadId: "thr_001", senderUserId: "usr_004", body: "North route will leave 5 minutes earlier from Monday.", sentAt: "2026-05-06T16:01:00+02:00", readByUserIds: ["usr_004", "usr_001"] },
  { id: "msg_002", schoolId: school.id, threadId: "thr_001", senderUserId: "usr_001", body: "Confirmed. I will publish a parent notice.", sentAt: "2026-05-06T16:07:00+02:00", readByUserIds: ["usr_004", "usr_001"] },
  { id: "msg_003", schoolId: school.id, threadId: "thr_002", senderUserId: "usr_003", body: "Please review account code ACC-HVA-L0006 for adjustment.", sentAt: "2026-05-05T11:21:00+02:00", readByUserIds: ["usr_003"] }
];

export const demoData: DemoDataBundle = {
  school,
  roles,
  users,
  grades,
  classes,
  learners,
  guardians,
  learnerGuardianLinks,
  teachers,
  attendanceRecords,
  notices,
  notifications,
  feeAccounts,
  payments,
  proofsOfPayment,
  consentForms,
  consentSubmissions,
  events,
  documents,
  incidentReports,
  transportVehicles,
  drivers,
  transportRoutes,
  transportStops,
  learnerTransportStatuses,
  aftercareSessions,
  aftercarePickups,
  auditLogs,
  messageThreads,
  messages
};
