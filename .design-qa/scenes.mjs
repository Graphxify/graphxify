// Creative section visuals composed ONLY from real material: live client-site captures,
// real client logos and brand colours, this site's own code and build output.
// Usage: node .design-qa/scenes.mjs <captureDir> <outDir> [name,name]
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const [cap, out, only] = process.argv.slice(2);
const root = path.resolve(".");
const f = (p) => `file://${path.isAbsolute(p) ? p : path.join(cap, p)}`;
const logo = (n) => `file://${root}/public/images/marquee/marquee-logo-0${n}-dark.svg`;
const lightLogo = (n) => `file://${root}/public/images/marquee/marquee-logo-0${n}-light.svg`;
const gx = `file://${root}/public/images/branding/graphxify-logo-dark.svg`;
const sites = ["flyup-line", "pharmacy-on-king", "boss-medical-clinic", "king-medical-art-pharmacy"];

const base = `*{box-sizing:border-box;margin:0;padding:0}
body{font-family:"Plus Jakarta Sans",ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
.cv{position:relative;overflow:hidden}
img{display:block}
.shadow{box-shadow:0 2px 6px rgba(10,10,10,.06),0 40px 80px -30px rgba(10,10,10,.35)}
.win{background:#fff;border-radius:22px;overflow:hidden}
.bar{height:44px;display:flex;align-items:center;gap:9px;padding:0 18px;background:#f4f4f5;border-bottom:1px solid #e7e7ea}
.bar i{width:12px;height:12px;border-radius:50%;background:#d9d9de}
.bar .url{margin-left:18px;height:24px;flex:1;max-width:380px;border-radius:12px;background:#fff;font:600 12px/24px 'Plus Jakarta Sans',sans-serif;color:#8a8a92;padding:0 12px}
.phone{background:#111;border-radius:52px;padding:11px;box-shadow:0 0 0 2px #3a3a3e inset,0 50px 90px -30px rgba(0,0,0,.55)}
.phone .s{border-radius:42px;overflow:hidden;position:relative;background:#fff}
.phone .s::before{content:"";position:absolute;top:13px;left:50%;width:96px;height:28px;margin-left:-48px;border-radius:16px;background:#000;z-index:2}
`;

