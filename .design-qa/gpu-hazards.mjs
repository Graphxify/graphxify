// Lists elements that force GPU layers / costly repaints, with their on-screen size.
// Usage: node .design-qa/gpu-hazards.mjs [origin] path...
import { chromium } from "playwright";
const [origin = "http://localhost:3000", ...paths] = process.argv.slice(2);
const b = await chromium.launch();
for (const path of paths.length ? paths : ["/", "/services", "/services/web-design", "/works", "/works/flyup-line", "/about", "/process", "/blog", "/contact"]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(origin + path, { waitUntil: "networkidle" });
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 700) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(60); }
  const found = await p.evaluate(() => {
    const out = {};
    const add = (k, el) => { const r = el.getBoundingClientRect(); (out[k] ??= []).push(`${Math.round(r.width)}x${Math.round(r.height)} ${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`); };
    for (const el of document.querySelectorAll("body *")) {
      const s = getComputedStyle(el);
      if (s.willChange !== "auto") add("will-change:" + s.willChange, el);
      if (s.backdropFilter && s.backdropFilter !== "none") add("backdrop-filter", el);
      if (s.filter !== "none") add("filter", el);
      if (s.animationIterationCount === "infinite" && s.animationName !== "none") add("infinite-anim:" + s.animationName, el);
      if (s.transformStyle === "preserve-3d" || (s.perspective && s.perspective !== "none")) add("3d", el);
      if (s.position === "fixed") add("fixed", el);
      if (s.mixBlendMode !== "normal") add("blend", el);
    }
    return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, { n: v.length, ex: v.slice(0, 2) }]));
  });
  console.log("==", path, "height", H);
  for (const [k, v] of Object.entries(found)) console.log("  ", k, "x" + v.n, "|", v.ex.join(" || "));
  await p.close();
}
await b.close();
