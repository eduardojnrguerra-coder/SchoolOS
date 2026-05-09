export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-5">
      <h1 className="text-2xl font-semibold text-pine-900">{title}</h1>
      <p className="text-sm text-slate-600">{subtitle}</p>
    </header>
  );
}
