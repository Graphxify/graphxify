// Blog cover series: one idea per post, one shared system (16:10, key content inside the
// 4:3 and 16:9 safe zone). Real material only: live client-site captures, Maven's own brand
// renders from the CMS and real code from this repo. No invented stats or claims.
// Usage: node .design-qa/blog-covers.mjs <captureDir> <mavenDir> <outDir>
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const [cap, maven, out] = process.argv.slice(2);
const f = (p) => `file://${path.join(cap, p)}`;
const m = (n) => `file://${path.join(maven, `m${n}.png`)}`;
const font = "'Plus Jakarta Sans',sans-serif";

const base = `*{box-sizing:border-box;margin:0;padding:0}
body{font-family:${font};-webkit-font-smoothing:antialiased}
.cv{position:relative;overflow:hidden;width:2400px;height:1500px}
img{display:block}
.shadow{box-shadow:0 2px 6px rgba(10,10,10,.06),0 40px 80px -30px rgba(10,10,10,.4)}
.win{background:#fff;border-radius:22px;overflow:hidden}
.bar{height:44px;display:flex;align-items:center;gap:9px;padding:0 18px;background:#f4f4f5;border-bottom:1px solid #e7e7ea}
.bar i{width:12px;height:12px;border-radius:50%;background:#d9d9de}
.phone{background:#111;border-radius:52px;padding:11px;box-shadow:0 0 0 2px #3a3a3e inset,0 50px 90px -30px rgba(0,0,0,.55)}
.phone .s{border-radius:42px;overflow:hidden;position:relative;background:#fff}
.phone .s::before{content:"";position:absolute;top:13px;left:50%;width:96px;height:28px;margin-left:-48px;border-radius:16px;background:#000;z-index:2}
`;

// Deterministic scatter so re-renders match.
let seed = 11;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

const sites = ["flyup-line", "pharmacy-on-king", "boss-medical-clinic", "king-medical-art-pharmacy"];
const desk = (s) => f(s === "king-medical-art-pharmacy" ? "king-medical-art-pharmacy-desktop.png" : `tile-${s}.jpg`);
const pin = (w, fill, dot = "#fff") => `<svg width="${w}" height="${w * 1.4}" viewBox="0 0 40 56"><path d="M20 0C9 0 0 9 0 20c0 15 20 36 20 36s20-21 20-36C40 9 31 0 20 0z" fill="${fill}"/><circle cx="20" cy="20" r="8" fill="${dot}"/></svg>`;

