import { notFound } from "next/navigation";
import { ContentForm } from "@/app/dashboard/(components)/content-form";
import { DeleteContentButton } from "@/app/dashboard/(components)/delete-content-button";
import { VersionHistoryTable } from "@/app/dashboard/(components)/version-history-table";
import { restorePostVersionAction } from "@/app/dashboard/posts/[id]/actions";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPostById, getPostVersions } from "@/db/queries/posts";
import { requirePermission } from "@/lib/auth/requireRole";
import { hasPermission } from "@/lib/auth/roles";

type Params = { id: string };

export default async function DashboardPostEditorPage({ params }: { params: Promise<Params> }) {
  const profile = await requirePermission("content.posts.edit_own");
  const { id } = await params;
  const isNew = id === "new";
  const canPublish = hasPermission(profile.role, "content.posts.publish");

  const post = isNew ? null : await getPostById(id);
  if (!isNew && !post) {
    notFound();
  }

  const versions = isNew ? [] : await getPostVersions(id);

  return (
    <section className="space-y-6">
      <RevealStagger className="space-y-6">
        <RevealItem className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Editor</p>
          <h1 className="text-3xl font-semibold">{isNew ? "Create blog" : "Edit blog"}</h1>
          {!isNew && versions.length > 0 ? (
            <p className="text-sm text-fg/62">
              Version #{versions[0].version} - Last edited by {versions[0].editor_id || "unknown"}
            </p>
          ) : null}
        </RevealItem>

        <RevealItem>
          <Card>
            <CardContent className="p-6">
              <ContentForm type="post" item={post} canPublish={canPublish} />
            </CardContent>
          </Card>
        </RevealItem>

        {!isNew ? (
          <RevealItem>
            <Card>
              <CardHeader>
                <CardTitle>Version history</CardTitle>
              </CardHeader>
              <CardContent>
                <VersionHistoryTable
                  versions={versions}
                  itemId={id}
                  itemIdField="postId"
                  restoreAction={restorePostVersionAction}
                />
              </CardContent>
            </Card>
          </RevealItem>
        ) : null}

        {!isNew ? (
          <RevealItem>
            <DeleteContentButton type="post" id={id} />
          </RevealItem>
        ) : null}
      </RevealStagger>
    </section>
  );
}
