// Capture real client sites for mockups: desktop 1440x900 and mobile 390x844 at 2x.
import { chromium } from "playwright";
const out = process.argv[2];
const sites = { "flyup-line": "https://flyupline.com/", "boss-medical-clinic": "https://www.bossmedclinic.com/", "pharmacy-on-king": "https://pharmacyonking.ca/", "king-medical-art-pharmacy": "https://www.kingmedicalartspharmacy.ca/" };
const b = await chromium.launch();
for (const [slug, url] of Object.entries(sites)) {
  for (const [kind, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 2, isMobile: kind === "mobile", hasTouch: kind === "mobile" });
    const p = await ctx.newPage();
    try {
      const res = await p.goto(url, { waitUntil: "networkidle", timeout: 60000 });
      await p.waitForTimeout(2500);
      // Let lazy content and entrance animations settle, then return to the top.
      const H = await p.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < Math.min(H, 6000); y += 500) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(150); }
      await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(1200);
      await p.screenshot({ path: `${out}/${slug}-${kind}.png` });
      await p.screenshot({ path: `${out}/${slug}-${kind}-full.png`, fullPage: true });
      console.log(slug, kind, res?.status(), "height", H);
    } catch (e) { console.log(slug, kind, "FAILED", e.message.slice(0, 100)); }
    await ctx.close();
  }
}
await b.close();
