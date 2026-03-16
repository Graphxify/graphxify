import "server-only";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile, hasPermission } from "@/lib/auth/requireRole";
import { logAuditEvent } from "@/lib/audit";
import { sendEmail } from "@/lib/email/provider";
import { isNotificationEnabled } from "@/lib/email/notification-settings";
import { publishNotificationTemplate } from "@/lib/email/templates";
import { normalizeBlogCategory } from "@/lib/blog";
import { env } from "@/lib/env";
import { getProjectPathSlug } from "@/lib/project-card-content";
import { postSchema, workSchema } from "@/lib/validation/schemas";

type ContentClient = ReturnType<typeof createClient> | NonNullable<ReturnType<typeof createAdminClient>>;
type ContentProfile = NonNullable<Awaited<ReturnType<typeof getCurrentProfile>>>;
type PublishContentType = "post" | "work";
type ParsedPostInput = ReturnType<typeof postSchema.parse>;

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

function assertCanCreatePost(profile: ContentProfile): void {
  if (!hasPermission(profile, "content.posts.create")) {
    throw new Error("Forbidden");
  }
}

function assertCanEditPost(profile: ContentProfile, authorId: string | null): void {
  if (hasPermission(profile, "content.posts.edit_any")) {
    return;
  }

  if (hasPermission(profile, "content.posts.edit_own") && authorId && authorId === profile.id) {
    return;
  }

  throw new Error("Forbidden");
}

function assertCanPublishPost(profile: ContentProfile, nextStatus: string): void {
  if (nextStatus === "published" && !hasPermission(profile, "content.posts.publish")) {
    throw new Error("Forbidden");
  }
}

function assertCanDeletePost(profile: ContentProfile): void {
  if (!hasPermission(profile, "content.posts.delete")) {
    throw new Error("Forbidden");
  }
}

function assertCanCreateWork(profile: ContentProfile): void {
  if (!hasPermission(profile, "content.works.create")) {
    throw new Error("Forbidden");
  }
}

function assertCanEditWork(profile: ContentProfile): void {
  if (!hasPermission(profile, "content.works.edit_any")) {
    throw new Error("Forbidden");
  }
}

function assertCanPublishWork(profile: ContentProfile, nextStatus: string): void {
  if (nextStatus === "published" && !hasPermission(profile, "content.works.publish")) {
    throw new Error("Forbidden");
  }
}

