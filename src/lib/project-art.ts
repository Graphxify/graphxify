/**
 * Art direction for each case study: the stage colour it is presented on and which
 * of its real renders lead. Indexes point into [cover, ...gallery] as stored in the
 * CMS, so reordering a project's gallery in the CMS changes what is shown here.
 * Keyed by public path slug; internal canonical slugs are resolved first.
 * Unknown projects fall back to a neutral charcoal stage with the cover image.
 */
import { getProjectPathSlug } from "@/lib/project-card-content";

export type ProjectArt = {
  /** Stage background, taken from the client's own brand. */
  stage: string;
  /** Text colour that reads on the stage. */
  tone: "light" | "dark";
  /** Index of the lead render. */
  hero: number;
  /** Indexes of up to two supporting renders. */
  supports: number[];
  /** One-line art-direction note, used as the stage caption for screen readers. */
  style: string;
  /**
   * Device mockups composed from screenshots of the client's LIVE site
   * (.design-qa/capture-live.mjs + mockups.mjs): [laptop + phone, three phones].
   */
  mockups?: [string, string];
};

const mockups = (slug: string): [string, string] => [`/images/mockups/${slug}-devices.webp`, `/images/mockups/${slug}-phones.webp`];

const ART: Record<string, ProjectArt> = {
  maven: { stage: "#161616", tone: "light", hero: 2, supports: [1, 4], style: "Editorial monochrome brand identity" },
  "flyup-line": { stage: "#F26B1D", tone: "dark", hero: 6, supports: [3, 4], style: "Travel brand with website and app touchpoints", mockups: mockups("flyup-line") },
  "pharmacy-on-king": { stage: "#8E1016", tone: "light", hero: 5, supports: [6, 3], style: "Community pharmacy website and print identity", mockups: mockups("pharmacy-on-king") },
  "boss-medical-clinic": { stage: "#06121F", tone: "light", hero: 1, supports: [4, 2], style: "Clinic website and signage with a calm blue glow", mockups: mockups("boss-medical-clinic") },
  "king-medical-art-pharmacy": { stage: "#0C1B33", tone: "light", hero: 0, supports: [1, 5], style: "Pharmacy website across desktop and mobile", mockups: mockups("king-medical-art-pharmacy") },
  "luka-hair-salon": { stage: "#2A211B", tone: "light", hero: 5, supports: [3, 2], style: "Luxury salon identity in black and walnut" }
};

/**
 * What each published case-study image shows, keyed by its (stable, unique) storage file name.
 * Written from the images themselves. CMS alt text (works.image_alts) takes precedence when set;
 * unknown images fall back to a generic description so nothing is ever left unlabelled.
 */
