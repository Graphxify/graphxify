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

function uniqueGalleryValues(values: string[]): string[] {
  return Array.from(new Set(values));
}

export function ContentForm({ type, item }: ContentFormProps): JSX.Element {
  const router = useRouter();
  const isWork = type === "work";
  const parsedWorkYear = Number.parseInt(String(item?.year ?? ""), 10);
  const workYearValue = String(Number.isFinite(parsedWorkYear) ? parsedWorkYear : new Date().getFullYear());
  const workServicesValue = Array.isArray(item?.services)
    ? (item.services as unknown[])
        .map((value) => String(value).trim())
        .filter((value) => value.length > 0)
        .join(", ")
    : "";
  const workServicesDefault = workServicesValue.length > 0 ? workServicesValue : "General";
  const workLayoutVariantValue = String(item?.layout_variant ?? "A");
  const workDescriptionValue = String(item?.excerpt ?? "").trim();
  const workContentValue = String(item?.content ?? "").trim() || workDescriptionValue || "Project details";
  const [saving, setSaving] = useState(false);
  const [cover, setCover] = useState(String(item?.cover_image_url ?? ""));
  const normalizedCover = String(item?.cover_image_url ?? "").trim();
  const initialGalleryImages =
    type === "work" && Array.isArray(item?.gallery_images)
      ? uniqueGalleryValues(
          (item.gallery_images as unknown[])
            .map((value) => String(value).trim())
            .filter((value) => Boolean(value) && value !== normalizedCover)
        )
      : [];
  const [galleryImages, setGalleryImages] = useState<string[]>(
    type !== "work"
      ? [""]
      : initialGalleryImages.length > 0
        ? initialGalleryImages
        : [""]
  );
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const updateGalleryImage = (index: number, value: string) => {
    setGalleryImages((prev) => prev.map((entry, entryIndex) => (entryIndex === index ? value : entry)));
  };

  const addGalleryImage = () => {
    setGalleryImages((prev) => (prev.length >= 24 ? prev : [...prev, ""]));
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => {
      if (prev.length <= 1) {
        return [""];
      }
      return prev.filter((_, entryIndex) => entryIndex !== index);
    });
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const formData = new FormData(event.currentTarget);
    formData.set("coverImageUrl", cover);
    const normalizedCoverValue = cover.trim();
    formData.delete("galleryImages");
    galleryImages.forEach((value) => {
      const normalizedValue = value.trim();
      if (!normalizedValue || normalizedValue === normalizedCoverValue) {
        return;
      }
      formData.append("galleryImages", normalizedValue);
    });

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
      {isWork ? (
        <>
          <input type="hidden" name="year" defaultValue={workYearValue} />
          <input type="hidden" name="services" defaultValue={workServicesDefault} />
          <input type="hidden" name="layoutVariant" defaultValue={workLayoutVariantValue} />
          <input type="hidden" name="content" defaultValue={workContentValue} />

          <div className="space-y-2">
            <Label>Hero background image</Label>
            <UploadMedia onUploaded={setCover} />
            <Input
              name="coverImageUrl"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              placeholder="Shown as project cover (cards) and project detail hero background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Project title</Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={String(item?.title ?? "")}
              placeholder="Shown on project cards and the project detail hero title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Project subtitle</Label>
            <Input
              id="subtitle"
              name="subtitle"
              defaultValue={String(item?.subtitle ?? item?.excerpt ?? "")}
              placeholder="Shown under the project title in the project detail hero"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              required
              defaultValue={String(item?.slug ?? "")}
              placeholder="Used in the URL (/works/...) - lowercase letters, numbers, hyphens only"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Title</Label>
            <Input
              id="role"
              name="role"
              required
              defaultValue={String(item?.role ?? "")}
              placeholder='Shown in the highlighted label above the image layout section (before "Template X")'
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Description</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              required
              defaultValue={String(item?.excerpt ?? "")}
              placeholder='Shown under "Title" above the image layout section and used for page SEO description'
            />
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

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Label>Project details gallery images</Label>
              <Button type="button" variant="secondary" size="sm" onClick={addGalleryImage} disabled={galleryImages.length >= 24}>
                Add image slot
              </Button>
            </div>
            <p className="text-xs text-fg/62">
              These images control the visuals on each project detail page. Slot count matches saved images; you can add up to 24.
            </p>
            <div className="space-y-3">
              {galleryImages.map((imageUrl, index) => (
                <div key={`gallery-image-${index}`} className="space-y-2 rounded-lg border border-border/20 bg-card/56 p-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.12em] text-fg/60">
                    <span>Image {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="text-fg/66 transition-colors hover:text-fg"
                    >
                      Remove
                    </button>
                  </div>
                  <UploadMedia onUploaded={(url) => updateGalleryImage(index, url)} />
                  <Input
                    name="galleryImages"
                    value={imageUrl}
                    onChange={(event) => updateGalleryImage(index, event.target.value)}
                    placeholder="Shown in the project detail visual gallery block"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Label htmlFor="title">Title</Label>
          </div>
          <div className="space-y-2">
            <Input
              id="title"
              name="title"
              required
              defaultValue={String(item?.title ?? "")}
              placeholder="Shown on blog cards and the blog article title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              required
              defaultValue={String(item?.slug ?? "")}
              placeholder="Used in the URL (/blog/...) - lowercase letters, numbers, hyphens only"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              required
              defaultValue={String(item?.excerpt ?? "")}
              placeholder="Shown on blog cards and used for page SEO description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              required
              className="min-h-[220px]"
              defaultValue={String(item?.content ?? "")}
              placeholder="Main blog article body shown on the blog detail page"
            />
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
            <Label>Hero background image</Label>
            <UploadMedia onUploaded={setCover} />
            <Input
              name="coverImageUrl"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              placeholder="Shown as blog card image and blog article hero image"
            />
          </div>
        </>
      )}
      {error ? <p className="text-sm text-fg/76">{error}</p> : null}
      {notice ? <p className="text-sm text-fg/76">{notice}</p> : null}
      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
