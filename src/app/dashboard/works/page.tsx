import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardWorks } from "@/db/queries/works";
import { requireRole } from "@/lib/auth/requireRole";

export default async function DashboardWorksPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  await requireRole(["admin", "mod"]);
  const page = Number(searchParams.page ?? 1);
  const result = await getDashboardWorks(page, 10);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Works</h1>
        <Link href="/dashboard/works/new" className="text-sm text-accentA">
          New work
        </Link>
      </div>
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
              <TableCell><Badge variant="secondary">{work.status}</Badge></TableCell>
              <TableCell>{work.year}</TableCell>
              <TableCell>
                <Link href={`/dashboard/works/${work.id}`} className="text-accentA">
                  Edit
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-sm text-[rgba(242,240,235,0.75)]">Page {result.page} - Total {result.total}</p>
    </section>
  );
}
