// Counts composited layers and their total area while scrolling each page (GPU cost proxy).
// Usage: node .design-qa/layers.mjs [origin] path...
import { chromium } from "playwright";
const [origin = "http://localhost:3000", ...paths] = process.argv.slice(2);
const b = await chromium.launch({ channel: "chromium" });
for (const path of paths.length ? paths : ["/", "/services", "/works", "/about", "/process", "/blog", "/contact"]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const cdp = await p.context().newCDPSession(p);
  await cdp.send("DOM.enable"); await cdp.send("LayerTree.enable");
  let worst = { count: 0, mpx: 0, big: [] };
  cdp.on("LayerTree.layerTreeDidChange", ({ layers = [] }) => {
    const drawn = layers.filter((l) => l.drawsContent);
    const mpx = drawn.reduce((s, l) => s + l.width * l.height, 0) / 1e6;
    if (mpx > worst.mpx) worst = { count: drawn.length, mpx, big: drawn.sort((a, b) => b.width * b.height - a.width * a.height).slice(0, 4).map((l) => ({ id: l.backendNodeId, w: Math.round(l.width), h: Math.round(l.height) })) };
  });
  await p.goto(origin + path, { waitUntil: "networkidle" });
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 450) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(120); }
  for (const l of worst.big) {
    if (!l.id) { l.node = "(root/scroller)"; continue; }
    try { const { node } = await cdp.send("DOM.describeNode", { backendNodeId: l.id }); l.node = `${node.nodeName.toLowerCase()}.${(node.attributes?.[node.attributes.indexOf("class") + 1] ?? "").slice(0, 70)}`; } catch { l.node = "?"; }
  }
  console.log(path, "layers:", worst.count, "area(Mpx):", worst.mpx.toFixed(1));
  for (const l of worst.big) console.log("   ", `${l.w}x${l.h}`, l.node);
  await p.close();
}
await b.close();
