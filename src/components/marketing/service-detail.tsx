import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLink } from "@/components/site/arrow-link";
import { CtaBlock } from "@/components/site/cta-block";
import { PageHero } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/site/project-card";
import { Reveal } from "@/components/site/reveal";
import { SectionIntro } from "@/components/site/section-intro";
import { ServiceFaq, type ServiceFaqItem } from "@/components/marketing/service-faq";
import type { ServiceWorkCard } from "@/app/(marketing)/services/work-cards";
import { shouldBypassNextImageOptimization } from "@/lib/content-helpers";
import { getProjectArt } from "@/lib/project-art";
import { cn } from "@/lib/utils";

export type ServiceKey = "brand-systems" | "web-design" | "web-development" | "cms-architecture";

export type ServiceInfo = {
  key: ServiceKey;
  title: string;
  /** One-line positioning, used as the lead line on /services. */
  description: string;
  /** Longer description for the /services section. */
  body: string;
  deliverables: readonly string[];
  bestFor: string;
  typicalProject: string;
  businessOutcome: string;
  /** Supporting line shown under the deliverables on the detail page. */
  note: string;
  /** Real render that illustrates this service: path slug + index into [cover, ...gallery]. Same picks as the home page. */
  art: { slug: string; index: number };
};

/** Single source for the facts both /services and each /services/<key> page show. */
export const serviceInfo: readonly ServiceInfo[] = [
  {
    key: "brand-systems",
    title: "Brand Systems",
    description: "Positioning, identity, and scalable brand foundations.",
    body: "We build complete brand identity systems for modern businesses that need to look credible from day one. Logo suite, typography, colour palette, brand voice, and usage documentation are all delivered together so your brand stays consistent across your website, social, print, and pitch materials without needing a designer to make every decision.",
    deliverables: [
      "Logo suite (primary, secondary, icon)",
      "Typography system with font files",
      "Colour palette with hex, RGB, and CMYK",
      "Brand guidelines document (PDF)",
      "Social media templates",
      "Full asset export package"
    ],
    bestFor: "New businesses or companies that have outgrown a DIY logo",
    typicalProject: "Full brand identity from scratch in 2 to 3 weeks",
    businessOutcome: "Look credible and consistent everywhere your business appears",
    note: "Every brand system includes a guidelines document your team can use day-to-day. No designer required to stay on-brand.",
    art: { slug: "maven", index: 1 }
  },
  {
    key: "web-design",
    title: "Web Design",
    description: "Structured interfaces with clarity and hierarchy.",
    body: "We design website interfaces built to communicate clearly and convert visitors into leads. Every layout prioritises hierarchy so your main message, your differentiator, and your call to action are visible before the scroll. Designed mobile-first, responsive across all screen sizes, and built with accessibility in mind so your website is usable by the widest possible audience.",
    deliverables: [
      "UX wireframes for each key page",
      "High-fidelity desktop and mobile designs",
      "Interactive prototype for client review",
      "Component design system",
      "Responsive layout specifications",
      "Accessibility review (WCAG guidelines)"
    ],
    bestFor: "Businesses with a clear brand ready to build or redesign their website",
    typicalProject: "4 to 8 pages across a 2 to 4 week design phase",
    businessOutcome: "A website visitors understand and engage with from the first scroll",
    note: "We design interfaces aligned with WCAG accessibility guidelines so websites are usable and inclusive for every visitor, on any device.",
    art: { slug: "flyup-line", index: 4 }
  },
  {
    key: "web-development",
    title: "Web Development",
    description: "Scalable builds engineered for performance.",
    body: "We build custom websites on Next.js, not WordPress templates, engineered to a Lighthouse 90+ performance target. You own the code outright with no recurring plugin subscriptions, and the architecture is built to scale with your business over the next five years. Optimised for Google Core Web Vitals and WCAG accessibility standards.",
    deliverables: [
      "Custom Next.js codebase (you own it outright)",
      "Performance budget targeting Lighthouse 90+",
      "Core Web Vitals optimisation",
      "Deployment to Vercel or your preferred host",
      "Integrations (CRM, forms, analytics)",
      "Post-launch handover and documentation"
    ],
    bestFor: "Companies ready to move off WordPress, page builders, or outdated custom sites",
    typicalProject: "4 to 8 week build depending on scope",
    businessOutcome: "A site that loads fast, is technically sound for search, and doesn't need a developer for routine updates",
    note: "Built on Next.js with server components, static generation, and edge caching. No plugin subscriptions. No recurring platform fees.",
    art: { slug: "king-medical-art-pharmacy", index: 0 }
  },
  {
    key: "cms-architecture",
    title: "CMS Architecture",
    description: "Structured content systems built for scale.",
    body: "We design content management systems where your team can publish pages, blog posts, and updates without designer involvement and without breaking the layout. Content models, user roles, and publishing workflows are defined before a line of code is written, so the CMS fits how your team actually works.",
    deliverables: [
      "Content model design and documentation",
      "CMS platform setup and configuration",
      "User roles and permissions structure",
      "Custom editing workflows",
      "Editor training guide",
      "Governance documentation"
    ],
    bestFor: "Teams who need to update their site regularly without developer help",
    typicalProject: "Delivered as part of a web development engagement or as a standalone CMS migration",
    businessOutcome: "Your team publishes confidently. Your site stays on-brand without constant developer involvement.",
    note: "Content models are designed before a line of code is written, so the CMS fits how your team works, not the other way around.",
    art: { slug: "boss-medical-clinic", index: 5 }
  }
];

