import Image from "next/image";
import Link from "next/link";
import { Check, Minus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLink } from "@/components/site/arrow-link";
import { Badge } from "@/components/site/badge";
import { CtaBlock } from "@/components/site/cta-block";
import { FaqList } from "@/components/site/faq-list";
import { Marquee } from "@/components/site/marquee";
import { ProjectStage } from "@/components/site/project-stage";
import { ScrollStack } from "@/components/site/scroll-stack";
import { Reveal } from "@/components/site/reveal";
import { Testimonials3D } from "@/components/site/testimonials-3d";
import { SectionIntro } from "@/components/site/section-intro";
import { DeferredLeadForm } from "@/components/marketing/deferred-home-islands";
import { getProjectDisplayTitle, getProjectPathSlug } from "@/lib/project-card-content";
import { faqs, services } from "@/lib/constants";

type TestimonialCard = {
  id: string;
  quote: string;
  name: string;
  role: string;
  image_url?: string | null;
  rating?: number;
};

type TestimonialMetricCard = {
  id: string;
  value: string;
  label: string;
  sort_order: number;
};

type HomeProjectCard = {
  id: string;
  slug: string;
  title: string;
  industry: string;
  coverImage: string;
  images?: string[];
  tags?: string[];
};

type StripLogo = {
  key: string;
  alt: string;
  baseName: string;
};

type CmsMarqueeItem = {
  id: string;
  image_url_dark: string;
  image_url_light: string;
  label: string;
};

// Fallback client logos, used only when the CMS marquee table is empty.
// `alt` must be the real client name — it is the only thing screen readers
// and crawlers get from this section.
const stripLogos: StripLogo[] = [
  {
    key: "marquee-logo-01",
    alt: "FlyUp Line",
    baseName: "marquee-logo-01"
  },
  {
    key: "marquee-logo-02",
    alt: "MBM Interior & Exterior",
    baseName: "marquee-logo-02"
  },
  {
    key: "marquee-logo-03",
    alt: "Maven",
    baseName: "marquee-logo-03"
  },
  {
    key: "marquee-logo-04",
    alt: "Beity Eats",
    baseName: "marquee-logo-04"
  },
  {
    key: "marquee-logo-05",
    alt: "Pharmacy on King",
    baseName: "marquee-logo-05"
  },
  {
    key: "marquee-logo-06",
    alt: "Kaffecino",
    baseName: "marquee-logo-06"
  }
];

function getMarqueeLogoSrc(baseName: string, tone: "light" | "dark"): string {
  return `/images/marquee/${baseName}-${tone}.svg`;
}

type HomeFaq = {
  id: string;
  q: string;
  a: string;
};

const homeFaqs: HomeFaq[] = [
  ...faqs.map((item, index) => ({ id: `faq-${index + 1}`, q: item.q, a: item.a })),
  {
    id: "faq-4",
    q: "How long does a typical website project take?",
    a: "Most projects take between 4 and 8 weeks from kickoff to launch. The exact timeline depends on scope, how quickly you can review work, and whether content is ready when we start."
  },
  {
    id: "faq-5",
    q: "What do you need from me to get started?",
    a: "Not much. A brief call or a few sentences about your goals is enough to get us moving. We handle the questions, structure, and direction from there."
  },
  {
    id: "faq-6",
    q: "Do you offer support after the website launches?",
    a: "Yes. We can set up hosting and offer post-launch support for content updates, new pages, and feature additions. We'll outline what makes sense for your project during the scoping call."
  }
];

// Typical durations and outputs, from the /process page.
const processStages = [
  { title: "Discover", time: "3 to 5 days", body: "Goals, audience and competitors, turned into a written scope, a fixed quote and a timeline." },
  { title: "Structure", time: "3 to 5 days", body: "Sitemap, navigation and wireframes for every key page, before anyone worries about looks." },
  { title: "Design", time: "1 to 3 weeks", body: "Desktop and mobile designs plus a clickable prototype. Nothing is built that you have not approved." },
  { title: "Build & Ship", time: "2 to 4 weeks", body: "Custom Next.js, tested on real devices, deployed to hosting you own, with your team trained." }
] as const;

// "Built differently" comparison, from the /services page.
const comparison = {
  typical: ["One-off designs", "Hard-to-manage websites", "Rigid page builders", "Slow, heavy builds", "Frequent redesigns required"],
  graphxify: ["Structured brand systems", "Scalable website architecture", "Clean CMS structure", "Fast, modern performance", "Built for long-term growth"]
} as const;

