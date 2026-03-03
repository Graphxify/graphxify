export const siteConfig = {
  name: "GRAPHXIFY",
  description:
    "Graphxify is a premium digital agency delivering enterprise-grade brand systems, performance websites, and growth-focused content operations.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
};

export const companyContact = {
  email: "info@graphxify",
  phoneDisplay: "(647)-570-0334",
  phoneHref: "+16475700334"
} as const;

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
    key: "brand-systems",
    title: "Brand Systems",
    body: "We define your positioning, messaging, and visual identity into a structured brand system that stays consistent across every platform."
  },
  {
    key: "web-design",
    title: "Web Design",
    body: "We design modern, high-end websites with clear hierarchy, strong UX, and layouts built to guide users toward action."
  },
  {
    key: "web-development",
    title: "Web Development",
    body: "We develop fast, scalable websites using modern frameworks - engineered for performance, accessibility, and long-term growth."
  },
  {
    key: "cms-architecture",
    title: "CMS Architecture",
    body: "We implement structured CMS systems so your team can publish, update, and scale content without breaking the design or workflow."
  }
] as const;
