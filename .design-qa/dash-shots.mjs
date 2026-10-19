// Logs into the CMS and screenshots dashboard pages. Credentials come from env, never the repo.
// Usage: DASH_EMAIL=… DASH_PASSWORD=… node .design-qa/dash-shots.mjs <outDir> [width=1440] [origin]
import { chromium } from "playwright";
const [out, w = "1440", origin = "http://localhost:3000"] = process.argv.slice(2);
const pages = ["/admin", "/dashboard", "/dashboard/analytics", "/dashboard/posts", "/dashboard/posts/new", "/dashboard/works", "/dashboard/marquee", "/dashboard/testimonials", "/dashboard/subscriptions", "/dashboard/leads", "/dashboard/profile", "/dashboard/settings", "/dashboard/users", "/dashboard/activity"];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: +w, height: 900 } });
const p = await ctx.newPage();
const errors = [];
p.on("console", (m) => m.type() === "error" && errors.push(`${p.url()} ${m.text().slice(0, 120)}`));
await p.goto(origin + "/admin", { waitUntil: "networkidle" });
await p.screenshot({ path: `${out}/${w}-login.jpg`, type: "jpeg", quality: 60, fullPage: true });
await p.fill('input[name="email"]', process.env.DASH_EMAIL);
await p.fill('input[name="password"]', process.env.DASH_PASSWORD);
await Promise.all([p.waitForURL(/dashboard/, { timeout: 30000 }), p.click('button[type="submit"]')]);
for (const path of pages.slice(1)) {
  const r = await p.goto(origin + path, { waitUntil: "networkidle" });
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  console.log(r.status(), path, overflow ? "OVERFLOW" : "");
  await p.screenshot({ path: `${out}/${w}-${path.replaceAll("/", "_") || "root"}.jpg`, type: "jpeg", quality: 60, fullPage: true });
}
console.log("console errors:", errors.length, errors.slice(0, 5));
await b.close();
