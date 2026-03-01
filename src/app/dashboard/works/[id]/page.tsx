import { notFound } from "next/navigation";
import { ContentForm } from "@/app/dashboard/(components)/content-form";
import { DeleteContentButton } from "@/app/dashboard/(components)/delete-content-button";
import { restoreWorkVersionAction } from "@/app/dashboard/works/[id]/actions";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getWorkById, getWorkVersions } from "@/db/queries/works";
import { requireRole } from "@/lib/auth/requireRole";

type Params = { id: string };

export default async function DashboardWorkEditorPage({ params }: { params: Params }) {
  await requireRole(["admin", "mod"]);
  const isNew = params.id === "new";

  const work = isNew ? null : await getWorkById(params.id);
  if (!isNew && !work) {
    notFound();
  }

  const versions = isNew ? [] : await getWorkVersions(params.id);

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
                          <form action={restoreWorkVersionAction}>
                            <input type="hidden" name="workId" value={params.id} />
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
          </RevealItem>
        ) : null}

        {!isNew ? (
          <RevealItem>
            <DeleteContentButton type="work" id={params.id} />
          </RevealItem>
        ) : null}
      </RevealStagger>
    </section>
  );
}
