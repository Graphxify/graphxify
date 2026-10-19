import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Star } from "lucide-react";
import { ArrowLink } from "@/components/site/arrow-link";
import { Badge } from "@/components/site/badge";
import { CtaBlock } from "@/components/site/cta-block";
import { PageHero } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/site/project-card";
import { Reveal } from "@/components/site/reveal";
import { SectionIntro } from "@/components/site/section-intro";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/constants";
import { getProjectCardContent, getProjectDisplayTitle, getProjectPathSlug } from "@/lib/project-card-content";

type AboutWorkPreview = {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
};

type AboutTestimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating?: number;
};

const facts = [
  { label: "Focus", value: "Brand, websites, CMS" },
  { label: "Delivery", value: "Design and development aligned" },
  { label: "Response", value: "Within 24 hours" }
];

// Same four stages as /process; each card deep-links to its stage there.
const approachSteps = [
  {
    title: "Discover",
    body: "Research your goals, audience, and competitive landscape to build a clear strategic foundation."
  },
  {
    title: "Structure",
    body: "Map content architecture, define systems, and establish the information hierarchy."
  },
  {
    title: "Design",
    body: "Craft a visual identity and interface system that communicates with clarity and purpose."
  },
  {
    title: "Build & Ship",
    body: "Develop, test, and deploy a performant product ready for real-world scale."
  }
] as const;

// One-line summaries for the About page; titles and keys come from the shared services list.
const capabilityLines: Record<(typeof services)[number]["key"], string> = {
  "brand-systems": "Positioning, visual language, and usage standards that keep your brand consistent as content scales.",
  "web-design": "Clear, conversion-focused interfaces built with responsive behavior and reusable design patterns.",
  "web-development": "Performant, maintainable websites with clean architecture, accessibility, and production quality.",
  "cms-architecture": "Content models and editor workflows so your team can publish confidently without breaking consistency."
};

const differentiators = [
  "System-driven identity and web design",
  "Clean, maintainable development",
  "Structured CMS architecture",
  "Consistent components and documentation",
  "Clear process and predictable delivery",
  "Transparent communication, kickoff to launch"
] as const;