function assertCanDeleteWork(profile: ContentProfile): void {
  if (!hasPermission(profile, "content.works.delete")) {
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

function parseTagsInput(raw: FormDataEntryValue | null): string[] {
  return Array.from(
    new Set(
      String(raw ?? "")
        .split(",")
        .map((segment) => segment.trim())
        .filter(Boolean)
    )
  ).slice(0, 8);
}

function isMissingColumnError(error: { code?: string } | null | undefined): boolean {
  return error?.code === "42703";
}

function buildPostBasePayload(parsed: ParsedPostInput, authorId: string | null, updatedAt?: string) {
  return {
    title: parsed.title,
    slug: parsed.slug,
    excerpt: parsed.excerpt,
    content: parsed.content,
    cover_image_url: parsed.coverImageUrl || null,
    status: parsed.status,
    author_id: authorId,
    ...(updatedAt ? { updated_at: updatedAt } : {})
  };
}

function buildPostMetadataPayload(parsed: ParsedPostInput, tags: string[]) {
  return {
    category: parsed.category,
    author: parsed.author,
    author_role: parsed.authorRole || null,
    author_bio: parsed.authorBio || null,
    tags,
    seo_title: parsed.seoTitle || null,
    seo_description: parsed.seoDescription || null
  };
}

function buildStoredPostMetadataPayload(version: Record<string, unknown>): ReturnType<typeof buildPostMetadataPayload> {
  return {
    category: normalizeBlogCategory(version.category),
    author: typeof version.author === "string" ? version.author : "Graphxify Team",
    author_role: typeof version.author_role === "string" ? version.author_role : "Editorial Team",
    author_bio:
      typeof version.author_bio === "string"
        ? version.author_bio
        : "Graphxify shares practical guidance on brand systems, websites, and content operations.",
    tags: Array.isArray(version.tags) ? version.tags.map((tag) => String(tag).trim()).filter(Boolean) : [],
    seo_title: typeof version.seo_title === "string" ? version.seo_title : null,
    seo_description: typeof version.seo_description === "string" ? version.seo_description : null
  };
}

async function createPostRecord(
  supabase: ContentClient,
  basePayload: ReturnType<typeof buildPostBasePayload>,
  metadataPayload: ReturnType<typeof buildPostMetadataPayload>
) {
  const primary = await supabase
    .from("posts")
    .insert({ ...basePayload, ...metadataPayload })
    .select("id")
    .single();

  if (primary.error && !isMissingColumnError(primary.error)) {
    throw primary.error;
  }

  if (!primary.error) {
    return primary.data;
  }

  const fallback = await supabase
    .from("posts")
    .insert(basePayload)
    .select("id")
    .single();

  if (fallback.error) {
    throw fallback.error;
  }

  return fallback.data;
}

async function updatePostRecord(
  supabase: ContentClient,
  postId: string,
  basePayload: ReturnType<typeof buildPostBasePayload>,
  metadataPayload: ReturnType<typeof buildPostMetadataPayload>
) {
  const primary = await supabase
    .from("posts")
    .update({ ...basePayload, ...metadataPayload })
    .eq("id", postId);

  if (primary.error && !isMissingColumnError(primary.error)) {
    throw primary.error;
  }

  if (!primary.error) {
    return;
  }

  const fallback = await supabase
    .from("posts")
    .update(basePayload)
    .eq("id", postId);

  if (fallback.error) {
    throw fallback.error;
  }
}

async function insertPostVersionRecord(
  supabase: ContentClient,
  basePayload: Record<string, unknown>,
  metadataPayload: Record<string, unknown>
) {
  const primary = await supabase
    .from("post_versions")
    .insert({ ...basePayload, ...metadataPayload });

  if (primary.error && !isMissingColumnError(primary.error)) {
    throw primary.error;
  }

  if (!primary.error) {
    return;
  }

  const fallback = await supabase
    .from("post_versions")
    .insert(basePayload);

  if (fallback.error) {
    throw fallback.error;
  }
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

async function notifyPublish(type: PublishContentType, title: string, slug: string): Promise<void> {
  if (!env.OWNER_NOTIFY_EMAIL) {
    return;
  }

  const enabled = await isNotificationEnabled("notify_contact_form");
  if (!enabled) return;

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
    category: params.formData.get("category"),
    author: params.formData.get("author"),
    authorRole: params.formData.get("authorRole"),
    authorBio: params.formData.get("authorBio"),
    tags: params.formData.get("tags"),
    seoTitle: params.formData.get("seoTitle"),
    seoDescription: params.formData.get("seoDescription"),
    coverImageUrl: params.formData.get("coverImageUrl"),
    status: params.formData.get("status")
  });
  const tags = parseTagsInput(params.formData.get("tags"));

  const supabase = getWriteClient();
  const id = params.id;
  const metadataPayload = buildPostMetadataPayload(parsed, tags);

  if (!id) {
    assertCanCreatePost(profile);
    assertCanPublishPost(profile, parsed.status);
    const basePayload = buildPostBasePayload(parsed, profile.id);
    const data = await createPostRecord(supabase, basePayload, metadataPayload);

    await insertPostVersionRecord(
      supabase,
      {
        post_id: data.id,
        version: 1,
        title: parsed.title,
        slug: parsed.slug,
        excerpt: parsed.excerpt,
        content: parsed.content,
        cover_image_url: parsed.coverImageUrl || null,
        status: parsed.status,
        editor_id: profile.id
      },
      metadataPayload
    );

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

  assertCanEditPost(profile, existing.author_id);
  assertCanPublishPost(profile, parsed.status);
  const updateTimestamp = new Date().toISOString();
  const basePayload = buildPostBasePayload(parsed, existing.author_id ?? profile.id, updateTimestamp);
  await updatePostRecord(supabase, id, basePayload, metadataPayload);

  const version = await nextPostVersion(id, supabase);
  await Promise.all([
    insertPostVersionRecord(
      supabase,
      {
        post_id: id,
        version,
        title: parsed.title,
        slug: parsed.slug,
        excerpt: parsed.excerpt,
        content: parsed.content,
        cover_image_url: parsed.coverImageUrl || null,
        status: parsed.status,
        editor_id: profile.id
      },
      metadataPayload
    ),
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
    status: params.formData.get("status"),
    // Portfolio card
    cardOutcome: params.formData.get("cardOutcome"),
    cardServices: parseServicesInput(params.formData.get("cardServices")),
    sortOrder: params.formData.get("sortOrder"),
    featured: params.formData.get("featured") === "true",
    // Info panel
    industry: params.formData.get("industry"),
    platform: params.formData.get("platform"),
    timeline: params.formData.get("timeline"),
    location: params.formData.get("location"),
    liveUrl: params.formData.get("liveUrl"),
    // Case study
    overview: params.formData.get("overview"),
    challenge: params.formData.get("challenge"),
    approach: params.formData.get("approach"),
    solution: params.formData.get("solution"),
    result: params.formData.get("result"),
    // SEO
    metaTitle: params.formData.get("metaTitle"),
    metaDescription: params.formData.get("metaDescription")
  });

  const galleryImages = sanitizeGalleryImages(parsed.galleryImages, parsed.coverImageUrl);
  const supabase = getWriteClient();
  const id = params.id;

  const workExtendedPayload = {
    card_outcome: parsed.cardOutcome || null,
    card_services: parsed.cardServices,
    sort_order: parsed.sortOrder,
    featured: parsed.featured,
    industry: parsed.industry || null,
    platform: parsed.platform || null,
    timeline: parsed.timeline || null,
    location: parsed.location || null,
    live_url: parsed.liveUrl || null,
    overview: parsed.overview || null,
    challenge: parsed.challenge || null,
    approach: parsed.approach || null,
    solution: parsed.solution || null,
    result: parsed.result || null,
    meta_title: parsed.metaTitle || null,
    meta_description: parsed.metaDescription || null
  };

  if (!id) {
    assertCanCreateWork(profile);
    assertCanPublishWork(profile, parsed.status);

    const workBaseInsert = {
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
    };

    const primaryInsert = await supabase
      .from("works")
      .insert({ ...workBaseInsert, ...workExtendedPayload })
      .select("id")
      .single();

    if (primaryInsert.error && !isMissingColumnError(primaryInsert.error)) {
      throw primaryInsert.error;
    }

    let insertedWorkId: string;

    if (primaryInsert.error) {
      const fallbackInsert = await supabase
        .from("works")
        .insert(workBaseInsert)
        .select("id")
        .single();

      if (fallbackInsert.error) {
        throw fallbackInsert.error;
      }
      insertedWorkId = fallbackInsert.data.id;
    } else {
      insertedWorkId = primaryInsert.data.id;
    }

    const data = { id: insertedWorkId };

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

  assertCanEditWork(profile);
  assertCanPublishWork(profile, parsed.status);

  const workBaseUpdate = {
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
  };

  const primaryUpdate = await supabase
    .from("works")
    .update({ ...workBaseUpdate, ...workExtendedPayload })
    .eq("id", id);

  if (primaryUpdate.error && !isMissingColumnError(primaryUpdate.error)) {
    throw primaryUpdate.error;
  }

  if (primaryUpdate.error) {
    const fallbackUpdate = await supabase
      .from("works")
      .update(workBaseUpdate)
      .eq("id", id);

    if (fallbackUpdate.error) {
      throw fallbackUpdate.error;
    }
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

  assertCanEditPost(profile, postMeta.author_id);

  const { data: version, error: versionError } = await supabase
    .from("post_versions")
    .select("*")
    .eq("id", versionId)
    .eq("post_id", postId)
    .single();

  if (versionError) {
    throw versionError;
  }
  assertCanPublishPost(profile, String(version.status));
  const versionRecord = version as Record<string, unknown>;
  await updatePostRecord(
    supabase,
    postId,
    {
      title: String(version.title ?? ""),
      slug: String(version.slug ?? ""),
      excerpt: String(version.excerpt ?? ""),
      content: String(version.content ?? version.excerpt ?? ""),
      cover_image_url: typeof version.cover_image_url === "string" ? version.cover_image_url : null,
      status: String(version.status ?? "draft") as ParsedPostInput["status"],
      author_id: postMeta.author_id ?? profile.id,
      updated_at: new Date().toISOString()
    },
    buildStoredPostMetadataPayload(versionRecord)
  );

  const nextVersion = await nextPostVersion(postId, supabase);
  await insertPostVersionRecord(
    supabase,
    {
      post_id: postId,
      version: nextVersion,
      title: version.title,
      slug: version.slug,
      excerpt: version.excerpt,
      content: version.content,
      cover_image_url: version.cover_image_url,
      status: version.status,
      editor_id: profile.id
    },
    buildStoredPostMetadataPayload(versionRecord)
  );

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

  assertCanEditWork(profile);

  const { data: version, error: versionError } = await supabase
    .from("work_versions")
    .select("*")
    .eq("id", versionId)
    .eq("work_id", workId)
    .single();

  if (versionError) {
    throw versionError;
  }
  assertCanPublishWork(profile, String(version.status));

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
  assertCanDeletePost(profile);

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
  assertCanDeleteWork(profile);

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
