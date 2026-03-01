"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadMedia } from "@/app/dashboard/(components)/upload-media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ContentFormProps = {
  type: "post" | "work";
  item?: Record<string, unknown> | null;
};

export function ContentForm({ type, item }: ContentFormProps): JSX.Element {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [cover, setCover] = useState(String(item?.cover_image_url ?? ""));
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    formData.set("coverImageUrl", cover);

    const endpoint = type === "post" ? "/api/dashboard/posts" : "/api/dashboard/works";
    const method = item?.id ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      body: formData
    });

    const payload = (await response.json()) as { id?: string; message?: string };
    if (!response.ok || !payload.id) {
      setError(payload.message || "Save failed");
      setSaving(false);
      return;
    }

    router.push(`/dashboard/${type}s/${payload.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-label={`${type} editor`}>
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
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input id="year" name="year" type="number" required defaultValue={String(item?.year ?? "2026")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" required defaultValue={String(item?.role ?? "")} />
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
          className="h-10 w-full rounded-lg border border-[rgba(242,240,235,0.18)] bg-[rgba(13,13,15,0.9)] px-3"
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
      {error ? <p className="text-sm text-[rgba(242,240,235,0.8)]">{error}</p> : null}
      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
