export type WorkCardContent = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
};

export const featuredWorks: WorkCardContent[] = [
  {
    slug: "northline-enterprise-replatform",
    title: "Northline Enterprise Replatform",
    description:
      "Replatformed a multi-page website into a system: clearer IA, reusable components, and a structured CMS for predictable publishing.",
    tags: ["Brand System", "UX/UI", "Development", "CMS"]
  },
  {
    slug: "vertex-brand-operations",
    title: "Vertex Brand Operations",
    description:
      "Built a brand system and component kit that multiple teams could use to launch consistent pages without design drift.",
    tags: ["Brand System", "Design System", "Web Components"]
  },
  {
    slug: "axis-growth-platform",
    title: "Axis Growth Platform",
    description:
      "Designed and built a performance-first site with modular sections and CMS structure for rapid iteration.",
    tags: ["UX/UI", "Development", "CMS"]
  }
];

export type TestimonialMetric = {
  value: string;
  label: string;
};

export const testimonialMetrics: TestimonialMetric[] = [
  { value: "24h", label: "Inquiry response window" },
  { value: "4-8w", label: "Typical delivery timeline" },
  { value: "01", label: "Senior point of contact" }
];

export type TestimonialSlide = {
  id: string;
  quote: string;
  name: string;
  role: string;
  imageUrl: string;
};

export const testimonialSlides: TestimonialSlide[] = [
  {
    id: "01",
    quote: "Graphxify translated our messy brief into a clear brand and website system we can actually run.",
    name: "Operations Lead",
    role: "B2B Services Company",
    imageUrl: "/assets/work-1.svg"
  },
  {
    id: "02",
    quote: "Design and development moved in one loop, so decisions were fast and the final quality stayed high.",
    name: "Marketing Manager",
    role: "SaaS Team",
    imageUrl: "/assets/work-2.svg"
  },
  {
    id: "03",
    quote: "The CMS structure is the biggest win. Our editors ship pages without layout drift or developer bottlenecks.",
    name: "Content Director",
    role: "Growth Team",
    imageUrl: "/assets/work-3.svg"
  }
];

export type ServicePillar = {
  slug: "brand-systems" | "web-design" | "web-development" | "cms-architecture";
  title: string;
  oneLiner: string;
  deliverables: string[];
  bestFor: string;
  whatWeDeliver: string;
  timeline: string;
  leaveWith: string;
};

export const servicePillars: ServicePillar[] = [
  {
    slug: "brand-systems",
    title: "Brand Systems",
    oneLiner:
      "A cohesive brand language your team can apply consistently across every page and asset.",
    deliverables: [
      "Brand foundations (typography, color, layout rules)",
      "Design tokens for digital consistency",
      "Component rules and usage examples",
      "Figma styles + handoff documentation"
    ],
    bestFor:
      "Teams with inconsistent visuals, unclear digital rules, or a website that doesn't match brand quality.",
    whatWeDeliver:
      "Brand foundations, design tokens, type and spacing systems, component rules, and a digital-ready handoff.",
    timeline: "1-3 weeks",
    leaveWith: "A brand system your team can apply consistently in design and in code."
  },
  {
    slug: "web-design",
    title: "Web Design (UX/UI)",
    oneLiner:
      "Clear narratives and calm UI systems that feel premium - and stay usable under real content.",
    deliverables: [
      "Information architecture + page narrative",
      "Wireframes -> high-fidelity UI",
      "Component-based design system",
      "Accessibility + interaction guidelines"
    ],
    bestFor:
      "Teams that need a premium interface system and page narratives that stay clear under real content.",
    whatWeDeliver:
      "IA, page narratives, wireframes, UI system, interaction rules, accessibility guidance.",
    timeline: "2-4 weeks (often overlapping with brand work)",
    leaveWith: "A component-based UI system ready for development."
  },
  {
    slug: "web-development",
    title: "Web Development",
    oneLiner:
      "Fast, maintainable websites engineered for performance, accessibility, and long-term iteration.",
    deliverables: [
      "Next.js implementation + responsive build",
      "Performance optimization (Core Web Vitals baseline)",
      "SEO fundamentals + technical hygiene",
      "QA, deployment, and launch support"
    ],
    bestFor: "Teams that need a fast, maintainable website that can evolve without rewriting everything.",
    whatWeDeliver: "Next.js build, reusable components, performance baseline, SEO setup, QA + launch.",
    timeline: "3-6 weeks (scope dependent)",
    leaveWith: "A production site that's fast, accessible, and cleanly structured."
  },
  {
    slug: "cms-architecture",
    title: "CMS Architecture",
    oneLiner: "Structured CMS implementations that keep publishing organized as your team grows.",
    deliverables: [
      "Content modeling + reusable blocks",
      "Editorial structure (fields, constraints, validation)",
      "Migration plan (if needed)",
      "Documentation + training for editors"
    ],
    bestFor:
      "Teams publishing regularly and need structure: reusable sections, clean content models, and predictable editing.",
    whatWeDeliver:
      "Content modeling, reusable blocks, editorial constraints, migration planning, documentation + training.",
    timeline: "2-6 weeks (depending on content volume and complexity)",
    leaveWith: "A CMS your team can run without content chaos."
  }
];

