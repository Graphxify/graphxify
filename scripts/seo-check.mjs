#!/usr/bin/env node
// SEO / AI-search regression check. Read-only: it only sends GET/HEAD requests.
//
//   npm run test:seo                      # against a running local server (default http://localhost:3000)
//   npm run test:seo -- --base http://localhost:3100
//   npm run check:production-seo          # against https://www.graphxify.com, with production-only checks
//
// Exit code 1 if any check FAILS. WARN lines do not fail the run.

const args = process.argv.slice(2);
const argValue = (name) => {
  const i = args.indexOf(name);
  return i > -1 ? args[i + 1] : undefined;
};
const PRODUCTION = args.includes("--production");
const BASE = (argValue("--base") ?? (PRODUCTION ? "https://www.graphxify.com" : "http://localhost:3000")).replace(/\/$/, "");
// The canonical origin every page must declare (NEXT_PUBLIC_SITE_URL in the build).
const SITE = (argValue("--site") ?? "https://www.graphxify.com").replace(/\/$/, "");
const MAX_RAW_IMAGE_BYTES = 1_000_000;
const UA = "Mozilla/5.0 (compatible; GraphxifySeoCheck/1.0)";

const failures = [];
const warnings = [];
let passes = 0;
const check = (ok, label, detail = "") => {
  if (ok) passes++;
  else failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
  return ok;
};
const warn = (label) => warnings.push(label);

const cache = new Map();
async function get(url, { follow = false, method = "GET" } = {}) {
  const key = `${method}|${follow}|${url}`;
  if (cache.has(key)) return cache.get(key);
  const res = await fetch(url, { method, redirect: follow ? "follow" : "manual", headers: { "User-Agent": UA } });
  const text = method === "HEAD" ? "" : await res.text();
  const result = { status: res.status, headers: res.headers, text, location: res.headers.get("location") };
  cache.set(key, result);
  return result;
}
const toBase = (url) => {
  const u = new URL(url, BASE);
  return BASE + u.pathname + u.search;
};
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
const metaContent = (html, attr, name) => {
  const m = html.match(new RegExp(`<meta ${attr}="${name.replace(/[.:]/g, "\\$&")}" content="([^"]*)"`));
  return m ? decode(m[1]) : null;
};
const jsonLdBlocks = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
    try {
      return JSON.parse(m[1]);
    } catch {
      return null;
    }
  });
const ldTypes = (node, acc = []) => {
  if (Array.isArray(node)) node.forEach((n) => ldTypes(n, acc));
  else if (node && typeof node === "object") {
    if (node["@type"]) acc.push(...[].concat(node["@type"]));
    Object.values(node).forEach((v) => ldTypes(v, acc));
  }
  return acc;
};

// ── robots.txt ──
const robots = await get(`${BASE}/robots.txt`);
check(robots.status === 200, "robots.txt returns 200", String(robots.status));
check(robots.text.includes(`Sitemap: ${SITE}/sitemap.xml`), "robots.txt declares the production sitemap");
for (const agent of ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User"]) {
  check(new RegExp(`User-Agent: ${agent}`, "i").test(robots.text), `robots.txt names ${agent}`);
}
check(/User-Agent: GPTBot\s*\nDisallow: \/\s*(\n|$)/i.test(robots.text), "robots.txt keeps the GPTBot training opt-out");
check(/User-Agent: Google-Extended\s*\nDisallow: \/\s*(\n|$)/i.test(robots.text), "robots.txt keeps the Google-Extended opt-out");
for (const p of ["/dashboard", "/api", "/auth"]) check(robots.text.includes(`Disallow: ${p}`), `robots.txt disallows ${p}`);
check(!/User-Agent: \*\s*\nDisallow: \/\s*(\n|$)/i.test(robots.text), "robots.txt does not block everything for *");