export const serviceHref = (key: ServiceKey): string => `/services/${key}`;

export function serviceFacts(service: ServiceInfo): { label: string; value: string }[] {
  return [
    { label: "Best for", value: service.bestFor },
    { label: "Typical project", value: service.typicalProject },
    { label: "Business outcome", value: service.businessOutcome }
  ];
}

/**
 * Composed section visuals (.design-qa/scenes.mjs), built only from real material:
 * live client-site captures, client logos and brand colours, this site's own code.
 * `slug` is the case study the visual links to.
 */
export const serviceScenes: Record<ServiceKey, { src: string; alt: string; pictured: string; slug: string }> = {
  "brand-systems": {
    src: "/images/scenes/service-brand-systems.webp",
    alt: "Brand board of real Graphxify client logos and their brand colours",
    pictured: "Client logos and brand colours",
    slug: "maven"
  },
  "web-design": {
    src: "/images/scenes/service-web-design.webp",
    alt: "The FlyUp Line homepage on a design canvas with its desktop and mobile artboards, colour and type styles, and reusable components",
    pictured: "FlyUp Line, design canvas",
    slug: "flyup-line"
  },
  "web-development": {
    src: "/images/scenes/service-web-development.webp",
    alt: "The B.O.S.S. website with source code and a successful build in front of it",
    pictured: "B.O.S.S. Medical Clinic, live site",
    slug: "boss-medical-clinic"
  },
  "cms-architecture": {
    src: "/images/scenes/service-cms-architecture.webp",
    alt: "The Graphxify CMS editor with the Maven project fields, each linked to where it appears on the live case study page",
    pictured: "Maven case study, CMS editor",
    slug: "maven"
  }
};

/** The section visual for a service, with the case study it links to. */
export function serviceRender(service: ServiceInfo, works: readonly ServiceWorkCard[]): { src: string; alt: string; pictured: string; work: ServiceWorkCard } | null {
  const scene = serviceScenes[service.key];
  const work = works.find((item) => item.pathSlug === scene.slug) ?? works.find((item) => item.pathSlug === service.art.slug);
  return work ? { src: scene.src, alt: scene.alt, pictured: scene.pictured, work } : null;
}

