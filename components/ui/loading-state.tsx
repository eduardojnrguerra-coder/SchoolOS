export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-card">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-pine-900" />
      {label}
    </div>
  );
}
