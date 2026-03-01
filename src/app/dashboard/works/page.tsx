import Link from "next/link";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardWorks } from "@/db/queries/works";
import { requireRole } from "@/lib/auth/requireRole";

export const dynamic = "force-dynamic";

export default async function DashboardWorksPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  await requireRole(["admin", "mod"]);
  const page = Number(searchParams.page ?? 1);
  const result = await getDashboardWorks(page, 10);

  return (
    <section className="space-y-5">
      <RevealStagger className="space-y-5">
        <RevealItem>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Content</p>
              <h1 className="text-3xl font-semibold">Works</h1>
            </div>
            <Link href="/dashboard/works/new" className="link-sweep text-sm">
              New work
            </Link>
          </div>
        </RevealItem>

        <RevealItem>
          <div className="section-shell border-border/18 bg-card/72 p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.rows.map((work) => (
                  <TableRow key={work.id}>
                    <TableCell>{work.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{work.status}</Badge>
                    </TableCell>
                    <TableCell>{work.year}</TableCell>
                    <TableCell>
                      <Link href={`/dashboard/works/${work.id}`} className="link-sweep text-sm">
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