const covers = {
  // ── How to choose a web design agency: inspect the work closely ──
  "how-to-choose-a-web-design-agency": `<div class="cv" style="background:linear-gradient(135deg,#003b99,#0052CC 50%,#0a6cff)">
    <div style="position:absolute;inset:-200px;display:grid;grid-template-columns:repeat(5,1fr);gap:56px;padding:120px;transform:rotate(-8deg)">
      ${Array.from({ length: 20 }, (_, i) => `<div class="win" style="opacity:.55;filter:grayscale(1) contrast(.9)"><div class="bar" style="height:30px"><i></i><i></i><i></i></div><img src="${desk(sites[i % 4])}" style="width:100%;height:300px;object-fit:cover;object-position:top"></div>`).join("")}
    </div>
    <div style="position:absolute;inset:0;background:radial-gradient(900px 700px at 52% 48%,transparent 30%,rgba(0,40,120,.55))"></div>
    <div style="position:absolute;left:1140px;top:880px;width:150px;height:560px;border-radius:75px;background:linear-gradient(90deg,#0a0a0a,#2b2b2f);transform:rotate(-38deg);transform-origin:top center;box-shadow:0 40px 80px -20px rgba(0,0,0,.6)"></div>
    <div style="position:absolute;left:650px;top:250px;width:860px;height:860px;border-radius:50%;padding:30px;background:linear-gradient(145deg,#fff,#d9d9de);box-shadow:0 60px 120px -30px rgba(0,0,0,.6)">
      <div style="width:100%;height:100%;border-radius:50%;overflow:hidden;position:relative;box-shadow:inset 0 0 40px rgba(0,0,0,.35)">
        <img src="${f("pharmacy-on-king-desktop.png")}" style="position:absolute;left:30px;top:-150px;width:1400px;max-width:none">
        <div style="position:absolute;inset:0;background:radial-gradient(circle at 30% 25%,rgba(255,255,255,.35),transparent 40%)"></div>
      </div>
      <div style="position:absolute;right:40px;top:60px;width:130px;height:130px;border-radius:50%;background:#34D36A;border:10px solid #fff;display:flex;align-items:center;justify-content:center;box-shadow:0 20px 40px -10px rgba(0,0,0,.4)"><svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
    </div></div>`,

  // ── Mobile-first: the phone is the main screen now ──
  "mobile-first-website-small-businesses": `<div class="cv" style="background:#0d0d0f">
    <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.07) 2px,transparent 2px);background-size:44px 44px"></div>
    <div style="position:absolute;left:820px;top:-200px;width:1100px;height:1100px;border-radius:50%;background:rgba(0,163,255,.28);filter:blur(170px)"></div>
    <div class="phone" style="position:absolute;left:1060px;top:90px;width:600px"><div class="s" style="aspect-ratio:390/844;height:1270px;width:auto"><img src="${f("boss-medical-clinic-mobile.png")}" style="width:100%;height:100%;object-fit:cover;object-position:top"></div></div>
    <div style="position:absolute;left:1730px;top:110px;bottom:140px;width:2px;background:rgba(255,255,255,.35)"></div>
    ${[110, 1358].map((t) => `<div style="position:absolute;left:1711px;top:${t}px;width:40px;height:2px;background:rgba(255,255,255,.35)"></div>`).join("")}
    <div style="position:absolute;left:560px;top:1070px;width:430px">
      <div class="win shadow" style="border-radius:12px"><div class="bar" style="height:22px;gap:5px;padding:0 10px"><i style="width:7px;height:7px"></i><i style="width:7px;height:7px"></i><i style="width:7px;height:7px"></i></div><img src="${f("boss-medical-clinic-desktop.png")}" style="width:100%;height:240px;object-fit:cover;object-position:top"></div>
      <div style="margin:0 auto;width:90px;height:40px;background:linear-gradient(#3a3a3e,#1c1c1f)"></div><div style="margin:0 auto;width:200px;height:10px;border-radius:5px;background:#2c2c30"></div>
    </div>
    <svg style="position:absolute;left:1000px;top:1110px" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#00A3FF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20L20 4M20 4h-9M20 4v9"/></svg>
  </div>`,

  // ── Strong brand identity: the logo is only the tip ──
  "what-makes-a-strong-brand-identity": (() => {
    const tile = (src, w, h, x, y, extra = "") => `<div class="shadow" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:22px;overflow:hidden;${extra}"><img src="${src}" style="width:100%;height:100%;object-fit:cover"></div>`;
    return `<div class="cv" style="background:linear-gradient(#f4f4f5,#e6e6e9 33%,#0b2350 33.2%,#06142e 70%,#030a17)">
      <div style="position:absolute;left:0;right:0;top:494px;height:10px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent)"></div>
      <svg style="position:absolute;left:0;top:520px" width="2400" height="980">${Array.from({ length: 9 }, (_, i) => `<path d="M0 ${60 + i * 105} Q 300 ${30 + i * 105} 600 ${60 + i * 105} T 1200 ${60 + i * 105} T 1800 ${60 + i * 105} T 2400 ${60 + i * 105}" stroke="rgba(255,255,255,${0.06 - i * 0.004})" stroke-width="3" fill="none"/>`).join("")}</svg>
      <svg style="position:absolute;left:520px;top:320px" width="1360" height="1150" viewBox="0 0 1360 1150"><path d="M330 0 L1030 0 L1260 300 L1100 1080 L260 1080 L100 300 Z" fill="rgba(140,190,255,.10)" stroke="rgba(160,205,255,.35)" stroke-width="3"/></svg>
      <svg style="position:absolute;left:0;top:0" width="2400" height="500"><path d="M760 500 L1050 150 L1130 220 L1220 90 L1380 260 L1450 210 L1640 500 Z" fill="#dfe7f2"/><path d="M1220 90 L1380 260 L1300 500 L1180 500 Z" fill="#cfd9e8"/></svg>
      <div class="shadow" style="position:absolute;left:930px;top:250px;width:540px;height:320px;border-radius:26px;overflow:hidden;background:#fff"><img src="${m(5)}" style="width:100%;height:100%;object-fit:cover"></div>
      ${tile(m(1), 380, 285, 640, 640)}${tile(m(2), 420, 285, 1040, 640)}${tile(m(3), 380, 285, 1480, 640)}
      ${tile(m(0), 380, 285, 1010, 950)}${tile(m(4), 380, 285, 1410, 950)}
      <div class="shadow" style="position:absolute;left:610px;top:950px;width:380px;height:285px;border-radius:22px;background:#161616;display:flex;flex-direction:column;justify-content:space-between;padding:30px">
        <div style="display:flex;gap:16px">${["#161616", "#5a5a5e", "#d9d9dc", "#ffffff"].map((c) => `<span style="width:64px;height:64px;border-radius:50%;background:${c};box-shadow:0 0 0 2px rgba(255,255,255,.25)"></span>`).join("")}</div>
        <span style="font:300 120px/1 ${font};color:#fff;letter-spacing:-.02em">Aa</span>
      </div>
    </div>`;
  })(),

  // ── Custom development vs WordPress: a pile of plugins vs one clean build ──
  "custom-web-development-vs-wordpress": (() => {
    const plugins = ["Page builder", "Slider", "SEO", "Forms", "Cache", "Security", "Backups", "Pop-ups", "Gallery", "Analytics", "Theme", "Cookie banner"];
    seed = 23;
    const pile = plugins.map((p, i) => {
      const x = 140 + (i % 3) * 320 + rnd() * 60 - (i === 11 ? 90 : 0), y = 330 + Math.floor(i / 3) * 210 + rnd() * 60, r = (rnd() - 0.5) * 34;
      return `<div class="shadow" style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${r}deg);background:#fff;border-radius:22px;padding:30px 34px;display:flex;align-items:center;gap:16px;font:700 32px/1 ${font};color:#3a3a40"><span style="width:26px;height:26px;border-radius:8px;background:#d4d4da"></span>${p}</div>`;
    }).join("");
    seed = 5;
    const cords = Array.from({ length: 10 }, () => `<path d="M${200 + rnd() * 800} ${300 + rnd() * 900} C ${rnd() * 1100} ${rnd() * 1500}, ${rnd() * 1100} ${rnd() * 1500}, ${200 + rnd() * 800} ${300 + rnd() * 900}" stroke="#b9b9c0" stroke-width="5" fill="none" stroke-linecap="round"/>`).join("");
    return `<div class="cv" style="background:#0d0d0f">
      <div style="position:absolute;left:0;top:0;bottom:0;width:1200px;background:#e9e9ec;overflow:hidden"><svg style="position:absolute;inset:0" width="1200" height="1500">${cords}</svg>${pile}</div>
      <div style="position:absolute;right:-200px;top:-200px;width:1000px;height:1000px;border-radius:50%;background:rgba(0,163,255,.22);filter:blur(160px)"></div>
      <div class="shadow" style="position:absolute;left:1360px;top:420px;width:880px;border-radius:26px;background:#1b1b1f;color:#d7d7de;font:500 31px/1.65 ui-monospace,SFMono-Regular,Menlo,monospace;overflow:hidden;box-shadow:0 0 0 2px rgba(255,255,255,.06),0 60px 120px -40px rgba(0,0,0,.8)">
        <div class="bar" style="background:#232328;border-color:#2e2e34"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i><span style="margin-left:16px;font:600 20px/1 ui-monospace,monospace;color:#9a9aa3">project-art.ts</span></div>
        <pre style="padding:34px 40px;white-space:pre"><span style="color:#c792ea">export function</span> <span style="color:#82aaff">getProjectArt</span>(slug) {
  <span style="color:#c792ea">return</span> ART[<span style="color:#82aaff">getProjectPathSlug</span>(slug)]
    ?? FALLBACK;
}</pre>
        <div style="border-top:1px solid #2e2e34;padding:24px 40px;font-size:25px"><span style="color:#8a8a92">$ npm run build</span><br><span style="color:#34D36A">✓</span> Compiled successfully</div>
      </div>
      <div style="position:absolute;left:1110px;top:660px;width:180px;height:180px;border-radius:50%;background:#0052CC;color:#fff;display:flex;align-items:center;justify-content:center;font:800 64px/1 ${font};letter-spacing:-.04em;box-shadow:0 0 0 14px #0d0d0f,0 30px 60px -10px rgba(0,82,204,.7)">vs</div>
    </div>`;
  })(),

  // ── Professional website drives growth: visitors in, enquiries out ──
  "professional-website-business-growth": (() => {
    seed = 41;
    const dots = Array.from({ length: 70 }, () => {
      const x = 120 + rnd() * 520, y = 200 + rnd() * 1100, r = 10 + rnd() * 12;
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="#0a0a0a" fill-opacity="${0.25 + rnd() * 0.5}"/>`;
    }).join("");
    seed = 9;
    const streams = Array.from({ length: 14 }, () => { const y = 220 + rnd() * 1060; return `<path d="M640 ${y} C 820 ${y}, 760 750, 900 750" stroke="#0a0a0a" stroke-opacity=".22" stroke-width="4" fill="none"/>`; }).join("");
    const outs = [380, 600, 820, 1040].map((y) => `<path d="M1700 750 C 1820 750, 1780 ${y + 60}, 1900 ${y + 60}" stroke="#0a0a0a" stroke-opacity=".5" stroke-width="5" fill="none"/>`).join("");
    const mail = [380, 600, 820, 1040].map((y) => `<div class="shadow" style="position:absolute;left:1900px;top:${y}px;width:260px;height:120px;border-radius:26px;background:#fff;display:flex;align-items:center;gap:22px;padding:0 30px">
        <svg width="62" height="62" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="2" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>
        <span style="width:54px;height:54px;border-radius:50%;background:#34D36A;display:flex;align-items:center;justify-content:center"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span></div>`).join("");
    return `<div class="cv" style="background:radial-gradient(1200px 900px at 55% 45%,#5be08a,#34D36A 55%,#22b956)">
      <svg style="position:absolute;inset:0" width="2400" height="1500">${streams}${dots}${outs}</svg>
      <div class="win" style="position:absolute;left:900px;top:330px;width:800px;box-shadow:0 60px 120px -40px rgba(0,60,20,.6)"><div class="bar"><i></i><i></i><i></i></div><img src="${f("flyup-line-desktop.png")}" style="width:100%;height:500px;object-fit:cover;object-position:top"></div>
      ${mail}
    </div>`;
  })(),

  // ── Local SEO: one pin that stands out on the map ──
  "local-seo-getting-found-on-google": (() => {
    seed = 77;
    const blocks = Array.from({ length: 48 }, (_, i) => {
      const c = i % 8, r = Math.floor(i / 8);
      const park = i === 19 || i === 28;
      return `<div style="position:absolute;left:${c * 380 + 40}px;top:${r * 380 + 40}px;width:300px;height:300px;border-radius:26px;background:${park ? "#cdeed8" : rnd() > 0.5 ? "#dedee2" : "#e6e6e9"}"></div>`;
    }).join("");
    const pins = [[640, 600], [1720, 520], [520, 1080], [1880, 1060], [1500, 1220], [900, 360]].map(([x, y]) => `<div style="position:absolute;left:${x}px;top:${y}px;filter:drop-shadow(0 12px 14px rgba(0,0,0,.2))">${pin(56, "#a9a9b1")}</div>`).join("");
    return `<div class="cv" style="background:#f2f2f3">
      <div style="position:absolute;left:50%;top:56%;width:3040px;height:2280px;margin:-1140px 0 0 -1520px;transform:perspective(2400px) rotateX(48deg) rotateZ(-18deg);background:#fafafa">
        ${blocks}
        <svg style="position:absolute;inset:0" width="3040" height="2280"><path d="M-50 1700 C 600 1500, 900 1900, 1500 1650 S 2500 1400, 3100 1600" stroke="#bfe0ff" stroke-width="110" fill="none"/></svg>
      </div>
      <div style="position:absolute;inset:0;background:linear-gradient(#f2f2f3 0%,rgba(242,242,243,0) 26%)"></div>
      ${pins}
      ${[460, 330, 200].map((s, i) => `<div style="position:absolute;left:${1200 - s / 2}px;top:${960 - s * 0.22}px;width:${s}px;height:${s * 0.44}px;border-radius:50%;border:4px solid rgba(0,82,204,${0.15 + i * 0.15});background:rgba(0,163,255,${0.05 + i * 0.05})"></div>`).join("")}
      <div style="position:absolute;left:1080px;top:600px;filter:drop-shadow(0 30px 30px rgba(0,40,120,.35))">${pin(240, "#0052CC")}</div>
      <div class="shadow" style="position:absolute;left:50%;top:150px;transform:translateX(-50%);width:1000px;height:120px;border-radius:60px;background:#fff;display:flex;align-items:center;gap:26px;padding:0 44px;font:600 40px/1 ${font};color:#0a0a0a">
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" stroke-width="2.6" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>
        bakery near me<span style="width:3px;height:52px;background:#0052CC;margin-left:-14px"></span>
        <span style="margin-left:auto;width:64px;height:64px;border-radius:50%;background:#0052CC;display:flex;align-items:center;justify-content:center">${pin(26, "#fff", "#0052CC")}</span>
      </div>
    </div>`;
  })()
};

fs.mkdirSync(out, { recursive: true });
const only = process.argv[5];
const b = await chromium.launch();
for (const [name, html] of Object.entries(covers)) {
  if (only && name !== only) continue;
  const page = await b.newPage({ viewport: { width: 1200, height: 750 }, deviceScaleFactor: 2 });
  const file = path.join(out, `_${name}.html`);
  fs.writeFileSync(file, `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;500;600;700;800&display=swap" rel="stylesheet"><style>${base} body{zoom:.5}</style></head><body>${html}</body></html>`);
  await page.goto("file://" + file, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(out, `${name}.png`) });
  console.log("wrote", name);
  await page.close();
}
await b.close();
