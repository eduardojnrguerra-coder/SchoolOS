import { demoData as seedDemoData } from "@/demo-data/seed";
import { getDataMode } from "@/src/lib/demoMode";
import { getRuntimeDataBundle, setRuntimeDataBundle } from "@/src/lib/runtimeDataStore";
import { createSupabaseBrowserClient } from "@/src/lib/supabase";
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
  RoleCode,
  School,
  Teacher,
  TransportRoute,
  TransportStop,
  TransportVehicle,
  User
} from "@/types/domain";

export type DataProviderMode = "demo" | "supabase";
export type SupabaseRow = Record<string, unknown>;

export type DataProviderError = {
  message: string;
  hint: string;
  table?: string;
  code?: string;
  details?: string;
};

export type DataProviderResult<T> = {
  data: T;
  mode: DataProviderMode;
  usingFallback: boolean;
  error?: DataProviderError;
};

export type DataProviderOptions = {
  forceDemo?: boolean;
  schoolId?: string;
};

export type DataProviderMutationResult<T> = {
  data?: T;
  mode: DataProviderMode;
  error?: DataProviderError;
};

type SupabaseErrorLike = {
  message: string;
  code?: string;
  details?: string | null;
  hint?: string | null;
};

type QueryOptions<T> = DataProviderOptions & {
  table: string;
  fallback: T[];
  mapper: (row: SupabaseRow) => T;
  select?: string;
  order?: { column: string; ascending?: boolean };
  limit?: number;
};

export type AttendanceUpsertInput = {
  schoolId: string;
  learnerId: string;
  classId?: string;
  date: string;
  status: AttendanceRecord["status"];
  note?: string;
  capturedByUserId?: string;
};

export type NoticeInsertInput = {
  schoolId: string;
  title: string;
  body: string;
  priority?: string;
  createdByUserId?: string;
  scheduledFor?: string;
  publishedAt?: string;
  expiresAt?: string;
  attachmentPath?: string;
  audienceType?: string;
  audienceTargetId?: string;
};

export type ProofOfPaymentInsertInput = {
  schoolId: string;
  feeAccountId: string;
  paymentId?: string;
  uploadedByUserId?: string;
  filePath: string;
};

export type ConsentSubmissionUpsertInput = {
  schoolId: string;
  consentFormId: string;
  learnerId: string;
  parentId?: string;
  status: string;
  answers?: Record<string, unknown>;
  signatureText?: string;
  acceptedAt?: string;
  acceptedByUserId?: string;
  ipHash?: string;
};

export type IncidentInsertInput = {
  schoolId: string;
  learnerId: string;
  incidentType: string;
  severity: IncidentReport["severity"];
  notes?: string;
  parentNotified?: boolean;
  followUpRequired?: boolean;
  parentVisible?: boolean;
  reportedByUserId?: string;
  occurredAt?: string;
};

export type TransportStatusLogInput = {
  schoolId: string;
  routeId?: string;
  learnerId?: string;
  status: string;
  note?: string;
  loggedByUserId?: string;
};

export type AftercareCheckInInput = {
  schoolId: string;
  learnerId: string;
  date: string;
  checkInAt?: string;
  supervisorUserId?: string;
  mealNotes?: string;
  homeworkNotes?: string;
};

export type AftercareCheckOutInput = {
  schoolId: string;
  sessionId: string;
  checkOutAt?: string;
  collectedByName?: string;
  relationship?: string;
  verifiedByUserId?: string;
};

const roleCodes: RoleCode[] = [
  "SUPER_ADMIN",
  "SCHOOL_ADMIN",
  "PRINCIPAL",
  "TEACHER",
  "FINANCE",
  "TRANSPORT_MANAGER",
  "AFTERCARE_STAFF",
  "PARENT"
];

function nowIso() {
  return new Date().toISOString();
}

function newId(prefix: string) {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  return `${prefix}_${random}`;
}

function read(row: SupabaseRow, key: string) {
  return row[key];
}

