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

function parseServicesInput(raw: FormDataEntryValue | null): string[] {
  const value = String(raw ?? "");
  return value
    .split(",")
    .map((s) => s.trim())
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

export async function createOrUpdatePost(params: { id?: string; formData: FormData }): Promise<{ id: string }> {
  const profile = await getCurrentProfile();
  if (!profile) {
    throw new Error("Unauthorized");
  }

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

    if (error) throw error;

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

    revalidatePath("/blog");
    revalidatePath("/dashboard/posts");
    return { id: data.id };
  }

  const { data: existing, error: existingError } = await supabase
    .from("posts")
    .select("id,author_id,status,title,slug")
    .eq("id", id)
    .maybeSingle();
  if (existingError) throw existingError;
  if (!existing) throw new Error("Post not found");

  if (profile.role === "mod" && existing.author_id && existing.author_id !== profile.id) {
    throw new Error("Forbidden");
  }

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

  if (error) throw error;

  await supabase.from("post_versions").insert({
    post_id: id,
    version: await nextPostVersion(id, supabase),
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
    action: parsed.status === "published" ? "post.publish" : "post.update",
    entityType: "post",
    entityId: id,
    metadata: {
      previous_status: existing.status,
      next_status: parsed.status,
      title: parsed.title
    }
  });

  if (parsed.status === "published" && env.OWNER_NOTIFY_EMAIL) {
    const template = publishNotificationTemplate({
      type: "post",
      title: parsed.title,
      slug: parsed.slug,
      publishedAt: new Date().toISOString()
    });
    void sendEmail({ to: env.OWNER_NOTIFY_EMAIL, ...template });
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.slug}`);
  revalidatePath("/dashboard/posts");
  return { id };
}

export async function createOrUpdateWork(params: { id?: string; formData: FormData }): Promise<{ id: string }> {
  const profile = await getCurrentProfile();
  if (!profile) {
    throw new Error("Unauthorized");
  }

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

    if (error) throw error;

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

    revalidatePath("/works");
    revalidatePath(`/works/${getProjectPathSlug(parsed.slug)}`);
    revalidatePath(`/works/${parsed.slug}`);
    revalidatePath("/dashboard/works");
    return { id: data.id };
  }

  const { data: existing, error: existingError } = await supabase
    .from("works")
    .select("id,author_id,status,title,slug")
    .eq("id", id)
    .maybeSingle();
  if (existingError) throw existingError;
  if (!existing) throw new Error("Work not found");

  if (profile.role === "mod" && existing.author_id && existing.author_id !== profile.id) {
    throw new Error("Forbidden");
  }

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

  if (error) throw error;

  await supabase.from("work_versions").insert({
    work_id: id,
    version: await nextWorkVersion(id, supabase),
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
    action: parsed.status === "published" ? "work.publish" : "work.update",
    entityType: "work",
    entityId: id,
    metadata: {
      previous_status: existing.status,
      next_status: parsed.status,
      title: parsed.title
    }
  });

  if (parsed.status === "published" && env.OWNER_NOTIFY_EMAIL) {
    const template = publishNotificationTemplate({
      type: "work",
      title: parsed.title,
      slug: parsed.slug,
      publishedAt: new Date().toISOString()
    });
    void sendEmail({ to: env.OWNER_NOTIFY_EMAIL, ...template });
  }

  revalidatePath("/works");
  revalidatePath(`/works/${getProjectPathSlug(parsed.slug)}`);
  revalidatePath(`/works/${parsed.slug}`);
  revalidatePath("/dashboard/works");
  return { id };
}

export async function restorePostVersion(postId: string, versionId: string): Promise<void> {
  const profile = await getCurrentProfile();
  if (!profile) throw new Error("Unauthorized");

  const supabase = getWriteClient();

  const { data: postMeta, error: postMetaError } = await supabase.from("posts").select("author_id").eq("id", postId).maybeSingle();
  if (postMetaError) throw postMetaError;
  if (!postMeta) throw new Error("Post not found");
  if (profile.role === "mod" && postMeta.author_id && postMeta.author_id !== profile.id) {
    throw new Error("Forbidden");
  }

  const { data: version, error: versionError } = await supabase
    .from("post_versions")
    .select("*")
    .eq("id", versionId)
    .eq("post_id", postId)
    .single();

  if (versionError) throw versionError;

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

  if (updateError) throw updateError;

  await supabase.from("post_versions").insert({
    post_id: postId,
    version: await nextPostVersion(postId, supabase),
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

  revalidatePath("/blog");
  revalidatePath("/dashboard/posts");
}

export async function restoreWorkVersion(workId: string, versionId: string): Promise<void> {
  const profile = await getCurrentProfile();
  if (!profile) throw new Error("Unauthorized");

  const supabase = getWriteClient();

  const { data: workMeta, error: workMetaError } = await supabase.from("works").select("author_id").eq("id", workId).maybeSingle();
  if (workMetaError) throw workMetaError;
  if (!workMeta) throw new Error("Work not found");
  if (profile.role === "mod" && workMeta.author_id && workMeta.author_id !== profile.id) {
    throw new Error("Forbidden");
  }

  const { data: version, error: versionError } = await supabase
    .from("work_versions")
    .select("*")
    .eq("id", versionId)
    .eq("work_id", workId)
    .single();

  if (versionError) throw versionError;

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

  if (updateError) throw updateError;

  await supabase.from("work_versions").insert({
    work_id: workId,
    version: await nextWorkVersion(workId, supabase),
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

  revalidatePath("/works");
  revalidatePath(`/works/${getProjectPathSlug(version.slug)}`);
  revalidatePath(`/works/${version.slug}`);
  revalidatePath("/dashboard/works");
}

export async function deletePost(postId: string): Promise<void> {
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "admin" && profile.role !== "mod")) {
    throw new Error("Forbidden");
  }

  const supabase = getWriteClient();
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw error;

  await logAuditEvent({
    actorId: profile.id,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: "post.delete",
    entityType: "post",
    entityId: postId,
    metadata: { operation: "delete" }
  });

  revalidatePath("/blog");
  revalidatePath("/dashboard/posts");
}

export async function deleteWork(workId: string): Promise<void> {
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "admin" && profile.role !== "mod")) {
    throw new Error("Forbidden");
  }

  const supabase = getWriteClient();
  const { error } = await supabase.from("works").delete().eq("id", workId);
  if (error) throw error;

  await logAuditEvent({
    actorId: profile.id,
    actorEmail: profile.email,
    actorRole: profile.role,
    action: "work.delete",
    entityType: "work",
    entityId: workId,
    metadata: { operation: "delete" }
  });

  revalidatePath("/works");
  revalidatePath("/dashboard/works");
}
