# Graphxify v4: image generation brief

The v4 design already uses your real project renders everywhere (hero fan, project stages, case-study galleries, service cards). These prompts cover only the places where a custom visual adds something real assets can't. Generate with Codex (or any image model), save with the exact filename, and tell me: I wire each one in.

**House style (applies to every prompt):** premium studio product photography, photographed rather than illustrated, soft light-grey world (#F2F2F2) with deep ink (#0A0A0A) and charcoal (#171717) objects, exactly one electric-blue accent (#00A3FF to #0052CC) and, only where stated, one vibrant-green accent (#34D36A). Diffused softbox light, crisp but soft contact shadows, shallow depth of field, calm and precise composition, generous negative space.

**Global negative instructions (append to every prompt):** no text, no letters, no numbers, no logos, no watermarks, no brand marks, no people unless stated, no hands unless stated, no readable UI text, no stock-photo clichés, no lens flares, no neon, no purple or pink tones, no cartoon or vector-illustration look, no clutter.

All files go in `public/images/v4/`. Export WebP at quality 82 (or PNG for transparency), sRGB.

---

## 0. Section scenes (built from real material, already on the site)

Every section visual is composed from real screenshots of the live client sites, real client logos and brand colours, and this site's own code and pages. Nothing is invented. Files are in `public/images/scenes/`:

| File | Where it shows | What it is |
|---|---|---|
| `hero-center.webp`, `hero-left.webp`, `hero-right.webp` | Home hero fan (centre, left, right) | Brand-stage scenes: FlyUp Line on a 3D laptop and phone with its real CTA and logo (orange), Pharmacy On King on two phones (red), B.O.S.S. Medical Clinic on one phone (navy, blue glow) |
| `hero-wall.webp` | Not in use | Isometric wall of the four live client sites, desktop and mobile |
| `service-brand-systems.webp` | Home services bento, Services, Brand Systems | Client logo grid with their real brand colours and the Graphxify type and accents |
| `service-web-design.webp` | Same, Web Design | Design-tool canvas: FlyUp Line desktop and mobile artboards, its real colours (sampled from the live site) and fonts (Rubik, Jost, Satisfy, from its Google Fonts link), and components cropped from its real buttons and logo |
| `service-web-development.webp` | Same, Web Development | B.O.S.S. live site with real code from this repo and the real build output |
| `service-cms-architecture.webp` | Same, CMS Architecture | The real works-editor fields (`content-form.tsx`) filled with Maven's published values, each wired to where it renders on the live case study |
| `about-moodboard.webp` | About hero | Moodboard of the live client sites with the Graphxify wordmark |
| `process-discover.webp` … `process-ship.webp` | Process, one per stage | Sitemap, wireframe, final design, live site on phones (Pharmacy On King) |

Rebuild after the client sites change: capture with the scripts in section 3, then `node .design-qa/scenes.mjs <captureDir> <outDir>` and convert each PNG to WebP (quality 82) into `public/images/scenes/`.

### Optional Codex upgrades of the scenes

The built scenes are flat studio composites. For a photoreal version, attach the reference screenshots from `docs/mockup-references/<project>/` and use the shared instruction from section 3 first (screens must show the attachments exactly).

- **Home hero (`hero-wall-photoreal.webp`, 16:10, 2880 × 1800):**
  > A long, light-grey studio table seen from a high three-quarter angle, with four laptops and four smartphones laid out in a loose staggered grid, each showing one ATTACHED screenshot exactly (FlyUp Line, B.O.S.S. Medical Clinic, Pharmacy On King, King Medical Arts Pharmacy). Soft overhead softbox light, gentle contact shadows, a single electric-blue (#00A3FF) cable running between two devices as the only accent. Screens perfectly sharp, background softly falling off. [Global negatives]
- **About (`about-studio-photoreal.webp`, 4:5, 2000 × 2500):**
  > A tidy studio wall seen straight-on: printed A3 sheets of the ATTACHED client website screenshots pinned in a neat grid with small black clips, one phone on a shelf below showing the ATTACHED mobile screenshot, a charcoal notebook and a small electric-blue square card on the shelf. Soft daylight from the left, light-grey wall. [Global negatives]

Real photos of your actual workspace or deliverables beat both.

---

## 1. Services: four 3D still lifes (optional alternative to the built scenes)

The services already use the real-material scenes in section 0. Use these only if you want an abstract 3D look instead. Same camera, light and plinth across all four so they read as a set.

**Shared set-up for all four:** a single matte light-grey plinth (#E6E6E6) on an infinite light-grey sweep (#F2F2F2), camera at 25° above, 50 mm equivalent, objects centred slightly right, soft key light from top-left, faint cool fill, subtle reflection on the plinth. 16:10, 2400 × 1500 px.

### 1a. `service-brand-systems.webp`
> A precise brand-identity kit arranged on the plinth like a sculpture: a stack of thick matte-white cards of three sizes, a graphite square tile, one small electric-blue square chip resting exactly on the corner of the top card, a slim brushed-aluminium ruler and a folded swatch strip in ink, white and blue. Objects aligned to an invisible grid with exact spacing. [House style] [Shared set-up] [Negatives]

### 1b. `service-web-design.webp`
> Three floating frosted-glass panels of different sizes hovering above the plinth at gentle angles, overlapping like layered page layouts, rounded corners, edges catching the light. The front panel has a thin electric-blue edge glow. Inside the panels only soft abstract blocks suggest a layout (no readable text). Small graphite cube beneath for balance. [House style] [Shared set-up] [Negatives]

### 1c. `service-web-development.webp`
> A single sculptural block of brushed charcoal metal on the plinth, its top surface machined with fine parallel grooves forming a precise circuit-like pattern; one groove carries a thin line of electric-blue light running across the block; a tiny vibrant-green light dot glows at the end of the line like a "deployed" indicator. Engineered, fast, premium. [House style] [Shared set-up] [Negatives]

### 1d. `service-cms-architecture.webp`
> A tidy modular structure of small matte cubes and shallow open drawers stacked on the plinth in a clean grid, most cubes white, a few charcoal, one electric blue, one drawer slightly pulled out as if content is being organised. Isometric-leaning three-quarter view, everything aligned. [House style] [Shared set-up] [Negatives]

---

## 2. About: studio visual (About page, "Behind the studio")

### 2a. `about-studio-desk.webp`
> Overhead flat-lay of a designer-developer's desk on a light-grey surface: an open laptop with its screen turned slightly away (no readable content), a closed charcoal notebook, a graphite pen, a printed brand-guideline booklet open to colour swatches in ink, white and electric blue, a small stack of matte business cards, a coffee cup in matte white. Everything arranged on an invisible grid with consistent spacing. Soft daylight from the left. 4:5, 2000 × 2500 px. [House style] [Negatives]

Better still, and preferred: **a real photo of you at work** in the same light, palette and framing. A real founder photo builds more trust than any render.

---

## 3. Project mockups from the real sites

### Done: device mockups built from the live sites (already on the site)

I captured the four live client sites (desktop 1440 px and mobile 390 px, at 2x) and composed device mockups from those real screenshots on each project's brand stage. They are in use on the home hero, the work index, project cards and the case studies:

| Project | Live site | Files in `public/images/mockups/` |
|---|---|---|
| FlyUp Line | flyupline.com | `flyup-line-devices.webp`, `flyup-line-phones.webp` |
| B.O.S.S. Medical Clinic | bossmedclinic.com | `boss-medical-clinic-devices.webp`, `boss-medical-clinic-phones.webp` |
| Pharmacy On King | pharmacyonking.ca | `pharmacy-on-king-devices.webp`, `pharmacy-on-king-phones.webp` |
| King Medical Arts Pharmacy | kingmedicalartspharmacy.ca | `king-medical-art-pharmacy-devices.webp`, `king-medical-art-pharmacy-phones.webp` |

Rebuild them any time the sites change: `node .design-qa/capture-live.mjs <dir>`, `node .design-qa/capture-scroll.mjs <dir>`, `node .design-qa/capture-kma.mjs <dir>`, then `node .design-qa/mockups.mjs <dir> <out>` and convert to WebP.

### Optional upgrade: photoreal scenes with Codex

The built mockups are clean studio composites. For photoreal "in the real world" scenes, give Codex these prompts **with the reference screenshots attached** from `docs/mockup-references/<project>/` (`desktop.jpg`, `mobile.jpg`, `mobile-1.jpg`, `mobile-2.jpg`). The screens must show those screenshots exactly; Codex must not redesign them.

Shared instruction (paste first):
> Create a photorealistic product mockup. The device screens must display the ATTACHED screenshots exactly as provided: same layout, colours, text and images, perspective-corrected to the screen, with only a subtle natural glass reflection on top. Do not redesign, translate, blur, crop out the logo or invent any UI. Premium commercial photography, 35-50 mm lens look, physically accurate light and shadows, shallow depth of field on the background only, the screens perfectly sharp.

Global negatives:
> No extra text or logos in the scene, no watermarks, no people's faces, no hands unless stated, no warped or melted UI, no duplicated devices, no cartoon or 3D-illustration look, no oversaturated colours, no lens flares.

#### 3a. FlyUp Line, travel lounge (`flyup-photoreal.webp`, 3:2, 2400 × 1600)
References: `docs/mockup-references/flyup-line/desktop.jpg` (laptop), `mobile.jpg` (phone).
> A silver laptop open at three-quarter angle on a light oak table in a bright, modern airport lounge, with a black smartphone resting upright against a matte orange ceramic cup beside it. Through the floor-to-ceiling window behind, a softly out-of-focus runway at golden hour. Warm natural window light from the left, soft long shadows, subtle orange accents in the scene (#F26B1D) echoing the brand. Laptop shows desktop.jpg, phone shows mobile.jpg. Camera slightly above table height, laptop in the left two-thirds, phone in the right third.

#### 3b. B.O.S.S. Medical Clinic, calm clinic reception (`boss-photoreal.webp`, 3:2, 2400 × 1600)
References: `docs/mockup-references/boss-medical-clinic/desktop.jpg`, `mobile-1.jpg`.
> A slim aluminium desktop monitor on a clean white reception counter in a calm, modern clinic with soft blue-grey walls, a small green plant and a neat stack of appointment cards (blank). A black smartphone lies at an angle on the counter in the foreground. Cool, even daylight with a gentle blue cast (#06121F tones in the shadows). Monitor shows desktop.jpg, phone shows mobile-1.jpg. Eye-level camera, monitor centre-left, phone lower right.

#### 3c. Pharmacy On King, pharmacy counter (`pharmacy-photoreal.webp`, 3:2, 2400 × 1600)
References: `docs/mockup-references/pharmacy-on-king/desktop.jpg`, `mobile.jpg`.
> A laptop on a white pharmacy counter with softly blurred shelves of medicine in the background, a small red paper bag (blank, no print) and a prescription clipboard (blank) beside it, and a black smartphone standing in a minimal stand. Clean bright retail lighting with a subtle red accent from the bag (#8E1016). Laptop shows desktop.jpg, phone shows mobile.jpg. Three-quarter angle, slightly above counter height.

#### 3d. King Medical Arts Pharmacy, home healthcare desk (`king-photoreal.webp`, 3:2, 2400 × 1600)
References: `docs/mockup-references/king-medical-art-pharmacy/desktop.jpg`, `mobile.jpg`, `mobile-2.jpg`.
> An iMac-style display on a tidy navy-and-white home office desk, a black smartphone and a small tablet lying flat in front of it, a glass of water and a closed white pill organiser (no labels). Soft daylight from a window on the right, deep navy wall (#0C1B33) behind. Display shows desktop.jpg, phone shows mobile.jpg, tablet shows mobile-2.jpg. Straight-on, slightly elevated camera.

Save each in `public/images/mockups/` and tell me; I will add them as the lead image or into the case-study galleries.

### Projects without a live site

- **Luka Hair Salon:** the CMS lists Website Design, but there is no live URL and no website screenshot anywhere. I will not invent one. Send me the live URL (and I will capture and build the mockups exactly like the four above) or the design screenshots (desktop + mobile), then use this Codex prompt with them attached:
  > A silver laptop at three-quarter angle and a black smartphone leaning beside it, on a dark walnut surface with a matte black straight razor case and a folded black towel, warm soft spot light from top-left, deep charcoal background fading to black, subtle walnut reflections. Laptop shows the ATTACHED Luka desktop screenshot, phone shows the ATTACHED mobile screenshot, exactly as provided. 3:2, 2400 × 1600 px. Save as `luka-hair-salon-devices.webp`.
- **Maven:** brand identity only, no website in scope. Its existing brand renders (storefront, tags, packaging) already carry its stage; a website mockup would misrepresent the project.

### 3e. Process page artifacts
Done with built scenes (section 0). If you have the real deliverables (a scope page with client details blurred, the actual wireframe, a Figma prototype screenshot), send them and they replace the built stage visuals.

---

## 3f. Blog covers (built, in `docs/blog-covers/`)

One idea per post, one shared system (16:10, 2400 × 1500, key content inside the 4:3 and 16:9 safe zone). Built from real material: live client-site captures, Maven's own brand renders from the CMS and real code from this repo. Rebuild with `node .design-qa/blog-covers.mjs <captureDir> <mavenDir> <outDir> [slug]`. Upload each file as the post's cover image in the dashboard; the file name is the post slug.

---

## 4. Social share image (Open Graph)

### 4a. `og-background.webp`
> Minimal light-grey studio sweep (#F2F2F2) with, on the right third, a small composition: a stack of three matte-white cards, one graphite square tile and one small electric-blue square, soft long shadows. Left two-thirds empty for the headline I will add in code. Camera straight-on, slightly elevated. 1200 × 630 px. [House style] [Negatives]

---

## 5. Optional: higher-resolution originals

The CMS renders are 1000-2500 px wide, which is enough for the new layouts. If you have the original files (especially Maven, Luka and B.O.S.S.), re-uploading them at 2400 px wide will make the large case-study stages even crisper.

## Rules

- Never generate or "recreate" client work: client screens and branding must come from the real files.
- Regenerate anything with text, logos, hands, purple tones or a cartoon look.
- After saving, tell me which files exist and I will place them (each has a planned slot).
