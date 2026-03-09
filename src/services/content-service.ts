import "server-only";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/auth/requireRole";
import { logAuditEvent } from "@/lib/audit";
import { sendEmail } from "@/lib/email/provider";
import { publishNotificationTemplate } from "@/lib/email/templates";
import { env } from "@/lib/env";
import { getProjectPathSlug } from "@/lib/project-card-content";
import { postSchema, workSchema } from "@/lib/validation/schemas";

type ContentClient = ReturnType<typeof createClient> | NonNullable<ReturnType<typeof createAdminClient>>;
type ContentProfile = NonNullable<Awaited<ReturnType<typeof getCurrentProfile>>>;
type PublishContentType = "post" | "work";

async function nextPostVersion(postId: string, supabase: ContentClient): Promise<number> {
  const { data } = await supabase
    .from("post_versions")
    .select("version")
    .eq("post_id", postId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.version ?? 0) + 1;
}

async function nextWorkVersion(workId: string, supabase: ContentClient): Promise<number> {
  const { data } = await supabase
    .from("work_versions")
    .select("version")
    .eq("work_id", workId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.version ?? 0) + 1;
}

function getWriteClient(): ContentClient {
  return createAdminClient() ?? createClient();
}

async function requireProfile(): Promise<ContentProfile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    throw new Error("Unauthorized");
  }
  return profile;
}

function assertCanEditOwnedContent(profile: ContentProfile, authorId: string | null): void {
  if (profile.role === "mod" && authorId && authorId !== profile.id) {
    throw new Error("Forbidden");
  }
}

function assertCanManageContent(profile: ContentProfile): void {
  if (profile.role !== "admin" && profile.role !== "mod") {
    throw new Error("Forbidden");
  }
}

function parseServicesInput(raw: FormDataEntryValue | null): string[] {
  const value = String(raw ?? "");
  return value
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);
}

function parseGalleryImagesInput(rawValues: FormDataEntryValue[]): string[] {
  return Array.from(
    new Set(
      rawValues
        .map((value) => String(value).trim())
        .filter(Boolean)
    )
  );
}

function sanitizeGalleryImages(galleryImages: string[], coverImageUrl?: string): string[] {
  const normalizedCover = String(coverImageUrl ?? "").trim();
  if (!normalizedCover) {
    return galleryImages;
  }

  return galleryImages.filter((imageUrl) => imageUrl !== normalizedCover);
}

function revalidatePaths(paths: string[]): void {
  for (const path of new Set(paths)) {
    revalidatePath(path);
  }
}

function getPostRevalidationPaths(slug?: string): string[] {
  return slug
    ? ["/blog", `/blog/${slug}`, "/dashboard/posts"]
    : ["/blog", "/dashboard/posts"];
}

function getWorkRevalidationPaths(slug: string): string[] {
  return ["/works", `/works/${getProjectPathSlug(slug)}`, `/works/${slug}`, "/dashboard/works"];
}

function notifyPublish(type: PublishContentType, title: string, slug: string): void {
  if (!env.OWNER_NOTIFY_EMAIL) {
    return;
  }

  const template = publishNotificationTemplate({
    type,
    title,
    slug,
    publishedAt: new Date().toISOString()
  });
  void sendEmail({ to: env.OWNER_NOTIFY_EMAIL, ...template });
}