// ── sitemap.xml ──
const sitemap = await get(`${BASE}/sitemap.xml`);
check(sitemap.status === 200, "sitemap.xml returns 200", String(sitemap.status));
const sitemapUrls = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
check(sitemapUrls.length >= 20, "sitemap.xml lists the public pages", `${sitemapUrls.length} URLs`);
check(new Set(sitemapUrls).size === sitemapUrls.length, "sitemap.xml has no duplicate URLs");
check(sitemapUrls.every((u) => u.startsWith(`${SITE}/`) || u === SITE), "sitemap URLs use the canonical origin");
check(
  !sitemapUrls.some((u) => /llms\.txt|feed\.xml|indexnow|vercel\.app|localhost|\/dashboard|\/api|\/auth|\/review|\/industries/.test(u)),
  "sitemap.xml contains no private, feed or preview URLs"
);

// ── Every sitemap page ──
const titles = new Map();
const descriptions = new Map();
const rawImages = new Set();
for (const url of sitemapUrls) {
  const path = new URL(url).pathname;
  const page = await get(toBase(url));
  if (!check(page.status === 200, `${path} returns 200`, String(page.status))) continue;
  const html = page.text;
  const title = decode((html.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? "");
  const description = metaContent(html, "name", "description");
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) ?? [])[1];
  const robotsMeta = metaContent(html, "name", "robots") ?? "";
  const ogImage = metaContent(html, "property", "og:image") ?? "";
  const h1Count = (html.match(/<h1\b/g) ?? []).length;
  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/);
  const mainWords = mainMatch ? mainMatch[1].replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length : 0;

  check(title.length > 0 && /Graphxify/.test(title), `${path} has a branded <title>`);
  check(!/\| GRAPHXIFY/.test(title), `${path} title uses the "| Graphxify" suffix`);
  check(Boolean(description), `${path} has a meta description`);
  check(canonical === url, `${path} is self-canonical`, `canonical=${canonical}`);
  check(!/noindex/i.test(robotsMeta) && !/noindex/i.test(page.headers.get("x-robots-tag") ?? ""), `${path} is indexable`);
  check(h1Count === 1, `${path} has exactly one <h1>`, `${h1Count}`);
  check(mainWords >= 80, `${path} <main> has server-rendered content`, `${mainWords} words`);
  check(!/<main[^>]*><!--\$\?--><template/.test(html), `${path} <main> is not an empty streaming shell`);
  check(Boolean(ogImage) && !/\.svg(\?|$)/.test(ogImage), `${path} has a non-SVG og:image`);
  check(Boolean(metaContent(html, "name", "twitter:image")), `${path} has a twitter:image`);
  check(!/localhost|\.vercel\.app/.test(`${canonical} ${ogImage}`), `${path} metadata has no localhost/preview URLs`);

  const blocks = jsonLdBlocks(html);
  check(blocks.length > 0 && blocks.every(Boolean), `${path} JSON-LD parses`);
  const types = ldTypes(blocks.filter(Boolean));
  check(html.includes(`"@id":"${SITE}/#organization"`), `${path} references the Organization @id`);
  for (const forbidden of ["LocalBusiness", "ProfessionalService", "AggregateRating", "Review", "FAQPage", "HowTo"]) {
    check(!types.includes(forbidden), `${path} has no ${forbidden} schema`);
  }
  check(!html.includes('"dateCreated"'), `${path} has no dateCreated`);

  titles.set(title, [...(titles.get(title) ?? []), path]);
  if (description) descriptions.set(description, [...(descriptions.get(description) ?? []), path]);

  // Image-performance guard: raw (unoptimised) Supabase Storage objects in <img src>.
  for (const m of html.matchAll(/<img\b[^>]*?\ssrc="([^"]+)"/g)) {
    const src = decode(m[1]);
    if (/\/storage\/v1\/object\/public\//.test(src) && !src.includes("/_next/image")) rawImages.add(`${path} ${src}`);
  }
}
for (const [title, paths] of titles) check(paths.length === 1, `title is unique: "${title}"`, paths.join(", "));
for (const [, paths] of descriptions) check(paths.length === 1, "meta description is unique", paths.join(", "));

for (const entry of rawImages) {
  const [path, src] = entry.split(" ");
  const head = await get(src, { method: "HEAD", follow: true }).catch(() => null);
  const bytes = Number(head?.headers.get("content-length") ?? 0);
  if (!head || !bytes) warn(`${path} raw Storage image size unknown: ${src}`);
  else check(bytes <= MAX_RAW_IMAGE_BYTES, `${path} raw Storage image is ≤ 1 MB`, `${Math.round(bytes / 1024)} KiB ${src}`);
}

