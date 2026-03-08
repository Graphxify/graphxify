import Link from "next/link";
import { FileText } from "lucide-react";
import { EmptyState } from "@/app/dashboard/(components)/empty-state";
import { ServerPagination } from "@/app/dashboard/(components)/server-pagination";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardPosts } from "@/db/queries/posts";
import { requireRole } from "@/lib/auth/requireRole";

export const dynamic = "force-dynamic";

function statusVariant(status: string) {
  if (status === "published") return "success" as const;
  if (status === "draft" || status === "review") return "warning" as const;
  return "secondary" as const;
}

export default async function DashboardPostsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireRole(["admin", "mod"]);
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page ?? 1);
  const result = await getDashboardPosts(page, 10);

  return (
    <section className="space-y-5">
      <RevealStagger className="space-y-5">
        <RevealItem>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Content</p>
              <h1 className="text-3xl font-semibold">Posts</h1>
            </div>
            <Button asChild size="sm">
              <Link href="/dashboard/posts/new">New post</Link>
            </Button>
          </div>
        </RevealItem>

        <RevealItem>
          <div className="section-shell border-border/18 bg-card/72 p-4">
            {result.rows.length === 0 ? (
              <EmptyState
                icon={<FileText className="h-8 w-8 text-fg/32" />}
                title="No posts yet"
                description="Create your first blog post to get started."
                actionLabel="New post"
                actionHref="/dashboard/posts/new"
              />
            ) : (
              <>
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
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(post.status)}>{post.status}</Badge>
                        </TableCell>
                        <TableCell className="text-fg/56">{new Date(post.updated_at).toLocaleString()}</TableCell>
                        <TableCell>
                          <Link href={`/dashboard/posts/${post.id}`} className="link-sweep text-sm">
                            Edit
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <ServerPagination
                  currentPage={result.page}
                  total={result.total}
                  pageSize={10}
                  basePath="/dashboard/posts"
                />
              </>
            )}
          </div>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}
