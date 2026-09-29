#!/usr/bin/env node
/**
 * Manual IndexNow submission.
 *
 *   INDEXNOW_KEY=<key> npm run indexnow:submit -- https://www.graphxify.com/blog/new-post
 *   INDEXNOW_KEY=<key> npm run indexnow:submit -- /blog/new-post /blog
 *   INDEXNOW_KEY=<key> npm run indexnow:submit -- --sitemap      (one-time: every sitemap URL)
 *
 * Use after a deploy that adds new posts/case studies (the CMS only auto-pings
 * content that is already live). Do NOT run --sitemap routinely: IndexNow is for
 * created / meaningfully updated / deleted URLs, not periodic full resubmission.
 * The key must already be served at <site>/indexnow-key.txt (set INDEXNOW_KEY in
 * Vercel). See docs/INDEXNOW-SETUP.md.
 */

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.graphxify.com").replace(/\/+$/, "");
const KEY = process.env.INDEXNOW_KEY?.trim();
const ENDPOINT = "https://api.indexnow.org/indexnow";

if (!KEY || !/^[a-zA-Z0-9-]{8,128}$/.test(KEY)) {
  console.error("INDEXNOW_KEY is missing or invalid (8-128 chars, letters/digits/hyphens).");
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Pass one or more URLs/paths, or --sitemap.");
  process.exit(1);
}

const site = new URL(SITE_URL);

async function urlsFromSitemap() {
  const response = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!response.ok) throw new Error(`Sitemap fetch failed: HTTP ${response.status}`);
  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

async function main() {
  const keyCheck = await fetch(`${SITE_URL}/indexnow-key.txt`);
  const served = keyCheck.ok ? (await keyCheck.text()).trim() : "";
  if (served !== KEY) {
    console.error(`Key file ${SITE_URL}/indexnow-key.txt does not serve this key yet (HTTP ${keyCheck.status}). Deploy with INDEXNOW_KEY set first.`);
    process.exit(1);
  }

  const raw = args.includes("--sitemap") ? await urlsFromSitemap() : args;
  const urlList = [
    ...new Set(
      raw
        .map((value) => {
          try {
            return new URL(value, `${SITE_URL}/`);
          } catch {
            return null;
          }
        })
        .filter((url) => url && url.host === site.host)
        .map((url) => url.toString())
    )
  ];

  if (urlList.length === 0) {
    console.error(`No URLs on ${site.host} to submit.`);
    process.exit(1);
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: site.host, key: KEY, keyLocation: `${SITE_URL}/indexnow-key.txt`, urlList })
  });

  console.log(`IndexNow responded HTTP ${response.status} for ${urlList.length} URL(s).`);
  if (response.status !== 200 && response.status !== 202) {
    console.error(await response.text());
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
