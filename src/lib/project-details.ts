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
  layoutSectionTitle?: string;
  liveUrl?: string;
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
    approach?: string;
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
    subtitle: "A complete brand identity and website built to simplify flight discovery for Canadian travellers.",
    year: 2025,
    industry: "Travel Platform",
    services: ["Brand Identity", "Web Design", "Web Development"],
    tools: ["Next.js", "Figma", "Vercel"],
    roles: ["Brand Designer", "Web Designer", "Frontend Developer"],
    overview:
      "FlyUp Line is a Canadian travel platform built around one goal: helping users find affordable flights quickly, without friction. Graphxify was brought in to create the full brand identity and website from the ground up, building a digital presence that communicates clarity, speed, and reliability from the first interaction.",
    excerpt: "A brand identity and website built to simplify flight discovery and build traveller trust.",
    content:
      "Graphxify designed the brand system and interface architecture to support a smooth, intuitive travel browsing experience from first visit to search results.",
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
      { label: "Platform", value: "Modern Web Platform" },
      { label: "Timeline", value: "6 Weeks" },
      { label: "Location", value: "Canada" }
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
      problem: "The travel booking space is crowded and most platforms overwhelm users with feature density before they even begin searching. FlyUp Line needed an identity and interface that stood apart through simplicity, built to feel fast, trustworthy, and easy to navigate for every type of traveller.",
      approach: "We established the core brand positioning around accessible travel, made simple. The visual identity was built around motion, clarity, and a modern digital aesthetic, with the interface focused on getting users to results with minimal friction at every step.",
      solution: "Graphxify delivered a complete brand identity system including logo, colour palette, and typography direction built for digital environments. The website was designed with a clean, structured layout that guides users intuitively from landing to search results, with visual hierarchy keeping focus on the core action throughout.",
      outcome: "FlyUp Line launched with a cohesive brand presence and a website built to convert. The platform communicates professionalism and ease of use immediately, positioning FlyUp Line competitively in the Canadian travel market with a strong foundation for long-term growth."
    }
  },
  {
    id: "gp-2",
    slug: "vertex-brand-operations",
    layoutVariant: "B",
    title: "Maven",
    subtitle: "Maven was developed as a women's fashion label defined by precision, confidence, and refined minimalism.",
    year: 2025,
    industry: "Women's Fashion",
    services: ["Brand", "Design System"],
    tools: ["Figma"],
    roles: ["Brand Designer", "Art Director"],
    overview:
      "Maven is a contemporary women's fashion brand built around clean silhouettes, controlled colour, and a strong typographic presence. The goal was to create an identity that reflects confidence and individuality without relying on traditional feminine clichés. Graphxify crafted a system that extends seamlessly across apparel, packaging, and digital platforms.",
    excerpt: "A complete brand identity system for a women's fashion label built around precision and refined minimalism.",
    content:
      "The identity system was designed to work across apparel, packaging, digital media, and marketing materials — built on typographic control, restrained colour, and a confident visual language.",
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
      { label: "Platform", value: "Brand Identity System" },
      { label: "Timeline", value: "4 Weeks" },
      { label: "Location", value: "Canada" }
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
      problem: "Women's fashion branding often leans heavily on soft visuals and predictable aesthetics. The challenge was to build a brand that feels feminine without being delicate, and strong without being aggressive — striking a balance that positions Maven as both refined and distinctive in a saturated market.",
      approach: "We focused on typography and composition as the core of the identity. Instead of relying on decorative elements, the system uses spacing, hierarchy, and proportion to communicate elegance and control. The colour palette was kept restrained to reinforce clarity and consistency.",
      solution: "Graphxify developed a complete brand identity system including logotypes, typographic rules, colour palette, and scalable design applications. The system was designed to adapt across apparel, tags, packaging, and digital media while maintaining a cohesive visual language.",
      outcome: "Maven launched with a distinct and confident identity that stands apart from typical fashion branding. The system allows the brand to scale while maintaining its tone, positioning Maven as a modern label with a clear point of view."
    }
  },
  {
    id: "gp-3",
    slug: "axis-growth-platform",
    layoutVariant: "C",
    title: "Boss Medical Clinic",
    subtitle: "A visual system built to communicate authority, clarity, and professional credibility.",
    year: 2024,
    industry: "Healthcare",
    services: ["Web Design", "Web Development"],
    tools: ["Next.js", "Figma"],
    roles: ["Web Designer", "Frontend Developer"],
    overview:
      "Boss Medical Clinic offers a range of medical services and needed a platform that reflects professionalism while presenting information in a structured and accessible way for patients.",
    excerpt: "A professional clinic website built to communicate authority while remaining approachable.",
    content:
      "The structure focused on making services, contact information, and pharmacy details easy to find, communicating professionalism and accessibility throughout.",
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
      { label: "Platform", value: "Business Website" },
      { label: "Timeline", value: "4 Weeks" },
      { label: "Location", value: "Canada" }
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
    subtitle: "A clear, accessible website built to serve a community pharmacy and its local patients.",
    year: 2025,
    industry: "Healthcare",
    services: ["Web Design", "Web Development"],
    tools: ["Next.js", "Figma"],
    roles: ["Web Designer", "Frontend Developer"],
    overview:
      "Pharmacy On King is a community pharmacy with a loyal local patient base. The pharmacy needed a website that would make it easier for existing and new patients to access services, find location information, and connect with the team. Graphxify was engaged to design and build a clean, accessible digital presence for the business.",
    excerpt: "A clean, community-focused website built for a trusted downtown pharmacy.",
    content:
      "The design focused on accessibility, clarity, and trust, helping visitors find services, location details, and contact information without friction.",
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
      { label: "Platform", value: "Business Website" },
      { label: "Timeline", value: "4 Weeks" },
      { label: "Location", value: "Canada" }
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
      problem: "Community pharmacies serve a broad range of patients, including many who are not highly comfortable with technology. The website needed to be clear and welcoming for first-time visitors while reinforcing the pharmacy's reputation as a trusted community resource.",
      approach: "Accessibility and clarity guided every decision. The information architecture was structured to answer the most common patient questions directly, with clean typography and strong contrast to support a wide range of users.",
      solution: "Graphxify delivered a fully responsive website with a clear, welcoming layout that keeps services, location, and contact details prominent. The design communicates community trust while meeting the visual standard expected of a modern healthcare business.",
      outcome: "Pharmacy On King now has a website that works as a genuine patient resource. The site helps new visitors understand what the pharmacy offers and makes it easy for the existing community to stay connected with the business."
    }
  },
  {
    id: "gp-5",
    slug: "atlas-fintech-experience-hub",
    layoutVariant: "E",
    title: "Luka Hair Salon",
    subtitle: "A refined brand identity and website designed to reflect the studio's premium positioning.",
    year: 2026,
    industry: "Beauty",
    services: ["Brand Identity", "Web Design"],
    tools: ["Figma", "Next.js"],
    roles: ["Brand Designer", "Web Designer"],
    overview:
      "Luka Hair Salon is a modern salon focused on delivering a refined client experience. Graphxify was brought in to create a visual identity and website that would reflect the quality of the work happening inside the studio, giving the brand a presence that matches its positioning in the market.",
    excerpt: "A clean visual identity and website built to reflect a premium salon experience.",
    content:
      "The design focused on simplicity, clarity, and a modern beauty aesthetic, creating an identity and site that communicates elegance and professionalism from the first impression.",
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
      { label: "Platform", value: "Business Website" },
      { label: "Timeline", value: "3 Weeks" },
      { label: "Location", value: "Canada" }
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
      problem: "Many salons rely on generic templates that fail to communicate what makes their experience different. Luka needed a brand and website that felt genuinely premium without being cold, balancing elegance with warmth and clarity with personality.",
      approach: "We defined the visual tone as clean, modern, and quietly confident, designed to feel like it belongs in a premium retail context. The website structure was kept intentionally simple to let the brand and services speak clearly without distraction.",
      solution: "Graphxify delivered a brand identity system and a website designed around ease of use and visual clarity. The site presents services, booking information, and the salon's personality in a refined layout that is easy to navigate on any device.",
      outcome: "Luka launched with a brand and digital presence that accurately represents the quality of its service offering. The identity gives the salon a professional foundation to grow from, and the website makes it straightforward for new and returning clients to engage with the business."
    }
  },
  {
    id: "gp-6",
    slug: "meridian-health-network-portal",
    layoutVariant: "F",
    title: "King Medical Arts Pharmacy",
    subtitle: "A modern pharmacy website designed to serve patients with clarity and professionalism.",
    year: 2026,
    industry: "Healthcare",
    services: ["Web Design", "Web Development"],
    tools: ["Next.js", "Figma"],
    roles: ["Web Designer", "Frontend Developer"],
    overview:
      "King Medical Arts Pharmacy required a modern website to improve how patients access pharmacy information and services online. The existing digital presence did not adequately reflect the professionalism of the practice. Graphxify was engaged to design and develop a clean, well-structured website that would serve both the pharmacy and its patients effectively.",
    excerpt: "A professional website built to present pharmacy services with clarity and confidence.",
    content:
      "The project focused on building a clean structure that helps visitors quickly access services, contact details, and pharmacy information, aligned with the professional medical arts environment.",
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
      { label: "Platform", value: "Business Website" },
      { label: "Timeline", value: "4 Weeks" },
      { label: "Location", value: "Canada" }
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
      problem: "The pharmacy operates in a professional medical arts context, setting a higher standard for its digital presence. Outdated design was creating a gap between the quality of the service and the impression it made online.",
      approach: "Every design decision was evaluated against a single question: does this make it easier for a patient to access what they need? We established clear content hierarchy and a clean visual language that reflects the professional medical environment.",
      solution: "Graphxify designed and developed a fully responsive website with a clean structure and clear service presentation. The layout allows patients to quickly locate services, contact details, and relevant information, aligned with the standard expected in a medical arts environment.",
      outcome: "King Medical Arts Pharmacy now has a website that accurately represents the quality and professionalism of its operation. The new digital presence serves as a reliable resource for patients and reinforces the pharmacy's standing within its professional medical community."
    }
  }
];

export function getProjectBySlug(slug: string): ProjectDetail | null {
  return graphxifyProjects.find((project) => project.slug === slug) ?? null;
}

export function getRelatedProjects(currentSlug: string, count = 3): ProjectDetail[] {
  return graphxifyProjects.filter((project) => project.slug !== currentSlug).slice(0, count);
}
