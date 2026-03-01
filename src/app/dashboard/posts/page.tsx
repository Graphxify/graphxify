import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardPosts } from "@/db/queries/posts";
import { requireRole } from "@/lib/auth/requireRole";

export default async function DashboardPostsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  await requireRole(["admin", "mod"]);
  const page = Number(searchParams.page ?? 1);
  const result = await getDashboardPosts(page, 10);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Posts</h1>
        <Link href="/dashboard/posts/new" className="text-sm text-accentA">
          New post
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.rows.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.title}</TableCell>
              <TableCell><Badge variant="secondary">{post.status}</Badge></TableCell>
              <TableCell>{new Date(post.updated_at).toLocaleString()}</TableCell>
              <TableCell>
                <Link href={`/dashboard/posts/${post.id}`} className="text-accentA">
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
