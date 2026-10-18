# Graphxify Design System v4: "Studio"

A premium creative-agency site. Reference: reelo.framer.website (principles, not layouts): a soft light-grey canvas, white rounded cards, heavy geometric display type, black pill CTAs, small pill badges above section titles, device and brand mockups as the hero of every story, one dark section for drama, a giant marquee wordmark to close.

Graphxify's personality on top: black and charcoal as the structure, **electric blue** as the brand voice, **vibrant green** as the "live / yes / done" signal, and every client project presented in its own brand colour.

## Colour system

| Token | Hex | Role |
|---|---|---|
| `bg` | #F2F2F2 | Page canvas |
| `card` / `surface` | #FFFFFF | Cards, nav, inputs on canvas |
| `fg` (ink) | #0A0A0A | Text, primary buttons, dark sections |
| `charcoal` | #171717 | Dark cards and sections |
| `charcoal-2` | #1F1F1F | Raised elements inside dark sections |
| `accentB` (blue) | #0052CC | Brand voice on light: links, highlighted words, focus, active nav |
| `accentA` (electric) | #00A3FF | Brand voice on dark: highlights, glows, logo square. Decorative on light |
| `green` | #34D36A | "Live / yes / done": availability dot, check marks, positive chips, success. As a fill with ink text, or as text on dark only (never green text on light) |

Rules:
- Primary action = black pill. Blue pill only for the single most important action inside a dark section.
- One highlighted word per heading at most, in blue (light) or electric (dark).
- Green never decorates. It means "available", "included" or "done".
- Client brand colours (FlyUp orange, Pharmacy red, B.O.S.S. teal, King navy, Maven graphite, Luka wood) appear only inside that project's own stage.

## Typography

Plus Jakarta Sans (`--font-jakarta`), one family.

| Class | Size | Weight / tracking |
|---|---|---|
| `.t-display` | clamp(3rem, 7vw, 6.25rem), leading 0.98 | 800, -0.05em |
| `.t-h1` | clamp(2.5rem, 5.6vw, 4.75rem), leading 1 | 800, -0.045em |
| `.t-h2` | clamp(2rem, 4.2vw, 3.6rem), leading 1.05 | 700, -0.04em |
| `.t-h3` | clamp(1.25rem, 1.8vw, 1.5rem), leading 1.2 | 700, -0.02em |
| `.t-lead` | clamp(1.0625rem, 1.4vw, 1.25rem), leading 1.55 | 500, fg/64 |
| `.t-body` | 1rem, leading 1.65 | 500, fg/64 |
| `.t-small` | 0.875rem | 500, fg/60 |

Body weight is 500 (Reelo-style warmth). Headings use `text-wrap: balance`.

## Shape and depth

- Radius: inputs 14px, chips full, small cards 20px (`rounded-[1.25rem]`), cards 32px (`rounded-[2rem]`), stages and dark sections 40-48px (`rounded-[2.5rem]`).
- Cards are white on the grey canvas, no border, shadow only on hover (`shadow-lift`).
- Inside cards, images get 20-24px radius.

## Layout

- Container `.container`: max 1240px, gutter 20 / 32px.
- Section rhythm `.section`: py-20 md:py-28.
- Section intro (`SectionIntro`): `Badge` above a `.t-h2` title, optional lead, centered by default, `align="left"` for editorial sections.
- Mobile: single column below `md`; horizontal scroll rails allowed for card sets on mobile only.

## Components (`src/components/site/`)

| Component | Purpose |
|---|---|
| `Badge` | White pill with an icon or coloured dot; used above section titles and on hero |
| `SectionIntro` | Badge + title + lead, centered or left |
| `PageHero` | Inner page opener: breadcrumbs, badge, `.t-h1`, lead, actions, optional media |
| `Breadcrumbs` | Trail for deep pages |
| `ArrowLink` | Text link with arrow that nudges on hover |
| `ProjectStage` | A project presented on its own brand-colour stage with real mockups, title, tags |
| `ProjectCard` | Compact version for grids |
| `Stat` | Big number + label, used as floating chips or in rows (verified numbers only) |
| `CtaPanel` | The dark closing panel with glow, headline, actions, optional form |
| `Reveal` | Fade-up on enter, static under reduced motion |
| `FaqList` | White rounded accordion items |
| `Marquee` | CSS marquee for logos and the footer wordmark |

Buttons (`ui/button.tsx`), pills: `default` black, `secondary` white, `accent` blue, `inverse` white on dark, `ghost`, `link`.

## Imagery

- Real project renders carry the site. Each project has a stage colour and a hero render (see `src/lib/project-art.ts`).
- Generated art (see `docs/image-prompts.md`) only where real assets can't: hero composition, service illustrations, about visual, missing website mockups.
- Never text or pills over photos, except the small floating "stat chips" in the hero composition, which sit on white cards.

## Motion

- Ease `cubic-bezier(0.16, 1, 0.3, 1)`. Reveals 600ms, hovers 250ms.
- Allowed: fade-up reveals, card lift + image zoom (1.04) on hover, tilt-in hero cards on load, marquees (logos, footer wordmark), accordion, button press scale.
- Not allowed: scroll-jacking, smooth-scroll libraries, custom cursors, infinite effects other than the two marquees.
- Everything static under `prefers-reduced-motion`.

## Navigation

Floating white pill nav (max 1100px) with logo, Work, Services (menu), Process, About, Blog, and a black "Start a project" pill. Mobile: black rounded menu button opening a full-screen panel. Breadcrumbs on deep pages. Footer: black, rounded top, sitemap, contact, socials, legal, giant marquee wordmark.

## Content rules

- No em-dashes in UI copy. No invented stats, clients, quotes or results.
- Verified numbers only: case-study count (computed), 4 to 8 weeks (from /process), 24h response (existing copy).
- One badge per section intro; never stacked eyebrow + badge.
