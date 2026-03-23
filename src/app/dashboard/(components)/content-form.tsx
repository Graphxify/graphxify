"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadMedia } from "@/app/dashboard/(components)/upload-media";
import { Button } from "@/components/ui/button";
import { FieldErrorText, FormAlert } from "@/components/ui/form-feedback";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { emitCmsContentChanged } from "@/lib/client/cms-sync";
import type { FormFieldErrors } from "@/lib/forms/shared";
import { submitFormDataRequest } from "@/lib/forms/shared";
import { BLOG_CATEGORIES, RELATED_SERVICE_OPTIONS, formatBlogTagInput } from "@/lib/blog";

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

function deriveWorkContentFromForm(formData: FormData): string {
  const parts = [
    "excerpt",
    "overview",
    "challenge",
    "approach",
    "solution",
    "result"
  ]
    .map((key) => String(formData.get(key) || "").trim())
    .filter(Boolean);

  return parts.join("\n\n");
}

function parseFieldErrorsFromMessage(message: string): FormFieldErrors {
  return Object.fromEntries(
    message
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separatorIndex = part.indexOf(":");
        if (separatorIndex === -1) {
          return null;
        }

        const key = part.slice(0, separatorIndex).trim();
        const value = part.slice(separatorIndex + 1).trim();

        if (!key || !value) {
          return null;
        }

        return [key, value] as const;
      })
      .filter((entry): entry is readonly [string, string] => Boolean(entry))
  );
}