function asString(row: SupabaseRow, key: string, fallback = "") {
  const value = read(row, key);
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function asOptionalString(row: SupabaseRow, key: string) {
  const value = asString(row, key);
  return value || undefined;
}

function asNumber(row: SupabaseRow, key: string, fallback = 0) {
  const value = read(row, key);
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function asBoolean(row: SupabaseRow, key: string, fallback = false) {
  const value = read(row, key);
  return typeof value === "boolean" ? value : fallback;
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function roleCode(value: unknown): RoleCode {
  return roleCodes.includes(value as RoleCode) ? (value as RoleCode) : "PARENT";
}

function formatSupabaseError(error: SupabaseErrorLike, table?: string): DataProviderError {
  const message = error.message.toLowerCase();
  const missingTable = error.code === "42P01" || message.includes("does not exist");
  const rlsDenied = error.code === "42501" || message.includes("permission denied");
  return {
    table,
    code: error.code,
    details: error.details ?? undefined,
    message: missingTable
      ? `Supabase table${table ? ` '${table}'` : ""} is missing.`
      : rlsDenied
        ? `Supabase RLS blocked access${table ? ` to '${table}'` : ""}.`
        : error.message,
    hint: missingTable
      ? "Run supabase/schema.sql, then seed the missing table. Pine X is showing demo data until the table exists."
      : rlsDenied
        ? "Check that the signed-in Supabase user has users and user_roles rows for this school. Pine X is showing demo data instead of bypassing RLS."
        : "Pine X is showing demo data for this request. Check Supabase table names, seed data, and RLS policies."
  };
}

function demoResult<T>(data: T, options: DataProviderOptions = {}, error?: DataProviderError): DataProviderResult<T> {
  return {
    data,
    mode: "demo",
    usingFallback: Boolean(error) || getDataMode(options) === "demo",
    error
  };
}

function shouldUseDemo(options: DataProviderOptions = {}) {
  return getDataMode(options) === "demo";
}

export function getActiveDataProviderMode(options: DataProviderOptions = {}): DataProviderMode {
  return getDataMode(options);
}

export function getDemoDataBundle(): DemoDataBundle {
  return seedDemoData;
}

async function readRows<T>({
  table,
  select = "*",
  order,
  limit,
  fallback,
  mapper,
  schoolId,
  forceDemo
}: QueryOptions<T>): Promise<DataProviderResult<T[]>> {
  const options = { schoolId, forceDemo };
  if (shouldUseDemo(options)) return demoResult(fallback, options);

  const supabase = createSupabaseBrowserClient();
  if (!supabase) return demoResult(fallback, options);

  let query = supabase.from(table).select(select);
  if (schoolId && table !== "schools") query = query.eq("school_id", schoolId);
  if (order) query = query.order(order.column, { ascending: order.ascending ?? true });
  if (typeof limit === "number") query = query.limit(limit);

  const { data, error } = await query;
  if (error) return demoResult(fallback, options, formatSupabaseError(error, table));
  return { data: asArray<SupabaseRow>(data).map(mapper), mode: "supabase", usingFallback: false };
}

function mapSchool(row: SupabaseRow): School {
  return {
    id: asString(row, "id"),
    name: asString(row, "name", "Selected school"),
    shortCode: asString(row, "short_code", "SCHOOL"),
    educationPhase: "COMBINED",
    timezone: asString(row, "timezone", "Africa/Johannesburg"),
    countryCode: "ZA",
    province: asString(row, "province", "Western Cape"),
    town: asString(row, "town"),
    supportEmail: "",
    supportPhone: "",
    createdAt: asString(row, "created_at", nowIso())
  };
}

function mapUser(row: SupabaseRow): User {
  const roleRows = asArray<SupabaseRow>(read(row, "user_roles"));
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    roleCode: roleCode(roleRows[0]?.role),
    fullName: asString(row, "full_name", "School user"),
    email: asString(row, "email"),
    phone: asString(row, "phone"),
    isActive: asBoolean(row, "is_active", true),
    createdAt: asString(row, "created_at", nowIso())
  };
}

function mapGrade(row: SupabaseRow): Grade {
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    code: asString(row, "code"),
    label: asString(row, "label"),
    sortOrder: asNumber(row, "sort_order")
  };
}

function mapClass(row: SupabaseRow): Class {
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    gradeId: asString(row, "grade_id"),
    classCode: asString(row, "class_code"),
    className: asString(row, "class_name"),
    roomLabel: asString(row, "room_label"),
    teacherId: asString(row, "teacher_id")
  };
}

function mapLearner(row: SupabaseRow): Learner {
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    learnerCode: asString(row, "learner_code"),
    firstName: asString(row, "first_name"),
    lastName: asString(row, "last_name"),
    preferredName: asOptionalString(row, "preferred_name"),
    gradeId: asString(row, "grade_id"),
    classId: asString(row, "class_id"),
    enrollmentDate: asString(row, "enrollment_date"),
    status: asString(row, "status", "ACTIVE") === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    medicalAlertSummary: asOptionalString(row, "medical_alert_summary")
  };
}

function mapParent(row: SupabaseRow): ParentGuardian {
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    fullName: asString(row, "full_name"),
    relationshipToLearner: (asString(row, "relationship", "GUARDIAN") as ParentGuardian["relationshipToLearner"]) || "GUARDIAN",
    email: asString(row, "email"),
    phone: asString(row, "phone"),
    isPrimaryContact: asBoolean(row, "is_primary_contact"),
    receivesBilling: asBoolean(row, "receives_billing")
  };
}

