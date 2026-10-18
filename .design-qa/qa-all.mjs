import { chromium } from "playwright";
const paths = ["/", "/works", "/works/maven", "/works/flyup-line", "/works/pharmacy-on-king", "/works/boss-medical-clinic", "/works/king-medical-art-pharmacy", "/works/luka-hair-salon", "/services", "/services/brand-systems", "/services/web-design", "/services/web-development", "/services/cms-architecture", "/process", "/about", "/blog", "/blog/how-to-choose-a-web-design-agency", "/contact", "/resources/website-growth-checklist", "/review", "/privacy", "/terms"];
const b = await chromium.launch(); const bad = [];
for (const w of [1440, 1280, 1024, 768, 430, 390, 375]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  for (const path of paths) {
    const p = await ctx.newPage(); const errs = [];
    p.on("console", m => m.type() === "error" && errs.push(m.text().slice(0, 120))); p.on("pageerror", e => errs.push("PAGEERR " + e.message.slice(0, 120)));
    const res = await p.goto("http://localhost:3000" + path, { waitUntil: "networkidle", timeout: 90000 }).catch(e => (errs.push("NAV " + e.message.slice(0, 60)), null));
    const H = await p.evaluate(() => document.body.scrollHeight); let ov = 0;
    for (let y = 0; y < H; y += 800) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(30); ov = Math.max(ov, await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)); }
    const h1 = await p.evaluate(() => document.querySelectorAll("h1").length);
    if (ov > 0 || errs.length || h1 !== 1 || (res && res.status() >= 400)) bad.push(`${w} ${path} status=${res?.status()} overflow=${ov} h1=${h1} ${errs.join(" | ")}`);
    await p.close();
  }
  await ctx.close();
}
console.log(bad.length ? bad.join("\n") : `ALL CLEAN: ${paths.length} pages x 7 widths (status, overflow, one h1, console)`);
await b.close();
