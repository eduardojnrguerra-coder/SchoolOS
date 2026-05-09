"use client";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { AttendanceMark, attendanceLabel } from "@/lib/attendance";

const markOptions: AttendanceMark[] = ["PRESENT", "ABSENT", "LATE", "LEFT_EARLY", "SICK_BAY", "EXCUSED"];

export type RegisterRow = {
  learnerId: string;
  learnerName: string;
  status: AttendanceMark;
  note: string;
};

export function RegisterEditor({
  rows,
  onChangeRow,
  compact = false
}: {
  rows: RegisterRow[];
  onChangeRow: (learnerId: string, data: Partial<RegisterRow>) => void;
  compact?: boolean;
}) {
  return (
    <Card className="overflow-x-auto">
      <table className={`w-full text-left ${compact ? "text-xs" : "text-sm"}`}>
        <thead className="border-b border-slate-200 text-slate-500">
          <tr>
            <th className="px-3 py-2">Learner</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Note</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.learnerId} className="border-b border-slate-100 last:border-b-0">
              <td className="px-3 py-2 font-medium text-slate-900">{row.learnerName}</td>
              <td className="px-3 py-2">
                <select
                  value={row.status}
                  onChange={(e) => onChangeRow(row.learnerId, { status: e.target.value as AttendanceMark })}
                  className="rounded-lg border border-slate-200 px-2 py-1"
                >
                  {markOptions.map((option) => (
                    <option key={option} value={option}>
                      {attendanceLabel(option)}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-3 py-2">
                <input
                  value={row.note}
                  onChange={(e) => onChangeRow(row.learnerId, { note: e.target.value })}
                  placeholder="Optional note"
                  className="w-full rounded-lg border border-slate-200 px-2 py-1"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 px-1">
        <StatusBadge label={`${rows.length} learners in register`} tone="info" />
      </div>
    </Card>
  );
}