function mapLearnerParent(row: SupabaseRow): LearnerGuardianLink {
  return {
    id: asString(row, "id"),
    learnerId: asString(row, "learner_id"),
    guardianId: asString(row, "parent_id"),
    custodyLevel: (asString(row, "custody_level", "SHARED") as LearnerGuardianLink["custodyLevel"]) || "SHARED",
    pickupAuthorized: asBoolean(row, "pickup_authorized")
  };
}

function mapTeacher(row: SupabaseRow): Teacher {
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    userId: asString(row, "user_id"),
    employeeCode: asString(row, "employee_code"),
    specialization: asString(row, "specialization")
  };
}

function mapAttendance(row: SupabaseRow): AttendanceRecord {
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    learnerId: asString(row, "learner_id"),
    classId: asString(row, "class_id"),
    date: asString(row, "attendance_date"),
    status: asString(row, "status", "PRESENT") as AttendanceRecord["status"],
    capturedByUserId: asString(row, "captured_by"),
    note: asOptionalString(row, "note"),
    capturedAt: asString(row, "created_at", nowIso())
  };
}

function mapNotice(row: SupabaseRow): Notice {
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    title: asString(row, "title"),
    body: asString(row, "body"),
    audience: "ALL",
    createdByUserId: asString(row, "created_by"),
    publishedAt: asString(row, "published_at", asString(row, "scheduled_for", asString(row, "created_at", nowIso()))),
    expiresAt: asOptionalString(row, "expires_at")
  };
}

function mapNotification(row: SupabaseRow): Notification {
  const channel = asString(row, "channel", "IN_APP");
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    userId: asString(row, "user_id"),
    channel: channel === "EMAIL" ? "EMAIL" : channel === "SMS" ? "SMS" : "IN_APP",
    title: asString(row, "title"),
    body: asString(row, "body"),
    readAt: asOptionalString(row, "read_at"),
    createdAt: asString(row, "created_at", nowIso())
  };
}

function mapFeeAccount(row: SupabaseRow): FeeAccount {
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    learnerId: asString(row, "learner_id"),
    accountCode: asString(row, "account_code"),
    billingCycle: asString(row, "billing_cycle", "MONTHLY") as FeeAccount["billingCycle"],
    currency: "ZAR",
    currentBalance: asNumber(row, "current_balance"),
    overdueAmount: asNumber(row, "overdue_amount"),
    updatedAt: asString(row, "updated_at", nowIso())
  };
}

function mapPayment(row: SupabaseRow): Payment {
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    feeAccountId: asString(row, "fee_account_id"),
    amount: asNumber(row, "amount"),
    currency: "ZAR",
    paidAt: asString(row, "paid_at", asString(row, "created_at", nowIso())),
    method: asString(row, "method", "EFT") as Payment["method"],
    reference: asString(row, "reference"),
    capturedByUserId: asOptionalString(row, "captured_by")
  };
}

function mapProof(row: SupabaseRow): ProofOfPayment {
  const filePath = asString(row, "file_path");
  const status = asString(row, "status", "PENDING");
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    paymentId: asString(row, "payment_id"),
    uploadedByUserId: asString(row, "uploaded_by"),
    fileName: filePath.split("/").pop() || "proof-of-payment.pdf",
    filePath,
    verifiedByUserId: asOptionalString(row, "verified_by"),
    verifiedAt: asOptionalString(row, "verified_at"),
    status: status === "REJECTED" ? "REJECTED" : status === "VERIFIED" ? "VERIFIED" : "PENDING"
  };
}

function mapConsentForm(row: SupabaseRow): ConsentForm {
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    title: asString(row, "title"),
    description: asString(row, "description"),
    category: "GENERAL",
    requiresSignature: asBoolean(row, "requires_signature", true),
    createdByUserId: asString(row, "created_by"),
    openAt: asString(row, "created_at", nowIso()),
    closeAt: asString(row, "due_at", nowIso())
  };
}

function mapConsentSubmission(row: SupabaseRow): ConsentSubmission {
  const status = asString(row, "status");
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    consentFormId: asString(row, "consent_form_id"),
    learnerId: asString(row, "learner_id"),
    guardianId: asString(row, "parent_id"),
    response: status === "DECLINED" ? "DECLINED" : "APPROVED",
    submittedAt: asString(row, "accepted_at", asString(row, "updated_at", nowIso())),
    signatureText: asOptionalString(row, "signature_text")
  };
}

