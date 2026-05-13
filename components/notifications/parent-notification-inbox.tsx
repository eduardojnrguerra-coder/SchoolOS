"use client";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { createDemoNotificationQueue, markAsRead } from "@/src/lib/notifications/notificationService";
import { QueuedNotification } from "@/src/lib/notifications/types";
import { salesDemoActionEventName, SalesDemoActionPayload } from "@/lib/sales-demo";
import { Bell, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type InboxFilter = "All" | "Unread" | "Action required";

const filters: InboxFilter[] = ["All", "Unread", "Action required"];

function tone(status: QueuedNotification["status"]) {
  if (status === "READ" || status === "DELIVERED") return "success" as const;
  if (status === "ACTION_REQUIRED" || status === "FAILED") return "warning" as const;
  return "info" as const;
}

function label(status: QueuedNotification["status"]) {
  return status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function ParentNotificationInbox() {
  const [queue, setQueue] = useState<QueuedNotification[]>(createDemoNotificationQueue());
  const [filter, setFilter] = useState<InboxFilter>("All");
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const filtered = useMemo(() => {
    return queue.filter((notification) => {
      if (filter === "Unread") return notification.status !== "READ";
      if (filter === "Action required") return notification.actionRequired || notification.status === "ACTION_REQUIRED";
      return true;
    });
  }, [filter, queue]);

  function read(notificationId: string) {
    setQueue((prev) => markAsRead(notificationId, prev));
  }

  useEffect(() => {
    function onDemoAction(event: Event) {
      const { type } = (event as CustomEvent<SalesDemoActionPayload>).detail ?? {};
      if (type === "RESET_DEMO") {
        setQueue(createDemoNotificationQueue());
        setFilter("All");
        setConfirmationMessage("");
        return;
      }
      if (type !== "PARENT_CONFIRM_ABSENCE") return;
      setFilter("All");
      setQueue((prev) =>
        prev.map((notification) =>
          notification.type === "ATTENDANCE_ABSENT"
            ? { ...notification, status: "READ", actionRequired: false, readAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
            : notification
        )
      );
      setConfirmationMessage("Absence confirmation submitted to Hermanus Valley Academy.");
    }

    window.addEventListener(salesDemoActionEventName, onDemoAction);
    return () => window.removeEventListener(salesDemoActionEventName, onDemoAction);
  }, []);

  return (
    <Card data-demo="parent-notification-inbox">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-pine-800" />
          <h2 className="font-semibold text-pine-900">Notification inbox</h2>
        </div>
        <StatusBadge label={`${queue.filter((item) => item.status !== "READ").length} unread`} tone="warning" />
      </div>
      {confirmationMessage && (
        <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {confirmationMessage}
        </div>
      )}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
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
      <div className="mt-3 space-y-2">
        {filtered.map((notification) => (
          <button key={notification.id} onClick={() => read(notification.id)} className="w-full text-left">
            <div className="rounded-xl border border-slate-200 p-3 text-sm transition hover:bg-slate-50">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{notification.title}</p>
                  <p className="mt-1 line-clamp-2 text-slate-600">{notification.body}</p>
                </div>
                {notification.status === "READ" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <span className="mt-1 h-2.5 w-2.5 rounded-full bg-pine-800" />}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge label={label(notification.status)} tone={tone(notification.status)} />
                {notification.actionRequired && <StatusBadge label="Action required" tone="warning" />}
              </div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="rounded-xl border border-slate-200 p-3 text-sm text-slate-500">No notifications in this filter.</p>
        )}
      </div>
    </Card>
  );
}
