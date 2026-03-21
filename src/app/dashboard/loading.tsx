export default function DashboardLoading(): JSX.Element {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-3 w-20 animate-pulse rounded-full bg-card/80" />
        <div className="h-10 w-80 max-w-full animate-pulse rounded-2xl bg-card/80" />
      </div>

      <div className="h-24 animate-pulse rounded-2xl border border-border/12 bg-card/60" />

      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-2xl border border-border/12 bg-card/60"
          />
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-14 animate-pulse rounded-2xl border border-border/12 bg-card/60"
          />
        ))}
      </div>
    </div>
  );
}