function mapEvent(row: SupabaseRow): Event {
  const audience = asString(row, "audience_type", "ALL");
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    title: asString(row, "title"),
    description: asString(row, "description"),
    location: asString(row, "location"),
    startsAt: asString(row, "starts_at", nowIso()),
    endsAt: asString(row, "ends_at", asString(row, "starts_at", nowIso())),
    visibility: audience === "CLASS" ? "CLASS" : audience === "STAFF" ? "STAFF" : audience === "PARENTS" ? "PARENTS" : "ALL",
    classId: audience === "CLASS" ? asOptionalString(row, "audience_target_id") : undefined
  };
}

function mapDocument(row: SupabaseRow): Document {
  const visibility = asString(row, "visibility_type", "ALL");
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    title: asString(row, "title"),
    category: (asString(row, "category", "POLICY") as Document["category"]) || "POLICY",
    audience: visibility === "STAFF" ? "STAFF" : visibility === "PARENTS" ? "PARENTS" : "ALL",
    filePath: asString(row, "storage_path"),
    uploadedByUserId: asString(row, "uploaded_by"),
    uploadedAt: asString(row, "created_at", nowIso())
  };
}

function mapIncident(row: SupabaseRow): IncidentReport {
  const incidentType = asString(row, "incident_type", "OTHER").toUpperCase();
  const category: IncidentReport["category"] = incidentType.includes("BULLY")
    ? "BULLYING"
    : incidentType.includes("SICK") || incidentType.includes("MEDICATION")
      ? "MEDICAL"
      : incidentType.includes("BEHAV")
        ? "BEHAVIOUR"
        : "SAFETY";
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    learnerId: asString(row, "learner_id"),
    reportedByUserId: asString(row, "reported_by"),
    severity: asString(row, "severity", "LOW").toUpperCase() as IncidentReport["severity"],
    category,
    summary: asString(row, "notes", "Incident logged"),
    actionTaken: asBoolean(row, "parent_notified") ? "Parent notified" : "Internal follow-up pending",
    occurredAt: asString(row, "occurred_at", nowIso()),
    createdAt: asString(row, "created_at", nowIso())
  };
}

function mapVehicle(row: SupabaseRow): TransportVehicle {
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    label: asString(row, "label"),
    registrationCode: asString(row, "registration_code"),
    capacity: asNumber(row, "capacity"),
    isActive: asBoolean(row, "is_active", true)
  };
}

function mapDriver(row: SupabaseRow): Driver {
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    fullName: asString(row, "full_name"),
    phone: asString(row, "phone"),
    licenseCode: asString(row, "license_code"),
    isActive: asBoolean(row, "is_active", true)
  };
}

function mapRoute(row: SupabaseRow): TransportRoute {
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    routeCode: asString(row, "route_code"),
    routeName: asString(row, "route_name"),
    vehicleId: asString(row, "vehicle_id"),
    driverId: asString(row, "driver_id"),
    morningDepartureTime: "07:00",
    afternoonDepartureTime: "14:30",
    isActive: true
  };
}

function mapStop(row: SupabaseRow): TransportStop {
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    routeId: asString(row, "route_id"),
    stopName: asString(row, "stop_name"),
    sequence: asNumber(row, "sequence"),
    pickupTime: asString(row, "pickup_time"),
    dropoffTime: asString(row, "dropoff_time")
  };
}

function mapTransportAssignment(row: SupabaseRow): LearnerTransportStatus {
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    learnerId: asString(row, "learner_id"),
    routeId: asString(row, "route_id"),
    stopId: asString(row, "stop_id"),
    statusDate: new Date().toISOString().slice(0, 10),
    morningStatus: "BOARDING",
    afternoonStatus: "AFTERCARE"
  };
}

function mapAftercareSession(row: SupabaseRow): AftercareSession {
  const mealNotes = asString(row, "meal_notes");
  const homeworkNotes = asString(row, "homework_notes");
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    learnerId: asString(row, "learner_id"),
    date: asString(row, "session_date"),
    checkInAt: asString(row, "check_in_at", nowIso()),
    checkOutAt: asOptionalString(row, "check_out_at"),
    supervisorUserId: asString(row, "supervisor_user_id"),
    notes: [mealNotes, homeworkNotes].filter(Boolean).join(" | ") || undefined
  };
}

function mapAftercarePickup(row: SupabaseRow): AftercarePickup {
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    aftercareSessionId: asString(row, "aftercare_session_id"),
    collectedByName: asString(row, "collected_by_name"),
    relationship: asString(row, "relationship"),
    verifiedByUserId: asString(row, "verified_by"),
    pickupAt: asString(row, "pickup_at", nowIso())
  };
}

