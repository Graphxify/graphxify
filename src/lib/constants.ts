export const siteConfig = {
  name: "GRAPHXIFY",
  description:
    "Graphxify is a premium digital agency delivering enterprise-grade brand systems, performance websites, and growth-focused content operations.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
};

export const marketingNav = [
  { href: "/", label: "Home" },
  { href: "/works", label: "Works" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" }
];

export const pricingPlans = [
  {
    name: "Launch",
    price: "$4,500",
    description: "High-conversion marketing website with strategic messaging and delivery workflow.",
    features: ["UX architecture", "Performance baseline", "SEO setup", "2-week delivery"]
  },
  {
    name: "Scale",
    price: "$9,800",
    description: "Website + CMS operating model for teams publishing content at speed.",
    features: ["Custom CMS", "Role permissions", "Analytics layer", "4-week delivery"]
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Cross-team platform design with governance and lifecycle optimization.",
    features: ["System architecture", "Audit + compliance", "SLAs + onboarding", "Continuous optimization"]
  }
] as const;

export const testimonials = [
  {
    id: "01",
    quote: "Graphxify gave us an operating platform, not just a site. Our content team now ships weekly.",
    name: "Avery Chen",
    role: "VP Marketing, Vertex Capital"
  },
  {
    id: "02",
    quote: "The brand consistency and performance gains were immediate. Lighthouse moved from 62 to 95.",
    name: "Leah Mendez",
    role: "Head of Digital, Northline"
  },
  {
    id: "03",
    quote: "Their CMS governance solved our approval bottlenecks while keeping quality uncompromised.",
    name: "Omar Rahim",
    role: "Operations Director, Axis Group"
  }
] as const;

export const faqs = [
  {
    q: "How quickly can Graphxify launch an enterprise website?",
    a: "Typical timeline is 3 to 6 weeks depending on content complexity and stakeholder workflows."
  },
  {
    q: "Can your team migrate existing blog and work archives?",
    a: "Yes. We provide migration mapping, QA checks, and structured redirects for SEO continuity."
  },
  {
    q: "Do you support internal approval and role-based publishing?",
    a: "Yes. Admin and moderator workflows are built into the CMS with audit trails for every mutation."
  }
] as const;

export const services = [
  {
    key: "strategy",
    title: "Brand Strategy",
    body: "Positioning workshops, message architecture, and audience-aligned funnel planning."
  },
  {
    key: "experience",
    title: "Experience Design",
    body: "Intentional interface systems that preserve brand precision across every view."
  },
  {
    key: "platform",
    title: "Platform Engineering",
    body: "Scalable full-stack architecture with role governance and analytics-ready instrumentation."
  }
] as const;

export const founder = {
  name: "Daniel",
  title: "Founder, Graphxify",
  bio: "Daniel leads Graphxify with a systems-first approach to premium digital products, combining brand discipline with enterprise delivery standards."
};
