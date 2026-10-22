// SEO crawl of a running build: every sitemap URL, rendered DOM checks, internal link status.
// Usage: node .design-qa/seo-audit.mjs [origin=http://localhost:3100] > report.json
import { chromium } from "playwright";

const origin = process.argv[2] ?? "http://localhost:3100";
const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

const b = await chromium.launch();
const ctx = await b.newContext();
const pages = [];
const links = new Set();
for (const path of urls) {
  const p = await ctx.newPage();
  const res = await p.goto(origin + path, { waitUntil: "domcontentloaded" });
  const d = await p.evaluate(() => {
    const meta = (sel) => document.querySelector(sel)?.getAttribute("content") ?? null;
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
      try {
        const j = JSON.parse(s.textContent);
        const items = Array.isArray(j) ? j : j["@graph"] ?? [j];
        return items.map((i) => i["@type"]).flat();
      } catch {
        return ["INVALID_JSON"];
      }
    });
    const heads = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => +h.tagName[1]);
    const skips = heads.filter((l, i) => i > 0 && l > heads[i - 1] + 1).length;
    const main = document.querySelector("main") ?? document.body;
    return {
      lang: document.documentElement.lang,
      title: document.title,
      desc: meta('meta[name="description"]'),
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
      robots: meta('meta[name="robots"]'),
      ogTitle: meta('meta[property="og:title"]'),
      ogDesc: meta('meta[property="og:description"]'),
      ogImage: meta('meta[property="og:image"]'),
      ogUrl: meta('meta[property="og:url"]'),
      twCard: meta('meta[name="twitter:card"]'),
      h1: [...document.querySelectorAll("h1")].map((h) => h.textContent.trim().slice(0, 80)),
      headingSkips: skips,
      imgNoAlt: [...document.querySelectorAll("img:not([alt])")].map((i) => i.src.slice(0, 90)),
      ld: ld.flat(),
      words: main.innerText.split(/\s+/).filter(Boolean).length,
      links: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")).filter((h) => h.startsWith("/") && !h.startsWith("//"))
    };
  });
  d.links.forEach((l) => links.add(l.split("#")[0] || "/"));
  delete d.links;
  pages.push({ path, status: res.status(), ...d });
  await p.close();
}
await b.close();

const linkStatus = {};
for (const l of links) {
  const r = await fetch(origin + l, { redirect: "manual" });
  if (r.status >= 300) linkStatus[l] = r.status;
}
const dup = (k) => Object.entries(pages.reduce((a, p) => ((a[p[k]] ??= []).push(p.path), a), {})).filter(([v, ps]) => v !== "null" && ps.length > 1);
const extras = {};
for (const f of ["/robots.txt", "/llms.txt", "/feed.xml", "/og"]) extras[f] = (await fetch(origin + f)).status;
console.log(JSON.stringify({ count: pages.length, pages, nonOkLinks: linkStatus, dupTitles: dup("title"), dupDescs: dup("desc"), extras }, null, 1));