function mapAuditLog(row: SupabaseRow): AuditLog {
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    actorUserId: asString(row, "actor_user_id"),
    action: asString(row, "action"),
    entityType: asString(row, "entity_type"),
    entityId: asString(row, "entity_id"),
    reason: asOptionalString(row, "reason"),
    ipHash: asString(row, "ip_hash"),
    createdAt: asString(row, "created_at", nowIso())
  };
}

function mapMessageThread(row: SupabaseRow): MessageThread {
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    subject: asString(row, "subject"),
    createdByUserId: asString(row, "created_by"),
    participantUserIds: asArray<string>(read(row, "participant_user_ids")),
    createdAt: asString(row, "created_at", nowIso())
  };
}

function mapMessage(row: SupabaseRow): Message {
  return {
    id: asString(row, "id"),
    schoolId: asString(row, "school_id"),
    threadId: asString(row, "thread_id"),
    senderUserId: asString(row, "sender_user_id"),
    body: asString(row, "body"),
    sentAt: asString(row, "created_at", nowIso()),
    readByUserIds: asArray<string>(read(row, "read_by_user_ids"))
  };
}

export async function getCurrentSchool(options: DataProviderOptions = {}): Promise<DataProviderResult<School | null>> {
  if (shouldUseDemo(options)) return demoResult(seedDemoData.school, options);
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return demoResult(seedDemoData.school, options);

  const query = options.schoolId
    ? supabase.from("schools").select("*").eq("id", options.schoolId).maybeSingle()
    : supabase.from("schools").select("*").limit(1).maybeSingle();
  const { data, error } = await query;
  if (error) return demoResult(seedDemoData.school, options, formatSupabaseError(error, "schools"));
  if (!data) {
    return demoResult(seedDemoData.school, options, {
      table: "schools",
      message: "No school record was returned from Supabase.",
      hint: "Create a schools row and make sure the signed-in user has a matching users.school_id. Demo data is shown for now."
    });
  }
  return { data: mapSchool(data as SupabaseRow), mode: "supabase", usingFallback: false };
}

export const getLearners = (options: DataProviderOptions = {}) =>
  readRows({ table: "learners", fallback: seedDemoData.learners, mapper: mapLearner, order: { column: "last_name" }, ...options });
export const getParents = (options: DataProviderOptions = {}) =>
  readRows({ table: "parents", fallback: seedDemoData.guardians, mapper: mapParent, order: { column: "full_name" }, ...options });
export const getClasses = (options: DataProviderOptions = {}) =>
  readRows({ table: "classes", fallback: seedDemoData.classes, mapper: mapClass, order: { column: "class_code" }, ...options });
export const getAttendanceRecords = (options: DataProviderOptions = {}) =>
  readRows({ table: "attendance_records", fallback: seedDemoData.attendanceRecords, mapper: mapAttendance, order: { column: "attendance_date", ascending: false }, ...options });
export const getNotices = (options: DataProviderOptions = {}) =>
  readRows({ table: "notices", fallback: seedDemoData.notices, mapper: mapNotice, order: { column: "created_at", ascending: false }, ...options });
export const getNotifications = (options: DataProviderOptions = {}) =>
  readRows({ table: "notifications", fallback: seedDemoData.notifications, mapper: mapNotification, order: { column: "created_at", ascending: false }, ...options });
export const getFeeAccounts = (options: DataProviderOptions = {}) =>
  readRows({ table: "fee_accounts", fallback: seedDemoData.feeAccounts, mapper: mapFeeAccount, order: { column: "updated_at", ascending: false }, ...options });
export const getConsentForms = (options: DataProviderOptions = {}) =>
  readRows({ table: "consent_forms", fallback: seedDemoData.consentForms, mapper: mapConsentForm, order: { column: "created_at", ascending: false }, ...options });
export const getEvents = (options: DataProviderOptions = {}) =>
  readRows({ table: "events", fallback: seedDemoData.events, mapper: mapEvent, order: { column: "starts_at" }, ...options });
export const getDocuments = (options: DataProviderOptions = {}) =>
  readRows({ table: "documents", fallback: seedDemoData.documents, mapper: mapDocument, order: { column: "created_at", ascending: false }, ...options });
export const getIncidents = (options: DataProviderOptions = {}) =>
  readRows({ table: "incident_reports", fallback: seedDemoData.incidentReports, mapper: mapIncident, order: { column: "occurred_at", ascending: false }, ...options });
export const getTransportRoutes = (options: DataProviderOptions = {}) =>
  readRows({ table: "transport_routes", fallback: seedDemoData.transportRoutes, mapper: mapRoute, order: { column: "route_name" }, ...options });
