// Usage: node .design-qa/blog-filter.mjs  -> checks the /blog category filter narrows the grid and resets.
import { chromium } from "playwright";
import assert from "node:assert";
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto("http://localhost:3000/blog", { waitUntil: "networkidle" });
const group = p.getByRole("group", { name: "Filter articles by category" });
const cards = () => p.locator("section ul > li a[href^='/blog/']").count();
const all = await cards();
for (const btn of await group.getByRole("button").all()) {
  const [label, count] = [(await btn.innerText()).replace(/\s*\d+$/, "").trim(), Number((await btn.innerText()).match(/(\d+)$/)?.[1])];
  await btn.click();
  assert.equal(await btn.getAttribute("aria-pressed"), "true");
  const n = await cards();
  const shown = Math.min(count, 6);
  assert.equal(n, shown, `${label}: expected ${shown} cards, got ${n}`);
  if (label !== "All") for (const pill of await p.locator("section ul > li a[href^='/blog/'] p span:first-child").allInnerTexts()) assert.equal(pill, label);
  console.log(`${label}: ${n} card(s) OK`);
}
await group.getByRole("button", { name: /^All/ }).click();
assert.equal(await cards(), all); console.log("reset to All OK,", all, "cards");
await b.close();
