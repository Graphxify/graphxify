// SEO validator over the rendered HTML of every sitemap URL (no browser needed).
// Errors fail the run (exit 1); length findings are warnings for human review, never auto-truncated.
// Usage: node .design-qa/seo-validate.mjs [origin=http://localhost:3100] [--canonical-host=https://www.graphxify.com]
const origin = process.argv[2]?.startsWith("http") ? process.argv[2] : "http://localhost:3100";
const canonicalHost = (process.argv.find((a) => a.startsWith("--canonical-host=")) ?? "").split("=")[1] ?? null;

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const all = (html, re) => [...html.matchAll(re)].map((m) => decode(m[1]));

const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const host = canonicalHost ?? new URL(locs[0]).origin;
const errors = [];
const warnings = [];
const rows = [];

if (new Set(locs).size !== locs.length) errors.push("sitemap: duplicate URLs");
for (const loc of locs) if (!loc.startsWith(host)) errors.push(`sitemap: non-canonical host ${loc}`);

for (const loc of locs) {
  const path = new URL(loc).pathname;
  const res = await fetch(origin + path, { redirect: "manual" });
  const html = await res.text();
  const at = (msg) => errors.push(`${path}: ${msg}`);
  const warn = (msg) => warnings.push(`${path}: ${msg}`);

  if (res.status !== 200) { at(`HTTP ${res.status}`); continue; }
  const xRobots = res.headers.get("x-robots-tag") ?? "";
  if (/noindex/i.test(xRobots)) at(`X-Robots-Tag ${xRobots}`);

  const titles = all(html, /<title[^>]*>([\s\S]*?)<\/title>/g);
  const descs = all(html, /<meta name="description" content="([^"]*)"/g);
  const canon = all(html, /<link rel="canonical" href="([^"]+)"/g);
  const robots = all(html, /<meta name="robots" content="([^"]*)"/g);
  const ogUrl = all(html, /<meta property="og:url" content="([^"]+)"/g);
  const ogT = all(html, /<meta property="og:title" content="([^"]*)"/g);
  const ogD = all(html, /<meta property="og:description" content="([^"]*)"/g);
  const twT = all(html, /<meta name="twitter:title" content="([^"]*)"/g);
  const twD = all(html, /<meta name="twitter:description" content="([^"]*)"/g);
  const ogImg = all(html, /<meta property="og:image" content="([^"]+)"/g);

  if (titles.length !== 1 || !titles[0]?.trim()) at(`expected 1 title, found ${titles.length}`);
  if (descs.length !== 1 || !descs[0]?.trim()) at(`expected 1 meta description, found ${descs.length}`);
  if (canon.length !== 1) at(`expected 1 canonical, found ${canon.length}`);
  else if (canon[0].replace(/\/$/, "") !== loc.replace(/\/$/, "")) at(`canonical ${canon[0]} != ${loc}`);
  if (robots.some((r) => /noindex/i.test(r))) at(`meta robots ${robots.join(",")}`);
  if (ogUrl[0] && canon[0] && ogUrl[0].replace(/\/$/, "") !== canon[0].replace(/\/$/, "")) at(`og:url ${ogUrl[0]} != canonical`);
  if (!ogImg.length) at("missing og:image");

  for (const block of all(html, /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(block); } catch { at("invalid JSON-LD"); }
  }

  const t = titles[0] ?? "";
  const d = descs[0] ?? "";
  if (t.length > 60) warn(`title ${t.length} chars`);
  if (d.length < 120 || d.length > 160) warn(`description ${d.length} chars`);
  for (const v of [...ogT, ...twT]) if (v.length > 60) warn(`social title ${v.length} chars`);
  for (const v of [...ogD, ...twD]) if (v.length > 160) warn(`social description ${v.length} chars`);
  rows.push({ path, t: t.length, d: d.length, title: t });
}

for (const r of rows) console.log(`${String(r.t).padStart(3)} ${String(r.d).padStart(3)}  ${r.path.padEnd(44)} ${r.title}`);
console.log(`\n${locs.length} sitemap URLs | ${errors.length} errors | ${warnings.length} warnings`);
for (const e of errors) console.log("ERROR  ", e);
for (const w of warnings) console.log("warn   ", w);
process.exit(errors.length ? 1 : 0);
