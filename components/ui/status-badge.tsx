import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-sky-100 text-sky-700",
  danger: "bg-rose-100 text-rose-700"
};

export function StatusBadge({ label, tone = "info" }: { label: string; tone?: keyof typeof colorMap }) {
  return <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", colorMap[tone])}>{label}</span>;
}
