import { notFound } from "next/navigation";
import { ContentForm } from "@/app/dashboard/(components)/content-form";
import { DeleteContentButton } from "@/app/dashboard/(components)/delete-content-button";
import { VersionHistoryTable } from "@/app/dashboard/(components)/version-history-table";
import { restoreWorkVersionAction } from "@/app/dashboard/works/[id]/actions";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkById, getWorkVersions } from "@/db/queries/works";
import { requireRole } from "@/lib/auth/requireRole";

type Params = { id: string };

export default async function DashboardWorkEditorPage({ params }: { params: Promise<Params> }) {
  await requireRole(["admin", "mod"]);
  const { id } = await params;
  const isNew = id === "new";

  const work = isNew ? null : await getWorkById(id);
  if (!isNew && !work) {
    notFound();
  }

  const versions = isNew ? [] : await getWorkVersions(id);

  return (
    <section className="space-y-6">
      <RevealStagger className="space-y-6">
        <RevealItem className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Editor</p>
          <h1 className="text-3xl font-semibold">{isNew ? "Create work" : "Edit work"}</h1>
          {!isNew && versions.length > 0 ? (
            <p className="text-sm text-fg/62">
              Version #{versions[0].version} - Last edited by {versions[0].editor_id || "unknown"}
            </p>
          ) : null}
        </RevealItem>

        <RevealItem>
          <Card>
            <CardContent className="p-6">
              <ContentForm type="work" item={work} />
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
                  itemIdField="workId"
                  restoreAction={restoreWorkVersionAction}
                />
              </CardContent>
            </Card>
          </RevealItem>
        ) : null}

        {!isNew ? (
          <RevealItem>
            <DeleteContentButton type="work" id={id} />
          </RevealItem>
        ) : null}
      </RevealStagger>
    </section>
  );
}
