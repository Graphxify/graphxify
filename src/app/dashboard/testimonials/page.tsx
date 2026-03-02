import Link from "next/link";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardTestimonials } from "@/db/queries/testimonials";
import { requireRole } from "@/lib/auth/requireRole";

export const dynamic = "force-dynamic";

export default async function DashboardTestimonialsPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  await requireRole(["admin", "mod"]);
  const page = Number(searchParams.page ?? 1);
  let result: Awaited<ReturnType<typeof getDashboardTestimonials>> = {
    rows: [],
    total: 0,
    page,
    pageSize: 12,
    warning: ""
  };
  let loadError = "";

  try {
    result = await getDashboardTestimonials(page, 12);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      const code = String((error as { code?: string }).code || "");
      if (code === "42501") {
        loadError = "Testimonials permissions are missing. Re-run supabase/rls.sql after supabase/testimonials.sql.";
      } else if (["42P01", "42703", "PGRST116", "PGRST204"].includes(code)) {
        loadError = "Testimonials schema is missing or outdated. Run supabase/testimonials.sql in Supabase SQL editor.";
      }
    }

    if (!loadError && error && typeof error === "object" && "message" in error) {
      loadError = String((error as { message?: string }).message || "Unable to load testimonials.");
    } else {
      loadError ||= "Unable to load testimonials.";
    }
  }

  return (
    <section className="space-y-5">
      <RevealStagger className="space-y-5">
        <RevealItem>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Content</p>
              <h1 className="text-3xl font-semibold">Testimonials</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/testimonials/metrics" className="link-sweep text-sm">
                Edit metrics card
              </Link>
              <Link href="/dashboard/testimonials/new" className="link-sweep text-sm">
                New testimonial
              </Link>
            </div>
          </div>
        </RevealItem>

        <RevealItem>
          <div className="section-shell border-border/18 bg-card/72 p-4">
            {result.warning ? <p className="mb-3 text-sm text-fg/72">{result.warning}</p> : null}
            {loadError ? <p className="mb-3 text-sm text-fg/72">{loadError}</p> : null}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.rows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.role}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.status}</Badge>
                    </TableCell>
                    <TableCell>{item.sort_order}</TableCell>
                    <TableCell>{new Date(item.updated_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Link href={`/dashboard/testimonials/${item.id}`} className="link-sweep text-sm">
                        Edit
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </RevealItem>

        <RevealItem>
          <p className="text-sm text-fg/62">
            Page {result.page} - Total {result.total}
          </p>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
