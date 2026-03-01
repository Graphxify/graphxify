import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function getDashboardLeads(page = 1, pageSize = 20) {
  const supabase = createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("leads")
    .select("id,name,email,message,created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    rows: data ?? [],
    total: count ?? 0,
    page,
    pageSize
  };
}

export async function getProfiles() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,role,created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
