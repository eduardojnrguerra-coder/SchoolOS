import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BellRing,
  Bus,
  CheckCircle2,
  Clock3,
  FileSignature,
  HeartHandshake,
  Home,
  MessageCircle,
  ShieldAlert,
  WalletCards,
  Wifi,
  type LucideIcon
} from "lucide-react";

export type ParentAppPreviewAction =
  | "ABSENCE_ALERT"
  | "ATTENDANCE_LATE"
  | "URGENT_NOTICE"
  | "FEE_REMINDER"
  | "CONSENT_FORM_REQUEST"
  | "TRANSPORT_DELAY"
  | "PICKUP_DROPOFF_UPDATE"
  | "AFTERCARE_CHECK_IN_OUT"
  | "INCIDENT_NOTIFICATION";

type BadgeTone = "info" | "success" | "warning" | "danger";

export type ParentAppPreviewMetaItem = {
  label: string;
  value: string;
  tone?: BadgeTone;
};

export type ParentAppPreviewProps = {
  action: ParentAppPreviewAction;
  learnerName?: string;
  schoolName?: string;
  title?: string;
  message?: string;
  timestamp?: string;
  statusLabel?: string;
  statusTone?: BadgeTone;
  actionLabel?: string;
  secondaryActionLabel?: string;
  meta?: ParentAppPreviewMetaItem[];
  footerNote?: string;
  className?: string;
};

type PreviewConfig = {
  eyebrow: string;
  title: string;
  message: string;
  statusLabel: string;
  statusTone: BadgeTone;
  actionLabel: string;
  icon: LucideIcon;
  accent: keyof typeof accentClasses;
  timestamp: string;
};

const accentClasses = {
  emerald: {
    shell: "from-emerald-500/25 via-pine-900 to-slate-950",
    icon: "bg-emerald-100 text-emerald-700",
    button: "bg-emerald-700 text-white"
  },
  amber: {
    shell: "from-amber-500/25 via-pine-900 to-slate-950",
    icon: "bg-amber-100 text-amber-700",
    button: "bg-amber-500 text-slate-950"
  },
  rose: {
    shell: "from-rose-500/25 via-pine-900 to-slate-950",
    icon: "bg-rose-100 text-rose-700",
    button: "bg-rose-600 text-white"
  },
  sky: {
    shell: "from-sky-500/25 via-pine-900 to-slate-950",
    icon: "bg-sky-100 text-sky-700",
    button: "bg-pine-900 text-white"
  }
};

const actionConfig: Record<ParentAppPreviewAction, PreviewConfig> = {
  ABSENCE_ALERT: {
    eyebrow: "Attendance alert",
    title: "Absence confirmation needed",
    message: "Your child was marked absent today. Please confirm if this is correct.",
    statusLabel: "Action required",
    statusTone: "danger",
    actionLabel: "Confirm absence",
    icon: AlertTriangle,
    accent: "rose",
    timestamp: "2026-05-07T08:22:00+02:00"
  },
  ATTENDANCE_LATE: {
    eyebrow: "Attendance alert",
    title: "Late arrival recorded",
    message: "Your child was marked late today. The register has been updated.",
    statusLabel: "Delivered",
    statusTone: "warning",
    actionLabel: "View register note",
    icon: Clock3,
    accent: "amber",
    timestamp: "2026-05-07T08:37:00+02:00"
  },
  URGENT_NOTICE: {
    eyebrow: "School notice",
    title: "Important school update",
    message: "A new urgent notice from the school is ready to read.",
    statusLabel: "Urgent",
    statusTone: "danger",
    actionLabel: "Acknowledge notice",
    icon: BellRing,
    accent: "rose",
    timestamp: "2026-05-07T09:05:00+02:00"
  },
  FEE_REMINDER: {
    eyebrow: "Finance",
    title: "Fee balance reminder",
    message: "A school fee balance is due. Please upload proof of payment or contact finance for help.",
    statusLabel: "Reminder",
    statusTone: "warning",
    actionLabel: "Upload proof",
    icon: WalletCards,
    accent: "amber",
    timestamp: "2026-05-07T10:10:00+02:00"
  },
  CONSENT_FORM_REQUEST: {
    eyebrow: "Consent form",
    title: "Signature required",
    message: "Please review and sign the school consent form before the due date.",
    statusLabel: "Signature needed",
    statusTone: "warning",
    actionLabel: "Sign form",
    icon: FileSignature,
    accent: "sky",
    timestamp: "2026-05-07T11:30:00+02:00"
  },
  TRANSPORT_DELAY: {
    eyebrow: "Transport",
    title: "Route delay update",
    message: "The school route is delayed. We will update you as the route progresses.",
    statusLabel: "Delayed",
    statusTone: "warning",
    actionLabel: "View transport",
    icon: Bus,
    accent: "amber",
    timestamp: "2026-05-07T14:18:00+02:00"
  },
  PICKUP_DROPOFF_UPDATE: {
    eyebrow: "Transport",
    title: "Pickup/drop-off update",
    message: "Your child has a new pickup or drop-off status on the school route.",
    statusLabel: "Confirmed",
    statusTone: "success",
    actionLabel: "View timeline",
    icon: Bus,
    accent: "emerald",
    timestamp: "2026-05-07T14:42:00+02:00"
  },
  AFTERCARE_CHECK_IN_OUT: {
    eyebrow: "Aftercare",
    title: "Aftercare status updated",
    message: "Your child has a new aftercare check-in or collection update.",
    statusLabel: "Updated",
    statusTone: "success",
    actionLabel: "View aftercare",
    icon: HeartHandshake,
    accent: "emerald",
    timestamp: "2026-05-07T14:25:00+02:00"
  },
  INCIDENT_NOTIFICATION: {
    eyebrow: "School care update",
    title: "Incident update recorded",
    message: "The school has recorded a care-related update. Sensitive details are shared only through authorized follow-up.",
    statusLabel: "Staff follow-up",
    statusTone: "danger",
    actionLabel: "Contact school",
    icon: ShieldAlert,
    accent: "rose",
    timestamp: "2026-05-07T12:05:00+02:00"
  }
};

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
}

