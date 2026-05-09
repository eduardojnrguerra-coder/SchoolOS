import { NotificationChannel, NotificationDeliveryStatus, NotificationType, ParentNotificationPreference } from "@/src/lib/notifications/types";

export const supportedNotificationChannels: NotificationChannel[] = [
  "IN_APP",
  "EMAIL",
  "WHATSAPP_PLACEHOLDER",
  "SMS_PLACEHOLDER",
  "PUSH_PLACEHOLDER"
];

export const demoParentNotificationPreferences: ParentNotificationPreference = {
  parentUserId: "demo_parent_user",
  channelsByType: {
    ATTENDANCE_ABSENT: ["IN_APP", "EMAIL", "PUSH_PLACEHOLDER"],
    ATTENDANCE_LATE: ["IN_APP", "PUSH_PLACEHOLDER"],
    FEE_REMINDER: ["IN_APP", "EMAIL"],
    TRANSPORT_DELAYED: ["IN_APP", "PUSH_PLACEHOLDER", "SMS_PLACEHOLDER"],
    CONSENT_FORM_DUE: ["IN_APP", "EMAIL"],
    DOCUMENT_UPLOADED: ["IN_APP"]
  },
  quietHours: {
    startsAt: "20:30",
    endsAt: "06:30"
  },
  allowPushPlaceholder: true,
  allowSmsPlaceholder: false,
  allowWhatsAppPlaceholder: false
};

export function resolveChannelsForType(type: NotificationType, fallback: NotificationChannel[] = ["IN_APP"]) {
  return demoParentNotificationPreferences.channelsByType[type] ?? fallback;
}

export function simulateChannelDelivery(channel: NotificationChannel, index: number): NotificationDeliveryStatus {
  if (channel === "WHATSAPP_PLACEHOLDER" || channel === "SMS_PLACEHOLDER" || channel === "PUSH_PLACEHOLDER") {
    return index % 5 === 0 ? "FAILED" : "SENT";
  }
  if (channel === "EMAIL") return index % 4 === 0 ? "DELIVERED" : "SENT";
  return index % 3 === 0 ? "READ" : "DELIVERED";
}
