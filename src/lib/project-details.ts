import { withProjectCardContent } from "@/lib/project-card-content";

export type LayoutVariant = "A" | "B" | "C" | "D" | "E" | "F";

export type ProjectImage = {
  src: string;
  alt: string;
  caption: string;
};

export type ProjectScopeItem = {
  label: string;
  value: string;
};

export type ProjectDetail = {
  id: string;
  slug: string;
  layoutVariant: LayoutVariant;
  layoutSectionTitle?: string;
  liveUrl?: string;
  title: string;
  subtitle: string;
  year: number;
  industry: string;
  services: string[];
  overview: string;
  excerpt: string;
  content: string;
  coverImage: string;
  /** Gallery images. Empty in the local fallback: real images come from the CMS. */
  images: ProjectImage[];
  scope: ProjectScopeItem[];
  proof: {
    problem: string;
    approach?: string;
    solution: string;
    outcome: string;
  };
};

/**
 * Local fallback for the six real case studies, used only when the CMS is
 * unreachable or a CMS field is empty. It holds descriptive copy only.
 *
 * Deliberately NOT here (removed 2026-09-29): metrics, testimonials, people,
 * timelines, tools and demo image captions. The previous values were leftover
 * template content (invented percentages and quotes attributed to fictional
 * people at fictional companies). Client evidence must come from the CMS and be
 * real — never add sample proof to this file.
 */