export const processPhases = [
  {
    id: "01",
    title: "Discover",
    items: [
      "Audit current site/content (or define from zero)",
      "Clarify goals, audiences, and constraints",
      "Define information architecture + CMS content model"
    ]
  },
  {
    id: "02",
    title: "Design",
    items: [
      "Brand system (or refine existing)",
      "UX/UI system + reusable components",
      "Prototype key flows and page templates"
    ]
  },
  {
    id: "03",
    title: "Build + Launch",
    items: [
      "Development in Next.js with performance baseline",
      "CMS implementation + editorial training",
      "QA, accessibility checks, and launch"
    ]
  }
];

export const qualityBar = [
  "A system, not one-off screens - consistent components and rules",
  "Typography and spacing that hold up under real content",
  "Performance as a feature (fast by default, measured at launch)",
  "Accessibility built in, not bolted on",
  "CMS structure that prevents content chaos",
  "Documentation your team can actually use"
];

export const founderSection = {
  title: "Founder-led, hands-on delivery",
  body: "Graphxify is led by Daniel. You work directly with the person responsible for strategy, design quality, and build decisions - with a system-first approach across brand, UI, and CMS structure.",
  bullets: [
    "Direct senior execution - no handoff to juniors",
    "Design + development in one loop (fewer gaps, faster decisions)",
    "Clear documentation + clean handover"
  ]
};

export const homepageFaqs = [
  {
    q: "What types of projects are you best for?",
    a: "Graphxify is best for teams that need a premium brand system and a fast website - plus CMS structure so publishing stays consistent over time."
  },
  {
    q: "Can you work with our existing brand?",
    a: "Yes. We can build on an existing brand system (tightening tokens, typography, and components) or create a new system if clarity is missing."
  },
  {
    q: "What stack do you build on?",
    a: "Typically Next.js for performance and maintainability, paired with a structured CMS implementation. We'll recommend the CMS based on your editing needs and team workflow."
  },
  {
    q: "Do you do CMS migrations?",
    a: "Yes. If you're moving from an older CMS or a hardcoded site, we plan content models, map fields, and migrate content safely."
  },
  {
    q: "What's the first step?",
    a: "Send an inquiry with your goals, timeline, and links. We reply within one business day with next steps."
  }
];

export type ServiceDetailContent = {
  slug: ServicePillar["slug"];
  title: string;
  intro: string;
  whoItsFor: string[];
  deliverables: string[];
  process: string[];
  faqs: Array<{ q: string; a: string }>;
  ctaQuestion: string;
};

