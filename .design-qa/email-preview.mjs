// Renders email templates to HTML + screenshots for review. Usage: npx tsx .design-qa/email-preview.mjs <outDir>
import fs from "node:fs";
import { chromium } from "playwright";
import * as t from "../src/lib/email/templates.ts";
const out = process.argv[2];
const samples = {
  autoReply: t.leadAutoReplyTemplate({ name: "Alex Morgan" }),
  leadNotification: t.leadNotificationTemplate({ name: "Alex Morgan", email: "alex@example.com", message: "Hi, we're a clinic looking for a new website and brand refresh.\nCan we talk next week?", createdAt: new Date().toISOString() }),
  test: t.testEmailTemplate()
};
const b = await chromium.launch();
for (const [k, v] of Object.entries(samples)) {
  // Local logo so the preview works before deploy.
  const html = v.html.replaceAll("https://www.graphxify.com/images/branding/graphxify-logo-email.png", "file://" + process.cwd() + "/public/images/branding/graphxify-logo-email.png");
  fs.writeFileSync(`${out}/${k}.html`, html);
  for (const w of [700, 380]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1.5 });
    await p.goto("file://" + `${out}/${k}.html`, { waitUntil: "networkidle" });
    await p.screenshot({ path: `${out}/${k}-${w}.jpg`, type: "jpeg", quality: 70, fullPage: true });
    await p.close();
  }
  console.log(k, "|", v.subject);
}
await b.close();
