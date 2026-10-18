// Real mobile screens further down each site: scroll there so on-scroll reveals actually run.
import { chromium } from "playwright";
const out = process.argv[2];
const sites = { "flyup-line": "https://flyupline.com/", "boss-medical-clinic": "https://www.bossmedclinic.com/", "pharmacy-on-king": "https://pharmacyonking.ca/", "king-medical-art-pharmacy": "https://www.kingmedicalartspharmacy.ca/" };
const b = await chromium.launch();
for (const [slug, url] of Object.entries(sites)) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await p.waitForTimeout(1500);
  const H = await p.evaluate(() => document.body.scrollHeight);
  for (const [i, frac] of [[1, 0.16], [2, 0.36]]) {
    const target = Math.round(H * frac);
    for (let y = 0; y <= target; y += 300) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(120); }
    await p.evaluate(y => scrollTo(0, y), target); await p.waitForTimeout(1800);
    await p.screenshot({ path: `${out}/${slug}-mobile-${i}.png` });
  }
  console.log(slug, "ok");
  await ctx.close();
}
await b.close();