// Hero composition: brand-stage scenes of live client sites (.design-qa/scenes.mjs), centre one largest.
const heroArt = [
  { src: "/images/scenes/hero-left.webp", place: "left", alt: "The Pharmacy On King website on two phones" },
  { src: "/images/scenes/hero-center.webp", place: "center", alt: "The FlyUp Line website on a laptop and phone, live at flyupline.com" },
  { src: "/images/scenes/hero-right.webp", place: "right", alt: "The B.O.S.S. Medical Clinic website on a phone" }
] as const;

export function HomeSections({
  testimonials,
  homeProjects,
  marqueeItems = []
}: {
  testimonials: TestimonialCard[];
  testimonialMetrics: TestimonialMetricCard[];
  homeProjects: HomeProjectCard[];
  marqueeItems?: CmsMarqueeItem[];
}): JSX.Element {
  const projects = homeProjects.map((project) => ({
    ...project,
    images: project.images?.length ? project.images : [project.coverImage],
    title: getProjectDisplayTitle(project.slug, project.title),
    href: `/works/${getProjectPathSlug(project.slug)}`
  }));
  const logos = marqueeItems.length
    ? marqueeItems.map((item) => ({ key: item.id, alt: item.label, src: item.image_url_dark }))
    : stripLogos.map((logo) => ({ key: logo.key, alt: logo.alt, src: getMarqueeLogoSrc(logo.baseName, "dark") }));
  // Hero proof: rating and count come straight from the published testimonials.
  const rated = testimonials.filter((item) => typeof item.rating === "number");
  const avgRating = rated.length ? rated.reduce((sum, item) => sum + (item.rating ?? 0), 0) / rated.length : 0;
  const reviewFaces = testimonials.slice(0, 4).map((item) =>
    item.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("")
  );
  const stats = [
    // Counted from the published case studies actually shown on the site.
    { value: String(projects.length), label: "Published case studies" },
    // Graphxify's stated process range (see /process), not a measured average.
    { value: "4 to 8 wks", label: "Typical launch" },
    { value: "24h", label: "Response time" }
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden pb-10 pt-12 md:pt-20">
        <div aria-hidden="true" className="absolute inset-0 -z-10 [background:linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.9)_45%,transparent_60%),linear-gradient(65deg,transparent_55%,rgba(255,255,255,0.7)_68%,transparent_80%)] [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]" />
        <div className="container flex flex-col items-center text-center">
          <Badge dot="green">Available for new projects</Badge>
          <h1 className="t-display mt-7 max-w-[15ch] text-fg">
            Brands and websites that help your business <span className="text-accentB">grow</span>.
          </h1>
          <p className="t-lead mt-7 max-w-[46ch]">
            We help small businesses and founders launch a brand and website that looks credible, loads fast, and converts.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/contact">Start a project</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/works">See our work</Link>
            </Button>
          </div>
        </div>

        {/* Fan of real project renders with verified stat chips */}
        <div className="container relative mt-12 md:mt-20">
          <div className="relative mx-auto flex max-w-5xl items-end justify-center sm:h-[24rem] md:h-[30rem]">
            {heroArt.map((art) => {
              const center = art.place === "center";
              const image = (
                <Image src={art.src} alt={art.alt} fill priority sizes={center ? "(max-width: 767px) 100vw, 580px" : "260px"} className="object-cover" />
              );
              return center ? (
                <div
                  key={art.place}
                  className="relative z-10 aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] bg-white shadow-[0_40px_80px_-40px_rgba(10,10,10,0.55)] ring-8 ring-white motion-safe:animate-[fadeIn_900ms_ease-out_both] sm:w-[70%] md:w-[56%]"
                >
                  {image}
                </div>
              ) : (
                // Tilt on the wrapper; the fade-in animation's transform would otherwise cancel it.
                <div key={art.place} className={`absolute bottom-6 hidden w-[24%] sm:block ${art.place === "left" ? "left-[4%] -rotate-[7deg]" : "right-[4%] rotate-[7deg]"}`}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-white shadow-[0_30px_60px_-30px_rgba(10,10,10,0.5)] ring-8 ring-white motion-safe:animate-[fadeIn_900ms_ease-out_200ms_both]">
                    {image}
                  </div>
                </div>
              );
            })}
            {/* Floating proof: live client rating (left) and the stated launch timeline (right) */}
            {rated.length >= 3 ? (
              <div className="absolute -left-2 top-4 z-20 hidden rounded-[1.25rem] bg-white py-3 pl-3 pr-5 text-left shadow-[0_24px_48px_-20px_rgba(10,10,10,0.35)] md:block md:-rotate-3 lg:-left-6">
                <p className="sr-only">
                  Rated {avgRating.toFixed(1)} out of 5 from {testimonials.length} client reviews
                </p>
                <div aria-hidden="true" className="flex items-center gap-3">
                  <div className="flex -space-x-1.5">
                    {reviewFaces.map((face, i) => (
                      <span key={i} className={`grid h-9 w-9 place-items-center rounded-full text-[0.6875rem] font-extrabold text-white ring-[3px] ring-white ${["bg-fg", "bg-accentB", "bg-charcoal-2", "bg-accentA"][i % 4]}`}>
                        {face}
                      </span>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(avgRating) ? "fill-fg text-fg" : "text-fg/20"}`} />
                      ))}
                      <span className="ml-1.5 text-[0.9375rem] font-extrabold tracking-[-0.02em]">{avgRating.toFixed(1)}</span>
                    </div>
                    <p className="t-small mt-0.5">from {testimonials.length} client reviews</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute left-0 top-6 z-20 hidden rounded-2xl bg-white px-4 py-3 text-left shadow-[0_20px_40px_-20px_rgba(10,10,10,0.35)] md:block md:-rotate-3">
                <p className="text-2xl font-extrabold tracking-[-0.04em]">{stats[0].value}</p>
                <p className="t-small">{stats[0].label}</p>
              </div>
            )}
            <Link
              href="/process"
              className="group absolute -right-2 top-14 z-20 hidden w-64 rounded-[1.25rem] bg-white p-4 text-left shadow-[0_24px_48px_-20px_rgba(10,10,10,0.35)] transition-transform duration-300 hover:-translate-y-1 md:block md:rotate-3 lg:-right-6"
            >
              <span className="flex items-center justify-between">
                <span className="text-[0.8125rem] font-semibold text-fg/60">Your new site, live in</span>
                <span aria-hidden="true" className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-green/70 motion-reduce:hidden" />
                  <span className="relative h-2 w-2 rounded-full bg-green" />
                </span>
              </span>
              <span className="mt-1 block text-[1.625rem] font-extrabold leading-none tracking-[-0.045em]">4 to 8 weeks</span>
              <span aria-hidden="true" className="mt-3.5 grid grid-cols-4 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="h-1.5 overflow-hidden rounded-full bg-fg/10">
                    <span
                      className={`block h-full origin-left rounded-full motion-safe:animate-[bar-grow_700ms_cubic-bezier(0.16,1,0.3,1)_both] ${i === 3 ? "bg-green" : "bg-fg"}`}
                      style={{ animationDelay: `${600 + i * 260}ms` }}
                    />
                  </span>
                ))}
              </span>
              <span className="mt-2 flex justify-between text-[0.6875rem] font-semibold text-fg/50">
                <span>Discover</span>
                <span>Structure</span>
                <span>Design</span>
                <span className="text-fg">Ship</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Clients ── */}
      <section aria-label="Brands we have designed and built for" className="pb-16 pt-6 md:pb-24">
        <p className="t-small text-center">Brands we&apos;ve designed and built for</p>
        <div className="relative mt-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent md:w-48" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent md:w-48" />
          <Marquee duration={38}>
            {logos.map((logo) => (
              <span key={logo.key} className="mx-7 inline-flex h-9 w-[6.5rem] items-center justify-center opacity-60 grayscale md:mx-10 md:w-[7.5rem]">
                <Image src={logo.src} alt={logo.alt} width={176} height={48} sizes="8rem" unoptimized={logo.src.startsWith("http")} className="h-full w-full object-contain" />
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ── A better way ── */}
      <section className="container section pt-0 md:pt-0">
        <Reveal>
          <SectionIntro badge="Why Graphxify" title={<>There is a better way to build a <span className="text-accentB">brand</span></>} />
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:mt-16 md:grid-cols-2">
          <Reveal className="rounded-[2rem] bg-white p-8 md:p-10">
            <h3 className="t-h3 text-fg/70">A typical agency</h3>
            <ul className="mt-7 space-y-4">
              {comparison.typical.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[0.9375rem] font-semibold text-fg/60">
                  <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-bg text-fg/50">
                    <Minus className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100} className="rounded-[2rem] bg-fg p-8 text-white md:p-10">
            <h3 className="t-h3">Graphxify</h3>
            <ul className="mt-7 space-y-4">
              {comparison.graphxify.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[0.9375rem] font-semibold">
                  <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-green text-fg">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── Selected work ── */}
      <section className="container section">
        <Reveal>
          <SectionIntro
            badge="Selected work"
            title={<>Work that speaks for <span className="text-accentB">itself</span></>}
            lead="Every project starts with a problem and ends with a platform. Each one is presented in its own brand."
          />
        </Reveal>
        <div className="mt-12 md:mt-16">
          <ScrollStack>
            {projects.map((project, index) => (
              <ProjectStage key={project.id} project={project} flip={index % 2 === 1} priority={index === 0} fit />
            ))}
          </ScrollStack>
        </div>
        <div className="mt-12 flex justify-center">
          <Button asChild size="lg">
            <Link href="/works">View all work</Link>
          </Button>
        </div>
      </section>

      {/* ── Services bento ── */}
      <section className="container section">
        <Reveal>
          <SectionIntro badge="Services" title={<>Everything you need to look <span className="text-accentB">credible</span></>} lead="Brand, design, development and CMS, delivered by one team with no handoffs." />
        </Reveal>
        <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-12 md:gap-6">
          {services.map((service, index) => {
            const src = `/images/scenes/service-${service.key}.webp`;
            const wide = index === 0 || index === 3;
            return (
              <Reveal key={service.key} delay={(index % 2) * 80} className={wide ? "md:col-span-7" : "md:col-span-5"}>
                <Link href={`/services/${service.key}`} className="group flex h-full flex-col overflow-hidden rounded-[2rem] bg-white p-3 transition-shadow duration-300 hover:shadow-lift">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-bg">
                    <Image src={src} alt="" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
                  </div>
                  <div className="flex flex-1 flex-col px-4 pb-4 pt-6 md:px-5">
                    <h3 className="t-h3 text-fg">{service.title}</h3>
                    <p className="t-body mt-2 max-w-[48ch]">{service.body}</p>
                    <p className="mt-auto flex items-center gap-2.5 pt-6 text-[0.9375rem] font-bold text-fg">
                      <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green text-fg">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {service.outcome}
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── Process ── */}
      <section className="container section">
        <Reveal>
          <SectionIntro badge="Process" title={<>How a project actually <span className="text-accentB">runs</span></>} lead="Four stages, in sequence, each ending in something you can look at and approve." />
        </Reveal>
        <ol className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
          {processStages.map((stage, index) => (
            <Reveal as="li" key={stage.title} delay={index * 80} className="flex flex-col rounded-[2rem] bg-white p-7">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-fg text-[0.9375rem] font-extrabold text-white">{index + 1}</span>
                <span className="rounded-full bg-bg px-3 py-1 text-[0.8125rem] font-semibold text-fg/72">{stage.time}</span>
              </div>
              <h3 className="t-h3 mt-10 text-fg">{stage.title}</h3>
              <p className="t-body mt-2 !text-[0.9375rem]">{stage.body}</p>
            </Reveal>
          ))}
        </ol>
        <div className="mt-10 flex justify-center">
          <ArrowLink href="/process">See the full process</ArrowLink>
        </div>
      </section>

      {/* ── Proof ── */}
      <section className="container section">
        <Reveal>
          <SectionIntro badge="Client stories" title={<>Proof that the method <span className="text-accentB">works</span></>} />
        </Reveal>
        <dl className="mx-auto mt-12 grid max-w-4xl grid-cols-3 gap-3 md:mt-16">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse items-center rounded-[1.5rem] bg-white px-3 py-6 text-center md:py-8">
              <dt className="t-small mt-1">{stat.label}</dt>
              <dd className="text-[clamp(1.5rem,3.6vw,2.75rem)] font-extrabold leading-none tracking-[-0.05em] text-fg">{stat.value}</dd>
            </div>
          ))}
        </dl>
        <Testimonials3D className="mt-5" items={testimonials} />
      </section>

      {/* ── FAQ ── */}
      <section className="container section">
        <Reveal>
          <SectionIntro badge="FAQ" title={<>Everything you need to <span className="text-accentB">know</span></>} />
        </Reveal>
        <FaqList className="mx-auto mt-12 max-w-3xl md:mt-16" items={homeFaqs.map(({ q, a }) => ({ q, a }))} />
      </section>

      {/* ── Closing panel with quick inquiry ── */}
      <CtaBlock title={<>Let&apos;s build something you&apos;re <span className="text-accentA">proud</span> of.</>}>
        <div className="rounded-[1.75rem] bg-white p-5 text-left text-fg md:p-8">
          <p className="text-lg font-bold tracking-[-0.02em]">Or send a quick note</p>
          <p className="t-small mt-1">Name, email and a line about the project is enough.</p>
          <div className="mt-5">
            <DeferredLeadForm />
          </div>
        </div>
      </CtaBlock>
    </>
  );
}