const scenes = {
  // ── Home hero fan: three brand-stage compositions of live client sites ──
  "hero-center": (() => {
    const shot = f("flyup-line-desktop.png");
    // Crop from the 1000px-wide measuring grid of the 1440px capture.
    const crop = (x1, y1, x2, y2, s, r) => `<div style="width:${(x2 - x1) * s}px;height:${(y2 - y1) * s}px;border-radius:${r}px;overflow:hidden"><img src="${shot}" style="width:${1000 * s}px;max-width:none;margin:${-y1 * s}px 0 0 ${-x1 * s}px"></div>`;
    return {
      w: 2400, h: 1800,
      html: `<div class="cv" style="width:2400px;height:1800px;background:radial-gradient(1500px 1100px at 35% 30%,#ff8a3d,#F26B1D 45%,#b8470b)">
        <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.09) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,.09) 2px,transparent 2px);background-size:120px 120px;mask-image:radial-gradient(circle at 50% 45%,#000 30%,transparent 75%)"></div>
        <div style="position:absolute;left:-200px;bottom:-500px;width:1400px;height:1000px;border-radius:50%;background:rgba(10,45,49,.45);filter:blur(160px)"></div>
        <div style="position:absolute;left:180px;top:300px;width:1640px;perspective:3200px">
          <div style="transform:rotateY(14deg) rotateX(6deg);transform-origin:left center">
            <div style="background:#0d0d0f;border-radius:44px;padding:26px;box-shadow:0 80px 140px -40px rgba(60,20,0,.7)"><img src="${shot}" style="width:100%;border-radius:12px"></div>
            <div style="margin:0 -7%;height:56px;border-radius:0 0 36px 36px;background:linear-gradient(#e4e4e8,#9b9ba3);box-shadow:0 40px 60px -20px rgba(60,20,0,.6)"></div>
          </div>
        </div>
        <div class="phone" style="position:absolute;right:170px;top:520px;width:460px;transform:rotate(7deg)"><div class="s" style="aspect-ratio:390/844"><img src="${f("flyup-line-mobile.png")}" style="width:100%"></div></div>
        <div style="position:absolute;left:150px;top:140px;transform:rotate(-5deg);filter:drop-shadow(0 30px 40px rgba(60,20,0,.45))">${crop(90, 386, 292, 432, 3.2, 74)}</div>
        <div style="position:absolute;right:190px;top:150px;padding:34px 46px;border-radius:40px;background:rgba(10,45,49,.55);backdrop-filter:blur(20px);box-shadow:inset 0 0 0 2px rgba(255,255,255,.25),0 30px 60px -20px rgba(0,0,0,.4);transform:rotate(4deg)"><img src="${lightLogo(1)}" style="height:96px"></div>
        <div style="position:absolute;left:170px;bottom:120px;display:flex;align-items:center;gap:20px;padding:24px 40px 24px 30px;border-radius:999px;background:#fff;font:800 46px/1 'Plus Jakarta Sans',sans-serif;color:#0a0a0a;box-shadow:0 30px 60px -20px rgba(60,20,0,.5)"><span style="width:30px;height:30px;border-radius:50%;background:#34D36A;box-shadow:0 0 0 10px rgba(52,211,106,.25)"></span>Live · flyupline.com</div>
      </div>`
    };
  })(),
  "hero-left": {
    w: 1500, h: 2000,
    html: `<div class="cv" style="width:1500px;height:2000px;background:radial-gradient(1100px 1200px at 30% 20%,#c4242c,#8E1016 50%,#4a0509)">
      <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.12) 3px,transparent 3px);background-size:60px 60px;mask-image:linear-gradient(#000,transparent 70%)"></div>
      <div class="phone" style="position:absolute;left:120px;top:560px;width:560px;transform:rotate(-9deg)"><div class="s" style="aspect-ratio:390/844"><img src="${f("pharmacy-on-king-mobile-2.png")}" style="width:100%"></div></div>
      <div class="phone" style="position:absolute;right:110px;top:430px;width:620px;transform:rotate(6deg)"><div class="s" style="aspect-ratio:390/844"><img src="${f("pharmacy-on-king-mobile.png")}" style="width:100%"></div></div>
      <div style="position:absolute;left:50%;top:140px;transform:translateX(-50%) rotate(-3deg);padding:44px 60px;border-radius:44px;background:rgba(255,255,255,.14);backdrop-filter:blur(20px);box-shadow:inset 0 0 0 2px rgba(255,255,255,.3),0 30px 60px -20px rgba(0,0,0,.45)"><img src="${lightLogo(5)}" style="height:150px"></div>
    </div>`
  },
  "hero-right": {
    w: 1500, h: 2000,
    html: `<div class="cv" style="width:1500px;height:2000px;background:#06121F">
      <div style="position:absolute;left:50%;top:48%;width:1300px;height:1300px;margin:-650px 0 0 -650px;border-radius:50%;background:radial-gradient(circle,rgba(0,163,255,.55),rgba(0,82,204,.25) 45%,transparent 70%)"></div>
      ${[900, 1180, 1460].map((s) => `<div style="position:absolute;left:50%;top:48%;width:${s}px;height:${s}px;margin:-${s / 2}px 0 0 -${s / 2}px;border-radius:50%;border:2px solid rgba(120,200,255,.18)"></div>`).join("")}
      <div class="phone" style="position:absolute;left:50%;top:470px;width:700px;margin-left:-350px;transform:rotate(-6deg)"><div class="s" style="aspect-ratio:390/844"><img src="${f("boss-medical-clinic-mobile.png")}" style="width:100%"></div></div>
      <div style="position:absolute;left:50%;top:150px;transform:translateX(-50%) rotate(-3deg);white-space:nowrap;display:flex;align-items:center;gap:22px;padding:34px 52px 34px 40px;border-radius:999px;background:#0b2240;box-shadow:inset 0 0 0 2px rgba(120,200,255,.35),0 30px 60px -20px rgba(0,0,0,.6);font:800 60px/1 'Plus Jakarta Sans',sans-serif;color:#fff;letter-spacing:-.02em"><span style="width:28px;height:28px;border-radius:50%;background:#00A3FF;box-shadow:0 0 0 10px rgba(0,163,255,.25)"></span>B.O.S.S. Medical Clinic</div>
    </div>`
  },
  // ── Home hero: isometric wall of real work ──
  "hero-wall": {
    w: 2400, h: 1350,
    html: `<div class="cv" style="width:2400px;height:1350px;background:radial-gradient(1400px 800px at 50% 0%,#ffffff,#ececec 70%)">
      <div style="position:absolute;left:50%;top:50%;width:3600px;transform:translate(-50%,-46%) rotateX(52deg) rotateZ(-32deg);transform-style:preserve-3d;display:grid;grid-template-columns:repeat(6,1fr);gap:48px">
        ${[0, 1, 2, 3, 4, 5].map((c) => `<div style="display:flex;flex-direction:column;gap:48px;transform:translateY(${c % 2 ? -260 : 0}px)">
          ${[0, 1, 2].map((r) => {
            const s = sites[(c + r) % 4];
            return (c + r) % 3 === 1
              ? `<div class="phone shadow" style="width:300px;align-self:center"><div class="s" style="aspect-ratio:390/844"><img src="${f(`tilem-${s}.jpg`)}" style="width:100%;height:100%;object-fit:cover;object-position:top"></div></div>`
              : `<div class="win shadow"><div class="bar"><i></i><i></i><i></i></div><img src="${f(s === "king-medical-art-pharmacy" ? "king-medical-art-pharmacy-desktop.png" : `tile-${s}.jpg`)}" style="width:100%;height:760px;object-fit:cover;object-position:top"></div>`;
          }).join("")}
        </div>`).join("")}
      </div>
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse 70% 75% at 50% 50%,transparent 55%,#f2f2f2 100%)"></div>
    </div>`
  },

  // ── Brand Systems: brand board of real client logos and real brand colours ──
  "service-brand-systems": {
    w: 2400, h: 1500,
    html: `<div class="cv" style="width:2400px;height:1500px;background:#ececec;display:flex;align-items:center;justify-content:center">
      <div style="transform:rotate(-4deg);display:grid;grid-template-columns:repeat(4,400px);grid-auto-rows:260px;gap:28px">
        ${[1, 2, 3, 4].map((n, i) => `<div class="shadow" style="background:#fff;border-radius:30px;display:flex;align-items:center;justify-content:center;padding:56px"><img src="${logo(n)}" style="max-width:100%;max-height:${i === 1 ? 150 : 110}px"></div>`).join("")}
        ${[["FlyUp Line", "#F26B1D"], ["Pharmacy On King", "#8E1016"], ["King Medical Arts", "#0C1B33"], ["B.O.S.S.", "#06121F"]]
          .map(([name, hex]) => `<div class="shadow" style="border-radius:30px;background:${hex};color:#fff;padding:34px;display:flex;flex-direction:column;justify-content:space-between">
            <span style="font:700 26px/1 'Plus Jakarta Sans',sans-serif;opacity:.85">${name}</span><span style="font:800 54px/1 'Plus Jakarta Sans',sans-serif;letter-spacing:-.03em">${hex}</span></div>`).join("")}
        ${[5, 6].map((n) => `<div class="shadow" style="background:#fff;border-radius:30px;display:flex;align-items:center;justify-content:center;padding:56px"><img src="${logo(n)}" style="max-width:100%;max-height:110px"></div>`).join("")}
        <div class="shadow" style="grid-column:span 2;border-radius:30px;background:#0a0a0a;color:#fff;padding:40px 48px;display:flex;align-items:flex-end;justify-content:space-between">
          <span style="font:800 170px/.85 'Plus Jakarta Sans',sans-serif;letter-spacing:-.06em">Aa</span>
          <span style="display:flex;gap:16px"><i style="width:70px;height:70px;border-radius:50%;background:#00A3FF"></i><i style="width:70px;height:70px;border-radius:50%;background:#0052CC"></i><i style="width:70px;height:70px;border-radius:50%;background:#34D36A"></i></span>
        </div>
      </div></div>`
  },

  // ── Web Design: design-tool canvas of the real FlyUp Line page. Fonts and colours are
  // FlyUp's own (Google Fonts link on flyupline.com; colours sampled from the capture). ──
  "service-web-design": (() => {
    const shot = f("flyup-line-desktop.png");
    // Coordinates are measured on a 1000px-wide copy of the 1440px capture.
    const crop = (x1, y1, x2, y2, s, r) => `<div style="width:${(x2 - x1) * s}px;height:${(y2 - y1) * s}px;border-radius:${r}px;overflow:hidden;flex:none"><img src="${shot}" style="width:${1000 * s}px;max-width:none;margin:${-y1 * s}px 0 0 ${-x1 * s}px"></div>`;
    const k = 1.44;
    const sel = { l: 84 * k, t: 160 * k, w: 380 * k, h: 120 * k };
    const handles = [[0, 0], [50, 0], [100, 0], [0, 50], [100, 50], [0, 100], [50, 100], [100, 100]].map(([x, y]) => `<i style="position:absolute;left:${x}%;top:${y}%;width:18px;height:18px;margin:-9px 0 0 -9px;background:#fff;border:3px solid #00A3FF"></i>`).join("");
    const label = (t, extra = "") => `<p style="font:600 22px/1 'Plus Jakarta Sans',sans-serif;color:#8d8d96;margin-bottom:14px;${extra}">${t}</p>`;
    const mobile = (img, left) => `<div style="position:absolute;left:${left}px;top:186px">${label("Mobile · 390")}<div class="shadow" style="width:300px;aspect-ratio:390/844;border-radius:10px;overflow:hidden;background:#fff"><img src="${f(img)}" style="width:100%"></div></div>`;
    const sw = (c) => `<div style="text-align:center"><div style="width:70px;height:70px;border-radius:50%;background:${c};box-shadow:0 0 0 2px rgba(255,255,255,.14)"></div><p style="margin-top:12px;font:600 18px/1 'Plus Jakarta Sans',sans-serif;color:#c9c9cf">${c}</p></div>`;
    const type = (fam, css, role) => `<div style="display:flex;align-items:center;gap:22px;padding:10px 0;border-top:1px solid rgba(255,255,255,.08)"><span style="width:84px;font:${css};color:#fff;line-height:1">Aa</span><span style="font:700 26px/1 'Plus Jakarta Sans',sans-serif;color:#fff">${fam}</span><span style="margin-left:auto;font:600 20px/1 'Plus Jakarta Sans',sans-serif;color:#8d8d96">${role}</span></div>`;
    return {
      w: 2400, h: 1500,
      html: `<link href="https://fonts.googleapis.com/css2?family=Jost:wght@500&family=Rubik:wght@800&family=Satisfy&display=swap" rel="stylesheet">
      <div class="cv" style="width:2400px;height:1500px;background:#141416">
        <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.09) 2px,transparent 2px);background-size:40px 40px"></div>
        <div style="position:absolute;left:-300px;bottom:-400px;width:1100px;height:1100px;border-radius:50%;background:rgba(0,82,204,.35);filter:blur(180px)"></div>
        <div class="shadow" style="position:absolute;left:50%;top:56px;transform:translateX(-50%);display:flex;gap:10px;padding:10px;border-radius:22px;background:#232327;box-shadow:0 0 0 1px rgba(255,255,255,.08)">
          ${["M10 6l18 12-8 2-4 8z", "M8 6v28M24 6v28M2 12h28M2 28h28", "M5 7h26v26H5z", "M8 9h20M18 9v22", "M6 30C10 12 26 26 30 6"].map((d, i) => `<span style="width:64px;height:64px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:${i ? "transparent" : "#0052CC"}"><svg width="34" height="40" viewBox="0 0 36 40" fill="${i ? "none" : "#fff"}" stroke="#fff" stroke-width="3" stroke-linejoin="round">${`<path d="${d}"/>`}</svg></span>`).join("")}
        </div>
        <div style="position:absolute;left:120px;top:186px">
          ${label("Desktop · 1440")}
          <div class="shadow" style="position:relative;width:1440px;height:900px;border-radius:10px;overflow:hidden"><img src="${shot}" style="width:100%">
            <div style="position:absolute;left:${sel.l}px;top:${sel.t}px;width:${sel.w}px;height:${sel.h}px;border:3px solid #00A3FF">${handles}
              <span style="position:absolute;right:-3px;top:-46px;background:#00A3FF;color:#fff;border-radius:8px;padding:8px 12px;font:700 20px/1 'Plus Jakarta Sans',sans-serif;white-space:nowrap">Hero headline · Rubik</span>
            </div>
            <div style="position:absolute;left:${sel.l + sel.w - 30}px;top:${sel.t + sel.h + 26}px;display:flex;align-items:flex-start">
              <svg width="44" height="52" viewBox="0 0 22 26"><path d="M2 2l17 11-7.5 1.6L8 23z" fill="#0052CC" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>
              <span style="margin:40px 0 0 -6px;background:#0052CC;color:#fff;border-radius:999px;padding:10px 18px;font:700 22px/1 'Plus Jakarta Sans',sans-serif">Graphxify</span>
            </div>
          </div>
        </div>
        ${mobile("flyup-line-mobile.png", 1640)}${mobile("flyup-line-mobile-1.png", 1980)}
        <div class="shadow" style="position:absolute;left:1640px;top:900px;width:640px;padding:28px 34px;border-radius:28px;background:#232327;box-shadow:0 0 0 1px rgba(255,255,255,.08),0 40px 80px -30px rgba(0,0,0,.6)">
          <p style="font:800 28px/1 'Plus Jakarta Sans',sans-serif;color:#fff">Styles <span style="color:#8d8d96;font-weight:600">· FlyUp Line</span></p>
          ${label("Colour", "margin-top:22px")}
          <div style="display:flex;justify-content:space-between">${["#FF6100", "#FFB45C", "#0A2D31", "#F6F6F7"].map(sw).join("")}</div>
          ${label("Type", "margin-top:22px")}
          ${type("Rubik", "800 46px 'Rubik',sans-serif", "Headings")}${type("Jost", "500 44px 'Jost',sans-serif", "Body")}${type("Satisfy", "400 44px 'Satisfy',cursive", "Accent")}
        </div>
        <div style="position:absolute;left:120px;top:1150px">
          ${label("Components")}
          <div style="display:flex;align-items:center;gap:26px;padding:26px 30px;border-radius:24px;background:#232327;box-shadow:0 0 0 1px rgba(255,255,255,.08)">
            ${crop(90, 386, 292, 432, 1.7, 39)}${crop(303, 386, 450, 432, 1.7, 39)}${crop(91, 8, 192, 42, 1.7, 10)}
            <span style="margin-left:14px;border:3px dashed #00A3FF;color:#00A3FF;border-radius:12px;padding:12px 18px;font:700 22px/1 'Plus Jakarta Sans',sans-serif">Reused on every page</span>
          </div>
        </div>
      </div>`
    };
  })(),

  // ── Web Development: real site + this site's real code + its real build output ──
  "service-web-development": {
    w: 2400, h: 1500,
    html: `<div class="cv" style="width:2400px;height:1500px;background:#141414">
      <div style="position:absolute;right:-120px;top:-140px;width:900px;height:900px;border-radius:50%;background:rgba(0,163,255,.22);filter:blur(140px)"></div>
      <div class="win shadow" style="position:absolute;left:110px;top:120px;width:1500px">
        <div class="bar"><i></i><i></i><i></i><span class="url">bossmedclinic.com</span></div>
        <img src="${f("boss-medical-clinic-desktop.png")}" style="width:100%;height:880px;object-fit:cover;object-position:top">
      </div>
      <div class="shadow" style="position:absolute;right:110px;top:300px;width:1050px;border-radius:22px;background:#1e1e22;color:#d7d7de;font:500 25px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;overflow:hidden">
        <div class="bar" style="background:#26262b;border-color:#303036"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i><span style="margin-left:16px;font:600 18px/1 ui-monospace,monospace;color:#9a9aa3">project-stage.tsx</span></div>
        <pre style="padding:28px 34px;white-space:pre"><span style="color:#c792ea">export function</span> <span style="color:#82aaff">ProjectStage</span>({ project, flip }) {
  <span style="color:#c792ea">const</span> { art, hero, supports } =
    <span style="color:#82aaff">resolveProjectRenders</span>(project.slug, project.images);
  <span style="color:#c792ea">const</span> light = art.tone === <span style="color:#c3e88d">"light"</span>;
  <span style="color:#c792ea">return</span> (
    &lt;<span style="color:#f07178">Link</span> href={project.href} ...&gt;</pre>
      </div>
      <div class="shadow" style="position:absolute;left:360px;bottom:110px;width:1000px;border-radius:22px;background:#0a0a0a;color:#e6e6ea;font:500 26px/1.7 ui-monospace,SFMono-Regular,Menlo,monospace;padding:30px 36px">
        <div style="color:#8a8a92">$ npm run build</div>
        <div><span style="color:#34D36A">✓</span> Compiled successfully</div>
        <div><span style="color:#34D36A">✓</span> Generating static pages (73/73)</div>
      </div></div>`
  },

  // ── CMS Architecture: the real works editor fields (dashboard content-form.tsx) filled with
  // Maven's published values, each wired to where it renders on the live case study. ──
  "service-cms-architecture": (() => {
    const page = f("own-case-study.png");
    // Page coordinates are measured on a 900px-wide copy of the 1440px capture.
    const s = 1100 / 900;
    const at = (key, x, y) => `<i data-to="${key}" style="position:absolute;left:${x * s}px;top:${y * s}px"></i>`;
    const field = (key, name, value, h = 72) => `<div style="position:relative">
        <p style="font:700 20px/1 'Plus Jakarta Sans',sans-serif;color:#55555c;margin-bottom:10px">${name}</p>
        <div style="min-height:${h}px;border:2px solid #e4e4e8;border-radius:16px;padding:20px 22px;font:600 24px/1.35 'Plus Jakarta Sans',sans-serif;color:#0a0a0a">${value}</div>
        ${key ? `<i data-from="${key}" style="position:absolute;right:-62px;top:${30 + h / 2}px;width:24px;height:24px;margin-top:-12px;border-radius:50%;background:#0052CC;box-shadow:0 0 0 5px #fff"></i>` : ""}</div>`;
    return {
      w: 2400, h: 1500,
      html: `<div class="cv" style="width:2400px;height:1500px;background:linear-gradient(135deg,#003b99 0%,#0052CC 45%,#00A3FF 100%)">
        <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px);background-size:60px 60px"></div>
        <div style="position:absolute;right:-200px;top:-300px;width:1000px;height:1000px;border-radius:50%;background:rgba(255,255,255,.22);filter:blur(180px)"></div>
        <div style="position:absolute;left:1190px;top:120px;width:1100px;perspective:2600px">
          <div class="win" style="position:relative;transform:rotateY(-9deg);transform-origin:left center;box-shadow:0 60px 120px -40px rgba(0,20,60,.65)">
            <div class="bar"><i></i><i></i><i></i><span class="url">graphxify.com/works/maven</span></div>
            <div style="position:relative;height:1210px;overflow:hidden"><img src="${page}" style="width:100%">
              ${at("title", 343, 240)}${at("subtitle", 262, 300)}${at("industry", 180, 356)}${at("platform", 452, 356)}${at("timeline", 622, 356)}${at("cover", 120, 560)}
            </div>
          </div>
        </div>
        <div class="shadow" style="position:absolute;left:110px;top:90px;width:900px;background:#fff;border-radius:40px;padding:44px 48px;display:flex;flex-direction:column;gap:22px">
          <div style="display:flex;align-items:center;gap:16px">
            <p style="font:600 22px/1 'Plus Jakarta Sans',sans-serif;color:#8a8a92">Works /</p>
            <p style="font:800 40px/1 'Plus Jakarta Sans',sans-serif;letter-spacing:-.03em">Maven</p>
            <span style="margin-left:auto;display:flex;align-items:center;gap:10px;background:#eafaf0;color:#137a3a;border-radius:999px;padding:12px 18px;font:700 20px/1 'Plus Jakarta Sans',sans-serif"><span style="width:12px;height:12px;border-radius:50%;background:#34D36A"></span>Published</span>
            <span style="background:#0a0a0a;color:#fff;border-radius:999px;padding:14px 26px;font:700 22px/1 'Plus Jakarta Sans',sans-serif">Save</span>
          </div>
          ${field("title", "Project title", "Maven")}
          ${field("subtitle", "Project subtitle", "Maven was developed as a fashion label defined by precision, confidence, and refined minimalism.", 104)}
          ${field("industry", "Industry tag", "Fashion")}
          ${field("platform", "Platform", "Brand Identity System")}
          ${field("timeline", "Timeline", "4 Weeks")}
          <div style="position:relative">
            <p style="font:700 20px/1 'Plus Jakarta Sans',sans-serif;color:#55555c;margin-bottom:10px">Cover image</p>
            <div style="height:190px;border-radius:16px;overflow:hidden"><img src="${page}" style="width:${2880 * 0.335}px;max-width:none;margin:-560px 0 0 -80px"></div>
            <i data-from="cover" style="position:absolute;right:-62px;top:125px;width:24px;height:24px;margin-top:-12px;border-radius:50%;background:#0052CC;box-shadow:0 0 0 5px #fff"></i>
          </div>
        </div>
        <svg id="wires" viewBox="0 0 2400 1500" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible"></svg>
        <script>
          addEventListener("load", () => document.fonts.ready.then(() => {
            const cv = document.querySelector(".cv").getBoundingClientRect(), k = 2400 / cv.width;
            const c = (el) => { const r = el.getBoundingClientRect(); return [(r.left + r.width / 2 - cv.left) * k, (r.top + r.height / 2 - cv.top) * k]; };
            let svg = "";
            document.querySelectorAll("[data-from]").forEach((el) => {
              const [x1, y1] = c(el), [x2, y2] = c(document.querySelector('[data-to="' + el.dataset.from + '"]'));
              const d = "M" + x1 + " " + y1 + " C" + (x1 + 260) + " " + y1 + " " + (x2 - 320) + " " + y2 + " " + x2 + " " + y2;
              svg += '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="10" stroke-opacity=".18"/><path d="' + d + '" fill="none" stroke="#fff" stroke-width="3.5"/>'
                + '<circle cx="' + x2 + '" cy="' + y2 + '" r="17" fill="#fff"/><circle cx="' + x2 + '" cy="' + y2 + '" r="10" fill="#34D36A"/>';
            });
            document.getElementById("wires").innerHTML = svg;
          }));
        </script>
      </div>`
    };
  })(),

  // ── About: moodboard of real work ──
  "about-moodboard": {
    w: 1800, h: 2250,
    html: `<div class="cv" style="width:1800px;height:2250px;background:#0a0a0a">
      <div style="position:absolute;left:-200px;bottom:-200px;width:900px;height:900px;border-radius:50%;background:rgba(0,163,255,.25);filter:blur(160px)"></div>
      <div class="win shadow" style="position:absolute;left:120px;top:150px;width:1150px;transform:rotate(-5deg)"><div class="bar"><i></i><i></i><i></i></div><img src="${f("pharmacy-on-king-desktop.png")}" style="width:100%"></div>
      <div class="win shadow" style="position:absolute;right:90px;top:820px;width:1100px;transform:rotate(4deg)"><div class="bar"><i></i><i></i><i></i></div><img src="${f("king-medical-art-pharmacy-desktop.png")}" style="width:100%"></div>
      <div class="phone" style="position:absolute;left:210px;top:1180px;width:360px;transform:rotate(-8deg)"><div class="s" style="aspect-ratio:390/844"><img src="${f("flyup-line-mobile.png")}" style="width:100%"></div></div>
      <div class="phone" style="position:absolute;right:230px;top:130px;width:330px;transform:rotate(7deg)"><div class="s" style="aspect-ratio:390/844"><img src="${f("boss-medical-clinic-mobile.png")}" style="width:100%"></div></div>
      <div class="shadow" style="position:absolute;left:640px;bottom:150px;background:#fff;border-radius:36px;padding:44px 56px;transform:rotate(-2deg)"><img src="${gx}" style="width:420px"></div>
    </div>`
  },

  // ── Process: one visual per stage ──
  "process-discover": {
    w: 1600, h: 1200,
    html: `<div class="cv" style="width:1600px;height:1200px;background:#f2f2f2;display:flex;align-items:center;justify-content:center">
      <div style="position:absolute;inset:0;background-image:radial-gradient(#c9c9cd 2px,transparent 2px);background-size:40px 40px;opacity:.6"></div>
      <div style="position:relative;display:flex;flex-direction:column;align-items:center;gap:90px;transform:scale(1.32)">
        <div class="shadow" style="background:#0a0a0a;color:#fff;border-radius:24px;padding:26px 46px;font:800 38px/1 'Plus Jakarta Sans',sans-serif">Home</div>
        <div style="width:2px;height:44px;background:#c8c8cc;margin:-90px 0 -44px"></div>
        <div style="display:flex;gap:30px;position:relative">
          <div style="position:absolute;left:8%;right:8%;top:-46px;height:2px;background:#c8c8cc"></div>
          ${["Work", "Services", "Process", "About", "Blog", "Contact"].map((p) => `<div style="position:relative"><div style="position:absolute;left:50%;top:-46px;width:2px;height:46px;background:#c8c8cc"></div>
            <div class="shadow" style="background:#fff;border-radius:22px;padding:22px 30px;font:700 30px/1 'Plus Jakarta Sans',sans-serif">${p}</div></div>`).join("")}
        </div>
        <div style="display:flex;gap:24px">${["Brand Systems", "Web Design", "Web Development", "CMS Architecture"].map((p) => `<div style="background:#fff;border:2px dashed #0052CC;color:#0052CC;border-radius:18px;padding:16px 22px;font:700 24px/1 'Plus Jakarta Sans',sans-serif">${p}</div>`).join("")}</div>
      </div></div>`
  },
  "process-structure": {
    w: 1600, h: 1200,
    html: `<div class="cv" style="width:1600px;height:1200px;background:#0b1f4d;display:flex;align-items:center;justify-content:center">
      <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px);background-size:50px 50px"></div>
      <div class="win shadow" style="position:relative;width:1300px"><div class="bar"><i></i><i></i><i></i></div>
        <div style="position:relative;height:800px;overflow:hidden"><img src="${f("pharmacy-on-king-desktop.png")}" style="width:100%;filter:grayscale(1) contrast(.35) brightness(1.6)">
        <div style="position:absolute;inset:0;background:rgba(0,82,204,.5);mix-blend-mode:multiply"></div>
        <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.2) 1px,transparent 1px);background-size:40px 40px"></div></div></div></div>`
  },
  // Design stage: design-tool canvas of the real Pharmacy On King homepage. Fonts from its
  // Google Fonts link (Plus Jakarta Sans, Inter); colours sampled from the live capture.
  "process-design": (() => {
    const shot = f("pharmacy-on-king-desktop.png");
    // Coordinates measured on a 1000px-wide copy of the 1440px capture.
    const crop = (x1, y1, x2, y2, s, r) => `<div style="width:${(x2 - x1) * s}px;height:${(y2 - y1) * s}px;border-radius:${r}px;overflow:hidden;flex:none"><img src="${shot}" style="width:${1000 * s}px;max-width:none;margin:${-y1 * s}px 0 0 ${-x1 * s}px"></div>`;
    const handles = [[0, 0], [50, 0], [100, 0], [0, 50], [100, 50], [0, 100], [50, 100], [100, 100]].map(([x, y]) => `<i style="position:absolute;left:${x}%;top:${y}%;width:14px;height:14px;margin:-7px 0 0 -7px;background:#fff;border:3px solid #00A3FF"></i>`).join("");
    const label = (t, extra = "") => `<p style="font:600 17px/1 'Plus Jakarta Sans',sans-serif;color:#8d8d96;margin-bottom:12px;${extra}">${t}</p>`;
    const mobile = (img, left) => `<div style="position:absolute;left:${left}px;top:118px">${label("Mobile · 390")}<div class="shadow" style="width:205px;aspect-ratio:390/844;border-radius:8px;overflow:hidden;background:#fff"><img src="${f(img)}" style="width:100%"></div></div>`;
    const sw = (c) => `<div style="text-align:center"><div style="width:56px;height:56px;border-radius:50%;background:${c};box-shadow:0 0 0 2px rgba(255,255,255,.14)"></div><p style="margin-top:9px;font:600 14px/1 'Plus Jakarta Sans',sans-serif;color:#c9c9cf">${c}</p></div>`;
    const type = (fam, css, role) => `<div style="display:flex;align-items:center;gap:16px;padding:9px 0;border-top:1px solid rgba(255,255,255,.08)"><span style="width:64px;font:${css};color:#fff;line-height:1">Aa</span><span style="font:700 19px/1 'Plus Jakarta Sans',sans-serif;color:#fff">${fam}</span><span style="margin-left:auto;font:600 15px/1 'Plus Jakarta Sans',sans-serif;color:#8d8d96">${role}</span></div>`;
    return {
      w: 1600, h: 1200,
      html: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap" rel="stylesheet">
      <div class="cv" style="width:1600px;height:1200px;background:#141416">
        <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.09) 2px,transparent 2px);background-size:34px 34px"></div>
        <div style="position:absolute;right:-250px;bottom:-300px;width:900px;height:900px;border-radius:50%;background:rgba(175,29,30,.3);filter:blur(160px)"></div>
        <div style="position:absolute;left:50%;top:36px;transform:translateX(-50%);display:flex;gap:8px;padding:8px;border-radius:18px;background:#232327;box-shadow:0 0 0 1px rgba(255,255,255,.08)">
          ${["M10 6l18 12-8 2-4 8z", "M8 6v28M24 6v28M2 12h28M2 28h28", "M5 7h26v26H5z", "M8 9h20M18 9v22", "M6 30C10 12 26 26 30 6"].map((d, i) => `<span style="width:50px;height:50px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:${i ? "transparent" : "#0052CC"}"><svg width="26" height="30" viewBox="0 0 36 40" fill="${i ? "none" : "#fff"}" stroke="#fff" stroke-width="3" stroke-linejoin="round"><path d="${d}"/></svg></span>`).join("")}
        </div>
        <div style="position:absolute;left:70px;top:118px">
          ${label("Desktop · 1440")}
          <div class="shadow" style="position:relative;width:1000px;height:625px;border-radius:8px;overflow:hidden"><img src="${shot}" style="width:100%">
            <div style="position:absolute;left:86px;top:254px;width:476px;height:138px;border:3px solid #00A3FF">${handles}
              <span style="position:absolute;right:-3px;top:-38px;background:#00A3FF;color:#fff;border-radius:7px;padding:7px 10px;font:700 15px/1 'Plus Jakarta Sans',sans-serif;white-space:nowrap">Hero headline · Plus Jakarta Sans</span>
            </div>
            <div style="position:absolute;left:520px;top:412px;display:flex;align-items:flex-start">
              <svg width="34" height="40" viewBox="0 0 22 26"><path d="M2 2l17 11-7.5 1.6L8 23z" fill="#0052CC" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>
              <span style="margin:30px 0 0 -4px;background:#0052CC;color:#fff;border-radius:999px;padding:8px 14px;font:700 17px/1 'Plus Jakarta Sans',sans-serif">Graphxify</span>
            </div>
          </div>
        </div>
        ${mobile("pharmacy-on-king-mobile.png", 1110)}${mobile("pharmacy-on-king-mobile-2.png", 1340)}
        <div style="position:absolute;left:1110px;top:690px;width:435px;padding:24px 26px;border-radius:22px;background:#232327;box-shadow:0 0 0 1px rgba(255,255,255,.08),0 40px 80px -30px rgba(0,0,0,.6)">
          <p style="font:800 21px/1 'Plus Jakarta Sans',sans-serif;color:#fff">Styles <span style="color:#8d8d96;font-weight:600">· Pharmacy On King</span></p>
          ${label("Colour", "margin-top:20px")}
          <div style="display:flex;justify-content:space-between">${["#AF1D1E", "#8E1718", "#353540", "#F4F4F4"].map(sw).join("")}</div>
          ${label("Type", "margin-top:20px")}
          ${type("Plus Jakarta Sans", "800 36px 'Plus Jakarta Sans',sans-serif", "Headings")}${type("Inter", "500 34px 'Inter',sans-serif", "Body")}
        </div>
        <div style="position:absolute;left:70px;top:830px">
          ${label("Components")}
          <div style="display:flex;align-items:center;gap:20px;padding:22px 24px;border-radius:20px;background:#232327;box-shadow:0 0 0 1px rgba(255,255,255,.08)">
            ${crop(781, 28, 909, 58, 1.6, 24)}${crop(92, 210, 297, 233, 1.6, 18)}${crop(98, 24, 180, 62, 1.6, 10)}
            <span style="margin-left:6px;border:3px dashed #00A3FF;color:#00A3FF;border-radius:10px;padding:10px 14px;font:700 16px/1 'Plus Jakarta Sans',sans-serif">Reused on every page</span>
          </div>
        </div>
      </div>`
    };
  })(),
  "process-ship": {
    w: 1600, h: 1200,
    html: `<div class="cv" style="width:1600px;height:1200px;background:#0a0a0a;display:flex;align-items:center;justify-content:center;gap:50px">
      <div style="position:absolute;right:-100px;top:-100px;width:700px;height:700px;border-radius:50%;background:rgba(52,211,106,.18);filter:blur(140px)"></div>
      ${["pharmacy-on-king-mobile.png", "pharmacy-on-king-mobile-1.png", "pharmacy-on-king-mobile-2.png"].map((m, i) => `<div class="phone" style="width:330px;transform:translateY(${i === 1 ? -40 : 40}px) rotate(${(i - 1) * 6}deg)"><div class="s" style="aspect-ratio:390/844"><img src="${f(m)}" style="width:100%"></div></div>`).join("")}
      <div class="shadow" style="position:absolute;left:80px;bottom:80px;background:#fff;border-radius:999px;padding:16px 28px 16px 18px;display:flex;align-items:center;gap:14px;font:700 30px/1 'Plus Jakarta Sans',sans-serif"><span style="width:20px;height:20px;border-radius:50%;background:#34D36A"></span>Live</div>
    </div>`
  }
};

fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch();
for (const [name, sc] of Object.entries(scenes)) {
  if (only && !only.split(",").includes(name)) continue;
  const page = await b.newPage({ viewport: { width: sc.w / 2, height: sc.h / 2 }, deviceScaleFactor: 2 });
  const html = path.join(cap, `_scene-${name}.html`);
  fs.writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet"><style>${base} body{zoom:.5}</style></head><body>${sc.html}</body></html>`);
  await page.goto("file://" + html, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(out, `${name}.png`) });
  console.log("wrote", name);
  await page.close();
}
await b.close();