export const getAftercareSessions = (options: DataProviderOptions = {}) =>
  readRows({ table: "aftercare_sessions", fallback: seedDemoData.aftercareSessions, mapper: mapAftercareSession, order: { column: "session_date", ascending: false }, ...options });

async function getSchoolDataPieces(options: DataProviderOptions) {
  const [
    school,
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
  ] = await Promise.all([
    getCurrentSchool(options),
    readRows({ table: "users", select: "*, user_roles(role)", fallback: seedDemoData.users, mapper: mapUser, order: { column: "full_name" }, ...options }),
    readRows({ table: "grades", fallback: seedDemoData.grades, mapper: mapGrade, order: { column: "sort_order" }, ...options }),
    getClasses(options),
    getLearners(options),
    getParents(options),
    readRows({ table: "learner_parents", fallback: seedDemoData.learnerGuardianLinks, mapper: mapLearnerParent, ...options }),
    readRows({ table: "teachers", fallback: seedDemoData.teachers, mapper: mapTeacher, order: { column: "employee_code" }, ...options }),
    getAttendanceRecords(options),
    getNotices(options),
    getNotifications(options),
    getFeeAccounts(options),
    readRows({ table: "payments", fallback: seedDemoData.payments, mapper: mapPayment, order: { column: "paid_at", ascending: false }, ...options }),
    readRows({ table: "proof_of_payments", fallback: seedDemoData.proofsOfPayment, mapper: mapProof, order: { column: "created_at", ascending: false }, ...options }),
    getConsentForms(options),
    readRows({ table: "consent_submissions", fallback: seedDemoData.consentSubmissions, mapper: mapConsentSubmission, order: { column: "updated_at", ascending: false }, ...options }),
    getEvents(options),
    getDocuments(options),
    getIncidents(options),
    readRows({ table: "transport_vehicles", fallback: seedDemoData.transportVehicles, mapper: mapVehicle, order: { column: "label" }, ...options }),
    readRows({ table: "drivers", fallback: seedDemoData.drivers, mapper: mapDriver, order: { column: "full_name" }, ...options }),
    getTransportRoutes(options),
    readRows({ table: "transport_stops", fallback: seedDemoData.transportStops, mapper: mapStop, order: { column: "sequence" }, ...options }),
    readRows({ table: "learner_transport_assignments", fallback: seedDemoData.learnerTransportStatuses, mapper: mapTransportAssignment, ...options }),
    getAftercareSessions(options),
    readRows({ table: "aftercare_pickups", fallback: seedDemoData.aftercarePickups, mapper: mapAftercarePickup, order: { column: "pickup_at", ascending: false }, ...options }),
    readRows({ table: "audit_logs", fallback: seedDemoData.auditLogs, mapper: mapAuditLog, order: { column: "created_at", ascending: false }, ...options }),
    readRows({ table: "message_threads", fallback: seedDemoData.messageThreads, mapper: mapMessageThread, order: { column: "created_at", ascending: false }, ...options }),
    readRows({ table: "messages", fallback: seedDemoData.messages, mapper: mapMessage, order: { column: "created_at" }, ...options })
  ]);

  const classRows = classes.data as Class[];
  const bundle = {
    school: school.data ?? seedDemoData.school,
    roles: seedDemoData.roles as Role[],
    users: users.data as User[],
    grades: grades.data as Grade[],
    classes: classRows,
    learners: learners.data as Learner[],
    guardians: guardians.data as ParentGuardian[],
    learnerGuardianLinks: learnerGuardianLinks.data as LearnerGuardianLink[],
    teachers: (teachers.data as Teacher[]).map((teacher) => ({
      ...teacher,
      homeroomClassId: classRows.find((item) => item.teacherId === teacher.id)?.id
    })),
    attendanceRecords: attendanceRecords.data as AttendanceRecord[],
    notices: notices.data as Notice[],
    notifications: notifications.data as Notification[],
    feeAccounts: feeAccounts.data as FeeAccount[],
    payments: payments.data as Payment[],
    proofsOfPayment: proofsOfPayment.data as ProofOfPayment[],
    consentForms: consentForms.data as ConsentForm[],
    consentSubmissions: consentSubmissions.data as ConsentSubmission[],
    events: events.data as Event[],
    documents: documents.data as Document[],
    incidentReports: incidentReports.data as IncidentReport[],
    transportVehicles: transportVehicles.data as TransportVehicle[],
    drivers: drivers.data as Driver[],
    transportRoutes: transportRoutes.data as TransportRoute[],
    transportStops: transportStops.data as TransportStop[],
    learnerTransportStatuses: learnerTransportStatuses.data as LearnerTransportStatus[],
    aftercareSessions: aftercareSessions.data as AftercareSession[],
    aftercarePickups: aftercarePickups.data as AftercarePickup[],
    auditLogs: auditLogs.data as AuditLog[],
    messageThreads: messageThreads.data as MessageThread[],
    messages: messages.data as Message[]
  } satisfies DemoDataBundle;

  return {
    results: [
      school,
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
    ],
    bundle
  };
}

