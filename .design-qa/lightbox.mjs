// Usage: node .design-qa/lightbox.mjs [/works/slug]  Checks the case-study gallery lightbox: open, arrows, Escape, focus return.
import { chromium } from "playwright";
const path = process.argv[2] ?? "/works/maven";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
const errs = []; p.on("pageerror", e => errs.push(e.message));
await p.goto("http://localhost:3000" + path, { waitUntil: "networkidle" });
const tiles = p.locator('button[aria-label$="Open larger view"]');
const n = await tiles.count(); if (n < 2) throw new Error("tiles " + n);
const t = tiles.nth(1); await t.scrollIntoViewIfNeeded(); await t.focus(); await p.keyboard.press("Enter");
const dlg = p.getByRole("dialog"); await dlg.waitFor();
const title = async () => (await dlg.locator("h2").innerText()).trim();
const t1 = await title(); await p.keyboard.press("ArrowRight"); const t2 = await title(); await p.keyboard.press("ArrowLeft"); const t3 = await title();
await p.keyboard.press("Escape"); await dlg.waitFor({ state: "detached" });
await p.waitForTimeout(300); const focusBack = await p.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.tagName);
const h1 = await p.locator("h1").count();
console.log({ tiles: n, t1, t2, t3, focusBack, h1, errs });
if (!t1.endsWith("02 / 0" + n) || !t2.endsWith("03 / 0" + n) || t3 !== t1 || !focusBack?.includes("gallery image 1") || h1 !== 1 || errs.length) { console.log("FAIL"); process.exit(1); }
console.log("PASS"); await b.close();
