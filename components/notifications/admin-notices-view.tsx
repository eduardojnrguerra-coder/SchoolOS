"use client";

import { NotificationCenter } from "@/components/notifications/notification-center";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoData } from "@/demo-data";
import {
  NoticeChannel,
  NoticeComposerState,
  NoticeDelivery,
  NoticePriority,
  buildNoticeAuditLog,
  createNoticeFromComposer,
  defaultNoticeComposer,
  simulateNoticeDelivery
} from "@/src/lib/notifications";
import { Notice } from "@/types/domain";
import { CalendarClock, Paperclip, Send } from "lucide-react";
import { useMemo, useState } from "react";

const channels: NoticeChannel[] = ["App notification", "Email", "WhatsApp placeholder", "SMS placeholder"];
const priorities: NoticePriority[] = ["Normal", "Important", "Urgent"];

export function AdminNoticesView() {
  const [notices, setNotices] = useState<Notice[]>(demoData.notices);
  const [composer, setComposer] = useState<NoticeComposerState>(defaultNoticeComposer);
  const [deliveries, setDeliveries] = useState<NoticeDelivery[]>([]);
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; action: string; detail: string; at: string }>>([]);
  const [sentMessage, setSentMessage] = useState("");

  const audienceTargets = useMemo(() => {
    if (composer.audienceType === "Grade") return demoData.grades.map((g) => ({ id: g.id, label: g.label }));
    if (composer.audienceType === "Class") return demoData.classes.map((c) => ({ id: c.id, label: c.className }));
    if (composer.audienceType === "Specific learner parent") {
      return demoData.learners.map((l) => ({ id: l.id, label: `${l.firstName} ${l.lastName}` }));
    }
    if (composer.audienceType === "Transport route") return demoData.transportRoutes.map((r) => ({ id: r.id, label: r.routeName }));
    return [{ id: "all", label: composer.audienceType }];
  }, [composer.audienceType]);

  function updateComposer(data: Partial<NoticeComposerState>) {
    setComposer((prev) => ({ ...prev, ...data }));
  }

  function defaultTargetForAudience(audienceType: NoticeComposerState["audienceType"]) {
    if (audienceType === "Grade") return demoData.grades[0]?.id ?? "all";
    if (audienceType === "Class") return demoData.classes[0]?.id ?? "all";
    if (audienceType === "Specific learner parent") return demoData.learners[0]?.id ?? "all";
    if (audienceType === "Transport route") return demoData.transportRoutes[0]?.id ?? "all";
    return "all";
  }

  function toggleChannel(channel: NoticeChannel) {
    setComposer((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((item) => item !== channel)
        : [...prev.channels, channel]
    }));
  }

  function sendNotice() {
    if (!composer.title.trim() || !composer.body.trim() || composer.channels.length === 0) return;
    const notice = createNoticeFromComposer(composer);
    const deliveryRows = simulateNoticeDelivery(notice, composer);
    setNotices((prev) => [notice, ...prev]);
    setDeliveries((prev) => [...deliveryRows, ...prev]);
    setAuditLogs((prev) => [buildNoticeAuditLog(notice, composer), ...prev]);
    setSentMessage("Notice queued in demo mode. No external messages were sent.");
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Notices" subtitle="Create, preview, send, and monitor school communications." />
      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.9fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-pine-900">Create Notice</h2>
            <StatusBadge label="Demo send" tone="info" />
          </div>
          <div className="grid gap-3">
            <input value={composer.title} onChange={(e) => updateComposer({ title: e.target.value })} placeholder="Notice title" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={composer.body} onChange={(e) => updateComposer({ body: e.target.value })} placeholder="Write the notice..." rows={5} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <div className="grid gap-3 md:grid-cols-2">
              <select
                value={composer.audienceType}
                onChange={(e) => {
                  const audienceType = e.target.value as NoticeComposerState["audienceType"];
                  updateComposer({ audienceType, audienceTargetId: defaultTargetForAudience(audienceType) });
                }}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                {["Whole school", "Grade", "Class", "Specific learner parent", "Transport route", "Aftercare group"].map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={composer.audienceTargetId} onChange={(e) => updateComposer({ audienceTargetId: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
                {audienceTargets.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </div>
            <div className="grid gap-2 md:grid-cols-4">
              {channels.map((channel) => (
                <label key={channel} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm">
                  <input type="checkbox" checked={composer.channels.includes(channel)} onChange={() => toggleChannel(channel)} />
                  {channel}
                </label>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <select value={composer.priority} onChange={(e) => updateComposer({ priority: e.target.value as NoticePriority })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
                {priorities.map((priority) => <option key={priority}>{priority}</option>)}
              </select>
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <Paperclip className="h-4 w-4 text-slate-500" />
                <input value={composer.attachmentName} onChange={(e) => updateComposer({ attachmentName: e.target.value })} placeholder="Attachment placeholder" className="min-w-0 flex-1 bg-transparent outline-none" />
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <CalendarClock className="h-4 w-4 text-slate-500" />
                <input type="datetime-local" value={composer.scheduledFor} onChange={(e) => updateComposer({ scheduledFor: e.target.value })} className="min-w-0 flex-1 bg-transparent outline-none" />
              </label>
            </div>
            <button onClick={sendNotice} className="inline-flex w-fit items-center gap-2 rounded-xl bg-pine-900 px-4 py-2 text-sm text-white">
              <Send className="h-4 w-4" />
              Send Notice
            </button>
            {sentMessage && <p className="text-sm text-emerald-700">{sentMessage}</p>}
          </div>
        </Card>

        <ParentPreview composer={composer} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-pine-900">Notice Library</h2>
          <div className="space-y-2">
            {notices.map((notice) => (
              <div key={notice.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{notice.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{notice.body}</p>
                  </div>
                  <StatusBadge label={notice.audience} tone="info" />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <NotificationCenter deliveries={deliveries.length ? deliveries : []} />
      </div>

      <Card>
        <h2 className="mb-3 text-lg font-semibold text-pine-900">Notice Audit Log</h2>
        {auditLogs.length === 0 ? (
          <p className="text-sm text-slate-500">Audit entries appear after a notice is sent in demo mode.</p>
        ) : (
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                <p className="font-medium text-slate-900">{log.action}</p>
                <p className="text-slate-600">{log.detail}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function ParentPreview({ composer }: { composer: NoticeComposerState }) {
  return (
    <Card className="bg-slate-950 text-white">
      <p className="text-xs uppercase tracking-wide text-white/60">Parent preview</p>
      <div className="mt-4 rounded-2xl bg-white p-4 text-slate-900">
        <div className="flex items-center justify-between">
          <StatusBadge label={composer.priority} tone={composer.priority === "Urgent" ? "danger" : composer.priority === "Important" ? "warning" : "info"} />
          <span className="text-xs text-slate-500">Hermanus Valley Academy</span>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-pine-900">{composer.title || "Notice title"}</h3>
        <p className="mt-2 text-sm text-slate-600">{composer.body || "Notice body will appear here."}</p>
        {composer.attachmentName && (
          <div className="mt-4 rounded-lg border border-slate-200 p-3 text-sm">
            Attachment: {composer.attachmentName}
          </div>
        )}
        <button className="mt-4 w-full rounded-xl bg-pine-900 px-4 py-2 text-sm text-white">Acknowledge</button>
      </div>
    </Card>
  );
}
