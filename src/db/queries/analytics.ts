import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function getAnalyticsSummary() {
  const supabase = createClient();

  const [posts, works, leads7, leads30, statusBreakdown, activity] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("works").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()),
    supabase.from("posts").select("status"),
    supabase
      .from("audit_logs")
      .select("created_at")
      .gte("created_at", new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString())
  ]);

  const postRows = statusBreakdown.data ?? [];
  const draft = postRows.filter((row) => row.status === "draft").length;
  const review = postRows.filter((row) => row.status === "review").length;
  const published = postRows.filter((row) => row.status === "published").length;

  const dayMap = new Map<string, number>();
  for (let i = 13; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dayMap.set(key, 0);
  }

  for (const row of activity.data ?? []) {
    const key = row.created_at.slice(0, 10);
    if (dayMap.has(key)) {
      dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
    }
  }

  return {
    publishedPosts: posts.count ?? 0,
    publishedWorks: works.count ?? 0,
    leads7: leads7.count ?? 0,
    leads30: leads30.count ?? 0,
    statusBreakdown: { draft, review, published },
    activity: Array.from(dayMap.entries()).map(([date, count]) => ({ date, count }))
  };
}
