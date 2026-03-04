export type LayoutVariant = "A" | "B" | "C" | "D" | "E" | "F";

export type ProjectTimelineStep = {
  phase: string;
  title: string;
  body: string;
  media: string;
};

export type ProjectMetric = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  note: string;
  progress?: number;
};

export type ProjectImage = {
  src: string;
  alt: string;
  caption: string;
};

export type ProjectTestimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectChapter = {
  title: string;
  body: string;
  image: string;
  caption: string;
};

export type ProjectScopeItem = {
  label: string;
  value: string;
};

export type ProjectTabPanel = {
  heading: string;
  body: string;
  points: string[];
  images: string[];
};

export type ProjectDetail = {
  id: string;
  slug: string;
  layoutVariant: LayoutVariant;
  title: string;
  subtitle: string;
  year: number;
  industry: string;
  services: string[];
  tools: string[];
  roles: string[];
  overview: string;
  excerpt: string;
  content: string;
  coverImage: string;
  timelineSteps: ProjectTimelineStep[];
  metrics: ProjectMetric[];
  images: ProjectImage[];
  testimonial: ProjectTestimonial;
  links: ProjectLink[];
  chapters: ProjectChapter[];
  scope: ProjectScopeItem[];
  tabPanels: {
    story: ProjectTabPanel;
    designSystem: ProjectTabPanel;
    results: ProjectTabPanel;
  };
  proof: {
    problem: string;
    solution: string;
    outcome: string;
  };
};