const principles = [
  {
    title: "Systems first",
    body: "Every decision is made through the lens of scalable, reusable systems, not isolated one-off deliverables."
  },
  {
    title: "Quality as standard",
    body: "Accessibility, performance, and clean code aren't extras. They're the baseline of every project."
  },
  {
    title: "Transparent process",
    body: "Clear timelines, predictable delivery, and open communication from the first call to final launch."
  }
] as const;

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AboutPageContent({
  works,
  testimonials = []
}: {
  works: AboutWorkPreview[];
  testimonials?: AboutTestimonial[];
}): JSX.Element {
  const previewWorks = works.slice(0, 3);

  return (
    <>
      <PageHero
        // PageHero stretches the badge when it has an aside; on mobile the third fact chip spans both columns.
        className="[&>div>div>span:first-child]:self-start [&_dl>div:last-child]:col-span-2 md:[&_dl>div:last-child]:col-span-1"
        label="About"
        title={
          <>
            Built on structure. Designed to <span className="text-accentB">scale</span>.
          </>
        }
        lead="Graphxify is a design and development studio focused on structured brand and web systems. We align identity, interface, and architecture into one cohesive platform, built for clarity, consistency, and long-term growth."
        actions={
          <>
            <Button asChild size="lg">
              <Link href="/contact">Start a project</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/works">See our work</Link>
            </Button>
          </>
        }
        aside={
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-charcoal ring-8 ring-white md:aspect-[16/10] lg:aspect-[4/5]">
            <Image
              src="/images/scenes/about-moodboard.webp"
              alt="A moodboard of websites Graphxify designed and built, on laptops and phones, with the Graphxify logo"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1023px) 100vw, 40vw"
            />
          </div>
        }
        facts={facts}
      />

      {/* ── Behind the studio ── */}
      <section className="container">
        <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-charcoal px-6 py-14 text-white md:rounded-[2.5rem] md:px-14 md:py-20 lg:px-20">
          <div aria-hidden="true" className="absolute -right-32 -top-40 -z-10 h-[42rem] w-[42rem] -m-[8rem] bg-[radial-gradient(closest-side,rgba(0,163,255,0.32),transparent)]" />
          <Badge tone="dark">Behind the studio</Badge>
          <h2 className="t-h1 mt-7 max-w-[14ch] text-white">
            Built by a designer who <span className="text-accentA">codes</span>.
          </h2>
          <div className="mt-12 grid gap-8 border-t border-white/10 pt-10 md:mt-16 md:grid-cols-12 md:gap-10 md:pt-12">
            <p className="text-[clamp(1.375rem,2.4vw,2rem)] font-semibold leading-[1.25] tracking-[-0.03em] md:col-span-7">
              Graphxify was founded on the belief that brand, design, and development should operate as one unified system,{" "}
              <span className="text-white/40">not three disconnected services.</span>
            </p>
            <p className="text-[1.0625rem] font-medium leading-relaxed text-white/64 md:col-span-5 md:pt-2">
              Every project is approached with a builder&apos;s mindset: structured, intentional, and engineered for long-term growth. No
              handoff friction, no misalignment. Just cohesive systems from concept to launch.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── What we do ── */}
      <section className="container section">
        <Reveal>
          <SectionIntro
            badge="Capabilities"
            title={
              <>
                What we <span className="text-accentB">do</span>
              </>
            }
            lead="Brand, design, development and CMS, delivered by one team."
          />
        </Reveal>
        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 md:gap-5">
          {services.map((service, index) => (
            <Reveal as="li" key={service.key} delay={(index % 2) * 80}>
              <Link
                href={`/services/${service.key}`}
                className="group flex h-full items-start justify-between gap-6 rounded-[2rem] bg-white p-7 transition-shadow duration-300 hover:shadow-lift md:p-9"
              >
                <div>
                  <h3 className="t-h3 text-fg">{service.title}</h3>
                  <p className="t-body mt-3 max-w-[44ch]">{capabilityLines[service.key]}</p>
                </div>
                <span aria-hidden="true" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg text-fg transition-colors duration-200 group-hover:bg-fg group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
        <div className="mt-10 flex justify-center">
          <ArrowLink href="/services">All services</ArrowLink>
        </div>
      </section>

      {/* ── Why Graphxify ── */}
      <section className="container section pt-0 md:pt-0">
        <Reveal>
          <SectionIntro
            badge="The difference"
            title={
              <>
                Why <span className="text-accentB">Graphxify</span>
              </>
            }
          />
        </Reveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 md:gap-5 lg:grid-cols-3">
          {differentiators.map((item, index) => (
            <Reveal as="li" key={item} delay={(index % 3) * 60} className="flex flex-col rounded-[2rem] bg-white p-7 md:p-8">
              <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-green text-fg">
                <Check className="h-5 w-5" />
              </span>
              <p className="mt-8 text-[1.125rem] font-bold leading-snug tracking-[-0.02em] text-fg md:mt-12 md:text-[1.25rem]">{item}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ── Principles ── */}
      <section className="container section pt-0 md:pt-0">
        <Reveal>
          <SectionIntro
            badge="Principles"
            title={
              <>
                Our <span className="text-accentB">principles</span>
              </>
            }
            lead="The core beliefs that drive how we design, develop, and deliver."
          />
        </Reveal>
        <ol className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
          {principles.map((principle, index) => (
            <Reveal as="li" key={principle.title} delay={index * 80} className="flex flex-col rounded-[2rem] bg-white p-7 md:p-9">
              <span aria-hidden="true" className="text-[clamp(3.5rem,6vw,5rem)] font-extrabold leading-none tracking-[-0.06em] text-fg/10">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="t-h3 mt-10 text-fg">{principle.title}</h3>
              <p className="t-body mt-3">{principle.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ── Approach ── */}
      <section className="container section pt-0 md:pt-0">
        <Reveal>
          <SectionIntro
            badge="Approach"
            title={
              <>
                Our <span className="text-accentB">approach</span>
              </>
            }
            lead="Four stages that turn ideas into structured, scalable digital products."
          />
        </Reveal>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {approachSteps.map((step, index) => (
            <Reveal as="li" key={step.title} delay={index * 80}>
              <Link
                href={`/process#stage-0${index + 1}`}
                className="group flex h-full flex-col rounded-[2rem] bg-white p-7 transition-shadow duration-300 hover:shadow-lift"
              >
                <span className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-fg text-[0.9375rem] font-extrabold text-white">{index + 1}</span>
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-fg/40 transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                </span>
                <h3 className="t-h3 mt-10 text-fg">{step.title}</h3>
                <p className="t-body mt-2 !text-[0.9375rem]">{step.body}</p>
              </Link>
            </Reveal>
          ))}
        </ol>
        <div className="mt-10 flex justify-center">
          <ArrowLink href="/process">See the full process</ArrowLink>
        </div>
      </section>

      {/* ── Testimonials ── */}
      {testimonials.length > 0 ? (
        <section className="container section pt-0 md:pt-0">
          <Reveal>
            <SectionIntro
              badge="Client stories"
              title={
                <>
                  Trusted by <span className="text-accentB">clients</span>
                </>
              }
            />
          </Reveal>
          <ul className="mt-12 columns-1 gap-5 md:mt-16 md:columns-2 lg:columns-3 [&>li]:mb-5">
            {testimonials.map((item, index) => {
              const dark = index === 0;
              return (
                <Reveal as="li" key={item.id} delay={(index % 3) * 60} className={dark ? "break-inside-avoid rounded-[2rem] bg-fg p-7 text-white" : "break-inside-avoid rounded-[2rem] bg-white p-7"}>
                  {item.rating ? (
                    <p className="flex gap-0.5" role="img" aria-label={`${item.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} aria-hidden="true" className={`h-4 w-4 ${i < Math.round(item.rating ?? 0) ? (dark ? "fill-green text-green" : "fill-fg text-fg") : "text-fg/20"}`} />
                      ))}
                    </p>
                  ) : null}
                  <blockquote className={`mt-5 text-[1.0625rem] font-semibold leading-relaxed tracking-[-0.01em] ${dark ? "text-white" : "text-fg"}`}>&ldquo;{item.quote}&rdquo;</blockquote>
                  <div className="mt-6 flex items-center gap-3">
                    <span aria-hidden="true" className={`grid h-10 w-10 place-items-center rounded-full text-[0.8125rem] font-extrabold ${dark ? "bg-white text-fg" : "bg-fg text-white"}`}>
                      {initials(item.name)}
                    </span>
                    <div>
                      <p className="text-[0.9375rem] font-bold">{item.name}</p>
                      <p className={`text-[0.8125rem] font-medium ${dark ? "text-white/60" : "text-fg/60"}`}>{item.role}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </section>
      ) : null}

      {/* ── Selected work ── */}
      {previewWorks.length > 0 ? (
        <section className="container section pt-0 md:pt-0">
          <Reveal>
            <SectionIntro
              badge="Work"
              title={
                <>
                  Selected <span className="text-accentB">work</span>
                </>
              }
            />
          </Reveal>
          <ul className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3 md:gap-6">
            {previewWorks.map((work, index) => (
              <Reveal as="li" key={work.id} delay={index * 80}>
                <ProjectCard
                  href={`/works/${getProjectPathSlug(work.slug)}`}
                  slug={work.slug}
                  title={getProjectDisplayTitle(work.slug, work.title)}
                  industry={getProjectCardContent(work.slug)?.industry}
                  image={work.coverImage}
                  sizes="(max-width: 767px) 100vw, 33vw"
                />
              </Reveal>
            ))}
          </ul>
          <div className="mt-12 flex justify-center">
            <Button asChild size="lg">
              <Link href="/works">View all work</Link>
            </Button>
          </div>
        </section>
      ) : null}

      <CtaBlock />
    </>
  );
}