export async function createOrUpdatePost(params: { id?: string; formData: FormData }): Promise<{ id: string }> {
  const profile = await requireProfile();
  const parsed = postSchema.parse({
    title: params.formData.get("title"),
    slug: params.formData.get("slug"),
    excerpt: params.formData.get("excerpt"),
    content: params.formData.get("content"),
    coverImageUrl: params.formData.get("coverImageUrl"),
    status: params.formData.get("status")
  });

  const supabase = getWriteClient();
  const id = params.id;

  if (!id) {
    const { data, error } = await supabase
      .from("posts")
      .insert({
        title: parsed.title,
        slug: parsed.slug,
        excerpt: parsed.excerpt,
        content: parsed.content,
        cover_image_url: parsed.coverImageUrl || null,
        status: parsed.status,
        author_id: profile.id
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    await supabase.from("post_versions").insert({
      post_id: data.id,
      version: 1,
      title: parsed.title,
      slug: parsed.slug,
      excerpt: parsed.excerpt,
      content: parsed.content,
      cover_image_url: parsed.coverImageUrl || null,
      status: parsed.status,
      editor_id: profile.id
    });

    await logAuditEvent({
      actorId: profile.id,
      actorEmail: profile.email,
      actorRole: profile.role,
      action: "post.create",
      entityType: "post",
      entityId: data.id,
      metadata: { status: parsed.status, slug: parsed.slug }
    });

    revalidatePaths(getPostRevalidationPaths());
    return { id: data.id };
  }

  const { data: existing, error: existingError } = await supabase
    .from("posts")
    .select("author_id,status")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }
  if (!existing) {
    throw new Error("Post not found");
  }

  assertCanEditOwnedContent(profile, existing.author_id);

  const { error } = await supabase
    .from("posts")
    .update({
      title: parsed.title,
      slug: parsed.slug,
      excerpt: parsed.excerpt,
      content: parsed.content,
      cover_image_url: parsed.coverImageUrl || null,
      status: parsed.status,
      author_id: existing.author_id ?? profile.id,
      updated_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) {
    throw error;
  }

  const version = await nextPostVersion(id, supabase);
  await Promise.all([
    supabase.from("post_versions").insert({
      post_id: id,
      version,
      title: parsed.title,
      slug: parsed.slug,
      excerpt: parsed.excerpt,
      content: parsed.content,
      cover_image_url: parsed.coverImageUrl || null,
      status: parsed.status,
      editor_id: profile.id
    }),
    logAuditEvent({
      actorId: profile.id,
      actorEmail: profile.email,
      actorRole: profile.role,
      action: parsed.status === "published" ? "post.publish" : "post.update",
      entityType: "post",
      entityId: id,
      metadata: {
        previous_status: existing.status,
        next_status: parsed.status,
        title: parsed.title
      }
    })
  ]);

  if (parsed.status === "published") {
    notifyPublish("post", parsed.title, parsed.slug);
  }

  revalidatePaths(getPostRevalidationPaths(parsed.slug));
  return { id };
}

export async function createOrUpdateWork(params: { id?: string; formData: FormData }): Promise<{ id: string }> {
  const profile = await requireProfile();
  const parsed = workSchema.parse({
    title: params.formData.get("title"),
    slug: params.formData.get("slug"),
    year: params.formData.get("year"),
    role: params.formData.get("role"),
    services: parseServicesInput(params.formData.get("services")),
    subtitle: params.formData.get("subtitle"),
    layoutVariant: params.formData.get("layoutVariant"),
    excerpt: params.formData.get("excerpt"),
    content: params.formData.get("content"),
    coverImageUrl: params.formData.get("coverImageUrl"),
    galleryImages: parseGalleryImagesInput(params.formData.getAll("galleryImages")),
    status: params.formData.get("status")
  });

  const galleryImages = sanitizeGalleryImages(parsed.galleryImages, parsed.coverImageUrl);
  const supabase = getWriteClient();
  const id = params.id;

  if (!id) {
    const { data, error } = await supabase
      .from("works")
      .insert({
        title: parsed.title,
        slug: parsed.slug,
        year: parsed.year,
        role: parsed.role,
        services: parsed.services,
        subtitle: parsed.subtitle || null,
        layout_variant: parsed.layoutVariant,
        excerpt: parsed.excerpt,
        content: parsed.content,
        cover_image_url: parsed.coverImageUrl || null,
        gallery_images: galleryImages,
        status: parsed.status,
        author_id: profile.id
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    await supabase.from("work_versions").insert({
      work_id: data.id,
      version: 1,
      title: parsed.title,
      slug: parsed.slug,
      year: parsed.year,
      role: parsed.role,
      services: parsed.services,
      subtitle: parsed.subtitle || null,
      layout_variant: parsed.layoutVariant,
      excerpt: parsed.excerpt,
      content: parsed.content,
      cover_image_url: parsed.coverImageUrl || null,
      gallery_images: galleryImages,
      status: parsed.status,
      editor_id: profile.id
    });

    await logAuditEvent({
      actorId: profile.id,
      actorEmail: profile.email,
      actorRole: profile.role,
      action: "work.create",
      entityType: "work",
      entityId: data.id,
      metadata: { status: parsed.status, slug: parsed.slug }
    });

    revalidatePaths(getWorkRevalidationPaths(parsed.slug));
    return { id: data.id };
  }

  const { data: existing, error: existingError } = await supabase
    .from("works")
    .select("author_id,status")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }
  if (!existing) {
    throw new Error("Work not found");
  }

  assertCanEditOwnedContent(profile, existing.author_id);

  const { error } = await supabase
    .from("works")
    .update({
      title: parsed.title,
      slug: parsed.slug,
      year: parsed.year,
      role: parsed.role,
      services: parsed.services,
      subtitle: parsed.subtitle || null,
      layout_variant: parsed.layoutVariant,
      excerpt: parsed.excerpt,
      content: parsed.content,
      cover_image_url: parsed.coverImageUrl || null,
      gallery_images: galleryImages,
      status: parsed.status,
      author_id: existing.author_id ?? profile.id,
      updated_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) {
    throw error;
  }

  const version = await nextWorkVersion(id, supabase);
  await Promise.all([
    supabase.from("work_versions").insert({
      work_id: id,
      version,
      title: parsed.title,
      slug: parsed.slug,
      year: parsed.year,
      role: parsed.role,
      services: parsed.services,
      subtitle: parsed.subtitle || null,
      layout_variant: parsed.layoutVariant,
      excerpt: parsed.excerpt,
      content: parsed.content,
      cover_image_url: parsed.coverImageUrl || null,
      gallery_images: galleryImages,
      status: parsed.status,
      editor_id: profile.id
    }),
    logAuditEvent({
      actorId: profile.id,
      actorEmail: profile.email,
      actorRole: profile.role,
      action: parsed.status === "published" ? "work.publish" : "work.update",
      entityType: "work",
      entityId: id,
      metadata: {
        previous_status: existing.status,
        next_status: parsed.status,
        title: parsed.title
      }
    })
  ]);

  if (parsed.status === "published") {
    notifyPublish("work", parsed.title, parsed.slug);
  }

  revalidatePaths(getWorkRevalidationPaths(parsed.slug));
  return { id };
}

export async function restorePostVersion(postId: string, versionId: string): Promise<void> {
  const profile = await requireProfile();
  const supabase = getWriteClient();

  const { data: postMeta, error: postMetaError } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .maybeSingle();

  if (postMetaError) {
    throw postMetaError;
  }
  if (!postMeta) {
    throw new Error("Post not found");
  }

  assertCanEditOwnedContent(profile, postMeta.author_id);

  const { data: version, error: versionError } = await supabase
    .from("post_versions")
    .select("*")
    .eq("id", versionId)
    .eq("post_id", postId)
    .single();

  if (versionError) {
    throw versionError;
  }

  const { error: updateError } = await supabase
    .from("posts")
    .update({
      title: version.title,
      slug: version.slug,
      excerpt: version.excerpt,
      content: version.content,
      cover_image_url: version.cover_image_url,
      status: version.status,
      author_id: postMeta.author_id ?? profile.id,
      updated_at: new Date().toISOString()
    })
    .eq("id", postId);

  if (updateError) {
    throw updateError;
  }

  const nextVersion = await nextPostVersion(postId, supabase);
  await supabase.from("post_versions").insert({
    post_id: postId,
    version: nextVersion,
    title: version.title,
    slug: version.slug,
    excerpt: version.excerpt,
    content: version.content,
    cover_image_url: version.cover_image_url,
    status: version.status,
    editor_id: profile.id
  });

  await logAuditEvent({
    actorId: profile.id,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: "post.restore",
    entityType: "post",
    entityId: postId,
    metadata: { restored_version_id: versionId, restored_version: version.version }
  });

  revalidatePaths(getPostRevalidationPaths());
}

export async function restoreWorkVersion(workId: string, versionId: string): Promise<void> {
  const profile = await requireProfile();
  const supabase = getWriteClient();

  const { data: workMeta, error: workMetaError } = await supabase
    .from("works")
    .select("author_id")
    .eq("id", workId)
    .maybeSingle();

  if (workMetaError) {
    throw workMetaError;
  }
  if (!workMeta) {
    throw new Error("Work not found");
  }

  assertCanEditOwnedContent(profile, workMeta.author_id);

  const { data: version, error: versionError } = await supabase
    .from("work_versions")
    .select("*")
    .eq("id", versionId)
    .eq("work_id", workId)
    .single();

  if (versionError) {
    throw versionError;
  }

  const { error: updateError } = await supabase
    .from("works")
    .update({
      title: version.title,
      slug: version.slug,
      year: version.year,
      role: version.role,
      services: version.services,
      subtitle: version.subtitle ?? null,
      layout_variant: version.layout_variant ?? "A",
      excerpt: version.excerpt,
      content: version.content,
      cover_image_url: version.cover_image_url,
      gallery_images: version.gallery_images ?? [],
      status: version.status,
      author_id: workMeta.author_id ?? profile.id,
      updated_at: new Date().toISOString()
    })
    .eq("id", workId);

  if (updateError) {
    throw updateError;
  }

  const nextVersion = await nextWorkVersion(workId, supabase);
  await supabase.from("work_versions").insert({
    work_id: workId,
    version: nextVersion,
    title: version.title,
    slug: version.slug,
    year: version.year,
    role: version.role,
    services: version.services,
    subtitle: version.subtitle ?? null,
    layout_variant: version.layout_variant ?? "A",
    excerpt: version.excerpt,
    content: version.content,
    cover_image_url: version.cover_image_url,
    gallery_images: version.gallery_images ?? [],
    status: version.status,
    editor_id: profile.id
  });

  await logAuditEvent({
    actorId: profile.id,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: "work.restore",
    entityType: "work",
    entityId: workId,
    metadata: { restored_version_id: versionId, restored_version: version.version }
  });

  revalidatePaths(getWorkRevalidationPaths(version.slug));
}

export async function deletePost(postId: string): Promise<void> {
  const profile = await requireProfile();
  assertCanManageContent(profile);

  const supabase = getWriteClient();
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) {
    throw error;
  }

  await logAuditEvent({
    actorId: profile.id,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: "post.delete",
    entityType: "post",
    entityId: postId,
    metadata: { operation: "delete" }
  });

  revalidatePaths(getPostRevalidationPaths());
}

export async function deleteWork(workId: string): Promise<void> {
  const profile = await requireProfile();
  assertCanManageContent(profile);

  const supabase = getWriteClient();
  const { error } = await supabase.from("works").delete().eq("id", workId);
  if (error) {
    throw error;
  }

  await logAuditEvent({
    actorId: profile.id,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: "work.delete",
    entityType: "work",
    entityId: workId,
    metadata: { operation: "delete" }
  });

  revalidatePaths(["/works", "/dashboard/works"]);
}