function defaultMeta(action: ParentAppPreviewAction, learnerName: string): ParentAppPreviewMetaItem[] {
  if (action === "FEE_REMINDER") return [{ label: "Next step", value: "Proof upload ready", tone: "warning" }];
  if (action === "CONSENT_FORM_REQUEST") return [{ label: "Required for", value: learnerName, tone: "warning" }];
  if (action === "TRANSPORT_DELAY") return [{ label: "ETA", value: "8 min delay", tone: "warning" }];
  if (action === "PICKUP_DROPOFF_UPDATE") return [{ label: "Timeline", value: "Route updated", tone: "success" }];
  if (action === "AFTERCARE_CHECK_IN_OUT") return [{ label: "Safety", value: "Staff captured", tone: "success" }];
  if (action === "INCIDENT_NOTIFICATION") return [{ label: "Privacy", value: "Details restricted", tone: "danger" }];
  return [{ label: "Child", value: learnerName, tone: action === "ABSENCE_ALERT" ? "danger" : "warning" }];
}

export function ParentAppPreview({
  action,
  learnerName = "Ariana Meyer",
  schoolName = "Hermanus Valley Academy",
  title,
  message,
  timestamp,
  statusLabel,
  statusTone,
  actionLabel,
  secondaryActionLabel = "Message school",
  meta,
  footerNote,
  className
}: ParentAppPreviewProps) {
  const config = actionConfig[action];
  const accent = accentClasses[config.accent];
  const Icon = config.icon;
  const previewTitle = title ?? config.title;
  const previewMessage = message ?? config.message;
  const previewStatus = statusLabel ?? config.statusLabel;
  const previewStatusTone = statusTone ?? config.statusTone;
  const previewAction = actionLabel ?? config.actionLabel;
  const previewTimestamp = timestamp ?? config.timestamp;
  const previewMeta = meta?.length ? meta : defaultMeta(action, learnerName);

  return (
    <div data-demo="parent-app-preview" data-demo-action={action}>
      <Card className={cn("overflow-hidden border-0 bg-slate-950 p-0 text-white shadow-2xl", className)}>
        <div className={cn("bg-gradient-to-br p-4", accent.shell)}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/55">Parent App Preview</p>
              <h2 className="mt-2 text-lg font-semibold text-white">What the parent sees</h2>
            </div>
            <StatusBadge label={previewStatus} tone={previewStatusTone} />
          </div>

        <div className="mx-auto mt-5 max-w-[350px] rounded-[2.25rem] border border-white/20 bg-slate-900 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <div className="overflow-hidden rounded-[1.85rem] bg-slate-50 text-slate-950">
            <div className="flex items-center justify-between bg-slate-950 px-5 pb-3 pt-4 text-[11px] font-semibold text-white">
              <span>{formatTime(previewTimestamp)}</span>
              <span className="h-4 w-20 rounded-full bg-white/15" />
              <span className="flex items-center gap-1">
                <Wifi className="h-3.5 w-3.5" />
                92%
              </span>
            </div>

            <div className="bg-gradient-to-b from-white to-slate-100 px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Pine X Parent</p>
                  <p className="mt-1 text-sm font-semibold text-pine-900">{schoolName}</p>
                </div>
                <div className="rounded-full bg-pine-900 px-3 py-1 text-xs font-medium text-white">Live</div>
              </div>

              <div className="mt-4 rounded-3xl bg-pine-900 p-4 text-white shadow-lg">
                <div className="flex items-start gap-3">
                  <div className={cn("rounded-2xl p-2.5", accent.icon)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/60">{config.eyebrow}</p>
                    <h3 className="mt-1 text-lg font-semibold leading-tight">{previewTitle}</h3>
                    <p className="mt-2 text-sm leading-5 text-white/80">{previewMessage}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge label={previewStatus} tone={previewStatusTone} />
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80">
                    {formatTime(previewTimestamp)} today
                  </span>
                </div>
              </div>

              <div className="mt-3 grid gap-2">
                {previewMeta.map((item) => (
                  <div key={`${item.label}-${item.value}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm">
                    <span className="text-slate-500">{item.label}</span>
                    <StatusBadge label={item.value} tone={item.tone ?? "info"} />
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-2">
                <button className={cn("rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm", accent.button)}>
                  {previewAction}
                </button>
                <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                  {secondaryActionLabel}
                </button>
              </div>

              {footerNote && <p className="mt-3 text-center text-xs leading-5 text-slate-500">{footerNote}</p>}
            </div>

            <div className="grid grid-cols-3 border-t border-slate-200 bg-white px-6 py-3 text-[11px] font-medium text-slate-400">
              <span className="flex flex-col items-center gap-1 text-pine-900"><Home className="h-4 w-4" />Home</span>
              <span className="flex flex-col items-center gap-1"><BellRing className="h-4 w-4" />Alerts</span>
              <span className="flex flex-col items-center gap-1"><MessageCircle className="h-4 w-4" />School</span>
            </div>
          </div>
        </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/55">
            <CheckCircle2 className="h-4 w-4 text-emerald-200" />
            Demo preview only. No real parent message is sent.
          </div>
        </div>
      </Card>
    </div>
  );
}
