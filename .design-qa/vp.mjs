// Viewport screenshots at given scroll targets: node vp.mjs <out> <width> <path>@<selector>[@offset] ...
import { chromium } from "playwright";
const [out, w, ...targets] = process.argv.slice(2);
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: +w, height: 900 } });
for (const [i, t] of targets.entries()) {
  const [path, sel, off = "120"] = t.split("@");
  const p = await ctx.newPage(); await p.goto("http://localhost:3000" + path, { waitUntil: "networkidle" });
  const H = await p.evaluate(() => document.body.scrollHeight); for (let y = 0; y < H; y += 700) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(40); }
  if (sel) await p.evaluate(([sel, off]) => { const el = document.querySelector(sel); scrollTo(0, (el ? el.getBoundingClientRect().top + scrollY : 0) - +off); }, [sel, off]); else await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${out}/vp-${w}-${i}.jpg`, type: "jpeg", quality: 65 }); await p.close();
}
await b.close();
