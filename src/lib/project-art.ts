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
