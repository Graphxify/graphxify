"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadMedia } from "@/app/dashboard/(components)/upload-media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { emitCmsContentChanged } from "@/lib/client/cms-sync";

type TestimonialItem = {
  id?: string;
  name?: string;
  role?: string;
  quote?: string;
  image_url?: string | null;
  status?: "draft" | "published";
  sort_order?: number;
};

export function TestimonialForm({ item }: { item?: TestimonialItem | null }): JSX.Element {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState(String(item?.image_url ?? ""));
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const formData = new FormData(event.currentTarget);
    formData.set("imageUrl", imageUrl);

    const endpoint = "/api/dashboard/testimonials";
    const method = item?.id ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        body: formData,
        credentials: "include",
        cache: "no-store"
      });

      const payload = (await response.json()) as { id?: string; message?: string };
      if (!response.ok || !payload.id) {
        setError(payload.message || "Save failed");
        return;
      }

      emitCmsContentChanged("testimonial.saved");
      setNotice("Saved successfully.");
      router.push(`/dashboard/testimonials/${payload.id}`);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Request failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" aria-label="Testimonial editor">
      <input type="hidden" name="id" defaultValue={String(item?.id ?? "")} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required defaultValue={String(item?.name ?? "")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role / Company</Label>
          <Input id="role" name="role" required defaultValue={String(item?.role ?? "")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quote">Quote</Label>
        <Textarea
          id="quote"
          name="quote"
          required
          className="min-h-[180px]"
          defaultValue={String(item?.quote ?? "")}
          placeholder="Write a full testimonial quote."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input id="sortOrder" name="sortOrder" type="number" min={0} max={9999} defaultValue={String(item?.sort_order ?? 0)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            className="h-11 w-full rounded-lg border border-border/20 bg-card/72 px-3 text-sm text-fg"
            defaultValue={String(item?.status ?? "draft")}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Background image</Label>
        <UploadMedia onUploaded={setImageUrl} />
        <Input
          name="imageUrl"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="Image URL"
        />
      </div>

      {error ? <p className="text-sm text-fg/76">{error}</p> : null}
      {notice ? <p className="text-sm text-fg/76">{notice}</p> : null}

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
