/**
 * Patches the related_service field on blog posts in Supabase.
 * Run this AFTER executing supabase/add-related-service.sql in the Supabase SQL editor.
 * Safe to run multiple times.
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ENV_FILES = [".env.local", ".env"];

// related_service values from demo-content.ts
const RELATED_SERVICE_MAP = {
  "how-to-choose-web-design-agency-canada": "web-design",
  "mobile-first-website-canadian-small-businesses-2026": "web-design",
  "brand-identity-canadian-businesses": "brand-systems",
  "custom-web-development-vs-wordpress-canada": "web-development",
  "professional-website-business-growth-canada": null,
  "local-seo-canadian-businesses-getting-found-google": null
};

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

  // Verify column exists first
  const { error: checkError } = await supabase
    .from("posts")
    .select("related_service")
    .limit(1);

  if (checkError?.code === "42703" || checkError?.code === "PGRST204") {
    console.error("Column 'related_service' does not exist yet.");
    console.error("Run supabase/add-related-service.sql in the Supabase SQL editor first.");
    process.exitCode = 1;
    return;
  }

  console.log("Patching related_service on blog posts...");

  for (const [slug, relatedService] of Object.entries(RELATED_SERVICE_MAP)) {
    const { error } = await supabase
      .from("posts")
      .update({ related_service: relatedService, updated_at: new Date().toISOString() })
      .eq("slug", slug);

    if (error) {
      console.error(`  ✗ ${slug}: ${error.message}`);
    } else {
      const label = relatedService ?? "null (no service link)";
      console.log(`  ✓ ${slug} → ${label}`);
    }
  }

  console.log("\nrelated_service patch complete.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
