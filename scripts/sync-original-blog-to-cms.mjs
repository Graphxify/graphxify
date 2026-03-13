import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const DEMO_CONTENT_PATH = path.join(ROOT, "src", "lib", "demo-content.ts");
const ENV_FILES = [".env.local", ".env"];
const LEGACY_PLACEHOLDER_SLUGS = [
  "enterprise-website-governance-2026",
  "how-to-design-an-audit-ready-cms",
  "performance-patterns-premium-agency-sites"
];

function isMissingColumnError(error) {
  return error?.code === "PGRST204" || error?.code === "42703" || /Could not find the .* column/i.test(error?.message ?? "");
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const source = fs.readFileSync(filePath, "utf8");
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function loadDemoPosts() {
  let source = fs.readFileSync(DEMO_CONTENT_PATH, "utf8");
  source = source.replace(/export const /g, "const ");
  source += "\nmodule.exports = { demoPosts, demoWorks };\n";

  const sandbox = {
    module: { exports: {} },
    exports: {}
  };

  vm.runInNewContext(source, sandbox, { filename: DEMO_CONTENT_PATH });
  return Array.isArray(sandbox.module.exports.demoPosts) ? sandbox.module.exports.demoPosts : [];
}

function toPostPayload(post, authorId) {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category ?? "Web Design",
    author: post.author ?? post.author_name ?? "Graphxify Team",
    author_role: post.author_role ?? "Editorial Team",
    author_bio:
      post.author_bio ??
      "Graphxify shares practical guidance on brand systems, websites, and content operations.",
    tags: Array.isArray(post.tags) ? post.tags : [],
    seo_title: post.seo_title ?? null,
    seo_description: post.seo_description ?? null,
    cover_image_url: post.cover_image_url ?? null,
    status: "published",
    author_id: authorId,
    created_at: post.created_at,
    updated_at: post.updated_at ?? post.created_at
  };
}

function toVersionPayload(postId, payload, authorId) {
  return {
    post_id: postId,
    version: 1,
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt,
    content: payload.content,
    category: payload.category,
    author: payload.author,
    author_role: payload.author_role,
    author_bio: payload.author_bio,
    tags: payload.tags,
    seo_title: payload.seo_title,
    seo_description: payload.seo_description,
    cover_image_url: payload.cover_image_url,
    status: payload.status,
    editor_id: authorId,
    created_at: payload.created_at
  };
}

function toLegacyPostPayload(payload) {
  return {
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt,
    content: payload.content,
    cover_image_url: payload.cover_image_url,
    status: payload.status,
    author_id: payload.author_id,
    created_at: payload.created_at,
    updated_at: payload.updated_at
  };
}

function toLegacyVersionPayload(payload) {
  return {
    post_id: payload.post_id,
    version: payload.version,
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt,
    content: payload.content,
    cover_image_url: payload.cover_image_url,
    status: payload.status,
    editor_id: payload.editor_id,
    created_at: payload.created_at
  };
}

async function upsertPostRecord(supabase, payload) {
  const primary = await supabase
    .from("posts")
    .upsert(payload, { onConflict: "slug" })
    .select("id,slug")
    .single();

  if (primary.error && !isMissingColumnError(primary.error)) {
    throw primary.error;
  }

  if (!primary.error) {
    return { data: primary.data, usedLegacySchema: false };
  }

  const fallback = await supabase
    .from("posts")
    .upsert(toLegacyPostPayload(payload), { onConflict: "slug" })
    .select("id,slug")
    .single();

  if (fallback.error) {
    throw fallback.error;
  }

  return { data: fallback.data, usedLegacySchema: true };
}

async function upsertPostVersionRecord(supabase, payload) {
  const primary = await supabase
    .from("post_versions")
    .upsert(payload, { onConflict: "post_id,version" });

  if (primary.error && !isMissingColumnError(primary.error)) {
    throw primary.error;
  }

  if (!primary.error) {
    return { usedLegacySchema: false };
  }

  const fallback = await supabase
    .from("post_versions")
    .upsert(toLegacyVersionPayload(payload), { onConflict: "post_id,version" });

  if (fallback.error) {
    throw fallback.error;
  }

  return { usedLegacySchema: true };
}

async function main() {
  for (const fileName of ENV_FILES) {
    loadEnvFile(path.join(ROOT, fileName));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
    process.exitCode = 1;
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const demoPosts = loadDemoPosts();
  if (demoPosts.length === 0) {
    console.error("No original demo blog posts were found.");
    process.exitCode = 1;
    return;
  }

  const { data: seedAuthor, error: authorError } = await supabase
    .from("profiles")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (authorError) {
    throw authorError;
  }

  const authorId = seedAuthor?.id ?? null;

  const { error: deleteError } = await supabase
    .from("posts")
    .delete()
    .in("slug", LEGACY_PLACEHOLDER_SLUGS);

  if (deleteError) {
    throw deleteError;
  }

  const synced = [];
  let usedLegacySchema = false;

  for (const post of demoPosts) {
    const payload = toPostPayload(post, authorId);
    const postResult = await upsertPostRecord(supabase, payload);
    usedLegacySchema = usedLegacySchema || postResult.usedLegacySchema;

    const versionPayload = toVersionPayload(postResult.data.id, payload, authorId);
    const versionResult = await upsertPostVersionRecord(supabase, versionPayload);
    usedLegacySchema = usedLegacySchema || versionResult.usedLegacySchema;

    synced.push(postResult.data.slug);
  }

  console.log(`Synced ${synced.length} original blog posts into the CMS.`);
  for (const slug of synced) {
    console.log(`- ${slug}`);
  }
  if (usedLegacySchema) {
    console.log("Imported using the legacy posts schema. Apply supabase/blog-metadata.sql to persist category, author, tags, and SEO fields in the database.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
