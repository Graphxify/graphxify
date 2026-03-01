export default function DashboardLoading() {
  return (
    <div className="space-y-4" aria-label="Dashboard loading">
      <div className="h-10 w-64 animate-pulse rounded-lg border border-border/18 bg-card/62" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-32 animate-pulse rounded-xl border border-border/18 bg-card/62" />
        <div className="h-32 animate-pulse rounded-xl border border-border/18 bg-card/62" />
        <div className="h-32 animate-pulse rounded-xl border border-border/18 bg-card/62" />
      </div>
      <div className="h-72 animate-pulse rounded-xl border border-border/18 bg-card/62" />
    </div>
  );
}
