import { notFound } from "next/navigation";
import { ContentForm } from "@/app/dashboard/(components)/content-form";
import { deletePostAction, restorePostVersionAction } from "@/app/dashboard/posts/[id]/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getPostById, getPostVersions } from "@/db/queries/posts";
import { requireRole } from "@/lib/auth/requireRole";

type Params = { id: string };

export default async function DashboardPostEditorPage({ params }: { params: Params }) {
  const profile = await requireRole(["admin", "mod"]);
  const isNew = params.id === "new";

  const post = isNew ? null : await getPostById(params.id);
  if (!isNew && !post) {
    notFound();
  }

  const versions = isNew ? [] : await getPostVersions(params.id);

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">{isNew ? "Create post" : "Edit post"}</h1>
      {!isNew && versions.length > 0 ? (
        <p className="text-sm text-[rgba(242,240,235,0.75)]">
          Version #{versions[0].version} - Last edited by {versions[0].editor_id || "unknown"}
        </p>
      ) : null}

      <Card>
        <CardContent className="p-6">
          <ContentForm type="post" item={post} />
        </CardContent>
      </Card>

      {!isNew ? (
        <Card>
          <CardHeader>
            <CardTitle>Version history</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Edited At</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.map((version) => (
                  <TableRow key={version.id}>
                    <TableCell>#{version.version}</TableCell>
                    <TableCell>{version.title}</TableCell>
                    <TableCell>{version.status}</TableCell>
                    <TableCell>{new Date(version.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <form action={restorePostVersionAction}>
                        <input type="hidden" name="postId" value={params.id} />
                        <input type="hidden" name="versionId" value={version.id} />
                        <Button size="sm" variant="secondary" type="submit">
                          Restore
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}

      {!isNew && profile.role === "admin" ? (
        <form action={deletePostAction}>
          <input type="hidden" name="postId" value={params.id} />
          <Button type="submit" variant="destructive">
            Delete post
          </Button>
        </form>
      ) : null}
    </section>
  );
}
