// King Medical Arts has an auto-rotating hero slider: wait for a slide to settle, then freeze motion.
import { chromium } from "playwright";
const out = process.argv[2];
const b = await chromium.launch();
for (const [kind, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 2, isMobile: kind === "mobile", hasTouch: kind === "mobile" });
  const p = await ctx.newPage();
  await p.goto("https://www.kingmedicalartspharmacy.ca/", { waitUntil: "networkidle", timeout: 60000 });
  await p.waitForTimeout(1500);
  // Freeze any slider: stop CSS animations/transitions and JS timers driving the carousel.
  await p.addStyleTag({ content: "*,*::before,*::after{animation-play-state:paused!important;transition:none!important}" });
  await p.evaluate(() => { const max = setTimeout(() => {}, 0); for (let i = 0; i <= max; i++) { clearTimeout(i); clearInterval(i); } });
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${out}/king-medical-art-pharmacy-${kind}.png` });
  console.log(kind, "ok");
  await ctx.close();
}
await b.close();
