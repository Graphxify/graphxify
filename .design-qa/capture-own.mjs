// Captures of this site itself (for the CMS scene) and taller desktop crops of client sites (for the wall).
import { chromium } from "playwright";
const out = process.argv[2];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.goto("http://localhost:3000/works/maven", { waitUntil: "networkidle" });
const H = await p.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < H; y += 500) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(80); }
await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(800);
await p.screenshot({ path: `${out}/own-case-study.png`, clip: { x: 0, y: 0, width: 1440, height: 1800 }, fullPage: true });
console.log("own case study ok");
await b.close();