export const serviceDetails: ServiceDetailContent[] = [
  {
    slug: "brand-systems",
    title: "Brand Systems",
    intro:
      "Brand isn't a logo - it's a set of rules. We build brand systems that translate cleanly into digital: tokens, typography, layout rules, and component guidance so everything stays consistent.",
    whoItsFor: [
      "Teams whose website looks 'off-brand' across pages",
      "Teams scaling content and needing consistent design rules",
      "Founders refreshing brand quality before a new site build"
    ],
    deliverables: [
      "Brand foundations (type, color, spacing principles)",
      "Digital design tokens",
      "Component and layout rules",
      "Figma styles + usage notes"
    ],
    process: [
      "Audit or define the current visual language",
      "Create tokens + rules that work across real layouts",
      "Package for handoff (design + dev-ready guidance)"
    ],
    faqs: [
      { q: "Can you work with an existing logo?", a: "Yes - we often systemize what already exists." },
      { q: "Do you do naming?", a: "Not currently; we focus on digital brand systems and execution." }
    ],
    ctaQuestion: "Ready for a brand system that holds up on the web?"
  },
  {
    slug: "web-design",
    title: "Web Design (UX/UI)",
    intro: "We design calm, premium interfaces with clear page narratives - built as reusable systems, not one-off comps.",
    whoItsFor: [
      "Teams whose website feels messy or hard to scan",
      "Products that need clearer positioning and page structure",
      "Organizations that want premium UI without visual noise"
    ],
    deliverables: [
      "Information architecture + navigation model",
      "Page narratives (what each section must communicate)",
      "Wireframes -> high-fidelity UI",
      "Component-based design system",
      "Interaction + accessibility guidance"
    ],
    process: [
      "Define IA and page narratives",
      "Design reusable components and templates",
      "Validate with content and edge cases"
    ],
    faqs: [
      {
        q: "Do you write the copy?",
        a: "We can guide structure and edit, and we can partner with a copywriter when needed."
      },
      {
        q: "Can you design without development?",
        a: "Yes, but best results come when design and build are paired."
      }
    ],
    ctaQuestion: "Ready for a brand system that holds up on the web?"
  },
  {
    slug: "web-development",
    title: "Web Development",
    intro:
      "Premium design needs premium execution. We build fast, accessible websites in Next.js with clean component structure and performance as a feature.",
    whoItsFor: [
      "Teams rebuilding on a modern stack",
      "Sites that need better performance and maintainability",
      "Brands that want a clean component system in code"
    ],
    deliverables: [
      "Next.js implementation",
      "Reusable components aligned to the design system",
      "Performance baseline + Core Web Vitals hygiene",
      "SEO setup (metadata, sitemap, robots, canonicals)",
      "Analytics hooks (events + basic instrumentation)",
      "QA + launch"
    ],
    process: [
      "Set foundations (routing, layout, components, content structure)",
      "Build templates + key pages",
      "Optimize, QA, deploy"
    ],
    faqs: [
      {
        q: "Can you work with our internal dev team?",
        a: "Yes - we can build the foundation and hand off cleanly."
      },
      { q: "Do you support ongoing updates?", a: "Yes - we offer retainers for iteration and expansion." }
    ],
    ctaQuestion: "Ready for a brand system that holds up on the web?"
  },
  {
    slug: "cms-architecture",
    title: "CMS Architecture",
    intro:
      "A CMS is only scalable when the structure is. We design content models, reusable blocks, and editing rules so publishing stays clean as you grow.",
    whoItsFor: [
      "Teams publishing regularly (new pages, landing pages, blog, docs)",
      "Organizations where content structure is inconsistent",
      "Sites where editing requires dev help for small changes"
    ],
    deliverables: [
      "Content modeling (types, relationships, constraints)",
      "Reusable blocks/sections aligned to the UI system",
      "Editorial rules (validation, required fields, guardrails)",
      "Migration planning (if needed)",
      "Documentation + editor training"
    ],
    process: [
      "Model your real content (not the ideal version)",
      "Build reusable blocks with guardrails",
      "Document and train for long-term autonomy"
    ],
    faqs: [
      {
        q: "Which CMS do you use?",
        a: "We recommend based on editing needs; the architecture matters more than the vendor."
      },
      { q: "Can you migrate our existing content?", a: "Yes - we plan the model and migrate safely." }
    ],
    ctaQuestion: "Ready for a brand system that holds up on the web?"
  }
];

export type CaseStudyContent = {
  slug: string;
  title: string;
  intro: string;
  context: string;
  challenge: string[];
  whatWeDid: string[];
  cmsArchitecture: string[];
  technicalNotes: string[];
  outcome: string[];
  stack: string;
  ctaPrompt: string;
};