export async function getSchoolDataBundle(options: DataProviderOptions = {}): Promise<DataProviderResult<DemoDataBundle>> {
  if (shouldUseDemo(options)) {
    setRuntimeDataBundle(seedDemoData);
    return demoResult(seedDemoData, options);
  }

  const { results, bundle } = await getSchoolDataPieces(options);
  const firstError = results.find((result) => result.error)?.error;
  if (firstError) {
    setRuntimeDataBundle(seedDemoData);
    return demoResult(seedDemoData, options, firstError);
  }

  setRuntimeDataBundle(bundle);
  return { data: bundle, mode: "supabase", usingFallback: false };
}

export async function getSchoolDashboardData(options: DataProviderOptions = {}) {
  return getSchoolDataBundle(options);
}

async function mutateSupabase<T>(
  table: string,
  operation: () => Promise<{ data: unknown; error: SupabaseErrorLike | null }>,
  demoData: T,
  options: DataProviderOptions = {}
): Promise<DataProviderMutationResult<T>> {
  if (shouldUseDemo(options)) return { data: demoData, mode: "demo" };
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return { data: demoData, mode: "demo" };
  const { data, error } = await operation();
  if (error) return { mode: "supabase", error: formatSupabaseError(error, table) };
  return { data: data as T, mode: "supabase" };
}

export async function upsertAttendance(input: AttendanceUpsertInput | AttendanceUpsertInput[], options: DataProviderOptions = {}) {
  const rows = (Array.isArray(input) ? input : [input]).map((item) => ({
    school_id: item.schoolId,
    learner_id: item.learnerId,
    class_id: item.classId,
    attendance_date: item.date,
    status: item.status,
    note: item.note,
    captured_by: item.capturedByUserId
  }));
  const demoRecords = rows.map((row) => mapAttendance({ ...row, id: newId("att"), created_at: nowIso() }));
  return mutateSupabase(
    "attendance_records",
    async () => {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return { data: demoRecords, error: null };
      return supabase.from("attendance_records").upsert(rows, { onConflict: "learner_id,attendance_date" }).select("*");
    },
    demoRecords,
    options
  );
}

export async function insertNotice(input: NoticeInsertInput, options: DataProviderOptions = {}) {
  const noticeRow = {
    school_id: input.schoolId,
    title: input.title,
    body: input.body,
    priority: input.priority ?? "NORMAL",
    created_by: input.createdByUserId,
    scheduled_for: input.scheduledFor,
    published_at: input.publishedAt ?? nowIso(),
    expires_at: input.expiresAt,
    attachment_path: input.attachmentPath
  };
  const demoNotice = mapNotice({ ...noticeRow, id: newId("ntc"), created_at: nowIso() });
  return mutateSupabase(
    "notices",
    async () => {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return { data: demoNotice, error: null };
      const { data, error } = await supabase.from("notices").insert(noticeRow).select("*").single();
      if (error || !data) return { data, error };
      if (input.audienceType) {
        await supabase.from("notice_audiences").insert({
          school_id: input.schoolId,
          notice_id: data.id,
          audience_type: input.audienceType,
          target_id: input.audienceTargetId || null
        });
      }
      return { data, error: null };
    },
    demoNotice,
    options
  );
}

export async function insertProofOfPayment(input: ProofOfPaymentInsertInput, options: DataProviderOptions = {}) {
  const row = {
    school_id: input.schoolId,
    payment_id: input.paymentId,
    fee_account_id: input.feeAccountId,
    uploaded_by: input.uploadedByUserId,
    file_path: input.filePath,
    status: "PENDING"
  };
  const demoProof = mapProof({ ...row, id: newId("pop"), created_at: nowIso() });
  return mutateSupabase(
    "proof_of_payments",
    async () => {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return { data: demoProof, error: null };
      return supabase.from("proof_of_payments").insert(row).select("*").single();
    },
    demoProof,
    options
  );
}

