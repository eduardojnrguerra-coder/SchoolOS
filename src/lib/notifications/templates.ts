import { NotificationTemplateContext, NotificationType } from "@/src/lib/notifications/types";

type Template = {
  title: (context: NotificationTemplateContext) => string;
  body: (context: NotificationTemplateContext) => string;
};

const safeLearner = (context: NotificationTemplateContext) => context.learnerName ?? "Your child";
const safeSchool = (context: NotificationTemplateContext) => context.schoolName ?? "the school";

export const notificationTemplates: Record<NotificationType, Template> = {
  ATTENDANCE_ABSENT: {
    title: (context) => `${safeLearner(context)} marked absent`,
    body: (context) => `${safeLearner(context)} was marked absent today. Please confirm if this is correct.`
  },
  ATTENDANCE_LATE: {
    title: (context) => `${safeLearner(context)} marked late`,
    body: (context) => `${safeLearner(context)} was marked late today at ${context.time ?? "the recorded time"}.`
  },
  NOTICE_SENT: {
    title: (context) => context.noticeTitle ?? "New school notice",
    body: (context) => `${safeSchool(context)} has sent a new notice. Please open it when you have a moment.`
  },
  FEE_REMINDER: {
    title: () => "School fee reminder",
    body: (context) => `A school fee balance of ${context.amount ?? "an outstanding amount"} is due. Please contact finance if you need help.`
  },
  PAYMENT_RECEIVED: {
    title: () => "Payment received",
    body: (context) => `Thank you. A payment of ${context.amount ?? "your payment"} has been recorded.`
  },
  PROOF_APPROVED: {
    title: () => "Proof approved",
    body: () => "Your proof of payment has been reviewed and approved."
  },
  PROOF_REJECTED: {
    title: () => "Proof needs attention",
    body: () => "Your proof of payment could not be verified. Please contact finance or upload a clearer document."
  },
  CONSENT_FORM_DUE: {
    title: (context) => `Consent due: ${context.formTitle ?? "School form"}`,
    body: (context) => `Please review and sign ${context.formTitle ?? "the consent form"} before the due date.`
  },
  CONSENT_FORM_OVERDUE: {
    title: (context) => `Overdue form: ${context.formTitle ?? "School form"}`,
    body: () => "A consent form is overdue. Please review it as soon as possible."
  },
  EVENT_REMINDER: {
    title: (context) => `Reminder: ${context.eventTitle ?? "School event"}`,
    body: (context) => `${context.eventTitle ?? "A school event"} is coming up. Please check whether consent, payment, or documents are required.`
  },
  INCIDENT_PARENT_ALERT: {
    title: () => "School incident update",
    body: (context) => `${safeSchool(context)} has recorded an incident involving ${safeLearner(context)}. Sensitive details are available only through authorized staff follow-up.`
  },
  TRANSPORT_PICKED_UP: {
    title: (context) => `${safeLearner(context)} picked up`,
    body: (context) => `${safeLearner(context)} has been picked up on ${context.routeName ?? "the school route"}.`
  },
  TRANSPORT_DROPPED_OFF: {
    title: (context) => `${safeLearner(context)} dropped off`,
    body: (context) => `${safeLearner(context)} has been dropped off from ${context.routeName ?? "the school route"}.`
  },
  TRANSPORT_DELAYED: {
    title: () => "Transport delay",
    body: (context) => `${context.routeName ?? "The school route"} is delayed. The school will update you as the route progresses.`
  },
  AFTERCARE_CHECKED_IN: {
    title: (context) => `${safeLearner(context)} checked into aftercare`,
    body: (context) => `${safeLearner(context)} has been checked into aftercare.`
  },
  AFTERCARE_COLLECTED: {
    title: (context) => `${safeLearner(context)} collected`,
    body: (context) => `${safeLearner(context)} has been collected from aftercare.`
  },
  DOCUMENT_UPLOADED: {
    title: (context) => `New document: ${context.documentTitle ?? "School document"}`,
    body: (context) => `${safeSchool(context)} uploaded a new document for your family.`
  }
};

export function generateNotificationContent(type: NotificationType, context: NotificationTemplateContext) {
  const template = notificationTemplates[type];
  return {
    title: template.title(context),
    body: template.body(context)
  };
}
