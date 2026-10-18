// Checks every ScrollStack card is fully visible when pinned. Usage: node .design-qa/stack-fit.mjs [origin]
import { chromium } from "playwright";
const origin = process.argv[2] ?? "http://localhost:3000";
const b = await chromium.launch();
let fail = 0;
for (const [w, h] of [[1440, 900], [1280, 720], [1024, 768], [768, 1024], [430, 932], [390, 844], [375, 667]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(origin + "/", { waitUntil: "networkidle" });
  // A pinned card's top sits at its sticky `top`; it fits if top + height <= viewport.
  const res = await p.evaluate(() => [...document.querySelectorAll("[data-stack-item]")].map((el) => Math.round(innerHeight - (parseFloat(el.style.top) + el.firstElementChild.offsetHeight))));
  const bad = res.some((m) => m < 0);
  fail += bad;
  console.log(`${w}x${h}`, bad ? "CUT" : "ok", "space below each card:", res.join(","));
  await p.close();
}
await b.close();
process.exit(fail ? 1 : 0);
