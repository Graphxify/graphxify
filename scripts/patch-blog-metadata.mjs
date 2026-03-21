/**
 * Patches existing blog posts in Supabase with correct metadata from demo-content.ts.
 * Handles: category, author, author_role, author_bio, tags, seo_title, seo_description,
 *          cover_image_url, content.
 * Skips related_service — run add-related-service.sql first, then patch-blog-related-service.mjs.
 * Safe to run multiple times (idempotent updates).
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const DEMO_CONTENT_PATH = path.join(ROOT, "src", "lib", "demo-content.ts");
const ENV_FILES = [".env.local", ".env"];

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const source = fs.readFileSync(filePath, "utf8");
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const sep = line.indexOf("=");
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    let value = line.slice(sep + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function loadDemoPosts() {
  let source = fs.readFileSync(DEMO_CONTENT_PATH, "utf8");
  source = source.replace(/export const /g, "const ");
  source += "\nmodule.exports = { demoPosts, demoWorks };\n";
  const sandbox = { module: { exports: {} }, exports: {} };
  vm.runInNewContext(source, sandbox, { filename: DEMO_CONTENT_PATH });
  return Array.isArray(sandbox.module.exports.demoPosts) ? sandbox.module.exports.demoPosts : [];
}

async function main() {
  for (const f of ENV_FILES) loadEnvFile(path.join(ROOT, f));

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
    console.error("No demo posts found.");
    process.exitCode = 1;
    return;
  }

  console.log(`Patching ${demoPosts.length} posts...`);

  for (const post of demoPosts) {
    const patch = {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category ?? "Web Design",
      author: post.author ?? post.author_name ?? "Graphxify Team",
      author_role: post.author_role ?? "Editorial Team",
      author_bio: post.author_bio ?? "Graphxify shares practical guidance on brand systems, websites, and content operations.",
      tags: Array.isArray(post.tags) ? post.tags : [],
      seo_title: post.seo_title ?? null,
      seo_description: post.seo_description ?? null,
      cover_image_url: post.cover_image_url ?? null,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from("posts")
      .update(patch)
      .eq("slug", post.slug);

    if (error) {
      console.error(`  ✗ ${post.slug}: ${error.message}`);
    } else {
      console.log(`  ✓ ${post.slug}`);
    }
  }

  console.log("\nMetadata patch complete.");
  console.log("Next: run supabase/add-related-service.sql in the Supabase SQL editor,");
  console.log("then run: node scripts/patch-blog-related-service.mjs");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
