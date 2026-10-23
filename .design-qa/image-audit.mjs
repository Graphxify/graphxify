// Image accessibility audit of every public page (rendered DOM, after scrolling so lazy images load).
// Routes = production sitemap + public pages intentionally outside it (/review, the 404 page).
// Errors fail the run; ambiguous findings are printed for human review.
// Usage: node .design-qa/image-audit.mjs [origin=http://localhost:3100] [--details]
import { chromium } from "playwright";

const origin = process.argv[2]?.startsWith("http") ? process.argv[2] : "http://localhost:3100";
const details = process.argv.includes("--details");
const EXTRA_PUBLIC = ["/review", "/__image-audit-404__"]; // noindex by design, but public

const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
const routes = [...[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname), ...EXTRA_PUBLIC];

const b = await chromium.launch();
const rows = [];
const errors = [];
const review = [];

for (const path of routes) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const res = await p.goto(origin + path, { waitUntil: "networkidle" });
  const H = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < H; y += 800) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(40); }

  const r = await p.evaluate(() => {
    const hidden = (el) => !!el.closest('[aria-hidden="true"]');
    const srcOf = (img) => { const s = img.currentSrc || img.src || ""; try { const u = new URL(s); return decodeURIComponent(u.searchParams.get("url") ?? u.pathname); } catch { return s; } };
    const out = { imgs: 0, described: 0, decorative: 0, emptyInformative: [], missing: [], filenameAlt: [], genericAlt: [], imageOf: [], dupAlt: [], svgNamed: 0, svgHidden: 0, svgUnnamed: [], cssBg: [], namelessControls: [], pictures: document.querySelectorAll("picture").length };
    const altBySrc = new Map();
    for (const img of document.querySelectorAll("img")) {
      out.imgs++;
      const alt = img.getAttribute("alt"); const src = srcOf(img).split("/").slice(-2).join("/");
      const decorativeRole = /^(presentation|none)$/.test(img.getAttribute("role") ?? "");
      if (alt === null) out.missing.push(src);
      else if (!alt.trim()) { if (hidden(img) || decorativeRole) out.decorative++; else out.emptyInformative.push(src); }
      else {
        out.described++;
        // Filenames: an extension, a long digit run, or hyphen/underscore-joined tokens. A single brand word ("Maven") is a valid logo alt.
        if (/\.(png|jpe?g|webp|gif|svg|avif)\b|\d{6,}|^[\w]+[-_][\w-]+$/i.test(alt)) out.filenameAlt.push(`${alt} (${src})`);
        if (/\bgallery image \d+|\bproject image$|project by graphxify$|\bimage \d+$/i.test(alt)) out.genericAlt.push(`${alt} (${src})`);
        if (/^(an? )?(image|picture|photo|graphic) of\b/i.test(alt)) out.imageOf.push(alt);
        if (altBySrc.has(alt) && altBySrc.get(alt) !== src) out.dupAlt.push(alt); else altBySrc.set(alt, src);
      }
    }
    for (const svg of document.querySelectorAll("svg")) {
      if (hidden(svg) || svg.getAttribute("aria-hidden") === "true") { out.svgHidden++; continue; }
      const named = svg.getAttribute("aria-label") || svg.getAttribute("aria-labelledby") || svg.querySelector("title")?.textContent?.trim();
      const r = svg.getBoundingClientRect();
      if (named) out.svgNamed++;
      // An unnamed, visible SVG inside a control that already has a text name is decorative in practice.
      else if (r.width > 0 && !svg.closest("a,button")?.textContent?.trim() && !svg.closest("a,button")?.getAttribute("aria-label")) out.svgUnnamed.push(`${Math.round(r.width)}x${Math.round(r.height)} in ${svg.parentElement?.tagName.toLowerCase()}.${String(svg.parentElement?.className).slice(0, 40)}`);
    }
    for (const el of document.querySelectorAll("body *")) {
      const bg = getComputedStyle(el).backgroundImage;
      if (bg && bg !== "none" && /url\(/.test(bg)) out.cssBg.push(`${el.tagName.toLowerCase()}: ${bg.slice(0, 80)}`);
    }
    for (const c of document.querySelectorAll("a[href],button")) {
      if (hidden(c)) continue;
      const imgNames = [...c.querySelectorAll("img")].map((i) => i.getAttribute("alt") ?? "").join(" ");
      const name = (c.getAttribute("aria-label") || c.textContent || "").trim() || imgNames.trim() || c.getAttribute("title") || (c.getAttribute("aria-labelledby") ? "labelledby" : "");
      if (!name) out.namelessControls.push(c.outerHTML.slice(0, 90));
    }
    return out;
  });

  const status = res.status();
  const expectStatus = path.startsWith("/__image-audit-404") ? 404 : 200;
  if (status !== expectStatus) errors.push(`${path}: HTTP ${status}`);
  for (const s of r.missing) errors.push(`${path}: img missing alt attribute (${s})`);
  for (const s of r.emptyInformative) errors.push(`${path}: informative image with empty alt (${s})`);
  for (const s of r.namelessControls) errors.push(`${path}: link/button without accessible name: ${s}`);
  for (const s of r.filenameAlt) review.push(`${path}: alt looks like a filename: ${s}`);
  // Placeholder alts (incl. renderAlt's last-resort fallback) are failures: the image still needs a real description.
  for (const s of r.genericAlt) errors.push(`${path}: placeholder alt, needs a real description: ${s}`);
  for (const s of r.imageOf) review.push(`${path}: redundant "image of" phrasing: ${s}`);
  for (const s of r.svgUnnamed) review.push(`${path}: visible unnamed SVG outside a named control: ${s}`);
  for (const s of new Set(r.dupAlt)) review.push(`${path}: same alt text on different images: "${s}"`);
  rows.push({ path, status, ...r });
  await p.close();
}
await b.close();

const pad = (s, n) => String(s).padEnd(n);
console.log(pad("route", 46), "HTTP imgs described decorative emptyInfo missing svgNamed svgHidden cssBg");
for (const x of rows) console.log(pad(x.path, 46), pad(x.status, 4), pad(x.imgs, 4), pad(x.described, 9), pad(x.decorative, 10), pad(x.emptyInformative.length, 9), pad(x.missing.length, 7), pad(x.svgNamed, 8), pad(x.svgHidden, 9), x.cssBg.length);
const t = (k) => rows.reduce((s, x) => s + (Array.isArray(x[k]) ? x[k].length : x[k]), 0);
console.log(`\n${rows.length} routes | ${t("imgs")} images: ${t("described")} described, ${t("decorative")} decorative, ${t("emptyInformative")} informative-but-empty, ${t("missing")} missing alt | SVG: ${t("svgNamed")} named, ${t("svgHidden")} hidden, ${t("svgUnnamed")} unnamed | CSS bg images: ${t("cssBg")} | picture: ${t("pictures")}`);
console.log(`${errors.length} errors | ${review.length} items for human review`);
for (const e of errors) console.log("ERROR  ", e);
for (const w of new Set(review)) console.log("review ", w);
if (details) for (const x of rows) for (const c of new Set(x.cssBg)) console.log("css-bg ", x.path, c);
process.exit(errors.length ? 1 : 0);