function normalizeFieldErrors(type: "post" | "work", errors?: FormFieldErrors): FormFieldErrors {
  if (!errors) {
    return {};
  }

  const nextErrors = { ...errors };
  if (type === "work" && nextErrors.content) {
    nextErrors.excerpt = nextErrors.excerpt || "Short description must contain at least 20 characters to publish.";
    delete nextErrors.content;
  }

  return nextErrors;
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
  const workCardServicesValue = Array.isArray(item?.card_services)
    ? (item.card_services as unknown[])
      .map((value) => String(value).trim())
      .filter((value) => value.length > 0)
      .join(", ")
    : "";
  const workLayoutVariantValue = String(item?.layout_variant ?? "A");
  const workDescriptionValue = String(item?.excerpt ?? "").trim();
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
  const [fieldErrors, setFieldErrors] = useState<FormFieldErrors>({});
  const [notice, setNotice] = useState("");
  const [slug, setSlug] = useState(String(item?.slug ?? ""));
  const slugManuallyEdited = useRef(Boolean(item?.slug));
  const [showPreview, setShowPreview] = useState(false);
  const [contentValue, setContentValue] = useState(String(item?.content ?? ""));
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});
  const blogCategoryValue = String(item?.category ?? BLOG_CATEGORIES[0]);
  const blogAuthorValue = String(item?.author ?? "Graphxify Team");
  const blogAuthorRoleValue = String(item?.author_role ?? "Editorial Team");
  const blogAuthorBioValue = String(
    item?.author_bio ?? "Graphxify shares practical guidance on brand systems, websites, and content operations."
  );
  const blogTagsValue = formatBlogTagInput(item?.tags);
  const blogSeoTitleValue = String(item?.seo_title ?? "");
  const blogSeoDescriptionValue = String(item?.seo_description ?? "");
  const blogRelatedServiceValue = String(item?.related_service ?? "");
  const blogReadTimeOverrideValue = typeof item?.read_time_override === "number" ? String(item.read_time_override) : "";

  useEffect(() => {
    const firstFieldName = Object.keys(fieldErrors)[0];
    if (!firstFieldName) {
      return;
    }

    const target = fieldRefs.current[firstFieldName];
    if (!target) {
      return;
    }

    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
        target.focus({ preventScroll: true });
      }
    });
  }, [fieldErrors]);

  function registerFieldRef(name: string) {
    return (node: HTMLElement | null) => {
      fieldRefs.current[name] = node;
    };
  }

  function getFieldError(name: string): string | undefined {
    return fieldErrors[name];
  }

  function getFieldClasses(name: string): string | undefined {
    return getFieldError(name)
      ? "border-red-500/70 bg-red-500/6 focus-visible:ring-red-500/25"
      : undefined;
  }

  function getErrorId(name: string): string {
    return `${type}-${name}-error`;
  }

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
    setFieldErrors({});
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
    if (isWork) {
      formData.set("content", deriveWorkContentFromForm(formData));
    }

    const endpoint = type === "post" ? "/api/dashboard/posts" : "/api/dashboard/works";
    const method = item?.id ? "PUT" : "POST";

    try {
      const result = await submitFormDataRequest<{ id: string }>(endpoint, formData, method);
      const savedId = result.data && typeof result.data === "object" && "id" in result.data
        ? String((result.data as { id?: string }).id || "")
        : "";

      if (!result.success || !savedId) {
        const normalizedErrors = normalizeFieldErrors(type, result.fieldErrors ?? parseFieldErrorsFromMessage(result.message));
        setFieldErrors(normalizedErrors);
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

          {/* ── SECTION: Core ── */}
          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-fg/44">Core</p>

          <div className="space-y-2">
            <Label>Cover image</Label>
            <UploadMedia onUploaded={setCover} currentUrl={cover} />
            <Input
              ref={registerFieldRef("coverImageUrl") as never}
              name="coverImageUrl"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              placeholder="Shown on project cards and as the project detail hero background"
              aria-invalid={getFieldError("coverImageUrl") ? true : undefined}
              aria-describedby={getFieldError("coverImageUrl") ? getErrorId("coverImageUrl") : undefined}
              className={getFieldClasses("coverImageUrl")}
            />
            <FieldErrorText id={getErrorId("coverImageUrl")} message={getFieldError("coverImageUrl")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Project title</Label>
            <Input
              ref={registerFieldRef("title") as never}
              id="title"
              name="title"
              required
              defaultValue={String(item?.title ?? "")}
              placeholder="Shown on project cards and the project detail hero"
              onChange={(e) => {
                if (!slugManuallyEdited.current) {
                  setSlug(slugify(e.target.value));
                }
              }}
              aria-invalid={getFieldError("title") ? true : undefined}
              aria-describedby={getFieldError("title") ? getErrorId("title") : undefined}
              className={getFieldClasses("title")}
            />
            <FieldErrorText id={getErrorId("title")} message={getFieldError("title")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Project subtitle</Label>
            <Input
              ref={registerFieldRef("subtitle") as never}
              id="subtitle"
              name="subtitle"
              defaultValue={String(item?.subtitle ?? item?.excerpt ?? "")}
              placeholder="Shown under the project title in the detail page hero"
              aria-invalid={getFieldError("subtitle") ? true : undefined}
              aria-describedby={getFieldError("subtitle") ? getErrorId("subtitle") : undefined}
              className={getFieldClasses("subtitle")}
            />
            <FieldErrorText id={getErrorId("subtitle")} message={getFieldError("subtitle")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              ref={registerFieldRef("slug") as never}
              id="slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                slugManuallyEdited.current = true;
                setSlug(e.target.value);
              }}
              placeholder="URL path: /works/your-slug — lowercase, numbers, hyphens only"
              aria-invalid={getFieldError("slug") ? true : undefined}
              aria-describedby={getFieldError("slug") ? getErrorId("slug") : undefined}
              className={getFieldClasses("slug")}
            />
            <FieldErrorText id={getErrorId("slug")} message={getFieldError("slug")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Layout label</Label>
            <Input
              ref={registerFieldRef("role") as never}
              id="role"
              name="role"
              required
              defaultValue={String(item?.role ?? "")}
              placeholder="Label shown above the image gallery section on the project detail page"
              aria-invalid={getFieldError("role") ? true : undefined}
              aria-describedby={getFieldError("role") ? getErrorId("role") : undefined}
              className={getFieldClasses("role")}
            />
            <FieldErrorText id={getErrorId("role")} message={getFieldError("role")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Short description</Label>
            <Textarea
              ref={registerFieldRef("excerpt") as never}
              id="excerpt"
              name="excerpt"
              required
              defaultValue={String(item?.excerpt ?? "")}
              placeholder="Shown above the image gallery and used as fallback SEO description"
              aria-invalid={getFieldError("excerpt") ? true : undefined}
              aria-describedby={getFieldError("excerpt") ? getErrorId("excerpt") : undefined}
              className={getFieldClasses("excerpt")}
            />
            <FieldErrorText id={getErrorId("excerpt")} message={getFieldError("excerpt")} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                ref={registerFieldRef("status") as never}
                id="status"
                name="status"
                className={`h-11 w-full rounded-lg border bg-card/72 px-3 text-sm text-fg ${getFieldError("status") ? "border-red-500/70 bg-red-500/6 focus-visible:ring-red-500/25" : "border-border/20"}`}
                defaultValue={String(item?.status ?? "draft")}
                aria-invalid={getFieldError("status") ? true : undefined}
                aria-describedby={getFieldError("status") ? getErrorId("status") : undefined}
              >
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                {canPublish ? <option value="published">Published</option> : null}
              </select>
              <FieldErrorText id={getErrorId("status")} message={getFieldError("status")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort order</Label>
              <Input
                ref={registerFieldRef("sortOrder") as never}
                id="sortOrder"
                name="sortOrder"
                type="number"
                min="0"
                max="9999"
                defaultValue={String(item?.sort_order ?? "0")}
                placeholder="Controls position on the Works page (lower = first)"
                aria-invalid={getFieldError("sortOrder") ? true : undefined}
                aria-describedby={getFieldError("sortOrder") ? getErrorId("sortOrder") : undefined}
                className={getFieldClasses("sortOrder")}
              />
              <FieldErrorText id={getErrorId("sortOrder")} message={getFieldError("sortOrder")} />
            </div>
          </div>

          {/* ── SECTION: Portfolio Card ── */}
          <p className="pt-2 text-[0.65rem] uppercase tracking-[0.18em] text-fg/44">Portfolio Card</p>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry tag</Label>
            <Input
              ref={registerFieldRef("industry") as never}
              id="industry"
              name="industry"
              defaultValue={String(item?.industry ?? "")}
              placeholder="e.g. Healthcare, Travel Platform, Beauty — shown as a badge on the card"
              aria-invalid={getFieldError("industry") ? true : undefined}
              aria-describedby={getFieldError("industry") ? getErrorId("industry") : undefined}
              className={getFieldClasses("industry")}
            />
            <FieldErrorText id={getErrorId("industry")} message={getFieldError("industry")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardServices">Card service tags</Label>
            <Input
              ref={registerFieldRef("cardServices") as never}
              id="cardServices"
              name="cardServices"
              defaultValue={workCardServicesValue}
              placeholder="Comma-separated: Brand Identity, Web Design, Development — shown on card hover"
              aria-invalid={getFieldError("cardServices") ? true : undefined}
              aria-describedby={getFieldError("cardServices") ? getErrorId("cardServices") : undefined}
              className={getFieldClasses("cardServices")}
            />
            <FieldErrorText id={getErrorId("cardServices")} message={getFieldError("cardServices")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardOutcome">Card context line</Label>
            <Textarea
              ref={registerFieldRef("cardOutcome") as never}
              id="cardOutcome"
              name="cardOutcome"
              defaultValue={String(item?.card_outcome ?? "")}
              placeholder="One sentence shown under the title on card hover"
              aria-invalid={getFieldError("cardOutcome") ? true : undefined}
              aria-describedby={getFieldError("cardOutcome") ? getErrorId("cardOutcome") : undefined}
              className={getFieldClasses("cardOutcome")}
            />
            <FieldErrorText id={getErrorId("cardOutcome")} message={getFieldError("cardOutcome")} />
          </div>

          {/* ── SECTION: Project Info Panel ── */}
          <p className="pt-2 text-[0.65rem] uppercase tracking-[0.18em] text-fg/44">Project Info Panel</p>
          <p className="text-xs text-fg/50">These fields populate the info rail shown at the top of each project page.</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Input
                ref={registerFieldRef("platform") as never}
                id="platform"
                name="platform"
                defaultValue={String(item?.platform ?? "")}
                placeholder="e.g. Business Website, Brand Identity System"
                aria-invalid={getFieldError("platform") ? true : undefined}
                aria-describedby={getFieldError("platform") ? getErrorId("platform") : undefined}
                className={getFieldClasses("platform")}
              />
              <FieldErrorText id={getErrorId("platform")} message={getFieldError("platform")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline</Label>
              <Input
                ref={registerFieldRef("timeline") as never}
                id="timeline"
                name="timeline"
                defaultValue={String(item?.timeline ?? "")}
                placeholder="e.g. 4 Weeks"
                aria-invalid={getFieldError("timeline") ? true : undefined}
                aria-describedby={getFieldError("timeline") ? getErrorId("timeline") : undefined}
                className={getFieldClasses("timeline")}
              />
              <FieldErrorText id={getErrorId("timeline")} message={getFieldError("timeline")} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                ref={registerFieldRef("location") as never}
                id="location"
                name="location"
                defaultValue={String(item?.location ?? "Canada")}
                placeholder="e.g. Canada"
                aria-invalid={getFieldError("location") ? true : undefined}
                aria-describedby={getFieldError("location") ? getErrorId("location") : undefined}
                className={getFieldClasses("location")}
              />
              <FieldErrorText id={getErrorId("location")} message={getFieldError("location")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="liveUrl">Live site URL</Label>
              <Input
                ref={registerFieldRef("liveUrl") as never}
                id="liveUrl"
                name="liveUrl"
                type="url"
                defaultValue={String(item?.live_url ?? "")}
                placeholder="https://example.com — enables the Visit Site button"
                aria-invalid={getFieldError("liveUrl") ? true : undefined}
                aria-describedby={getFieldError("liveUrl") ? getErrorId("liveUrl") : undefined}
                className={getFieldClasses("liveUrl")}
              />
              <FieldErrorText id={getErrorId("liveUrl")} message={getFieldError("liveUrl")} />
            </div>
          </div>

          {/* ── SECTION: Case Study ── */}
          <p className="pt-2 text-[0.65rem] uppercase tracking-[0.18em] text-fg/44">Case Study</p>
          <p className="text-xs text-fg/50">These sections appear in the case study block on the project page. Aim for 1 to 2 sentences per section.</p>

          <div className="space-y-2">
            <Label htmlFor="overview">Overview</Label>
            <Textarea
              ref={registerFieldRef("overview") as never}
              id="overview"
              name="overview"
              defaultValue={String(item?.overview ?? "")}
              placeholder="A brief summary of the project and what Graphxify was brought in to do"
              aria-invalid={getFieldError("overview") ? true : undefined}
              aria-describedby={getFieldError("overview") ? getErrorId("overview") : undefined}
              className={getFieldClasses("overview")}
            />
            <FieldErrorText id={getErrorId("overview")} message={getFieldError("overview")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenge">Challenge</Label>
            <Textarea
              ref={registerFieldRef("challenge") as never}
              id="challenge"
              name="challenge"
              defaultValue={String(item?.challenge ?? "")}
              placeholder="What problem or constraint the client was facing before the project"
              aria-invalid={getFieldError("challenge") ? true : undefined}
              aria-describedby={getFieldError("challenge") ? getErrorId("challenge") : undefined}
              className={getFieldClasses("challenge")}
            />
            <FieldErrorText id={getErrorId("challenge")} message={getFieldError("challenge")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="approach">Approach</Label>
            <Textarea
              ref={registerFieldRef("approach") as never}
              id="approach"
              name="approach"
              defaultValue={String(item?.approach ?? "")}
              placeholder="How Graphxify approached solving the problem"
              aria-invalid={getFieldError("approach") ? true : undefined}
              aria-describedby={getFieldError("approach") ? getErrorId("approach") : undefined}
              className={getFieldClasses("approach")}
            />
            <FieldErrorText id={getErrorId("approach")} message={getFieldError("approach")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="solution">Solution</Label>
            <Textarea
              ref={registerFieldRef("solution") as never}
              id="solution"
              name="solution"
              defaultValue={String(item?.solution ?? "")}
              placeholder="What Graphxify delivered — specific outputs and design decisions"
              aria-invalid={getFieldError("solution") ? true : undefined}
              aria-describedby={getFieldError("solution") ? getErrorId("solution") : undefined}
              className={getFieldClasses("solution")}
            />
            <FieldErrorText id={getErrorId("solution")} message={getFieldError("solution")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="result">Result</Label>
            <Textarea
              ref={registerFieldRef("result") as never}
              id="result"
              name="result"
              defaultValue={String(item?.result ?? "")}
              placeholder="The outcome for the client after the project launched"
              aria-invalid={getFieldError("result") ? true : undefined}
              aria-describedby={getFieldError("result") ? getErrorId("result") : undefined}
              className={getFieldClasses("result")}
            />
            <FieldErrorText id={getErrorId("result")} message={getFieldError("result")} />
          </div>

          {/* ── SECTION: Gallery Images ── */}
          <p className="pt-2 text-[0.65rem] uppercase tracking-[0.18em] text-fg/44">Gallery Images</p>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-fg/62">Images shown in the visual gallery on the project detail page. Add up to 24.</p>
              <Button type="button" variant="secondary" size="sm" onClick={addGalleryImage} disabled={galleryImages.length >= 24}>
                Add image slot
              </Button>
            </div>
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
                    placeholder="Shown in the project detail visual gallery"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION: SEO ── */}
          <p className="pt-2 text-[0.65rem] uppercase tracking-[0.18em] text-fg/44">SEO</p>

          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta title</Label>
            <Input
              ref={registerFieldRef("metaTitle") as never}
              id="metaTitle"
              name="metaTitle"
              defaultValue={String(item?.meta_title ?? "")}
              placeholder="Custom page title tag — falls back to project title if empty"
              aria-invalid={getFieldError("metaTitle") ? true : undefined}
              aria-describedby={getFieldError("metaTitle") ? getErrorId("metaTitle") : undefined}
              className={getFieldClasses("metaTitle")}
            />
            <FieldErrorText id={getErrorId("metaTitle")} message={getFieldError("metaTitle")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta description</Label>
            <Textarea
              ref={registerFieldRef("metaDescription") as never}
              id="metaDescription"
              name="metaDescription"
              defaultValue={String(item?.meta_description ?? "")}
              placeholder="Custom meta description — falls back to excerpt if empty"
              aria-invalid={getFieldError("metaDescription") ? true : undefined}
              aria-describedby={getFieldError("metaDescription") ? getErrorId("metaDescription") : undefined}
              className={getFieldClasses("metaDescription")}
            />
            <FieldErrorText id={getErrorId("metaDescription")} message={getFieldError("metaDescription")} />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Label htmlFor="title">Blog title</Label>
          </div>
          <div className="space-y-2">
            <Input
              ref={registerFieldRef("title") as never}
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
              aria-invalid={getFieldError("title") ? true : undefined}
              aria-describedby={getFieldError("title") ? getErrorId("title") : undefined}
              className={getFieldClasses("title")}
            />
            <FieldErrorText id={getErrorId("title")} message={getFieldError("title")} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                ref={registerFieldRef("category") as never}
                id="category"
                name="category"
                className={`h-11 w-full rounded-lg border bg-card/72 px-3 text-sm text-fg ${getFieldError("category") ? "border-red-500/70 bg-red-500/6 focus-visible:ring-red-500/25" : "border-border/20"}`}
                defaultValue={blogCategoryValue}
                aria-invalid={getFieldError("category") ? true : undefined}
                aria-describedby={getFieldError("category") ? getErrorId("category") : undefined}
              >
                {BLOG_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <FieldErrorText id={getErrorId("category")} message={getFieldError("category")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                ref={registerFieldRef("author") as never}
                id="author"
                name="author"
                required
                defaultValue={blogAuthorValue}
                placeholder="Shown on the blog listing and detail page"
                aria-invalid={getFieldError("author") ? true : undefined}
                aria-describedby={getFieldError("author") ? getErrorId("author") : undefined}
                className={getFieldClasses("author")}
              />
              <FieldErrorText id={getErrorId("author")} message={getFieldError("author")} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="authorRole">Author role</Label>
              <Input
                ref={registerFieldRef("authorRole") as never}
                id="authorRole"
                name="authorRole"
                defaultValue={blogAuthorRoleValue}
                placeholder="Shown in the author card on the blog detail page"
                aria-invalid={getFieldError("authorRole") ? true : undefined}
                aria-describedby={getFieldError("authorRole") ? getErrorId("authorRole") : undefined}
                className={getFieldClasses("authorRole")}
              />
              <FieldErrorText id={getErrorId("authorRole")} message={getFieldError("authorRole")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                ref={registerFieldRef("tags") as never}
                id="tags"
                name="tags"
                defaultValue={blogTagsValue}
                placeholder="Comma-separated tags used on the blog detail page"
                aria-invalid={getFieldError("tags") ? true : undefined}
                aria-describedby={getFieldError("tags") ? getErrorId("tags") : undefined}
                className={getFieldClasses("tags")}
              />
              <FieldErrorText id={getErrorId("tags")} message={getFieldError("tags")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="authorBio">Author bio</Label>
            <Textarea
              ref={registerFieldRef("authorBio") as never}
              id="authorBio"
              name="authorBio"
              defaultValue={blogAuthorBioValue}
              placeholder="Short author description shown on the blog detail page"
              aria-invalid={getFieldError("authorBio") ? true : undefined}
              aria-describedby={getFieldError("authorBio") ? getErrorId("authorBio") : undefined}
              className={getFieldClasses("authorBio")}
            />
            <FieldErrorText id={getErrorId("authorBio")} message={getFieldError("authorBio")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              ref={registerFieldRef("slug") as never}
              id="slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                slugManuallyEdited.current = true;
                setSlug(e.target.value);
              }}
              placeholder="Used in the URL (/blog/...) - lowercase letters, numbers, hyphens only"
              aria-invalid={getFieldError("slug") ? true : undefined}
              aria-describedby={getFieldError("slug") ? getErrorId("slug") : undefined}
              className={getFieldClasses("slug")}
            />
            <FieldErrorText id={getErrorId("slug")} message={getFieldError("slug")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              ref={registerFieldRef("excerpt") as never}
              id="excerpt"
              name="excerpt"
              required
              defaultValue={String(item?.excerpt ?? "")}
              placeholder="Shown on blog cards, in the blog hero, and used as fallback SEO description"
              aria-invalid={getFieldError("excerpt") ? true : undefined}
              aria-describedby={getFieldError("excerpt") ? getErrorId("excerpt") : undefined}
              className={getFieldClasses("excerpt")}
            />
            <FieldErrorText id={getErrorId("excerpt")} message={getFieldError("excerpt")} />
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
                ref={registerFieldRef("content") as never}
                id="content"
                name="content"
                required
                value={contentValue}
                onChange={(e) => setContentValue(e.target.value)}
                placeholder="Main blog body shown on the public blog detail page"
                aria-invalid={getFieldError("content") ? true : undefined}
                aria-describedby={getFieldError("content") ? getErrorId("content") : undefined}
                className={`min-h-[220px] ${getFieldClasses("content") ?? ""}`}
              />
            )}
            {showPreview ? <input type="hidden" name="content" value={contentValue} /> : null}
            <FieldErrorText id={getErrorId("content")} message={getFieldError("content")} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO title</Label>
              <Input
                ref={registerFieldRef("seoTitle") as never}
                id="seoTitle"
                name="seoTitle"
                defaultValue={blogSeoTitleValue}
                placeholder="Optional custom title tag for the blog detail page"
                aria-invalid={getFieldError("seoTitle") ? true : undefined}
                aria-describedby={getFieldError("seoTitle") ? getErrorId("seoTitle") : undefined}
                className={getFieldClasses("seoTitle")}
              />
              <FieldErrorText id={getErrorId("seoTitle")} message={getFieldError("seoTitle")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO description</Label>
              <Textarea
                ref={registerFieldRef("seoDescription") as never}
                id="seoDescription"
                name="seoDescription"
                defaultValue={blogSeoDescriptionValue}
                placeholder="Optional custom meta description for the blog detail page"
                aria-invalid={getFieldError("seoDescription") ? true : undefined}
                aria-describedby={getFieldError("seoDescription") ? getErrorId("seoDescription") : undefined}
                className={getFieldClasses("seoDescription")}
              />
              <FieldErrorText id={getErrorId("seoDescription")} message={getFieldError("seoDescription")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="readTimeOverride">Read time (minutes)</Label>
            <Input
              ref={registerFieldRef("readTimeOverride") as never}
              id="readTimeOverride"
              name="readTimeOverride"
              type="number"
              min="1"
              max="120"
              defaultValue={blogReadTimeOverrideValue}
              placeholder="Auto-calculated from word count"
              aria-invalid={getFieldError("readTimeOverride") ? true : undefined}
              aria-describedby={getFieldError("readTimeOverride") ? getErrorId("readTimeOverride") : undefined}
              className={getFieldClasses("readTimeOverride")}
            />
            <FieldErrorText id={getErrorId("readTimeOverride")} message={getFieldError("readTimeOverride")} />
            <p className="text-[0.7rem] text-fg/48">Leave blank to auto-calculate (220 wpm). Override for posts with video or heavy media.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="relatedService">Related service</Label>
            <select
              ref={registerFieldRef("relatedService") as never}
              id="relatedService"
              name="relatedService"
              className={`h-11 w-full rounded-lg border bg-card/72 px-3 text-sm text-fg ${getFieldError("relatedService") ? "border-red-500/70 bg-red-500/6 focus-visible:ring-red-500/25" : "border-border/20"}`}
              defaultValue={blogRelatedServiceValue}
              aria-invalid={getFieldError("relatedService") ? true : undefined}
              aria-describedby={getFieldError("relatedService") ? getErrorId("relatedService") : undefined}
            >
              <option value="">Auto (derived from category)</option>
              {RELATED_SERVICE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <FieldErrorText id={getErrorId("relatedService")} message={getFieldError("relatedService")} />
            <p className="text-[0.7rem] text-fg/48">Controls the service callout shown at the bottom of this blog post. Leave blank to derive automatically from category.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              ref={registerFieldRef("status") as never}
              id="status"
              name="status"
              className={`h-11 w-full rounded-lg border bg-card/72 px-3 text-sm text-fg ${getFieldError("status") ? "border-red-500/70 bg-red-500/6 focus-visible:ring-red-500/25" : "border-border/20"}`}
              defaultValue={String(item?.status ?? "draft")}
              aria-invalid={getFieldError("status") ? true : undefined}
              aria-describedby={getFieldError("status") ? getErrorId("status") : undefined}
            >
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              {canPublish ? <option value="published">Published</option> : null}
            </select>
            <FieldErrorText id={getErrorId("status")} message={getFieldError("status")} />
          </div>
          <div className="space-y-2">
            <Label>Featured image</Label>
            <UploadMedia onUploaded={setCover} currentUrl={cover} />
            <Input
              ref={registerFieldRef("coverImageUrl") as never}
              name="coverImageUrl"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              placeholder="Shown on the blog listing and blog detail hero"
              aria-invalid={getFieldError("coverImageUrl") ? true : undefined}
              aria-describedby={getFieldError("coverImageUrl") ? getErrorId("coverImageUrl") : undefined}
              className={getFieldClasses("coverImageUrl")}
            />
            <FieldErrorText id={getErrorId("coverImageUrl")} message={getFieldError("coverImageUrl")} />
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
