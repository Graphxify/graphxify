export const siteConfig = {
  name: "Graphxify",
  title: "Graphxify — Brand Systems, Web Design & Development",
  description:
    "Graphxify is a premium branding + web design + development studio. We build cohesive brand systems, high-performance websites, and structured CMS implementations so teams can publish confidently as they grow.",
  tagline:
    "Premium brand systems, web design, and web development — with CMS architecture built to scale.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://graphxify-omega.vercel.app"
};

export const marketingNav = [
  { href: "/", label: "Home" },
  { href: "/works", label: "Works" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" }
];