export async function upsertConsentSubmission(input: ConsentSubmissionUpsertInput, options: DataProviderOptions = {}) {
  const row = {
    school_id: input.schoolId,
    consent_form_id: input.consentFormId,
    learner_id: input.learnerId,
    parent_id: input.parentId,
    status: input.status,
    answers: input.answers ?? {},
    signature_text: input.signatureText,
    accepted_at: input.acceptedAt ?? nowIso(),
    accepted_by_user_id: input.acceptedByUserId,
    ip_hash: input.ipHash ?? "client_ip_placeholder"
  };
  const demoSubmission = mapConsentSubmission({ ...row, id: newId("csub"), created_at: nowIso(), updated_at: nowIso() });
  return mutateSupabase(
    "consent_submissions",
    async () => {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return { data: demoSubmission, error: null };
      return supabase.from("consent_submissions").upsert(row, { onConflict: "consent_form_id,learner_id" }).select("*").single();
    },
    demoSubmission,
    options
  );
}

export async function insertIncident(input: IncidentInsertInput, options: DataProviderOptions = {}) {
  const row = {
    school_id: input.schoolId,
    learner_id: input.learnerId,
    incident_type: input.incidentType,
    severity: input.severity,
    notes: input.notes,
    parent_notified: input.parentNotified ?? false,
    follow_up_required: input.followUpRequired ?? false,
    parent_visible: input.parentVisible ?? false,
    reported_by: input.reportedByUserId,
    occurred_at: input.occurredAt ?? nowIso()
  };
  const demoIncident = mapIncident({ ...row, id: newId("inc"), created_at: nowIso() });
  return mutateSupabase(
    "incident_reports",
    async () => {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return { data: demoIncident, error: null };
      return supabase.from("incident_reports").insert(row).select("*").single();
    },
    demoIncident,
    options
  );
}

export async function insertTransportStatusLog(input: TransportStatusLogInput, options: DataProviderOptions = {}) {
  const row = {
    school_id: input.schoolId,
    route_id: input.routeId,
    learner_id: input.learnerId,
    status: input.status,
    note: input.note,
    logged_by: input.loggedByUserId
  };
  return mutateSupabase(
    "transport_status_logs",
    async () => {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return { data: { id: newId("tsl"), ...row }, error: null };
      return supabase.from("transport_status_logs").insert(row).select("*").single();
    },
    { id: newId("tsl"), ...row },
    options
  );
}

export async function checkInAftercare(input: AftercareCheckInInput, options: DataProviderOptions = {}) {
  const row = {
    school_id: input.schoolId,
    learner_id: input.learnerId,
    session_date: input.date,
    check_in_at: input.checkInAt ?? nowIso(),
    supervisor_user_id: input.supervisorUserId,
    meal_notes: input.mealNotes,
    homework_notes: input.homeworkNotes
  };
  const demoSession = mapAftercareSession({ ...row, id: newId("acs"), created_at: nowIso(), updated_at: nowIso() });
  return mutateSupabase(
    "aftercare_sessions",
    async () => {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return { data: demoSession, error: null };
      return supabase.from("aftercare_sessions").insert(row).select("*").single();
    },
    demoSession,
    options
  );
}

export async function checkOutAftercare(input: AftercareCheckOutInput, options: DataProviderOptions = {}) {
  const checkOutAt = input.checkOutAt ?? nowIso();
  const pickupRow = input.collectedByName
    ? {
        school_id: input.schoolId,
        aftercare_session_id: input.sessionId,
        collected_by_name: input.collectedByName,
        relationship: input.relationship,
        verified_by: input.verifiedByUserId,
        pickup_at: checkOutAt
      }
    : null;

  return mutateSupabase(
    "aftercare_sessions",
    async () => {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) return { data: { id: input.sessionId, check_out_at: checkOutAt }, error: null };
      const { data, error } = await supabase.from("aftercare_sessions").update({ check_out_at: checkOutAt }).eq("id", input.sessionId).select("*").single();
      if (!error && pickupRow) await supabase.from("aftercare_pickups").insert(pickupRow);
      return { data, error };
    },
    { id: input.sessionId, check_out_at: checkOutAt },
    options
  );
}

export const dataProvider = {
  mode: getActiveDataProviderMode,
  demo: getDemoDataBundle,
  getCurrentSchool,
  getLearners,
  getParents,
  getClasses,
  getAttendanceRecords,
  getNotices,
  getNotifications,
  getFeeAccounts,
  getConsentForms,
  getEvents,
  getDocuments,
  getIncidents,
  getTransportRoutes,
  getAftercareSessions,
  getSchoolDataBundle,
  getSchoolDashboardData,
  upsertAttendance,
  insertNotice,
  insertProofOfPayment,
  upsertConsentSubmission,
  insertIncident,
  insertTransportStatusLog,
  checkInAftercare,
  checkOutAftercare,
  getRuntimeDataBundle
};
