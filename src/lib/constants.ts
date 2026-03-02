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

export const testimonials = [
  {
    id: "01",
    quote: "Graphxify turned our ideas into a sharp, clean brand. Fast, easy, and right on point.",
    name: "Ethan Moore",
    role: "Co-founder, NovaTech",
    image_url: "/assets/work-1.svg"
  },
  {
    id: "02",
    quote: "The design and build loop was seamless. We launched with clarity, speed, and a system our team can manage.",
    name: "Leah Mendez",
    role: "Head of Digital, Northline",
    image_url: "/assets/work-2.svg"
  },
  {
    id: "03",
    quote: "Our site feels premium now, and the CMS structure means we can publish confidently without design drift.",
    name: "Omar Rahim",
    role: "Operations Director, Axis Group",
    image_url: "/assets/work-3.svg"
  }
] as const;

export const testimonialMetricsDefault = [
  { id: "metric-01", value: "26+", label: "Finalized Projects", sort_order: 0 },
  { id: "metric-02", value: "98%", label: "Client satisfaction rate", sort_order: 1 },
  { id: "metric-03", value: "10M", label: "Gross Revenue", sort_order: 2 }
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
