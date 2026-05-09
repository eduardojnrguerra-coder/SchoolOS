import { demoData } from "@/demo-data";
import { createAdminNotificationActivity } from "@/src/lib/notifications/notificationService";
import { Notice } from "@/types/domain";

export * from "@/src/lib/notifications/types";
export * from "@/src/lib/notifications/templates";
export * from "@/src/lib/notifications/channels";
export * from "@/src/lib/notifications/notificationService";

export type NoticeAudienceType = "Whole school" | "Grade" | "Class" | "Specific learner parent" | "Transport route" | "Aftercare group";
export type NoticeChannel = "App notification" | "Email" | "WhatsApp placeholder" | "SMS placeholder";
export type NoticePriority = "Normal" | "Important" | "Urgent";
export type DeliveryStatus =
  | "Sent"
  | "Delivered"
  | "Read"
  | "Action required"
  | "Failed"
  | "QUEUED"
  | "PENDING"
  | "SENT"
  | "DELIVERED"
  | "READ"
  | "ACTION_REQUIRED"
  | "FAILED";

export type NoticeDelivery = {
  id: string;
  noticeId: string;
  recipientLabel: string;
  channel: NoticeChannel | string;
  status: DeliveryStatus;
  title?: string;
  body?: string;
  updatedAt: string;
};

export type NoticeComposerState = {
  title: string;
  body: string;
  audienceType: NoticeAudienceType;
  audienceTargetId: string;
  channels: NoticeChannel[];
  priority: NoticePriority;
  attachmentName: string;
  scheduledFor: string;
};

export type ParentNoticeItem = Notice & {
  priority: NoticePriority;
  isRead: boolean;
  requiresAction: boolean;
  attachmentName?: string;
};

export const defaultNoticeComposer: NoticeComposerState = {
  title: "Winter pickup arrangement update",
  body: "Please note that afternoon pickup will move to the main gate during rainy weather days.",
  audienceType: "Whole school",
  audienceTargetId: "all",
  channels: ["App notification", "Email"],
  priority: "Important",
  attachmentName: "",
  scheduledFor: new Date().toISOString().slice(0, 16)
};

export function getDemoParentNotices(): ParentNoticeItem[] {
  return demoData.notices.map((notice, index) => ({
    ...notice,
    priority: index === 0 ? "Important" : index === 1 ? "Urgent" : "Normal",
    isRead: index > 0,
    requiresAction: index === 0,
    attachmentName: index === 0 ? "winter-uniform-guide.pdf" : undefined
  }));
}

export function createNoticeFromComposer(composer: NoticeComposerState): Notice {
  return {
    id: `ntc_demo_${Date.now()}`,
    schoolId: demoData.school.id,
    title: composer.title,
    body: composer.body,
    audience: composer.audienceType === "Class" ? "CLASS" : "ALL",
    classId: composer.audienceType === "Class" ? composer.audienceTargetId : undefined,
    createdByUserId: "usr_001",
    publishedAt: composer.scheduledFor ? new Date(composer.scheduledFor).toISOString() : new Date().toISOString()
  };
}

export function simulateNoticeDelivery(notice: Notice, composer: NoticeComposerState): NoticeDelivery[] {
  const recipients = getAudienceRecipients(composer);
  return recipients.flatMap((recipient, recipientIndex) =>
    composer.channels.map((channel, channelIndex) => ({
      id: `delivery_${notice.id}_${recipientIndex}_${channelIndex}`,
      noticeId: notice.id,
      recipientLabel: recipient,
      channel,
      status: getSimulatedStatus(recipientIndex + channelIndex),
      updatedAt: new Date().toISOString()
    }))
  );
}

export function buildNoticeAuditLog(notice: Notice, composer: NoticeComposerState) {
  return {
    id: `aud_notice_${Date.now()}`,
    action: "NOTICE_SENT_DEMO",
    detail: `${notice.title} queued for ${composer.audienceType} via ${composer.channels.join(", ")}`,
    at: new Date().toISOString()
  };
}

export function getDashboardNotificationCenterItems(): NoticeDelivery[] {
  const engineItems: NoticeDelivery[] = createAdminNotificationActivity().map((notification) => ({
    id: notification.id,
    noticeId: notification.noticeId,
    recipientLabel: notification.recipientLabel,
    channel: notification.channel,
    status: notification.status as DeliveryStatus,
    title: notification.title,
    body: notification.body,
    updatedAt: notification.updatedAt
  }));

  const legacyItems: NoticeDelivery[] = demoData.notifications.map((notification, index) => ({
    id: `center_${notification.id}`,
    noticeId: notification.id,
    recipientLabel: demoData.users.find((u) => u.id === notification.userId)?.fullName ?? "School user",
    channel: notification.channel === "EMAIL" ? "Email" : notification.channel === "SMS" ? "SMS placeholder" : "App notification",
    status: index === 0 ? "Action required" : index === 1 ? "Failed" : notification.readAt ? "Read" : "Delivered",
    updatedAt: notification.createdAt
  }));

  return [...engineItems, ...legacyItems];
}

function getAudienceRecipients(composer: NoticeComposerState) {
  if (composer.audienceType === "Specific learner parent") {
    const learner = demoData.learners.find((item) => item.id === composer.audienceTargetId);
    return learner ? [`Parent of ${learner.firstName} ${learner.lastName}`] : ["Selected parent"];
  }
  if (composer.audienceType === "Class") {
    const classItem = demoData.classes.find((item) => item.id === composer.audienceTargetId);
    return classItem ? [`${classItem.className} parents`] : ["Class parents"];
  }
  if (composer.audienceType === "Grade") {
    const grade = demoData.grades.find((item) => item.id === composer.audienceTargetId);
    return grade ? [`${grade.label} parents`] : ["Grade parents"];
  }
  if (composer.audienceType === "Transport route") {
    const route = demoData.transportRoutes.find((item) => item.id === composer.audienceTargetId);
    return route ? [`${route.routeName} families`] : ["Transport families"];
  }
  if (composer.audienceType === "Aftercare group") return ["Aftercare families"];
  return ["All parents", "All staff"];
}

function getSimulatedStatus(index: number): DeliveryStatus {
  const statuses: DeliveryStatus[] = ["Sent", "Delivered", "Read", "Action required"];
  return statuses[index % statuses.length];
}
