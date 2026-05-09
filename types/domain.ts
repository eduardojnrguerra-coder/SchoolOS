export type ID = string;
export type ISODate = string;
export type ISODateTime = string;

export type RoleCode =
  | "SUPER_ADMIN"
  | "SCHOOL_ADMIN"
  | "PRINCIPAL"
  | "TEACHER"
  | "FINANCE"
  | "TRANSPORT_MANAGER"
  | "AFTERCARE_STAFF"
  | "PARENT";

export interface School {
  id: ID;
  name: string;
  shortCode: string;
  educationPhase: "ECD" | "PRIMARY" | "COMBINED";
  timezone: string;
  countryCode: "ZA";
  province: string;
  town: string;
  supportEmail: string;
  supportPhone: string;
  createdAt: ISODateTime;
}

export interface Role {
  id: ID;
  code: RoleCode;
  label: string;
  description: string;
}

export interface User {
  id: ID;
  schoolId: ID;
  roleCode: RoleCode;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  lastLoginAt?: ISODateTime;
  createdAt: ISODateTime;
}

export interface Grade {
  id: ID;
  schoolId: ID;
  code: string;
  label: string;
  sortOrder: number;
}

export interface Class {
  id: ID;
  schoolId: ID;
  gradeId: ID;
  classCode: string;
  className: string;
  roomLabel: string;
  teacherId: ID;
}

export interface Learner {
  id: ID;
  schoolId: ID;
  learnerCode: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  gradeId: ID;
  classId: ID;
  enrollmentDate: ISODate;
  status: "ACTIVE" | "INACTIVE";
  medicalAlertSummary?: string;
}

export interface ParentGuardian {
  id: ID;
  schoolId: ID;
  fullName: string;
  relationshipToLearner: "MOTHER" | "FATHER" | "GUARDIAN" | "AUNT" | "UNCLE" | "GRANDPARENT";
  email: string;
  phone: string;
  isPrimaryContact: boolean;
  receivesBilling: boolean;
}

export interface LearnerGuardianLink {
  id: ID;
  learnerId: ID;
  guardianId: ID;
  custodyLevel: "PRIMARY" | "SHARED" | "EMERGENCY_ONLY";
  pickupAuthorized: boolean;
}

export interface Teacher {
  id: ID;
  schoolId: ID;
  userId: ID;
  employeeCode: string;
  specialization: string;
  homeroomClassId?: ID;
}

export interface AttendanceRecord {
  id: ID;
  schoolId: ID;
  learnerId: ID;
  classId: ID;
  date: ISODate;
  status: "PRESENT" | "ABSENT" | "LATE" | "LEFT_EARLY" | "SICK_BAY" | "EXCUSED";
  capturedByUserId: ID;
  note?: string;
  capturedAt: ISODateTime;
}

export interface Notice {
  id: ID;
  schoolId: ID;
  title: string;
  body: string;
  audience: "ALL" | "PARENTS" | "TEACHERS" | "CLASS";
  classId?: ID;
  createdByUserId: ID;
  publishedAt: ISODateTime;
  expiresAt?: ISODateTime;
}

export interface Notification {
  id: ID;
  schoolId: ID;
  userId: ID;
  channel: "IN_APP" | "EMAIL" | "SMS";
  title: string;
  body: string;
  readAt?: ISODateTime;
  createdAt: ISODateTime;
}

export interface FeeAccount {
  id: ID;
  schoolId: ID;
  learnerId: ID;
  accountCode: string;
  billingCycle: "MONTHLY" | "TERM";
  currency: "ZAR";
  currentBalance: number;
  overdueAmount: number;
  updatedAt: ISODateTime;
}

export interface Payment {
  id: ID;
  schoolId: ID;
  feeAccountId: ID;
  amount: number;
  currency: "ZAR";
  paidAt: ISODateTime;
  method: "EFT" | "CARD" | "CASH";
  reference: string;
  capturedByUserId?: ID;
}

export interface ProofOfPayment {
  id: ID;
  schoolId: ID;
  paymentId: ID;
  uploadedByUserId: ID;
  fileName: string;
  filePath: string;
  verifiedByUserId?: ID;
  verifiedAt?: ISODateTime;
  status: "PENDING" | "VERIFIED" | "REJECTED";
}

export interface ConsentForm {
  id: ID;
  schoolId: ID;
  title: string;
  description: string;
  category: "EXCURSION" | "MEDIA" | "MEDICAL" | "GENERAL";
  requiresSignature: boolean;
  createdByUserId: ID;
  openAt: ISODateTime;
  closeAt: ISODateTime;
}

