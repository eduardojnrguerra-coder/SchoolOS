"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export function AttendanceOverviewChart({
  data
}: {
  data: Array<{ date: string; present: number; absent: number; late: number }>;
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 12 }} />
          <YAxis tick={{ fill: "#475569", fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="present" stroke="#16a34a" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="absent" stroke="#dc2626" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FeeCollectionChart({
  data
}: {
  data: Array<{ month: string; paid: number; outstanding: number; target: number }>;
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 12 }} />
          <YAxis tick={{ fill: "#475569", fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="paid" stackId="fees" fill="#0f766e" radius={[6, 6, 0, 0]} />
          <Bar dataKey="outstanding" stackId="fees" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
