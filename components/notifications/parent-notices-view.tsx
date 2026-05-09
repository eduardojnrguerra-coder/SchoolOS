"use client";

import { Card } from "@/components/ui/card";
import { ParentNotificationInbox } from "@/components/notifications/parent-notification-inbox";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDemoParentNotices, ParentNoticeItem } from "@/src/lib/notifications";
import { Bell, CheckCircle2, FileText, CalendarDays, CreditCard, MessageCircle, Signature } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type NoticeFilter = "All" | "Unread" | "Important" | "Action required";

const filters: NoticeFilter[] = ["All", "Unread", "Important", "Action required"];

export function ParentNoticesView() {
  const [notices, setNotices] = useState<ParentNoticeItem[]>(getDemoParentNotices());
  const [filter, setFilter] = useState<NoticeFilter>("All");
  const [selectedId, setSelectedId] = useState(notices[0]?.id ?? "");

  const filtered = useMemo(() => {
    return notices.filter((notice) => {
      if (filter === "Unread") return !notice.isRead;
      if (filter === "Important") return notice.priority === "Important" || notice.priority === "Urgent";
      if (filter === "Action required") return notice.requiresAction;
      return true;
    });
  }, [filter, notices]);

  const selected = notices.find((notice) => notice.id === selectedId) ?? filtered[0];

  function openNotice(noticeId: string) {
    setSelectedId(noticeId);
    setNotices((prev) => prev.map((notice) => notice.id === noticeId ? { ...notice, isRead: true } : notice));
  }

  function acknowledgeNotice(noticeId: string) {
    setNotices((prev) => prev.map((notice) => notice.id === noticeId ? { ...notice, isRead: true, requiresAction: false } : notice));
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-pine-900 p-5 text-white">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h1 className="text-xl font-semibold">Notices</h1>
        </div>
        <p className="mt-1 text-sm text-white/75">Updates from Hermanus Valley Academy</p>
      </div>

      <Card>
        <h2 className="font-semibold text-pine-900">Action center</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
          <Action href="/parent/forms" icon={<Signature className="h-4 w-4" />} label="Sign form" />
          <Action href="/parent/fees" icon={<CreditCard className="h-4 w-4" />} label="Upload proof" />
          <Action href="/parent/fees" icon={<FileText className="h-4 w-4" />} label="View statement" />
          <Action href="/parent/notices" icon={<Bell className="h-4 w-4" />} label="Acknowledge notice" />
          <Action href="/parent/calendar" icon={<CalendarDays className="h-4 w-4" />} label="View event" />
          <Action href="/parent/messages" icon={<MessageCircle className="h-4 w-4" />} label="Contact school" />
        </div>
      </Card>

      <ParentNotificationInbox />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`shrink-0 rounded-full px-3 py-2 text-xs ${filter === item ? "bg-pine-900 text-white" : "border border-slate-200 bg-white text-slate-600"}`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {filtered.map((notice) => (
            <button key={notice.id} onClick={() => openNotice(notice.id)} className="w-full text-left">
              <Card className={`transition hover:shadow-xl ${selected?.id === notice.id ? "ring-2 ring-pine-300" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-pine-900">{notice.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{notice.body}</p>
                  </div>
                  {!notice.isRead && <span className="mt-1 h-2.5 w-2.5 rounded-full bg-pine-800" />}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge label={notice.priority} tone={notice.priority === "Urgent" ? "danger" : notice.priority === "Important" ? "warning" : "info"} />
                  {notice.requiresAction && <StatusBadge label="Action required" tone="warning" />}
                  <StatusBadge label={notice.isRead ? "Read" : "Unread"} tone={notice.isRead ? "success" : "info"} />
                </div>
              </Card>
            </button>
          ))}
          {filtered.length === 0 && <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">No notices match this filter.</p>}
        </div>

        {selected && (
          <Card>
            <div className="flex items-start justify-between gap-3">
              <div>
                <StatusBadge label={selected.priority} tone={selected.priority === "Urgent" ? "danger" : selected.priority === "Important" ? "warning" : "info"} />
                <h2 className="mt-3 text-xl font-semibold text-pine-900">{selected.title}</h2>
                <p className="mt-1 text-xs text-slate-500">{new Date(selected.publishedAt).toLocaleString("en-ZA")}</p>
              </div>
              {selected.isRead ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <Bell className="h-5 w-5 text-pine-800" />}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">{selected.body}</p>
            <div className="mt-5">
              <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Attachments</p>
              {selected.attachmentName ? (
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm">
                  <FileText className="h-4 w-4 text-slate-500" />
                  {selected.attachmentName}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No attachments for this notice.</p>
              )}
            </div>
            <button onClick={() => acknowledgeNotice(selected.id)} className="mt-5 w-full rounded-xl bg-pine-900 px-4 py-3 text-sm font-medium text-white">
              Acknowledge
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}

function Action({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-slate-700 hover:bg-slate-50">
      <span className="text-pine-800">{icon}</span>
      {label}
    </Link>
  );
}
