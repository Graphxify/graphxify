import { chromium } from "playwright";
const [a, b] = process.argv.slice(2);
const pages = ["/", "/services", "/services/web-development", "/services/brand-systems", "/about", "/contact", "/works", "/works/maven", "/blog", "/blog/local-seo-getting-found-on-google", "/blog/professional-website-business-growth"];
const br = await chromium.launch();
const snap = async (origin, path, w) => {
  const ctx = await br.newContext({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" }); const p = await ctx.newPage();
  await p.goto(origin + path, { waitUntil: "networkidle" });
  const H = await p.evaluate(() => document.body.scrollHeight); for (let y = 0; y < H; y += 700) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(40); }
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
  const boxes = await p.evaluate(() => [...document.querySelectorAll("body *:not(script):not(style):not(link):not(noscript)")].map((e) => { const r = e.getBoundingClientRect(); return `${e.tagName}:${Math.round(r.x)},${Math.round(r.y + scrollY)},${Math.round(r.width)}x${Math.round(r.height)}:${getComputedStyle(e).color}|${getComputedStyle(e).backgroundColor}|${getComputedStyle(e).fontSize}`; }));
  await ctx.close(); return boxes;
};
let total = 0, diffs = 0;
for (const w of [1440, 390]) for (const path of pages) {
  const x = await snap(a, path, w), y = await snap(b, path, w);
  const n = x.length === y.length ? x.filter((v, i) => v !== y[i]).length : -1;
  total += x.length; if (n !== 0) diffs++;
  console.log(String(w).padEnd(5), path.padEnd(44), "elements", x.length, n === -1 ? `COUNT DIFFERS (${y.length})` : `changed: ${n}`);
}
console.log(`\n${total} element boxes compared; pages with layout/style differences: ${diffs}`);
await br.close();
