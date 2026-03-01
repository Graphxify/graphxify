import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function listAuditLogs(params: {
  page?: number;
  pageSize?: number;
  action?: string;
  entity?: string;
  actor?: string;
  from?: string;
  to?: string;
}) {
  const supabase = createClient();
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const fromIndex = (page - 1) * pageSize;
  const toIndex = fromIndex + pageSize - 1;

  let query = supabase
    .from("audit_logs")
    .select("id,actor_email,actor_role,action,entity_type,entity_id,ip,created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(fromIndex, toIndex);

  if (params.action) query = query.eq("action", params.action);
  if (params.entity) query = query.eq("entity_type", params.entity);
  if (params.actor) query = query.ilike("actor_email", `%${params.actor}%`);
  if (params.from) query = query.gte("created_at", params.from);
  if (params.to) query = query.lte("created_at", params.to);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    rows: data ?? [],
    total: count ?? 0,
    page,
    pageSize
  };
}