export const caseStudies: CaseStudyContent[] = [
  {
    slug: "northline-enterprise-replatform",
    title: "Northline Enterprise Replatform",
    intro:
      "Replatformed a multi-page website into a system: clearer IA, reusable components, and a structured CMS foundation for predictable publishing.",
    context:
      "Northline needed a website that could evolve without constant redesign. The existing site had inconsistent layouts, slow page performance, and a content setup that made simple updates feel risky.",
    challenge: [
      "Inconsistent page structure across sections",
      "Design drift from one-off page additions",
      "Slow performance and bloated front-end patterns",
      "Publishing that depended on developers for routine changes"
    ],
    whatWeDid: [
      "Rebuilt information architecture around clear page roles",
      "Designed a component-based UI system to reduce one-off layouts",
      "Implemented a performance-focused build with clean templates",
      "Created CMS structure aligned to the component system"
    ],
    cmsArchitecture: [
      "Modeled pages as structured sections (not freeform blobs)",
      "Reusable blocks with guardrails (headings, rich text, media, CTAs)",
      "SEO fields standardized per page",
      "Navigation + global content modeled once and reused"
    ],
    technicalNotes: [
      "Next.js component system aligned to design tokens",
      "Performance hygiene baked into templates (images, fonts, rendering)",
      "Clean content boundaries to keep the codebase maintainable"
    ],
    outcome: [
      "A website that stays consistent as new pages ship",
      "Faster updates through reusable sections and guardrails",
      "A CMS foundation that supports growth without content chaos"
    ],
    stack: "Next.js • TypeScript • Tailwind • Structured CMS implementation",
    ctaPrompt: "Need a replatform that turns your site into a system?"
  },
  {
    slug: "vertex-brand-operations",
    title: "Vertex Brand Operations",
    intro:
      "Built a brand system and component kit that multiple teams could use to launch consistent pages without design drift.",
    context:
      "Vertex had multiple teams producing campaign pages and updates. Over time, the brand felt inconsistent - not because of poor intent, but because the system wasn't defined tightly enough for day-to-day execution.",
    challenge: [
      "Inconsistent typography, spacing, and layout decisions",
      "Campaign pages rebuilt from scratch each time",
      "No shared component language between design and development"
    ],
    whatWeDid: [
      "Defined digital-first brand rules: typography, spacing, and layout principles",
      "Created a design token approach that translates into code cleanly",
      "Built a component kit for repeated patterns (heroes, feature blocks, CTAs, grids)",
      "Documented usage so teams could ship without second-guessing"
    ],
    cmsArchitecture: [
      "Reusable campaign sections aligned to components",
      "Structured content fields to prevent layout breakage"
    ],
    technicalNotes: [
      "Component inventory designed to scale across page types",
      "Design + dev alignment to avoid drift over time"
    ],
    outcome: [
      "Consistent output across teams without heavy policing",
      "Reusable components that speed up new page creation",
      "A brand system that actually survives real usage"
    ],
    stack: "Design tokens • Component system • Next.js implementation (where applicable)",
    ctaPrompt: "Want a brand system your team can execute consistently?"
  },
  {
    slug: "axis-growth-platform",
    title: "Axis Growth Platform",
    intro: "Designed and built a performance-first site with modular sections and CMS structure for rapid iteration.",
    context:
      "Axis needed to iterate quickly while keeping the site fast and premium. The existing setup made experiments slow and added clutter over time.",
    challenge: [
      "Slow iteration cycles for new pages and landing pages",
      "Performance regressions as the site grew",
      "No clean structure for modular page building"
    ],
    whatWeDid: [
      "Designed page templates built from reusable sections",
      "Built a clean front-end system with performance as a baseline",
      "Implemented CMS structure for modular publishing",
      "Added instrumentation hooks for measurement-ready pages"
    ],
    cmsArchitecture: [
      "Modular section model for landing pages",
      "Consistent metadata and SEO fields",
      "Clear editing boundaries to prevent broken layouts"
    ],
    technicalNotes: [
      "Next.js templates with performance hygiene",
      "Reusable components designed for iteration"
    ],
    outcome: [
      "A site that stays fast as content grows",
      "A repeatable system for building new pages",
      "A CMS setup that supports iteration without mess"
    ],
    stack: "Next.js • TypeScript • Tailwind • Structured CMS implementation",
    ctaPrompt: "Need a site built for iteration without losing quality?"
  }
];

export function findServiceDetail(slug: string): ServiceDetailContent | undefined {
  return serviceDetails.find((item) => item.slug === slug);
}

export function findCaseStudy(slug: string): CaseStudyContent | undefined {
  return caseStudies.find((item) => item.slug === slug);
}
