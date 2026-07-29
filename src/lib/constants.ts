/**
 * Ensures the site URL always uses the canonical www subdomain.
 * Handles the case where NEXT_PUBLIC_SITE_URL is set to the non-www
 * variant on Vercel, which previously caused sitemap/canonical mismatches.
 */
function resolveCanonicalUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.graphxify.com").replace(/\/+$/, "");
  // Auto-correct non-www production URL → www
  if (raw === "https://graphxify.com") {
    return "https://www.graphxify.com";
  }
  return raw;
}

export const siteConfig = {
  name: "GRAPHXIFY",
  description:
    "Graphxify is a web design and branding agency serving businesses worldwide. We deliver brand systems, custom websites, and digital platforms built to perform.",
  url: resolveCanonicalUrl()
};

export const companyContact = {
  email: "info@graphxify.com",
  phoneDisplay: "(647)-570-0334",
  phoneHref: "+16475700334"
} as const;

export const marketingNav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/works", label: "Works" },
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
    q: "Do you work with small businesses and startups?",
    a: "Yes. Most of our clients are small to midsize businesses, local service companies, and founders building their first serious brand or website. We are built for exactly this kind of work."
  },
  {
    q: "Can you redesign my existing website?",
    a: "Absolutely. We handle full redesigns and rebuilds regularly. Whether you want a fresh look, faster load times, or a better CMS setup, we'll scope the right solution for your situation."
  },
  {
    q: "Do you build custom websites or use templates?",
    a: "Everything we build is custom. No page builders, no off-the-shelf templates. Your website is designed and developed from scratch to match your brand and your goals."
  }
] as const;

export const services = [
  {
    key: "brand-systems",
    title: "Brand Systems",
    body: "We build your visual identity and messaging from the ground up: logo, colours, typography, and positioning that work together across every touchpoint.",
    outcome: "You show up looking credible and consistent from day one."
  },
  {
    key: "web-design",
    title: "Web Design",
    body: "We design modern, conversion-focused websites with clear hierarchy and layouts built to guide visitors toward action, not just look good on a portfolio.",
    outcome: "A website that works as hard for you as you do."
  },
  {
    key: "web-development",
    title: "Web Development",
    body: "We build fast, reliable websites using Next.js, engineered for performance, SEO, and long-term maintainability without unnecessary complexity.",
    outcome: "Loads instantly, ranks better, and scales without friction."
  },
  {
    key: "cms-architecture",
    title: "CMS Architecture",
    body: "We structure your CMS so your team can update pages, publish content, and manage the site confidently, without touching code or calling a developer.",
    outcome: "Your team stays in control. No developer needed for day-to-day updates."
  }
] as const;