/** A project render filling its box on the project's stage colour. */
export function RenderImage({ src, work, sizes, priority = false, decorative = false, alt }: { src: string; work: ServiceWorkCard; sizes: string; priority?: boolean; decorative?: boolean; alt?: string }): JSX.Element {
  return (
    <Image
      src={src}
      alt={decorative ? "" : alt ?? `${work.title}, ${work.industry} project by Graphxify`}
      fill
      priority={priority}
      sizes={sizes}
      unoptimized={shouldBypassNextImageOptimization(src)}
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
    />
  );
}

/** Green check bullets: green means "included". */
export function CheckItem({ children, className }: { children: React.ReactNode; className?: string }): JSX.Element {
  return (
    <li className={cn("flex items-start gap-3 text-[0.9375rem] font-semibold leading-snug text-fg", className)}>
      <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green text-fg">
        <Check className="h-3.5 w-3.5" />
      </span>
      <span className="pt-0.5">{children}</span>
    </li>
  );
}

export type RelatedProject = { pathSlug: string; outcome: string };
export type RelatedPost = { slug: string; label: string };

const cardHover = "transition-[transform,box-shadow] duration-300 ease-out hover:shadow-lift motion-safe:hover:-translate-y-1";

/** The shared layout of every /services/<key> page. Metadata and JSON-LD stay in each route. */
export function ServiceDetail({
  serviceKey,
  lead,
  ctaLabel,
  statement,
  relatedHeading,
  relatedProjects = [],
  relatedPosts,
  faqs,
  works = [],
  children
}: {
  serviceKey: ServiceKey;
  lead: string;
  ctaLabel: string;
  statement: { title: string; body: string };
  relatedHeading?: string;
  relatedProjects?: readonly RelatedProject[];
  relatedPosts: readonly RelatedPost[];
  faqs: readonly ServiceFaqItem[];
  works?: readonly ServiceWorkCard[];
  /** Optional service-specific section, rendered after "What's included". */
  children?: React.ReactNode;
}): JSX.Element {
  const service = serviceInfo.find((item) => item.key === serviceKey) as ServiceInfo;
  const others = serviceInfo.filter((item) => item.key !== serviceKey);
  const render = serviceRender(service, works);
  const projects = relatedProjects.flatMap((related) => {
    const work = works.find((item) => item.pathSlug === related.pathSlug);
    return work ? [{ ...work, outcome: related.outcome }] : [];
  });
  const [firstWord, ...rest] = service.title.split(" ");

  return (
    <>
      <PageHero
        // PageHero stretches the badge when it has an aside; keep it pill-sized.
        className="pb-0 md:pb-0 [&>div>div>span:first-child]:self-start"
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: service.title }]}
        label="Service"
        title={
          <>
            {firstWord} <span className="text-accentB">{rest.join(" ")}</span>
          </>
        }
        lead={lead}
        actions={
          <>
            <Button asChild size="lg">
              <Link href="/contact">
                {ctaLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/works">View work</Link>
            </Button>
          </>
        }
        aside={
          render ? (
            <Link href={`/works/${render.work.pathSlug}`} className="group block rounded-[2rem] bg-white p-3 shadow-[0_40px_80px_-50px_rgba(10,10,10,0.45)]">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem]" style={{ backgroundColor: getProjectArt(render.work.pathSlug).stage }}>
                <RenderImage src={render.src} alt={render.alt} work={render.work} sizes="(max-width: 1023px) 100vw, 600px" priority />
              </div>
              <p className="flex items-center justify-between gap-4 px-3 pb-1 pt-4 text-[0.875rem] font-semibold text-fg/64">
                <span>
                  Pictured: <span className="text-fg">{render.pictured}</span>
                </span>
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-fg transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </p>
            </Link>
          ) : null
        }
      />

      {/* Facts as white chips; own grid so long answers get a full column on mobile. */}
      <div className="container pb-4 pt-12 md:pt-16">
        <dl className="grid gap-3 md:grid-cols-3">
          {serviceFacts(service).map((fact) => (
            <div key={fact.label} className="rounded-[1.5rem] bg-white p-5 md:p-6">
              <dt className="t-small">{fact.label}</dt>
              <dd className="mt-2 text-[1.0625rem] font-bold leading-snug tracking-[-0.015em] text-fg">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* What's included */}
      <section className="container section">
        <Reveal>
          <SectionIntro badge="What's included" title={statement.title} lead={statement.body} />
        </Reveal>
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {service.deliverables.map((item, index) => (
            <Reveal as="li" key={item} delay={(index % 3) * 60} className="flex items-start gap-4 rounded-[1.5rem] bg-white p-5 md:p-6">
              <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-green text-fg">
                <Check className="h-4 w-4" />
              </span>
              <span className="pt-1 text-[1rem] font-bold leading-snug tracking-[-0.01em] text-fg">{item}</span>
            </Reveal>
          ))}
        </ul>
        <p className="t-body mx-auto mt-8 max-w-[60ch] text-center">{service.note}</p>
      </section>

      {children}

      {projects.length ? (
        <section className="container section">
          <Reveal>
            <SectionIntro badge="Related work" title={relatedHeading ?? "Related work."} />
          </Reveal>
          <ul className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3 md:gap-6">
            {projects.map((project, index) => (
              <Reveal as="li" key={project.pathSlug} delay={index * 80}>
                <ProjectCard
                  className={cardHover}
                  href={`/works/${project.pathSlug}`}
                  slug={project.pathSlug}
                  title={project.title}
                  industry={project.industry}
                  image={project.coverImage}
                  summary={project.outcome}
                  sizes="(max-width: 767px) 100vw, 33vw"
                />
              </Reveal>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <ArrowLink href="/works">View all work</ArrowLink>
          </div>
        </section>
      ) : null}

      {/* Related reading */}
      <section className="container section">
        <Reveal>
          <SectionIntro badge="Related reading" title={<>From the <span className="text-accentB">blog</span>.</>} />
        </Reveal>
        <ul className="mx-auto mt-12 flex max-w-3xl flex-col gap-3 md:mt-16">
          {relatedPosts.map((post, index) => (
            <Reveal as="li" key={post.slug} delay={index * 60}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-center justify-between gap-6 rounded-[1.5rem] bg-white px-6 py-5 transition-shadow duration-300 hover:shadow-lift md:px-8 md:py-6"
              >
                <span className="text-[1.0625rem] font-bold tracking-[-0.015em] text-fg md:text-lg">{post.label}</span>
                <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bg text-fg transition-colors duration-200 group-hover:bg-fg group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Other services */}
      <section className="container section">
        <Reveal>
          <SectionIntro badge="Other services" title={<>Most projects combine <span className="text-accentB">two</span> or three.</>} />
        </Reveal>
        <ul className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3 md:gap-6">
          {others.map((item, index) => {
            const art = serviceRender(item, works);
            return (
              <Reveal as="li" key={item.key} delay={index * 80}>
                <Link href={serviceHref(item.key)} className={cn("group flex h-full flex-col rounded-[2rem] bg-white p-3", cardHover)}>
                  {art ? (
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem]" style={{ backgroundColor: getProjectArt(art.work.pathSlug).stage }}>
                      <RenderImage src={art.src} alt={art.alt} work={art.work} sizes="(max-width: 767px) 100vw, 33vw" />
                    </div>
                  ) : null}
                  <div className="flex flex-1 items-start justify-between gap-4 px-3 pb-3 pt-5">
                    <div>
                      <h3 className="t-h3 text-fg">{item.title}</h3>
                      <p className="t-body mt-1 !text-[0.9375rem]">{item.description}</p>
                    </div>
                    <span aria-hidden="true" className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bg text-fg transition-colors duration-200 group-hover:bg-fg group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* FAQ */}
      <section className="container section">
        <Reveal>
          <ServiceFaq items={faqs} />
        </Reveal>
      </section>

      <CtaBlock />
    </>
  );
}
