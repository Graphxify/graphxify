"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadMedia } from "@/app/dashboard/(components)/upload-media";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/form-feedback";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { emitCmsContentChanged } from "@/lib/client/cms-sync";
import { submitFormDataRequest } from "@/lib/forms/shared";
import { BLOG_CATEGORIES, formatBlogTagInput } from "@/lib/blog";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

type ContentFormProps = {
  type: "post" | "work";
  item?: Record<string, unknown> | null;
  canPublish?: boolean;
};

function uniqueGalleryValues(values: string[]): string[] {
  return Array.from(new Set(values));
}

export function ContentForm({ type, item, canPublish = true }: ContentFormProps): JSX.Element {
  const router = useRouter();
  const isWork = type === "work";
  const isBlog = type === "post";
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
  const [slug, setSlug] = useState(String(item?.slug ?? ""));
  const slugManuallyEdited = useRef(Boolean(item?.slug));
  const [showPreview, setShowPreview] = useState(false);
  const [contentValue, setContentValue] = useState(String(item?.content ?? ""));
  const blogCategoryValue = String(item?.category ?? BLOG_CATEGORIES[0]);
  const blogAuthorValue = String(item?.author ?? "Graphxify Team");
  const blogAuthorRoleValue = String(item?.author_role ?? "Editorial Team");
  const blogAuthorBioValue = String(
    item?.author_bio ?? "Graphxify shares practical guidance on brand systems, websites, and content operations."
  );
  const blogTagsValue = formatBlogTagInput(item?.tags);
  const blogSeoTitleValue = String(item?.seo_title ?? "");
  const blogSeoDescriptionValue = String(item?.seo_description ?? "");

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

    try {
      const result = await submitFormDataRequest<{ id: string }>(endpoint, formData, method);
      const savedId = result.data && typeof result.data === "object" && "id" in result.data
        ? String((result.data as { id?: string }).id || "")
        : "";

      if (!result.success || !savedId) {
        setError(result.message || `Unable to save ${isBlog ? "blog" : "work"}.`);
        return;
      }

      emitCmsContentChanged(`${type}.saved`);
      setNotice(result.message || `${isBlog ? "Blog" : "Work"} saved successfully.`);
      router.push(`/dashboard/${type}s/${savedId}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : `Unable to save ${isBlog ? "blog" : "work"}.`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" aria-label={`${isBlog ? "blog" : type} editor`}>
      <input type="hidden" name="id" defaultValue={String(item?.id ?? "")} />
      {isWork ? (
        <>
          <input type="hidden" name="year" defaultValue={workYearValue} />
          <input type="hidden" name="services" defaultValue={workServicesDefault} />
          <input type="hidden" name="layoutVariant" defaultValue={workLayoutVariantValue} />
          <input type="hidden" name="content" defaultValue={workContentValue} />

          <div className="space-y-2">
            <Label>Hero background image</Label>
            <UploadMedia onUploaded={setCover} currentUrl={cover} />
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
              onChange={(e) => {
                if (!slugManuallyEdited.current) {
                  setSlug(slugify(e.target.value));
                }
              }}
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
              value={slug}
              onChange={(e) => {
                slugManuallyEdited.current = true;
                setSlug(e.target.value);
              }}
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
              className="h-11 w-full rounded-lg border border-border/20 bg-card/72 px-3 text-sm text-fg"
              defaultValue={String(item?.status ?? "draft")}
            >
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              {canPublish ? <option value="published">Published</option> : null}
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
                  <UploadMedia onUploaded={(url) => updateGalleryImage(index, url)} currentUrl={imageUrl} />
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
            <Label htmlFor="title">Blog title</Label>
          </div>
          <div className="space-y-2">
            <Input
              id="title"
              name="title"
              required
              defaultValue={String(item?.title ?? "")}
              placeholder="Shown on blog cards and the blog detail page title"
              onChange={(e) => {
                if (!slugManuallyEdited.current) {
                  setSlug(slugify(e.target.value));
                }
              }}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                className="h-11 w-full rounded-lg border border-border/20 bg-card/72 px-3 text-sm text-fg"
                defaultValue={blogCategoryValue}
              >
                {BLOG_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                required
                defaultValue={blogAuthorValue}
                placeholder="Shown on the blog listing and detail page"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="authorRole">Author role</Label>
              <Input
                id="authorRole"
                name="authorRole"
                defaultValue={blogAuthorRoleValue}
                placeholder="Shown in the author card on the blog detail page"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                defaultValue={blogTagsValue}
                placeholder="Comma-separated tags used on the blog detail page"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="authorBio">Author bio</Label>
            <Textarea
              id="authorBio"
              name="authorBio"
              defaultValue={blogAuthorBioValue}
              placeholder="Short author description shown on the blog detail page"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                slugManuallyEdited.current = true;
                setSlug(e.target.value);
              }}
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
              placeholder="Shown on blog cards, in the blog hero, and used as fallback SEO description"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Content</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-fg/62"
                onClick={() => setShowPreview((prev) => !prev)}
              >
                {showPreview ? "Edit" : "Preview"}
              </Button>
            </div>
            {showPreview ? (
              <div
                className="prose prose-sm prose-invert min-h-[220px] rounded-lg border border-border/18 bg-card/72 px-3 py-2 text-sm text-fg"
                dangerouslySetInnerHTML={{
                  __html: contentValue
                    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
                    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
                    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
                    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.+?)\*/g, "<em>$1</em>")
                    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accentA underline">$1</a>')
                    .replace(/^- (.+)$/gm, "<li>$1</li>")
                    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
                    .replace(/\n/g, "<br />")
                }}
              />
            ) : (
              <Textarea
                id="content"
                name="content"
                required
                className="min-h-[220px]"
                value={contentValue}
                onChange={(e) => setContentValue(e.target.value)}
                placeholder="Main blog body shown on the public blog detail page"
              />
            )}
            {showPreview ? <input type="hidden" name="content" value={contentValue} /> : null}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO title</Label>
              <Input
                id="seoTitle"
                name="seoTitle"
                defaultValue={blogSeoTitleValue}
                placeholder="Optional custom title tag for the blog detail page"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO description</Label>
              <Textarea
                id="seoDescription"
                name="seoDescription"
                defaultValue={blogSeoDescriptionValue}
                placeholder="Optional custom meta description for the blog detail page"
              />
            </div>
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
              <option value="review">Review</option>
              {canPublish ? <option value="published">Published</option> : null}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Featured image</Label>
            <UploadMedia onUploaded={setCover} currentUrl={cover} />
            <Input
              name="coverImageUrl"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              placeholder="Shown on the blog listing and blog detail hero"
            />
          </div>
        </>
      )}
      <FormAlert message={error} />
      <FormAlert message={notice} type="success" />
      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