// ── Legacy redirects: single-hop 308 to the expected page ──
const redirects = [
  ["/works/northline-enterprise-replatform", "/works/flyup-line"],
  ["/works/vertex-brand-operations", "/works/maven"],
  ["/works/axis-growth-platform", "/works/boss-medical-clinic"],
  ["/works/boss-raam-pharmacy", "/works/boss-medical-clinic"],
  ["/index", "/"],
  ["/work", "/works"],
  ["/pricing", "/services"],
  ["/blog/how-to-choose-web-design-agency-canada", "/blog/how-to-choose-a-web-design-agency"]
];
for (const [from, to] of redirects) {
  const r = await get(`${BASE}${from}`);
  const dest = r.location ? new URL(r.location, BASE).pathname : null;
  check(r.status === 308 && dest === to, `${from} → 308 ${to}`, `${r.status} ${dest}`);
  if (dest) {
    const final = await get(`${BASE}${dest}`);
    check(final.status === 200, `${from} redirect destination returns 200 in one hop`, String(final.status));
  }
}

// ── 404 handling ──
const notFound = await get(`${BASE}/this-page-does-not-exist-seo-check`);
check(notFound.status === 404, "unknown URL returns 404", String(notFound.status));
check(/noindex/i.test(metaContent(notFound.text, "name", "robots") ?? ""), "404 page is noindex");
check(!/<link rel="canonical"/.test(notFound.text), "404 page has no canonical");
for (const p of ["/works/orion-saas-relaunch", "/works/northline-enterprise-platform"]) {
  check((await get(`${BASE}${p}`)).status === 404, `removed demo project ${p} returns 404`);
}

// ── llms.txt / feed ──
const llms = await get(`${BASE}/llms.txt`);
check(llms.status === 200 && (llms.headers.get("content-type") ?? "").startsWith("text/plain"), "llms.txt is served as text/plain");
check(/noindex/i.test(llms.headers.get("x-robots-tag") ?? ""), "llms.txt sends X-Robots-Tag: noindex");
const feed = await get(`${BASE}/feed.xml`);
check(feed.status === 200 && /xml/.test(feed.headers.get("content-type") ?? ""), "feed.xml is served as XML");

// ── IndexNow key file ──
const indexNow = await get(`${BASE}/indexnow-key.txt`);
if (PRODUCTION) {
  check(indexNow.status === 200 && /^[a-zA-Z0-9-]{8,128}$/.test(indexNow.text.trim()), "IndexNow key file is served (value not printed)", String(indexNow.status));
} else {
  check([200, 404].includes(indexNow.status), "IndexNow key route responds (404 is expected without INDEXNOW_KEY)", String(indexNow.status));
}

// ── Production-only: host canonicalisation ──
if (PRODUCTION) {
  for (const host of ["https://graphxify.com/", "http://www.graphxify.com/"]) {
    const r = await get(host);
    const dest = r.location ? new URL(r.location, host).toString() : null;
    check([301, 307, 308].includes(r.status) && dest === `${SITE}/`, `${host} redirects to ${SITE}/`, `${r.status} ${dest}`);
  }
}

// ── Secret exposure in page HTML ──
let suspicious = 0;
for (const url of sitemapUrls) {
  const html = (await get(toBase(url))).text;
  if (/sb_secret_[A-Za-z0-9]/.test(html)) suspicious++;
  for (const jwt of html.match(/eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g) ?? []) {
    try {
      if (JSON.parse(Buffer.from(jwt.split(".")[1], "base64url").toString()).role === "service_role") suspicious++;
    } catch {
      // Not a JWT payload.
    }
  }
}
check(suspicious === 0, "no server-only credentials in page HTML");

console.log(`SEO check against ${BASE}${PRODUCTION ? " (production mode)" : ""}`);
console.log(`  ${passes} passed, ${failures.length} failed, ${warnings.length} warnings, ${sitemapUrls.length} sitemap pages`);
for (const w of warnings) console.log(`  WARN ${w}`);
for (const f of failures) console.log(`  FAIL ${f}`);
process.exit(failures.length ? 1 : 0);
