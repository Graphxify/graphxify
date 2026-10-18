// Usage: node .design-qa/shot.mjs <outDir> <widths comma list> <path> [path...]
// Writes <name>-<width>.jpg full-page screenshots (after scrolling so reveals settle)
// and prints overflow + console errors per page.
import { chromium } from "playwright";
const [out, widths, ...paths] = process.argv.slice(2);
const b = await chromium.launch();
for (const w of widths.split(",").map(Number)) for (const path of paths) {
  const p = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage(); const errs = [];
  p.on("console", m => m.type() === "error" && errs.push(m.text().slice(0, 150)));
  p.on("pageerror", e => errs.push("PAGEERR " + e.message.slice(0, 150)));
  await p.goto("http://localhost:3000" + path, { waitUntil: "networkidle", timeout: 90000 }).catch(e => errs.push("NAV " + e.message.slice(0, 80)));
  const H = await p.evaluate(() => document.body.scrollHeight);
  let ov = 0;
  for (let y = 0; y < H; y += 400) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(70); ov = Math.max(ov, await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)); }
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(500);
  const name = (path === "/" ? "home" : path.replace(/\//g, "_").slice(1)) + "-" + w;
  await p.screenshot({ path: `${out}/${name}.jpg`, type: "jpeg", quality: 55, fullPage: true });
  console.log(name, "height", H, "overflow", ov, errs.length ? "ERR: " + errs.join(" | ") : "");
  await p.close();
}
await b.close();
