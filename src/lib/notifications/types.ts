export type NotificationType =
  | "ATTENDANCE_ABSENT"
  | "ATTENDANCE_LATE"
  | "NOTICE_SENT"
  | "FEE_REMINDER"
  | "PAYMENT_RECEIVED"
  | "PROOF_APPROVED"
  | "PROOF_REJECTED"
  | "CONSENT_FORM_DUE"
  | "CONSENT_FORM_OVERDUE"
  | "EVENT_REMINDER"
  | "INCIDENT_PARENT_ALERT"
  | "TRANSPORT_PICKED_UP"
  | "TRANSPORT_DROPPED_OFF"
  | "TRANSPORT_DELAYED"
  | "AFTERCARE_CHECKED_IN"
  | "AFTERCARE_COLLECTED"
  | "DOCUMENT_UPLOADED";

export type NotificationChannel =
  | "IN_APP"
  | "EMAIL"
  | "WHATSAPP_PLACEHOLDER"
  | "SMS_PLACEHOLDER"
  | "PUSH_PLACEHOLDER";

export type NotificationDeliveryStatus =
  | "QUEUED"
  | "PENDING"
  | "SENT"
  | "DELIVERED"
  | "READ"
  | "ACTION_REQUIRED"
  | "FAILED";

export type NotificationPriority = "LOW" | "NORMAL" | "IMPORTANT" | "URGENT";

export type NotificationTemplateContext = {
  learnerName?: string;
  parentName?: string;
  schoolName?: string;
  noticeTitle?: string;
  amount?: string;
  formTitle?: string;
  eventTitle?: string;
  documentTitle?: string;
  routeName?: string;
  time?: string;
  staffContactLabel?: string;
};

export type QueuedNotification = {
  id: string;
  schoolId: string;
  recipientUserId: string;
  recipientLabel: string;
  type: NotificationType;
  title: string;
  body: string;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  status: NotificationDeliveryStatus;
  actionRequired: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export type QueueNotificationInput = {
  schoolId: string;
  recipientUserId: string;
  recipientLabel: string;
  type: NotificationType;
  channels: NotificationChannel[];
  context: NotificationTemplateContext;
  priority?: NotificationPriority;
  actionRequired?: boolean;
  metadata?: QueuedNotification["metadata"];
};

export type ParentNotificationPreference = {
  parentUserId: string;
  channelsByType: Partial<Record<NotificationType, NotificationChannel[]>>;
  quietHours?: {
    startsAt: string;
    endsAt: string;
  };
  allowPushPlaceholder: boolean;
  allowSmsPlaceholder: boolean;
  allowWhatsAppPlaceholder: boolean;
};
