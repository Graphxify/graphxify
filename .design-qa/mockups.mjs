// Composes device mockups from REAL site captures (no generated content).
// Usage: node .design-qa/mockups.mjs <captureDir> <outDir>
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const [capDir, outDir] = process.argv.slice(2);
const projects = [
  { slug: "flyup-line", stage: "#F26B1D", light: "rgba(255,226,196,0.55)" },
  { slug: "boss-medical-clinic", stage: "#06121F", light: "rgba(70,150,255,0.35)" },
  { slug: "pharmacy-on-king", stage: "#8E1016", light: "rgba(255,140,140,0.35)" },
  { slug: "king-medical-art-pharmacy", stage: "#0C1B33", light: "rgba(80,170,255,0.32)" }
];

const css = (stage, light) => `
*{box-sizing:border-box;margin:0}
html,body{width:2400px;height:1600px;overflow:hidden}
.scene{position:relative;width:2400px;height:1600px;background:
  radial-gradient(1200px 900px at 28% 18%, ${light}, transparent 70%),
  radial-gradient(1600px 1000px at 50% 115%, rgba(0,0,0,0.35), transparent 60%), ${stage};}
.floor{position:absolute;left:50%;bottom:170px;width:1700px;height:120px;transform:translateX(-50%);
  background:radial-gradient(closest-side, rgba(0,0,0,0.45), transparent);filter:blur(18px)}
/* Laptop */
.laptop{position:absolute;left:330px;top:210px;width:1560px}
.lid{position:relative;background:#0d0d0f;border-radius:34px 34px 10px 10px;padding:26px 26px 30px;
  box-shadow:0 0 0 2px #2a2a2e inset, 0 60px 120px -40px rgba(0,0,0,0.6)}
.lid::before{content:"";position:absolute;top:10px;left:50%;width:10px;height:10px;margin-left:-5px;border-radius:50%;background:#1f2a33}
.screen{width:100%;aspect-ratio:16/10;border-radius:8px;overflow:hidden;background:#fff}
.screen img,.pscreen img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
.base{position:relative;width:112%;margin-left:-6%;height:34px;border-radius:0 0 30px 30px;
  background:linear-gradient(#e9eaee,#b9bbc2 70%,#9a9ca3);box-shadow:0 30px 60px -20px rgba(0,0,0,0.55)}
.base::before{content:"";position:absolute;left:50%;top:0;width:260px;height:14px;margin-left:-130px;border-radius:0 0 14px 14px;background:linear-gradient(#c3c5cb,#d9dadf)}
/* Phone */
.phone{position:absolute;right:250px;bottom:150px;width:430px;aspect-ratio:9/19.3;background:#111;border-radius:70px;padding:14px;
  box-shadow:0 0 0 3px #3a3a3e inset, 0 0 0 1px #000, 0 70px 120px -30px rgba(0,0,0,0.65)}
.pscreen{position:relative;width:100%;height:100%;border-radius:57px;overflow:hidden;background:#fff}
.island{position:absolute;top:18px;left:50%;width:130px;height:38px;margin-left:-65px;border-radius:20px;background:#000;z-index:2}
/* Trio of phones */
.trio{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:90px}
.trio .phone{position:relative;right:auto;bottom:auto;width:470px}
.trio .phone:nth-child(1){transform:translateY(70px) rotate(-6deg)}
.trio .phone:nth-child(3){transform:translateY(70px) rotate(6deg)}
`;
const img = (p) => `<img src="file://${p}" alt="">`;

const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 2400, height: 1600 } });
for (const pr of projects) {
  const desk = path.join(capDir, `${pr.slug}-desktop.png`);
  const mob = path.join(capDir, `${pr.slug}-mobile.png`);
  if (!fs.existsSync(desk) || !fs.existsSync(mob)) { console.log("skip", pr.slug); continue; }
  const scenes = {
    devices: `<div class="scene"><div class="floor"></div>
      <div class="laptop"><div class="lid"><div class="screen">${img(desk)}</div></div><div class="base"></div></div>
      <div class="phone"><div class="pscreen"><div class="island"></div>${img(mob)}</div></div></div>`,
    phones: `<div class="scene"><div class="floor"></div><div class="trio">
      <div class="phone"><div class="pscreen"><div class="island"></div>${img(mob)}</div></div>
      <div class="phone"><div class="pscreen"><div class="island"></div>${img(path.join(capDir, `${pr.slug}-mobile-1.png`))}</div></div>
      <div class="phone"><div class="pscreen"><div class="island"></div>${img(path.join(capDir, `${pr.slug}-mobile-2.png`))}</div></div>
    </div></div>`
  };
  for (const [name, body] of Object.entries(scenes)) {
    const html = path.join(capDir, `_scene-${pr.slug}-${name}.html`);
    fs.writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"><style>${css(pr.stage, pr.light)}</style></head><body>${body}</body></html>`);
    await page.goto("file://" + html, { waitUntil: "load" });
    await page.waitForTimeout(300);
    const out = path.join(outDir, `${pr.slug}-${name}.png`);
    await page.screenshot({ path: out });
    console.log("wrote", out);
  }
}
await b.close();
