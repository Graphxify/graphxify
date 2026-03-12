import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/** Counts of items that need admin attention — used on Overview and sidebar badges */
export const getPendingCounts = cache(async function getPendingCounts() {
  const supabase = createClient();

  const [newLeads, pendingTestimonials, postsInReview] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("testimonials").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "review")
  ]);

  return {
    newLeads: newLeads.count ?? 0,
    pendingTestimonials: pendingTestimonials.count ?? 0,
    postsInReview: postsInReview.count ?? 0
  };
});

export async function getAnalyticsSummary() {
  const supabase = createClient();

  const since14d = new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString();

  const [posts, works, leads7, leads30, postsDraft, postsReview, activity] = await Promise.all([
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
    // Count queries per status instead of fetching all rows
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "review"),
    // Limit audit log rows — only need date grouping, not full history
    supabase
      .from("audit_logs")
      .select("created_at")
      .gte("created_at", since14d)
      .limit(500)
  ]);

  const dayMap = new Map<string, number>();
  for (let i = 13; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dayMap.set(d.toISOString().slice(0, 10), 0);
  }

  for (const row of activity.data ?? []) {
    const key = row.created_at.slice(0, 10);
    if (dayMap.has(key)) {
      dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
    }
  }

  const published = posts.count ?? 0;

  return {
    publishedPosts: published,
    publishedWorks: works.count ?? 0,
    leads7: leads7.count ?? 0,
    leads30: leads30.count ?? 0,
    statusBreakdown: {
      draft: postsDraft.count ?? 0,
      review: postsReview.count ?? 0,
      published
    },
    activity: Array.from(dayMap.entries()).map(([date, count]) => ({ date, count }))
  };
}
