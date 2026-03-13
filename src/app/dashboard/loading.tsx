/**
 * Dashboard route loading boundary.
 *
 * Without this file, clicking any sidebar tab holds the current page
 * until the destination page finishes full server-side rendering
 * (auth check + DB queries). With this file, Next.js creates a Suspense
 * boundary around every dashboard page — the sidebar and layout shell
 * render immediately on click, and this skeleton fills the content area
 * while data fetches complete.
 */
export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Page title placeholder */}
      <div className="h-7 w-44 rounded-lg bg-card/80" />

      {/* Table shell */}
      <div className="section-shell overflow-hidden border-border/14 bg-card/52 p-0">
        {/* Toolbar row */}
        <div className="flex items-center gap-3 border-b border-border/10 px-4 py-3">
          <div className="h-8 w-56 rounded-lg bg-card/80" />
          <div className="ml-auto h-8 w-24 rounded-lg bg-card/80" />
        </div>

        {/* Table rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-border/8 px-4 py-3.5 last:border-0"
          >
            <div className="h-4 w-4 shrink-0 rounded bg-card/80" />
            <div className="h-4 w-48 rounded bg-card/80" />
            <div className="h-4 w-20 rounded bg-card/80" />
            <div className="ml-auto h-4 w-14 rounded bg-card/80" />
          </div>
        ))}
      </div>
    </div>
  );
}
