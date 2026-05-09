"use client";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { DeliveryStatus, NoticeDelivery } from "@/src/lib/notifications";
import { RefreshCw } from "lucide-react";

function toneForStatus(status: DeliveryStatus) {
  if (status === "Read" || status === "READ" || status === "Delivered" || status === "DELIVERED") return "success" as const;
  if (status === "Action required" || status === "ACTION_REQUIRED" || status === "Failed" || status === "FAILED") return "warning" as const;
  return "info" as const;
}

function displayStatus(status: DeliveryStatus) {
  return status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function NotificationCenter({ deliveries }: { deliveries: NoticeDelivery[] }) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-pine-900">Notification Center</h2>
          <p className="text-xs text-slate-500">Recent delivery activity and resend queue.</p>
        </div>
        <StatusBadge label={`${deliveries.length} records`} tone="info" />
      </div>
      <div className="space-y-2">
        {deliveries.length === 0 && (
          <p className="rounded-lg border border-slate-200 p-3 text-sm text-slate-500">No delivery records yet.</p>
        )}
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 text-sm">
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-900">{delivery.title ?? delivery.recipientLabel}</p>
              <p className="truncate text-xs text-slate-500">
                {delivery.recipientLabel} · {delivery.channel} · {new Date(delivery.updatedAt).toLocaleString("en-ZA")}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <StatusBadge label={displayStatus(delivery.status)} tone={toneForStatus(delivery.status)} />
              {(delivery.status === "Failed" || delivery.status === "FAILED") && (
                <button className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" aria-label="Resend notification placeholder">
                  <RefreshCw className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
