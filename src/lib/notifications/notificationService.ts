import { demoData } from "@/demo-data";
import { simulateChannelDelivery } from "@/src/lib/notifications/channels";
import { generateNotificationContent } from "@/src/lib/notifications/templates";
import {
  NotificationDeliveryStatus,
  QueueNotificationInput,
  QueuedNotification
} from "@/src/lib/notifications/types";

export function queueNotification(input: QueueNotificationInput, existingQueue: QueuedNotification[] = []) {
  const now = new Date().toISOString();
  const content = generateNotificationContent(input.type, input.context);
  const notification: QueuedNotification = {
    id: `nq_${input.type.toLowerCase()}_${Date.now()}`,
    schoolId: input.schoolId,
    recipientUserId: input.recipientUserId,
    recipientLabel: input.recipientLabel,
    type: input.type,
    title: content.title,
    body: content.body,
    channels: input.channels,
    priority: input.priority ?? "NORMAL",
    status: input.actionRequired ? "ACTION_REQUIRED" : "QUEUED",
    actionRequired: input.actionRequired ?? false,
    createdAt: now,
    updatedAt: now,
    metadata: input.metadata
  };

  return [notification, ...existingQueue];
}

export function markAsRead(notificationId: string, queue: QueuedNotification[]) {
  const now = new Date().toISOString();
  return queue.map((notification) =>
    notification.id === notificationId
      ? { ...notification, status: "READ" as NotificationDeliveryStatus, readAt: now, updatedAt: now, actionRequired: false }
      : notification
  );
}

export function simulateDemoDelivery(queue: QueuedNotification[]) {
  return queue.map((notification, index) => {
    if (notification.status === "READ" || notification.status === "ACTION_REQUIRED") return notification;
    const statuses = notification.channels.map((channel, channelIndex) => simulateChannelDelivery(channel, index + channelIndex));
    const status: NotificationDeliveryStatus = statuses.includes("FAILED")
      ? "FAILED"
      : statuses.includes("SENT")
        ? "SENT"
        : statuses.includes("DELIVERED")
          ? "DELIVERED"
          : "QUEUED";
    return { ...notification, status, updatedAt: new Date().toISOString() };
  });
}

export function createDemoNotificationQueue() {
  const schoolId = demoData.school.id;
  const parent = demoData.guardians[0];
  const learner = demoData.learners[0];
  const recipientUserId = "demo_parent_user";
  const recipientLabel = parent.fullName;
  const base: QueuedNotification[] = [];

  return simulateDemoDelivery([
    ...queueNotification({
      schoolId,
      recipientUserId,
      recipientLabel,
      type: "ATTENDANCE_ABSENT",
      channels: ["IN_APP", "EMAIL"],
      context: { learnerName: `${learner.firstName} ${learner.lastName}`, schoolName: demoData.school.name },
      priority: "URGENT",
      actionRequired: true
    }, base),
    ...queueNotification({
      schoolId,
      recipientUserId,
      recipientLabel,
      type: "FEE_REMINDER",
      channels: ["IN_APP", "EMAIL"],
      context: { amount: "R3 500", schoolName: demoData.school.name },
      priority: "IMPORTANT",
      actionRequired: true
    }),
    ...queueNotification({
      schoolId,
      recipientUserId,
      recipientLabel,
      type: "TRANSPORT_DELAYED",
      channels: ["IN_APP", "PUSH_PLACEHOLDER"],
      context: { routeName: demoData.transportRoutes[0]?.routeName },
      priority: "IMPORTANT"
    }),
    ...queueNotification({
      schoolId,
      recipientUserId,
      recipientLabel,
      type: "DOCUMENT_UPLOADED",
      channels: ["IN_APP"],
      context: { documentTitle: demoData.documents[0]?.title, schoolName: demoData.school.name }
    })
  ]);
}

export function createAdminNotificationActivity() {
  const queue = createDemoNotificationQueue();
  return queue.map((notification) => ({
    id: notification.id,
    noticeId: notification.id,
    recipientLabel: notification.recipientLabel,
    channel: notification.channels.join(", "),
    status: notification.status as NotificationDeliveryStatus,
    title: notification.title,
    body: notification.body,
    updatedAt: notification.updatedAt
  }));
}