const RENDER_ALTS: Record<string, string> = {
  // Maven
  "1774297079680-7go9su7efzm": "Black Maven business cards with a layered wordmark",
  "1773703889310-r8hw03ykx2": "Black and white Maven clothing tags",
  "1773704717570-ws7wdevvw2m": "The Maven wordmark on a black storefront sign",
  "1773703236737-tfyzkjiz84n": "A white Maven shopping bag",
  "1773703122787-ldtyh2mrdu": "A black bucket hat with the Maven logo",
  "1773704960090-yn6kvanxwdq": "The Maven wordmark with the tagline “Less Noise. More Maven.”",
  "1773703099711-fq43u13r4a7": "A Maven button badge with a black and white portrait",
  // FlyUp Line
  "1772776216295-r4i00e80rd8": "The FlyUp Line logo embossed on a white card",
  "1772776373767-my5ckxeliz": "The FlyUp Line plane icon on an orange background",
  "1772776377625-44pibedfnyf": "FlyUp Line orange lanyards and a staff access card",
  "1772776381903-ac43q1cze3u": "The FlyUp Line app icon on a phone home screen",
  "1775263198884-0g6m8l8b6hd": "The FlyUp Line services section beside a passport and boarding pass",
  "1775263177100-3uonvasl3gk": "A glowing FlyUp Line 20% off offer card",
  "1772776622204-dpa2mm8kap9": "The FlyUp Line flight booking page on a laptop in a café",
  // Pharmacy On King
  "1775198098313-ronvfss6ou": "A Pharmacy On King billboard",
  "1775197451871-92n4cns96s": "The Pharmacy On King services section",
  "1775198009987-z08s765o2sd": "A Pharmacy On King staff ID badge on a red lanyard",
  "1775197999898-uj1tslu7ha": "Red Pharmacy On King business cards",
  "1775197926098-g1qkdy1ps1": "The Pharmacy On King logo on red",
  "1775197677297-bsrshxlyl3g": "The Pharmacy On King prescription submission form",
  "1775198061232-sreb4iwq33": "The Pharmacy On King prescriptions page on a phone",
  // B.O.S.S. Medical Clinic
  "1775173790965-4qwhinbgcz8": "The B.O.S.S. logo mounted on a clinic wall",
  "1775194536784-7zv27pgwbdv": "The B.O.S.S. Medical Clinic homepage on a glass screen",
  "1775177477423-mk4xbc3ms5": "The B.O.S.S. logo on an illuminated glass panel",
  "1775195116230-c2x0nq42734": "The B.O.S.S. Medical Clinic locations map page",
  "1775178072224-p03au5cghzk": "The B.O.S.S. Medical Clinic “What Makes Us Different” page on a phone",
  "1775178093745-0dg3vdbb4kns": "The B.O.S.S. Medical Clinic contact page with its appointment form",
  // King Medical Arts Pharmacy
  "1775256706042-lsqx8n1vjhr": "The King Medical Arts Pharmacy homepage on a desktop monitor",
  "1775261699606-xch2959q8y": "The King Medical Arts Pharmacy location map on a phone",
  "1775262624183-42m9914iy91": "The King Medical Arts Pharmacy About section with photos of the store",
  "1775260314823-lw0qdsr92z": "The King Medical Arts Pharmacy About page",
  "1775260206741-eqdt5xkd83v": "The King Medical Arts Pharmacy contact form",
  "1775259991432-ocpo5x44ct": "King Medical Arts Pharmacy service cards",
  "1775260141631-ho0v1aivmop": "The King Medical Arts Pharmacy contact details panel",
  // Luka Hair Salon
  "1772777254739-2ulxiui4hmj": "The Luka Hair Salon scissors emblem embossed on white",
  "1772778704906-sk1ho5i7q9g": "A Luka Hair Salon business card beside a shaving brush and straight razor",
  "1772779484901-0mtg7l3gqja": "A hanging Luka Hair Salon shop sign on a city street",
  "1772777399522-j0vauzm4eh": "Black spray bottles with the Luka Hair Salon logo",
  "1772777038972-21hzmx3u1l6i": "A Luka-branded straight razor and business card in a wooden bowl",
  "1772777365128-uj1dimrbmi8": "Luka Hair Salon logo variations on black",
  "1772777391736-j8bimyz4ctk": "A Luka Hair Salon business card with scissors and a beard oil bottle"
};

/** Lookup key for an image URL: decoded, without query string (?v= cache busters). */
export function imageKey(src: string): string {
  return decodeURIComponent(src).split("?")[0];
}

/**
 * Alt text for a project image. Order: CMS alt text for this URL, live-site mockups,
 * curated descriptions above, then a generic fallback.
 */
export function renderAlt(title: string, src: string, cmsAlts?: Record<string, string> | null): string {
  const fromCms = cmsAlts?.[imageKey(src)]?.trim();
  if (fromCms) return fromCms;
  if (src.includes("-devices.webp")) return `The ${title} website on a laptop and phone`;
  if (src.includes("-phones.webp")) return `The ${title} website on three phones`;
  const file = imageKey(src).split("/").pop()?.replace(/\.[a-z0-9]+$/i, "") ?? "";
  return RENDER_ALTS[file] ?? `${title} project image`;
}

const FALLBACK: ProjectArt = { stage: "#171717", tone: "light", hero: 0, supports: [1, 2], style: "Brand and website project" };

export function getProjectArt(slug: string): ProjectArt {
  return ART[getProjectPathSlug(slug)] ?? FALLBACK;
}

/** Resolve the art direction against a project's actual images ([cover, ...gallery]). */
export function resolveProjectRenders(slug: string, images: string[]): { art: ProjectArt; hero: string; supports: string[] } {
  const art = getProjectArt(slug);
  const pick = (index: number) => images[index] ?? images[0];
  // Live-site mockups lead when they exist; the strongest real brand render supports them.
  if (art.mockups) {
    return { art, hero: art.mockups[0], supports: [art.mockups[1], pick(art.supports[0])].filter(Boolean) };
  }
  const supports = art.supports.map(pick).filter((src, i, all) => src && src !== pick(art.hero) && all.indexOf(src) === i);
  return { art, hero: pick(art.hero), supports };
}
