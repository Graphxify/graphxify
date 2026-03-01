"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadMedia } from "@/app/dashboard/(components)/upload-media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { emitCmsContentChanged } from "@/lib/client/cms-sync";

type ContentFormProps = {
  type: "post" | "work";
  item?: Record<string, unknown> | null;
};

export function ContentForm({ type, item }: ContentFormProps): JSX.Element {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [cover, setCover] = useState(String(item?.cover_image_url ?? ""));
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const formData = new FormData(event.currentTarget);
    formData.set("coverImageUrl", cover);

    const endpoint = type === "post" ? "/api/dashboard/posts" : "/api/dashboard/works";
    const method = item?.id ? "PUT" : "POST";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(endpoint, {
        method,
        body: formData,
        credentials: "include",
        cache: "no-store",
        signal: controller.signal
      });

      const payload = (await response.json()) as { id?: string; message?: string };
      if (!response.ok || !payload.id) {
        setError(payload.message || "Save failed");
        return;
      }

      emitCmsContentChanged(`${type}.saved`);
      setNotice("Saved successfully.");
      router.push(`/dashboard/${type}s/${payload.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Request failed");
    } finally {
      clearTimeout(timeout);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" aria-label={`${type} editor`}>
      <input type="hidden" name="id" defaultValue={String(item?.id ?? "")} />
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required defaultValue={String(item?.title ?? "")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" required defaultValue={String(item?.slug ?? "")} />
      </div>
      {type === "work" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input id="year" name="year" type="number" required defaultValue={String(item?.year ?? "2026")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" name="role" required defaultValue={String(item?.role ?? "")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="services">Services (comma separated)</Label>
            <Input
              id="services"
              name="services"
              required
              defaultValue={Array.isArray(item?.services) ? (item?.services as string[]).join(", ") : ""}
            />
          </div>
        </>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" name="excerpt" required defaultValue={String(item?.excerpt ?? "")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" name="content" required className="min-h-[220px]" defaultValue={String(item?.content ?? "")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          className="h-11 w-full rounded-lg border border-border/20 bg-card/72 px-3 text-sm"
          defaultValue={String(item?.status ?? "draft")}
        >
          <option value="draft">Draft</option>
          <option value="review">Review</option>
          <option value="published">Published</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label>Cover image</Label>
        <UploadMedia onUploaded={setCover} />
        <Input name="coverImageUrl" value={cover} onChange={(e) => setCover(e.target.value)} placeholder="Image URL" />
      </div>
      {error ? <p className="text-sm text-fg/76">{error}</p> : null}
      {notice ? <p className="text-sm text-fg/76">{notice}</p> : null}
      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
