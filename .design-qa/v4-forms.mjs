// Usage: node .design-qa/v4-forms.mjs <outDir>
// Exercises the conversion forms without ever sending a request: all API posts are aborted.
import { chromium } from "playwright";
const out = process.argv[2];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const posted = [];
await ctx.route("**/api/**", (r) => { posted.push(r.request().url()); return r.abort(); });
const p = await ctx.newPage(); const errs = [];
p.on("pageerror", (e) => errs.push(e.message));
p.on("console", (m) => m.type() === "error" && !m.text().includes("net::ERR_FAILED") && errs.push(m.text().slice(0, 120)));

// Contact: empty submit -> errors, then pill toggle + custom field + consent.
await p.goto("http://localhost:3000/contact", { waitUntil: "networkidle" });
await p.click('form[aria-label="Project inquiry form"] button[type=submit]');
await p.waitForTimeout(300);
const contactErrs = await p.$$eval('form[aria-label="Project inquiry form"] [role=alert]', (n) => n.map((e) => e.textContent?.trim()));
const invalid = await p.$$eval('[aria-invalid=true]', (n) => n.map((e) => e.id || e.getAttribute("name")));
const helpErr = await p.textContent("#contact-help-error");
await p.locator("#contact-name").screenshot({ path: `${out}/x-name-invalid.png` });
await p.locator('form[aria-label="Project inquiry form"]').screenshot({ path: `${out}/x-contact-errors.png` });
await p.click('button[role=checkbox]:has-text("Web Design")');
await p.click('button[role=checkbox]:has-text("Something Else")');
const checked = await p.$$eval('button[role=checkbox][aria-checked=true]', (n) => n.map((e) => e.textContent?.trim()));
const custom = await p.isVisible("#contact-custom-need");
await p.fill("#contact-name", "QA Test");
await p.fill("#contact-email", "qa@example.com");
await p.selectOption("#contact-budget", "Starter Website");
await p.check('input[name=consent]');
await p.focus("#contact-email");
await p.keyboard.press("Tab");
await p.locator('form[aria-label="Project inquiry form"]').screenshot({ path: `${out}/x-contact-filled.png` });
console.log("contact errors:", contactErrs.length, contactErrs, "\ninvalid:", invalid, "\nhelp err:", helpErr?.trim(), "\nchecked:", checked, "custom field:", custom);

// Home quick form: empty submit.
await p.goto("http://localhost:3000/", { waitUntil: "networkidle" });
for (let y = 0; y < 16000; y += 600) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(60); }
await p.waitForSelector('form[aria-label="Quick start lead form"]', { timeout: 20000 });
await p.click('form[aria-label="Quick start lead form"] button[type=submit]');
await p.waitForTimeout(300);
console.log("quick errors:", await p.$$eval('form[aria-label="Quick start lead form"] [role=alert]', (n) => n.map((e) => e.textContent?.trim())));
await p.locator('form[aria-label="Quick start lead form"]').screenshot({ path: `${out}/x-quick-errors.png` });

// Checklist newsletter: invalid email (form uses native required, so type something invalid-ish for the schema).
await p.goto("http://localhost:3000/resources/website-growth-checklist", { waitUntil: "networkidle" });
await p.locator("#checklist-subscribe-email").scrollIntoViewIfNeeded();
await p.fill("#checklist-subscribe-email", "a@b");
await p.click('form[aria-label="Newsletter signup form"] button[type=submit]');
await p.waitForTimeout(300);
console.log("newsletter errors:", await p.$$eval('form[aria-label="Newsletter signup form"] [role=alert]', (n) => n.map((e) => e.textContent?.trim())));
await p.locator("#checklist-signup").screenshot({ path: `${out}/x-newsletter-errors.png` });

// Review: empty submit.
await p.goto("http://localhost:3000/review", { waitUntil: "networkidle" });
await p.click('form[aria-label="Submit a review"] button[type=submit]');
await p.waitForTimeout(300);
console.log("review errors:", await p.$$eval('form[aria-label="Submit a review"] [role=alert]', (n) => n.map((e) => e.textContent?.trim())));
await p.locator('form[aria-label="Submit a review"]').screenshot({ path: `${out}/x-review-errors.png` });

console.log("API requests attempted (all aborted):", posted, "\npage errors:", errs);
await b.close();
