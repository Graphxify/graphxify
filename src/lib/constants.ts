export const siteConfig = {
  name: "GRAPHXIFY",
  description:
    "Graphxify is a Canadian web design and branding agency serving Toronto, Mississauga, and Ontario businesses. We deliver brand systems, custom websites, and digital platforms built to perform.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
};

export const companyContact = {
  email: "info@graphxify.com",
  phoneDisplay: "(647)-570-0334",
  phoneHref: "+16475700334"
} as const;

export const marketingNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Service" },
  { href: "/works", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" }
];

export const testimonials = [
  {
    id: "01",
    quote: "Graphxify completely transformed our online presence. The new website feels modern, fast, and perfectly aligned with our brand. The process from design to launch was smooth and professional.",
    name: "Carlos M",
    role: "Founder, FlyUp Line",
    rating: 5,
    image_url: null
  },
  {
    id: "02",
    quote: "Working with Graphxify was a great experience. The branding and website design elevated our business and helped us present a more premium image to our clients.",
    name: "Luka",
    role: "Founder, Luka Hair Salon",
    rating: 5,
    image_url: null
  },
  {
    id: "03",
    quote: "Graphxify delivered a clean, modern website that feels both professional and easy for our customers to navigate. The final result reflects our brand perfectly.",
    name: "Sam",
    role: "Founder, King Medical Arts Pharmacy",
    rating: 5,
    image_url: null
  },
  {
    id: "04",
    quote: "The attention to detail throughout the project was impressive. Graphxify translated our vision into a strong brand and website that truly represents our business.",
    name: "Sarah H",
    role: "Founder, Maven Brand",
    rating: 5,
    image_url: null
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
    a: "Yes. Admin, editor, reviewer, and author workflows are built into the CMS with audit trails for every mutation."
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