export const graphxifyProjects: ProjectDetail[] = [
  {
    id: "gp-1",
    slug: "northline-enterprise-replatform",
    layoutVariant: "A",
    title: "FlyUp Line",
    subtitle: "A premium marketing and CMS rebuild that unified brand, speed, and publishing control.",
    year: 2025,
    industry: "Enterprise Software",
    services: ["Research", "UX Strategy", "Web Engineering", "CMS Architecture"],
    tools: ["Next.js", "Supabase", "Figma", "Vercel"],
    roles: ["Lead Product Partner", "Design Lead", "Technical Director"],
    overview:
      "Northline needed one platform that could serve sales, marketing, and content teams without sacrificing visual polish. We rebuilt the full experience from IA to publishing workflows.",
    excerpt: "Unified marketing and CMS stack with measurable conversion lift.",
    content:
      "The project replaced disconnected campaign pages with a scalable architecture where brand consistency, performance, and governance are built into every template.",
    coverImage: "/assets/work-1.svg",
    timelineSteps: [
      {
        phase: "Phase 1",
        title: "Discovery and architecture mapping",
        body: "Mapped user journeys, content dependencies, and page ownership to remove duplicate structures and reduce editorial confusion.",
        media: "/assets/work-1.svg"
      },
      {
        phase: "Phase 2",
        title: "Experience system and design language",
        body: "Built a component-driven visual system with clear hierarchy, reusable blocks, and premium black-white styling for consistency.",
        media: "/assets/work-2.svg"
      },
      {
        phase: "Phase 3",
        title: "Engineering and CMS implementation",
        body: "Implemented performant templates and role-based publishing workflows that allow marketing teams to ship safely at high velocity.",
        media: "/assets/work-3.svg"
      },
      {
        phase: "Phase 4",
        title: "Optimization and launch hardening",
        body: "Refined page speed budgets, analytics instrumentation, and QA gates for a stable launch and clean handoff.",
        media: "/assets/work-1.svg"
      }
    ],
    metrics: [
      { label: "Conversion Lift", value: 31, suffix: "%", note: "Pipeline-qualified inquiries increased", progress: 92 },
      { label: "Publish Time", value: 54, suffix: "%", note: "Faster from draft to publish", progress: 86 },
      { label: "Core Pages", value: 42, note: "Templates migrated into the system", progress: 78 },
      { label: "Performance", value: 98, note: "Lighthouse performance median", progress: 98 }
    ],
    images: [
      { src: "/assets/work-1.svg", alt: "Northline platform hero visual", caption: "Replatform hero visual language." },
      { src: "/assets/work-2.svg", alt: "Northline module system", caption: "Reusable modules for campaign pages." },
      { src: "/assets/work-3.svg", alt: "Northline editorial dashboards", caption: "Editorial controls and publishing governance." },
      { src: "/assets/work-1.svg", alt: "Northline mobile design", caption: "Mobile-first interaction checks." },
      { src: "/assets/work-2.svg", alt: "Northline content hierarchy", caption: "Structured content hierarchy patterns." },
      { src: "/assets/work-3.svg", alt: "Northline performance view", caption: "Performance-oriented engineering decisions." },
      { src: "/assets/work-1.svg", alt: "Northline component library", caption: "Component system for scalable delivery." },
      { src: "/assets/work-2.svg", alt: "Northline analytics setup", caption: "Unified analytics instrumentation." }
    ],
    testimonial: {
      quote:
        "Graphxify translated a messy web estate into a premium platform our team can actually run with confidence.",
      name: "Elena Park",
      role: "VP Marketing",
      company: "Northline"
    },
    links: [
      { label: "Start a similar project", href: "/contact" },
      { label: "View more work", href: "/works" }
    ],
    chapters: [
      {
        title: "Alignment",
        body: "We aligned leadership and editors on one navigation and one source of truth for campaign publishing.",
        image: "/assets/work-1.svg",
        caption: "Shared architecture decisions removed duplicate efforts."
      },
      {
        title: "Execution",
        body: "The new interface system created continuity across marketing pages, product proof points, and conversion touchpoints.",
        image: "/assets/work-2.svg",
        caption: "Design and engineering moved in one integrated workflow."
      },
      {
        title: "Scale",
        body: "Post-launch governance and templates now let teams ship new pages faster without breaking structure or visuals.",
        image: "/assets/work-3.svg",
        caption: "Editorial scale became operationally predictable."
      }
    ],
    scope: [
      { label: "Team", value: "6 people" },
      { label: "Timeline", value: "14 weeks" },
      { label: "Markets", value: "North America + EMEA" },
      { label: "Templates", value: "12 core templates" }
    ],
    tabPanels: {
      story: {
        heading: "From fragmentation to one premium platform",
        body: "Northline had grown quickly with disconnected campaign sites and manual publishing paths. We rebuilt the full stack and design system around clarity.",
        points: ["Consolidated IA", "Role-based CMS controls", "Consistent interaction patterns"],
        images: ["/assets/work-1.svg", "/assets/work-2.svg", "/assets/work-3.svg"]
      },
      designSystem: {
        heading: "A strict but flexible design language",
        body: "We implemented component constraints that preserve brand consistency while still enabling campaign-level creativity.",
        points: ["Unified spacing scale", "Tokenized typography", "Reusable conversion modules"],
        images: ["/assets/work-2.svg", "/assets/work-1.svg", "/assets/work-3.svg"]
      },
      results: {
        heading: "Measured outcomes after launch",
        body: "The new system reduced content bottlenecks and improved conversion performance with cleaner UX and faster load times.",
        points: ["31% conversion lift", "54% faster publishing", "High Lighthouse performance"],
        images: ["/assets/work-3.svg", "/assets/work-1.svg", "/assets/work-2.svg"]
      }
    },
    proof: {
      problem: "Disconnected properties and inconsistent UX were reducing trust and slowing publishing.",
      solution: "A full replatform centered on reusable templates, clear governance, and performance-first engineering.",
      outcome: "Higher conversion, faster execution, and a scalable publishing model."
    }
  },
  {
    id: "gp-2",
    slug: "vertex-brand-operations",
    layoutVariant: "B",
    title: "Maven",
    subtitle: "Editorial-first brand governance for global campaign teams.",
    year: 2025,
    industry: "B2B Platform",
    services: ["Brand Systems", "Editorial UX", "Web Design", "Governance"],
    tools: ["Figma", "Next.js", "Notion", "Supabase"],
    roles: ["Design Systems Partner", "Content Architect", "Frontend Lead"],
    overview:
      "Vertex needed premium consistency across distributed campaign teams. We built an editorial operating system that balances freedom with standards.",
    excerpt: "Brand governance toolkit for multi-team campaign delivery.",
    content:
      "The new ecosystem introduced chapter-based storytelling templates, clear governance, and visual rigor across all marketing outputs.",
    coverImage: "/assets/work-2.svg",
    timelineSteps: [
      {
        phase: "Phase 1",
        title: "Editorial audit",
        body: "Reviewed live pages, writing structures, and conversion friction to identify systemic quality gaps.",
        media: "/assets/work-2.svg"
      },
      {
        phase: "Phase 2",
        title: "System definitions",
        body: "Defined voice, hierarchy, spacing, and reusable storytelling blocks for consistent campaign execution.",
        media: "/assets/work-1.svg"
      },
      {
        phase: "Phase 3",
        title: "Cross-team rollout",
        body: "Implemented workflow guardrails and templates for global teams without slowing time-to-publish.",
        media: "/assets/work-3.svg"
      },
      {
        phase: "Phase 4",
        title: "Operational QA",
        body: "Established review checklists and ownership boundaries to sustain quality after launch.",
        media: "/assets/work-2.svg"
      }
    ],
    metrics: [
      { label: "Campaign Consistency", value: 89, suffix: "%", note: "Design QA pass rate", progress: 89 },
      { label: "Review Cycles", value: 37, suffix: "%", note: "Reduction in revision loops", progress: 74 },
      { label: "Editorial Speed", value: 2.4, suffix: "x", note: "Faster assembly with templates", progress: 80 },
      { label: "Regions Activated", value: 9, note: "Teams publishing in one system", progress: 68 }
    ],
    images: [
      { src: "/assets/work-2.svg", alt: "Vertex editorial hero spread", caption: "Editorial hero style for premium campaigns." },
      { src: "/assets/work-1.svg", alt: "Vertex chapter layout", caption: "Chapter-based storytelling blocks." },
      { src: "/assets/work-3.svg", alt: "Vertex governance modules", caption: "Governance modules for distributed teams." },
      { src: "/assets/work-2.svg", alt: "Vertex campaign spread", caption: "Wide campaign spread treatment." },
      { src: "/assets/work-1.svg", alt: "Vertex content progression", caption: "Narrative progression with clear pacing." },
      { src: "/assets/work-3.svg", alt: "Vertex modular cards", caption: "Flexible but constrained card modules." },
      { src: "/assets/work-2.svg", alt: "Vertex captioned imagery", caption: "Minimal captions for editorial tone." },
      { src: "/assets/work-1.svg", alt: "Vertex final outputs", caption: "Final outputs across campaign programs." }
    ],
    testimonial: {
      quote:
        "The new system finally made our content look and feel like one brand, no matter who ships the page.",
      name: "Marcus Liu",
      role: "Global Creative Director",
      company: "Vertex"
    },
    links: [
      { label: "Book a discovery call", href: "/contact" },
      { label: "Explore all case studies", href: "/works" }
    ],
    chapters: [
      {
        title: "Editorial Foundation",
        body: "We established a narrative framework so each page tells a clear story with consistent pacing and hierarchy.",
        image: "/assets/work-2.svg",
        caption: "Narrative architecture before visual styling."
      },
      {
        title: "Governance in Motion",
        body: "Templates were built with role ownership and approval checkpoints to prevent quality drift.",
        image: "/assets/work-1.svg",
        caption: "Content governance integrated directly into delivery."
      },
      {
        title: "Global Rollout",
        body: "Regional teams adopted the system quickly because modules stayed flexible while preserving premium structure.",
        image: "/assets/work-3.svg",
        caption: "Consistent output across markets and campaign types."
      }
    ],
    scope: [
      { label: "Team", value: "5 people" },
      { label: "Timeline", value: "12 weeks" },
      { label: "Campaign Types", value: "7 standardized formats" },
      { label: "Localization", value: "9 regions" }
    ],
    tabPanels: {
      story: {
        heading: "Editorial governance at scale",
        body: "Vertex lacked a shared language between creative and field marketing. We created one editorial operating model.",
        points: ["Clear chaptering", "Reusable story structures", "Predictable QA process"],
        images: ["/assets/work-2.svg", "/assets/work-1.svg", "/assets/work-3.svg"]
      },
      designSystem: {
        heading: "Luxury black-white visual discipline",
        body: "A premium black-white system with restrained accent usage gives every campaign a unified tone.",
        points: ["Typographic rhythm", "Component hierarchy", "Consistent image framing"],
        images: ["/assets/work-1.svg", "/assets/work-3.svg", "/assets/work-2.svg"]
      },
      results: {
        heading: "Operational outcomes",
        body: "Campaign teams now launch faster with fewer revisions and stronger brand consistency.",
        points: ["89% QA consistency", "37% fewer revision cycles", "2.4x faster page assembly"],
        images: ["/assets/work-3.svg", "/assets/work-2.svg", "/assets/work-1.svg"]
      }
    },
    proof: {
      problem: "Distributed teams were publishing inconsistent campaign pages with long review cycles.",
      solution: "An editorial-first brand system with governance rules and reusable chapter templates.",
      outcome: "Faster output with premium, consistent execution across every region."
    }
  },
  {
    id: "gp-3",
    slug: "axis-growth-platform",
    layoutVariant: "C",
    title: "BOSS RAAM Pharmacy",
    subtitle: "A proof-first case study platform focused on outcomes, not noise.",
    year: 2024,
    industry: "SaaS Growth",
    services: ["Web Development", "CMS", "Analytics", "Optimization"],
    tools: ["Next.js", "TypeScript", "Supabase", "Looker Studio"],
    roles: ["Full-Stack Delivery", "Analytics Lead", "UX Strategist"],
    overview:
      "Axis needed a platform where business proof appears early and clearly. We designed a structure that foregrounds metrics, outcomes, and governance.",
    excerpt: "Performance-first website and publishing model for growth teams.",
    content:
      "The platform reframed storytelling around measurable outcomes with structured proof blocks, cleaner conversion paths, and analytics-ready components.",
    coverImage: "/assets/work-3.svg",
    timelineSteps: [
      {
        phase: "Phase 1",
        title: "Data baseline and benchmark review",
        body: "Established performance benchmarks and conversion baselines before redesign decisions were made.",
        media: "/assets/work-3.svg"
      },
      {
        phase: "Phase 2",
        title: "Proof-first IA",
        body: "Reordered page structures so outcomes, testimonials, and KPI context appear before deep product narrative.",
        media: "/assets/work-1.svg"
      },
      {
        phase: "Phase 3",
        title: "Engineering and instrumentation",
        body: "Implemented robust event tracking and modular templates to support continuous optimization.",
        media: "/assets/work-2.svg"
      },
      {
        phase: "Phase 4",
        title: "Performance tuning",
        body: "Improved asset strategy and rendering paths for strong Core Web Vitals across key pages.",
        media: "/assets/work-3.svg"
      }
    ],
    metrics: [
      { label: "Pipeline Growth", value: 42, suffix: "%", note: "Qualified opportunities from web", progress: 91 },
      { label: "Time on Case Studies", value: 2.1, suffix: "x", note: "Improvement in reading depth", progress: 76 },
      { label: "LCP Improvement", value: 38, suffix: "%", note: "Median largest contentful paint", progress: 82 },
      { label: "Template Velocity", value: 3.4, suffix: "x", note: "Faster content launch cadence", progress: 88 }
    ],
    images: [
      { src: "/assets/work-3.svg", alt: "Axis proof-first hero", caption: "Outcome-first hero treatment." },
      { src: "/assets/work-1.svg", alt: "Axis split content structure", caption: "Clear split between narrative and proof." },
      { src: "/assets/work-2.svg", alt: "Axis dashboard integration", caption: "Embedded analytics awareness in UI." },
      { src: "/assets/work-3.svg", alt: "Axis module variations", caption: "Flexible module combinations for campaigns." },
      { src: "/assets/work-1.svg", alt: "Axis mobile proof cards", caption: "Mobile proof cards and KPI emphasis." },
      { src: "/assets/work-2.svg", alt: "Axis CMS structures", caption: "Structured CMS entities for scalability." },
      { src: "/assets/work-3.svg", alt: "Axis experimentation blocks", caption: "Experiment-ready content blocks." },
      { src: "/assets/work-1.svg", alt: "Axis launch outputs", caption: "Final launch outputs and conversion surfaces." }
    ],
    testimonial: {
      quote:
        "Axis finally had a website that spoke in outcomes. Sales conversations improved because proof was visible from the first screen.",
      name: "Priya Nair",
      role: "Chief Growth Officer",
      company: "Axis"
    },
    links: [
      { label: "Discuss your growth platform", href: "/contact" },
      { label: "See other projects", href: "/works" }
    ],
    chapters: [
      {
        title: "Baseline",
        body: "We aligned stakeholders around baseline metrics to remove opinion-led design decisions.",
        image: "/assets/work-3.svg",
        caption: "A shared baseline created objective design priorities."
      },
      {
        title: "Structure",
        body: "Pages were rebuilt to present business evidence early, with supporting narrative flowing beneath.",
        image: "/assets/work-1.svg",
        caption: "Proof-first flow across high-intent pages."
      },
      {
        title: "Optimization",
        body: "Instrumentation and ongoing experimentation turned the website into a reliable growth channel.",
        image: "/assets/work-2.svg",
        caption: "Continuous optimization grounded in real usage."
      }
    ],
    scope: [
      { label: "Team", value: "7 people" },
      { label: "Timeline", value: "16 weeks" },
      { label: "Tracking Events", value: "43 tracked events" },
      { label: "Templates", value: "15 conversion templates" }
    ],
    tabPanels: {
      story: {
        heading: "Proof-first storytelling",
        body: "Axis needed a website that earned trust quickly. We prioritized measurable impact over decorative narratives.",
        points: ["Business outcomes first", "Clear conversion architecture", "Data-led content decisions"],
        images: ["/assets/work-3.svg", "/assets/work-1.svg", "/assets/work-2.svg"]
      },
      designSystem: {
        heading: "Systemized for growth teams",
        body: "A practical, high-clarity system gave growth teams reusable templates without sacrificing premium presentation.",
        points: ["Modular content patterns", "Structured cards", "Analytics-aware interfaces"],
        images: ["/assets/work-1.svg", "/assets/work-2.svg", "/assets/work-3.svg"]
      },
      results: {
        heading: "Commercial impact",
        body: "The redesigned platform improved quality conversations and conversion depth.",
        points: ["42% pipeline growth", "2.1x deeper case study reading", "3.4x faster publishing velocity"],
        images: ["/assets/work-2.svg", "/assets/work-3.svg", "/assets/work-1.svg"]
      }
    },
    proof: {
      problem: "Axis pages buried proof below long narrative sections and underperformed in conversion.",
      solution: "A structured problem-solution-outcome layout with immediate metric visibility.",
      outcome: "Higher-quality pipeline and stronger performance across critical conversion journeys."
    }
  },
  {
    id: "gp-4",
    slug: "lumen-commerce-redesign",
    layoutVariant: "D",
    title: "Pharmacy On King",
    subtitle: "A design-showcase case study centered on visual credibility and conversion clarity.",
    year: 2025,
    industry: "Commerce Enablement",
    services: ["Visual Direction", "Experience Design", "Frontend Build"],
    tools: ["Figma", "Framer Motion", "Next.js", "Tailwind"],
    roles: ["Design Director", "Frontend Engineer", "UX Writer"],
    overview:
      "Lumen needed a premium redesign that looked distinctive without compromising product clarity. We led with visuals, then layered concise narrative and proof.",
    excerpt: "Design-forward redesign balancing premium visuals with conversion outcomes.",
    content:
      "The final experience uses curated visual pacing and subtle interactions to deliver trust and sophistication while preserving commercial intent.",
    coverImage: "/assets/work-1.svg",
    timelineSteps: [
      {
        phase: "Phase 1",
        title: "Visual narrative definition",
        body: "Defined the visual progression and photo treatment strategy before component work started.",
        media: "/assets/work-1.svg"
      },
      {
        phase: "Phase 2",
        title: "Gallery-led UX prototyping",
        body: "Built interaction prototypes focused on pacing, attention control, and conversion continuity.",
        media: "/assets/work-2.svg"
      },
      {
        phase: "Phase 3",
        title: "Responsive refinement",
        body: "Adjusted media choreography and hierarchy across breakpoints for polished mobile and desktop outputs.",
        media: "/assets/work-3.svg"
      },
      {
        phase: "Phase 4",
        title: "Launch tuning",
        body: "Finalized loading strategy and image behavior for premium motion with strong performance.",
        media: "/assets/work-1.svg"
      }
    ],
    metrics: [
      { label: "Engagement Lift", value: 28, suffix: "%", note: "Higher session depth", progress: 81 },
      { label: "Hero CTR", value: 33, suffix: "%", note: "Primary CTA interaction increase", progress: 83 },
      { label: "Design QA", value: 96, suffix: "%", note: "Cross-device visual consistency", progress: 96 },
      { label: "Bounce Reduction", value: 22, suffix: "%", note: "Improved landing retention", progress: 71 }
    ],
    images: [
      { src: "/assets/work-1.svg", alt: "Lumen visual hero", caption: "Hero composition with premium contrast." },
      { src: "/assets/work-2.svg", alt: "Lumen featured spread", caption: "Featured visual spread for product credibility." },
      { src: "/assets/work-3.svg", alt: "Lumen split gallery", caption: "Split gallery sequence with balanced pacing." },
      { src: "/assets/work-1.svg", alt: "Lumen detail crop", caption: "Detail-focused interface crop." },
      { src: "/assets/work-2.svg", alt: "Lumen product sections", caption: "Structured product explanation blocks." },
      { src: "/assets/work-3.svg", alt: "Lumen cards and metrics", caption: "Interleaved visual + proof composition." },
      { src: "/assets/work-1.svg", alt: "Lumen before state", caption: "Before redesign baseline." },
      { src: "/assets/work-2.svg", alt: "Lumen after state", caption: "After redesign premium output." }
    ],
    testimonial: {
      quote:
        "The redesign made our brand feel high-end without losing clarity. Stakeholders immediately saw the quality shift.",
      name: "Daria Wolfe",
      role: "Head of Marketing",
      company: "Lumen"
    },
    links: [
      { label: "Plan a redesign", href: "/contact" },
      { label: "Back to portfolio", href: "/works" }
    ],
    chapters: [
      {
        title: "Visual Direction",
        body: "Established a restrained black-white visual tone with strategic micro-accent use.",
        image: "/assets/work-1.svg",
        caption: "A premium system with disciplined restraint."
      },
      {
        title: "Interaction Detail",
        body: "Applied subtle movement and parallax to improve depth without distracting from message clarity.",
        image: "/assets/work-2.svg",
        caption: "Motion tuned for polish, not novelty."
      },
      {
        title: "Commercial Alignment",
        body: "Placed proof and conversion prompts between key visuals so storytelling supports outcomes.",
        image: "/assets/work-3.svg",
        caption: "Visual-first, still conversion-anchored."
      }
    ],
    scope: [
      { label: "Team", value: "4 people" },
      { label: "Timeline", value: "10 weeks" },
      { label: "Visual Concepts", value: "5 approved routes" },
      { label: "Launch Pages", value: "18 pages refreshed" }
    ],
    tabPanels: {
      story: {
        heading: "Visual storytelling with commercial intent",
        body: "Lumen needed a portfolio-grade visual experience that still supported high-intent users.",
        points: ["Curated gallery pacing", "Minimal narrative blocks", "Clear conversion touchpoints"],
        images: ["/assets/work-1.svg", "/assets/work-2.svg", "/assets/work-3.svg"]
      },
      designSystem: {
        heading: "Refined interaction language",
        body: "Spacing, motion, and image framing were standardized to preserve premium consistency.",
        points: ["Structured image crops", "Subtle motion depth", "Black-white premium palette"],
        images: ["/assets/work-2.svg", "/assets/work-3.svg", "/assets/work-1.svg"]
      },
      results: {
        heading: "Post-launch impact",
        body: "The redesign improved user confidence and boosted engagement through clearer visual hierarchy.",
        points: ["28% engagement lift", "33% hero CTA growth", "22% bounce reduction"],
        images: ["/assets/work-3.svg", "/assets/work-1.svg", "/assets/work-2.svg"]
      }
    },
    proof: {
      problem: "Lumen's previous site looked generic and failed to communicate premium value.",
      solution: "A design-showcase-first framework with curated media sequencing and subtle interaction depth.",
      outcome: "Higher perceived quality, stronger engagement, and improved conversion behavior."
    }
  },
  {
    id: "gp-5",
    slug: "atlas-fintech-experience-hub",
    layoutVariant: "E",
    title: "Luka Hair Salon",
    subtitle: "An interactive project experience with switchable story, system, and result views.",
    year: 2026,
    industry: "Fintech",
    services: ["Brand Systems", "Web UX", "Frontend Engineering", "Content Strategy"],
    tools: ["Next.js", "TypeScript", "Figma", "Framer Motion"],
    roles: ["Engagement Lead", "Product Designer", "Frontend Architect"],
    overview:
      "Atlas needed a high-trust project narrative for enterprise buyers. We built a tabbed, interactive case-study system that keeps complexity organized.",
    excerpt: "Interactive case-study hub with premium transitions and structured storytelling.",
    content:
      "The experience framework lets Atlas surface narrative, design rationale, and outcomes in focused views while preserving a consistent premium aesthetic.",
    coverImage: "/assets/work-2.svg",
    timelineSteps: [
      {
        phase: "Phase 1",
        title: "Narrative architecture",
        body: "Mapped audience questions to focused content lanes, reducing cognitive load on high-intent visitors.",
        media: "/assets/work-2.svg"
      },
      {
        phase: "Phase 2",
        title: "Component and motion system",
        body: "Built an intentional component set with restrained transitions for a premium but calm interaction experience.",
        media: "/assets/work-3.svg"
      },
      {
        phase: "Phase 3",
        title: "Switcher-driven IA",
        body: "Implemented a segmented content switcher to separate narrative context from design and KPI evidence.",
        media: "/assets/work-1.svg"
      },
      {
        phase: "Phase 4",
        title: "Validation and launch",
        body: "Validated with stakeholders and finalized content governance and interaction polish for rollout.",
        media: "/assets/work-2.svg"
      }
    ],
    metrics: [
      { label: "Enterprise Demos", value: 26, suffix: "%", note: "Increase from project pages", progress: 78 },
      { label: "Content Clarity Score", value: 4.7, suffix: "/5", note: "Qualitative buyer feedback", progress: 94 },
      { label: "Session Depth", value: 39, suffix: "%", note: "More sections viewed per visit", progress: 82 },
      { label: "Reuse Velocity", value: 3.1, suffix: "x", note: "Case-study template reuse speed", progress: 87 }
    ],
    images: [
      { src: "/assets/work-2.svg", alt: "Atlas fintech hero", caption: "Premium fintech hero visual." },
      { src: "/assets/work-3.svg", alt: "Atlas tabbed interface", caption: "Segmented case-study switcher." },
      { src: "/assets/work-1.svg", alt: "Atlas design system cards", caption: "Design system narratives and usage." },
      { src: "/assets/work-2.svg", alt: "Atlas results display", caption: "Results and proof storytelling." },
      { src: "/assets/work-3.svg", alt: "Atlas mobile views", caption: "Responsive interactions on mobile." },
      { src: "/assets/work-1.svg", alt: "Atlas governance model", caption: "Governance-aware content structures." },
      { src: "/assets/work-2.svg", alt: "Atlas campaign modules", caption: "Reusable campaign modules." },
      { src: "/assets/work-3.svg", alt: "Atlas launch snapshots", caption: "Launch-ready outputs." }
    ],
    testimonial: {
      quote:
        "The segmented case-study format made complex fintech work easy to understand and incredibly polished.",
      name: "Noah Bernard",
      role: "Head of Product Marketing",
      company: "Atlas"
    },
    links: [
      { label: "Build your experience hub", href: "/contact" },
      { label: "See all projects", href: "/works" }
    ],
    chapters: [
      {
        title: "Narrative Lanes",
        body: "We separated content into focused lanes so enterprise buyers can navigate by intent.",
        image: "/assets/work-2.svg",
        caption: "Story clarity through purposeful segmentation."
      },
      {
        title: "Design Transparency",
        body: "Design-system decisions were surfaced clearly, showing the strategic rationale behind visual choices.",
        image: "/assets/work-3.svg",
        caption: "Design rationale built into the project narrative."
      },
      {
        title: "Outcome Visibility",
        body: "Results and operational impact are presented without noise, helping decision-makers assess quickly.",
        image: "/assets/work-1.svg",
        caption: "Outcome communication optimized for enterprise stakeholders."
      }
    ],
    scope: [
      { label: "Team", value: "5 people" },
      { label: "Timeline", value: "11 weeks" },
      { label: "Content Lanes", value: "3 structured lanes" },
      { label: "Reusable Blocks", value: "24 content blocks" }
    ],
    tabPanels: {
      story: {
        heading: "Why the switcher architecture mattered",
        body: "Atlas audiences range from product leaders to procurement teams. The switcher gives each persona a clean route through the project story.",
        points: ["Persona-aware flow", "Lower cognitive load", "Faster access to relevant proof"],
        images: ["/assets/work-2.svg", "/assets/work-1.svg", "/assets/work-3.svg"]
      },
      designSystem: {
        heading: "Design system in production context",
        body: "We documented how components, typography, and spacing enforce brand quality across every case-study surface.",
        points: ["Token-based spacing", "Component consistency", "Deliberate micro-accent usage"],
        images: ["/assets/work-3.svg", "/assets/work-2.svg", "/assets/work-1.svg"]
      },
      results: {
        heading: "Measured impact from the new format",
        body: "The new structure improved content engagement and demo conversion from enterprise audiences.",
        points: ["26% demo growth", "39% session depth increase", "4.7/5 clarity score"],
        images: ["/assets/work-1.svg", "/assets/work-3.svg", "/assets/work-2.svg"]
      }
    },
    proof: {
      problem: "Atlas case studies mixed too many narratives into one long format, reducing clarity for decision-makers.",
      solution: "A premium segmented switcher with dedicated lanes for story, system rationale, and results.",
      outcome: "Higher engagement depth and stronger commercial conversion from enterprise buyers."
    }
  },
  {
    id: "gp-6",
    slug: "meridian-health-network-portal",
    layoutVariant: "F",
    title: "King Medical Art Pharmacy",
    subtitle: "A split-screen storytelling format for complex program communication.",
    year: 2026,
    industry: "Healthcare Network",
    services: ["Platform Strategy", "UX Architecture", "Web Engineering", "Content Governance"],
    tools: ["Next.js", "TypeScript", "Supabase", "Figma"],
    roles: ["Principal Strategist", "UX Lead", "Engineering Lead"],
    overview:
      "Meridian needed to explain a complex multi-audience portal in a way that felt premium and easy to scan. We designed a split-screen narrative with sticky context and scroll-driven storytelling.",
    excerpt: "Split-screen project narrative balancing healthcare complexity with premium clarity.",
    content:
      "The final experience keeps key project context persistent while detailed sections progress on the right, helping readers move through strategy, metrics, and implementation with confidence.",
    coverImage: "/assets/work-3.svg",
    timelineSteps: [
      {
        phase: "Phase 1",
        title: "Stakeholder and audience mapping",
        body: "Aligned medical, operations, and communications stakeholders around one portal narrative framework.",
        media: "/assets/work-3.svg"
      },
      {
        phase: "Phase 2",
        title: "Information model and routing",
        body: "Built a structured IA to support clinicians, administrators, and patients with clear role-based pathways.",
        media: "/assets/work-1.svg"
      },
      {
        phase: "Phase 3",
        title: "Implementation and governance",
        body: "Developed templates with strong governance controls so content teams can update quickly without structural drift.",
        media: "/assets/work-2.svg"
      },
      {
        phase: "Phase 4",
        title: "Validation and handoff",
        body: "Validated readability, accessibility, and editorial workflows before deployment and team onboarding.",
        media: "/assets/work-3.svg"
      }
    ],
    metrics: [
      { label: "Navigation Success", value: 88, suffix: "%", note: "Users reached intended sections", progress: 88 },
      { label: "Task Completion", value: 34, suffix: "%", note: "Increase in key task completion", progress: 79 },
      { label: "Support Deflection", value: 29, suffix: "%", note: "Fewer portal support requests", progress: 72 },
      { label: "Readability Score", value: 4.6, suffix: "/5", note: "Stakeholder readability feedback", progress: 92 }
    ],
    images: [
      { src: "/assets/work-3.svg", alt: "Meridian split-screen hero", caption: "Split-screen overview and section progression." },
      { src: "/assets/work-1.svg", alt: "Meridian section layouts", caption: "Structured section layout for complex topics." },
      { src: "/assets/work-2.svg", alt: "Meridian metrics visuals", caption: "Metric blocks for measurable outcomes." },
      { src: "/assets/work-3.svg", alt: "Meridian navigation context", caption: "Persistent context for easier comprehension." },
      { src: "/assets/work-1.svg", alt: "Meridian content hierarchy", caption: "Role-based hierarchy and routing paths." },
      { src: "/assets/work-2.svg", alt: "Meridian visual breakouts", caption: "Visual breakouts in long-form narratives." },
      { src: "/assets/work-3.svg", alt: "Meridian testimonial integration", caption: "Evidence and testimony in-line with narrative." },
      { src: "/assets/work-1.svg", alt: "Meridian final system", caption: "Final portal system outputs." }
    ],
    testimonial: {
      quote:
        "The split-screen layout made a very complex program feel understandable and premium for every stakeholder group.",
      name: "Alicia Gomez",
      role: "Program Director",
      company: "Meridian Health"
    },
    links: [
      { label: "Discuss a platform rebuild", href: "/contact" },
      { label: "Return to portfolio", href: "/works" }
    ],
    chapters: [
      {
        title: "Context",
        body: "A persistent context panel keeps project fundamentals visible while the narrative evolves.",
        image: "/assets/work-3.svg",
        caption: "Sticky context improves comprehension in long-form case studies."
      },
      {
        title: "Progression",
        body: "The right panel scroll model enables detailed exploration without losing orientation.",
        image: "/assets/work-1.svg",
        caption: "Scroll-driven progression for dense information."
      },
      {
        title: "Clarity",
        body: "Strategic breakouts and metric blocks maintain readability and confidence throughout.",
        image: "/assets/work-2.svg",
        caption: "Readable complexity with premium presentation."
      }
    ],
    scope: [
      { label: "Team", value: "8 people" },
      { label: "Timeline", value: "18 weeks" },
      { label: "Stakeholder Groups", value: "6 primary groups" },
      { label: "Accessible Templates", value: "14 templates" }
    ],
    tabPanels: {
      story: {
        heading: "Persistent context + deep narrative",
        body: "The split-screen model gives readers orientation while still allowing deep, structured project explanation.",
        points: ["Sticky context panel", "Section jump links", "Scroll-based progression"],
        images: ["/assets/work-3.svg", "/assets/work-1.svg", "/assets/work-2.svg"]
      },
      designSystem: {
        heading: "Governed healthcare UX system",
        body: "A strict visual and structural system ensures clarity across varied audiences and high-content volumes.",
        points: ["Role-based IA", "Accessible typography", "Governed content blocks"],
        images: ["/assets/work-1.svg", "/assets/work-2.svg", "/assets/work-3.svg"]
      },
      results: {
        heading: "Outcome-focused portal performance",
        body: "The redesigned portal improved navigation success and reduced support burden.",
        points: ["88% navigation success", "34% task completion lift", "29% support deflection"],
        images: ["/assets/work-2.svg", "/assets/work-3.svg", "/assets/work-1.svg"]
      }
    },
    proof: {
      problem: "Meridian's legacy portal was difficult to navigate and hard to communicate across stakeholder groups.",
      solution: "A split-screen narrative architecture with persistent context and structured scroll sections.",
      outcome: "Higher clarity, improved task completion, and reduced support friction."
    }
  }
];

export function getProjectBySlug(slug: string): ProjectDetail | null {
  return graphxifyProjects.find((project) => project.slug === slug) ?? null;
}

export function getRelatedProjects(currentSlug: string, count = 3): ProjectDetail[] {
  return graphxifyProjects.filter((project) => project.slug !== currentSlug).slice(0, count);
}