export interface ConsentSubmission {
  id: ID;
  schoolId: ID;
  consentFormId: ID;
  learnerId: ID;
  guardianId: ID;
  response: "APPROVED" | "DECLINED";
  submittedAt: ISODateTime;
  signatureText?: string;
}

export interface Event {
  id: ID;
  schoolId: ID;
  title: string;
  description: string;
  location: string;
  startsAt: ISODateTime;
  endsAt: ISODateTime;
  visibility: "ALL" | "PARENTS" | "STAFF" | "CLASS";
  classId?: ID;
}

export interface Document {
  id: ID;
  schoolId: ID;
  title: string;
  category: "POLICY" | "ACADEMIC" | "FINANCE" | "TRANSPORT" | "AFTERCARE";
  audience: "ALL" | "PARENTS" | "STAFF";
  filePath: string;
  uploadedByUserId: ID;
  uploadedAt: ISODateTime;
}

export interface IncidentReport {
  id: ID;
  schoolId: ID;
  learnerId: ID;
  reportedByUserId: ID;
  severity: "LOW" | "MEDIUM" | "HIGH";
  category: "BEHAVIOUR" | "SAFETY" | "MEDICAL" | "BULLYING";
  summary: string;
  actionTaken: string;
  occurredAt: ISODateTime;
  createdAt: ISODateTime;
}

export interface TransportVehicle {
  id: ID;
  schoolId: ID;
  label: string;
  registrationCode: string;
  capacity: number;
  isActive: boolean;
}

export interface Driver {
  id: ID;
  schoolId: ID;
  fullName: string;
  phone: string;
  licenseCode: string;
  isActive: boolean;
}

export interface TransportRoute {
  id: ID;
  schoolId: ID;
  routeCode: string;
  routeName: string;
  vehicleId: ID;
  driverId: ID;
  morningDepartureTime: string;
  afternoonDepartureTime: string;
  isActive: boolean;
}

export interface TransportStop {
  id: ID;
  schoolId: ID;
  routeId: ID;
  stopName: string;
  sequence: number;
  pickupTime: string;
  dropoffTime: string;
}

export interface LearnerTransportStatus {
  id: ID;
  schoolId: ID;
  learnerId: ID;
  routeId: ID;
  stopId: ID;
  statusDate: ISODate;
  morningStatus: "BOARDING" | "BOARDED" | "ABSENT";
  afternoonStatus: "DROPPED" | "PICKED_UP" | "AFTERCARE";
}

export interface AftercareSession {
  id: ID;
  schoolId: ID;
  learnerId: ID;
  date: ISODate;
  checkInAt: ISODateTime;
  checkOutAt?: ISODateTime;
  supervisorUserId: ID;
  notes?: string;
}

export interface AftercarePickup {
  id: ID;
  schoolId: ID;
  aftercareSessionId: ID;
  collectedByName: string;
  relationship: string;
  verifiedByUserId: ID;
  pickupAt: ISODateTime;
}

export interface AuditLog {
  id: ID;
  schoolId: ID;
  actorUserId: ID;
  action: string;
  entityType: string;
  entityId: ID;
  reason?: string;
  ipHash: string;
  createdAt: ISODateTime;
}

export interface MessageThread {
  id: ID;
  schoolId: ID;
  subject: string;
  createdByUserId: ID;
  participantUserIds: ID[];
  createdAt: ISODateTime;
}

export interface Message {
  id: ID;
  schoolId: ID;
  threadId: ID;
  senderUserId: ID;
  body: string;
  sentAt: ISODateTime;
  readByUserIds: ID[];
}

export interface DemoDataBundle {
  school: School;
  roles: Role[];
  users: User[];
  grades: Grade[];
  classes: Class[];
  learners: Learner[];
  guardians: ParentGuardian[];
  learnerGuardianLinks: LearnerGuardianLink[];
  teachers: Teacher[];
  attendanceRecords: AttendanceRecord[];
  notices: Notice[];
  notifications: Notification[];
  feeAccounts: FeeAccount[];
  payments: Payment[];
  proofsOfPayment: ProofOfPayment[];
  consentForms: ConsentForm[];
  consentSubmissions: ConsentSubmission[];
  events: Event[];
  documents: Document[];
  incidentReports: IncidentReport[];
  transportVehicles: TransportVehicle[];
  drivers: Driver[];
  transportRoutes: TransportRoute[];
  transportStops: TransportStop[];
  learnerTransportStatuses: LearnerTransportStatus[];
  aftercareSessions: AftercareSession[];
  aftercarePickups: AftercarePickup[];
  auditLogs: AuditLog[];
  messageThreads: MessageThread[];
  messages: Message[];
}