const fallbackProjects: ProjectDetail[] = [
  {
    id: "gp-1",
    slug: "northline-enterprise-replatform",
    layoutVariant: "A",
    title: "FlyUp Line",
    subtitle: "FlyUp Line required a digital presence that communicates speed, trust, and accessibility. Graphxify created a structured interface designed to simplify the booking experience while reinforcing credibility.",
    year: 2025,
    industry: "Travel and Aviation",
    services: ["Branding", "Website Design", "UX Strategy"],
    overview:
      "FlyUp Line is a travel platform focused on affordable flights and efficient service. The objective was to design a website that builds immediate trust while guiding users toward booking with minimal friction.",
    excerpt: "A brand identity and website built to simplify flight discovery and build traveller trust.",
    content:
      "Graphxify designed the brand system and interface architecture to support a smooth, intuitive travel browsing experience from first visit to search results.",
    coverImage: "/assets/work-1.svg",
    images: [],
    scope: [
      { label: "Platform", value: "Web" },
      { label: "Timeline", value: "3–4 Weeks" }
    ],
    proof: {
      problem: "Travel platforms often overwhelm users with excessive information and unclear flows. The challenge was to simplify the experience while maintaining functionality and clarity across all booking stages.",
      approach: "We focused on reducing friction through clear hierarchy and intuitive navigation. Content and interface elements were structured to guide users naturally from search to action without unnecessary distractions.",
      solution: "Graphxify developed a responsive platform with a streamlined booking flow, strong call-to-action placement, and optimized performance across devices.",
      outcome: "FlyUp Line now presents as a credible and efficient travel platform. The improved structure enhances user confidence and supports a smoother path to conversion."
    }
  },
  {
    id: "gp-2",
    slug: "vertex-brand-operations",
    layoutVariant: "B",
    title: "Maven",
    subtitle: "Maven was developed as a contemporary fashion label defined by restraint, precision, and typographic clarity. Graphxify created a complete identity system designed to translate seamlessly across apparel and digital environments while maintaining a confident and premium visual language.",
    year: 2025,
    industry: "Fashion",
    services: ["Brand Identity", "Design System"],
    overview:
      "Maven is a minimalist fashion label built around bold typography, controlled colour, and a strong editorial perspective. Graphxify was responsible for crafting the full brand identity and visual system, establishing a foundation that extends across garments, packaging, and digital touchpoints with consistency and intent.",
    excerpt: "A premium brand identity system built for a minimalist fashion label.",
    content:
      "The identity system was designed to work across apparel, packaging, digital media, and marketing materials — built on typographic control, restrained colour, and a confident visual language.",
    coverImage: "/assets/work-2.svg",
    images: [],
    scope: [
      { label: "Platform", value: "Brand Identity System" },
      { label: "Timeline", value: "4 Weeks" }
    ],
    proof: {
      problem: "The fashion space is highly saturated, where visual noise often replaces identity. Maven required a system that felt distinctive without relying on trend-driven elements, while remaining flexible enough to scale across multiple formats without losing its core aesthetic.",
      approach: "We anchored the identity in typography as the primary expression of the brand. Every visual decision was derived from this foundation, with a restrained colour palette and structured compositions used to maintain clarity, hierarchy, and control across all applications.",
      solution: "Graphxify delivered a complete identity system including primary and secondary logotypes, typographic lockups, colour palette, and comprehensive usage guidelines. The system was built to perform consistently across apparel, packaging, and digital media at any scale.",
      outcome: "Maven launched with a visual identity that reads as established and intentional. The system provides long-term flexibility while maintaining a distinct point of view, allowing the brand to expand without compromising its core aesthetic."
    }
  },
  {
    id: "gp-3",
    slug: "axis-growth-platform",
    layoutVariant: "C",
    title: "B.O.S.S. Medical Clinic",
    subtitle: "B.O.S.S. Medical Clinic required a digital identity that communicates authority while remaining approachable. Graphxify developed a visual system focused on clarity and credibility.",
    year: 2024,
    industry: "Healthcare / Medical Clinic",
    services: ["Website Design", "Branding"],
    overview:
      "B.O.S.S. Medical Clinic offers a range of medical services and needed a platform that reflects professionalism while presenting information in a structured and accessible way for patients.",
    excerpt: "A modern, trustworthy website built for a medical clinic.",
    content:
      "The structure focused on making services, contact information, and pharmacy details easy to find, communicating professionalism and accessibility throughout.",
    coverImage: "/assets/work-3.svg",
    images: [],
    scope: [
      { label: "Platform", value: "Web" },
      { label: "Timeline", value: "3–4 Weeks" }
    ],
    proof: {
      problem: "The primary challenge was balancing credibility with usability — avoiding overly complex layouts while maintaining a strong professional presence that builds patient trust.",
      approach: "We focused on hierarchy and clarity, ensuring users can quickly understand the services available and navigate without confusion, supported by a clean and authoritative visual language.",
      solution: "Graphxify delivered a responsive website with a service-driven layout, clear content structure, and an optimized user experience that communicates competence at every touchpoint.",
      outcome: "The clinic now has a digital presence that strengthens trust and improves patient engagement, presenting as a credible and approachable medical provider."
    }
  },
  {
    id: "gp-4",
    slug: "lumen-commerce-redesign",
    layoutVariant: "D",
    title: "Pharmacy On King",
    subtitle: "Pharmacy on King required a digital presence that reflects professionalism, clarity, and trust. Graphxify developed a structured and accessible interface aligned with modern healthcare expectations.",
    year: 2024,
    industry: "Healthcare / Pharmacy",
    services: ["Website Design", "UI/UX"],
    overview:
      "Pharmacy on King is a community-focused pharmacy offering essential healthcare services. The objective was to design a website that communicates reliability while making information easily accessible.",
    excerpt: "A clean, community-focused website built for a trusted downtown pharmacy.",
    content:
      "The design focused on accessibility, clarity, and trust, helping visitors find services, location details, and contact information without friction.",
    coverImage: "/assets/work-1.svg",
    images: [],
    scope: [
      { label: "Platform", value: "Web" },
      { label: "Timeline", value: "2–3 Weeks" }
    ],
    proof: {
      problem: "Healthcare websites often suffer from cluttered layouts and unclear navigation. The challenge was to simplify the experience while ensuring all critical information remains accessible.",
      approach: "We prioritized structure and readability, organizing content into clear sections supported by consistent typography and spacing.",
      solution: "Graphxify created a responsive website with intuitive navigation, clear service presentation, and optimized usability.",
      outcome: "The platform reinforces trust and improves accessibility, allowing users to navigate and engage with ease."
    }
  },
  {
    id: "gp-5",
    slug: "atlas-fintech-experience-hub",
    layoutVariant: "E",
    title: "Luka Hair Salon",
    subtitle: "Luka Hair Salon required a digital identity that reflects style, precision, and modern aesthetics. Graphxify developed a visual direction that balances elegance with clarity.",
    year: 2023,
    industry: "Beauty / Hair Salon",
    services: ["Website Design", "Branding"],
    overview:
      "Luka Hair Salon offers professional hair services and needed a website that communicates quality while attracting new clients through a strong visual presence.",
    excerpt: "A clean visual identity and website built to reflect a premium salon experience.",
    content:
      "The design focused on simplicity, clarity, and a modern beauty aesthetic, creating an identity and site that communicates elegance and professionalism from the first impression.",
    coverImage: "/assets/work-2.svg",
    images: [],
    scope: [
      { label: "Platform", value: "Web" },
      { label: "Timeline", value: "2–3 Weeks" }
    ],
    proof: {
      problem: "Salon websites often rely heavily on visuals but lack structure. The challenge was to maintain a strong aesthetic while ensuring usability and clear navigation.",
      approach: "We combined visual simplicity with structured layouts, allowing imagery and content to work together without overwhelming the user.",
      solution: "Graphxify designed a responsive website with clear service sections, strong visual hierarchy, and optimized booking pathways.",
      outcome: "The salon now presents a polished and modern brand image, improving client perception and engagement."
    }
  },
  {
    id: "gp-6",
    slug: "meridian-health-network-portal",
    layoutVariant: "F",
    title: "King Medical Arts Pharmacy",
    subtitle: "King Medical Arts Pharmacy required a refined and accessible digital presence. Graphxify developed a structured interface that prioritizes clarity and reliability.",
    year: 2023,
    industry: "Healthcare / Pharmacy",
    services: ["Website Design", "UI/UX"],
    overview:
      "The pharmacy provides essential healthcare services and needed a website that improves accessibility while maintaining a professional tone.",
    excerpt: "A professional website built to present pharmacy services with clarity and confidence.",
    content:
      "The project focused on building a clean structure that helps visitors quickly access services, contact details, and pharmacy information, aligned with the professional medical arts environment.",
    coverImage: "/assets/work-3.svg",
    images: [],
    scope: [
      { label: "Platform", value: "Web" },
      { label: "Timeline", value: "2–3 Weeks" }
    ],
    proof: {
      problem: "The previous experience lacked structure, making it difficult for users to access key information efficiently.",
      approach: "We simplified the user journey through structured layouts, consistent spacing, and clear typographic hierarchy.",
      solution: "Graphxify created a responsive website with streamlined navigation and improved usability across all devices.",
      outcome: "The updated platform enhances accessibility and reinforces the pharmacy's credibility."
    }
  }
];

/**
 * Name, industry, confirmed year and confirmed services always come from the
 * single confirmed-facts registry (lib/project-card-content.ts), so this
 * fallback cannot drift from what the CMS-backed pages render.
 */
export const graphxifyProjects: ProjectDetail[] = fallbackProjects.map((project) => withProjectCardContent(project));

export function getProjectBySlug(slug: string): ProjectDetail | null {
  return graphxifyProjects.find((project) => project.slug === slug) ?? null;
}

