// Scroll-smoothness test: scrolls each page top to bottom under CPU throttling and reports
// frame times. Usage: node .design-qa/jank.mjs <origin> <cpuRate> <path...>
import { chromium } from "playwright";
const [origin, rate, ...paths] = process.argv.slice(2);
const b = await chromium.launch();
for (const w of [1440, 390]) for (const path of paths) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  const cdp = await p.context().newCDPSession(p);
  await p.goto(origin + path, { waitUntil: "networkidle" });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: +rate });
  const r = await p.evaluate(async () => {
    const H = document.documentElement.scrollHeight - innerHeight, frames = [];
    let last = performance.now(), y = 0;
    await new Promise((done) => {
      const tick = (t) => { frames.push(t - last); last = t; y += 40; scrollTo(0, y); if (y < H) requestAnimationFrame(tick); else done(); };
      requestAnimationFrame(tick);
    });
    frames.sort((a, b) => a - b);
    const pct = (q) => frames[Math.floor(frames.length * q)].toFixed(1);
    return { frames: frames.length, p50: pct(0.5), p95: pct(0.95), max: frames.at(-1).toFixed(1), over50: frames.filter((f) => f > 50).length };
  });
  console.log(w, path, JSON.stringify(r));
  await p.close();
}
await b.close();
