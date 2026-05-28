export function SkeletonCard() {
  return (
    <div className="animate-pulseSoft rounded-2xl border border-spruce-100 bg-white p-3 shadow-soft">
      <div className="h-40 rounded-xl bg-slate-100" />
      <div className="mt-3 h-4 w-2/3 rounded bg-slate-100" />
      <div className="mt-2 h-3 w-1/3 rounded bg-slate-100" />
      <div className="mt-3 h-8 w-full rounded-xl bg-slate-100" />
    </div>
  );
}
