import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Blocks, Fingerprint, Layout, Mail, Minus, PackageCheck, Phone, Plus, Sparkles, Terminal, Timer, Zap, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeferredLeadForm, DeferredTestimonialsSection } from "@/components/marketing/deferred-home-islands";
import { FounderIntroSection } from "@/components/marketing/founder-intro-section";
import { SectionReveal } from "@/components/marketing/section-reveal";
import { companyContact, faqs, services } from "@/lib/constants";

type TestimonialCard = {
  id: string;
  quote: string;
  name: string;
  role: string;
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

const HomeProjectsSlider = dynamic(
  () => import("@/components/marketing/home-projects-slider").then((mod) => mod.HomeProjectsSlider),
  {
    loading: () => <div className="h-[18.5rem] rounded-[1.2rem] border border-border/18 bg-card/40 md:h-[21rem]" />
  }
);

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

const serviceIcons: Record<string, LucideIcon> = {
  "brand-systems": Fingerprint,
  "web-design": Layout,
  "web-development": Terminal,
  "cms-architecture": Blocks
};

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

function SectionHeading({
  eyebrow,
  title
}: {
  eyebrow: string;
  title: string;
}): JSX.Element {
  return (
    <div className="mb-6">
      <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fg/58">
        <span className="h-1.5 w-1.5 rounded-full bg-accentA" aria-hidden="true" />
        <span>{eyebrow}</span>
      </p>
      <h2 className="mt-1 text-2xl font-semibold md:text-3xl">{title}</h2>
    </div>
  );
}

export function HomeSections({
  testimonials,
  testimonialMetrics,
  homeProjects,
  marqueeItems = []
}: {
  testimonials: TestimonialCard[];
  testimonialMetrics: TestimonialMetricCard[];
  homeProjects: HomeProjectCard[];
  marqueeItems?: CmsMarqueeItem[];
}): JSX.Element {
  const projectCards = homeProjects;

  return (
    <div className="space-y-16 pb-16 pt-4 md:space-y-20 md:pb-20 md:pt-8 lg:space-y-24 lg:pt-10">
      <section className="container pt-0 md:pt-2">
        <div className="mx-auto max-w-[940px]">
          <div className="mx-auto flex w-fit items-center justify-center rounded-full border border-border/18 bg-card/72 px-3.5 py-1.5 text-center shadow-[0_8px_22px_rgba(13,13,15,0.08)]">
            <p className="text-sm text-fg/66">Independent Design Studio</p>
          </div>

          <div className="relative mt-6">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[48%] -z-10 h-28 w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accentA/14 blur-3xl md:h-36"
            />
            <h1 className="mx-auto flex max-w-full flex-col items-center text-center text-[clamp(1.32rem,7vw,5.1rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-black dark:text-white sm:leading-[0.95]">
              <span className="block whitespace-nowrap">
                <span className="gradient-text">Systems</span> and websites
              </span>
              <span className="mt-1.5 block whitespace-nowrap md:mt-2">
                built for modern
              </span>
              <span className="mt-1.5 block whitespace-nowrap md:mt-2">
                <span className="gradient-text">businesses</span> ready to grow
              </span>
            </h1>
          </div>

          <p className="mx-auto mt-5 max-w-3xl text-center text-[0.96rem] text-black dark:text-white md:text-[1.14rem]">
            Graphxify is an independent design studio. We help small businesses and founders launch with a brand and website that looks credible, loads fast, and converts.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="w-full rounded-lg border border-border/26 px-6 text-sm !bg-graphite !text-ivory shadow-[0_12px_24px_rgba(13,13,15,0.22)] hover:!bg-graphite/92 dark:!bg-ivory dark:!text-graphite dark:hover:!bg-ivory/92 sm:w-auto sm:text-base"
            >
              <Link href="/contact">Start a Project</Link>
            </Button>
            <Link href="/works" className="link-sweep text-sm text-fg/72 sm:text-base">
              View Our Work
            </Link>
          </div>

          <div className="mt-9 flex justify-center">
            <div className="inline-grid grid-cols-3 divide-x divide-border/12 overflow-hidden rounded-2xl border border-border/14 bg-card/60 shadow-[0_8px_28px_rgba(13,13,15,0.07)]">
              {([
                { icon: PackageCheck, stat: "26+", label: "Projects delivered" },
                { icon: Timer, stat: "4 to 8 wks", label: "Average launch" },
                { icon: Zap, stat: "24h", label: "Response time" }
              ] as const).map(({ icon: Icon, stat, label }) => (
                <div key={stat} className="flex flex-col items-center gap-2 px-5 py-4 sm:px-7">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-accentA/24 bg-accentA/8 text-accentA">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-semibold text-fg/88 sm:text-[0.95rem]">{stat}</p>
                  <p className="text-center text-[0.65rem] leading-tight text-fg/50">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {(() => {
          // Use CMS items when available; fall back to the hardcoded static logos.
          const useCms = marqueeItems.length > 0;
          const cmsItems = marqueeItems;

          return (
            <div className="group relative mt-12 overflow-hidden rounded-2xl bg-card/70 py-2.5 md:mt-14">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-card via-card/90 to-transparent md:w-24" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-card via-card/90 to-transparent md:w-24" />
              <div className="flex w-max animate-marquee items-center [animation-duration:30s] [animation-play-state:running] motion-reduce:animate-none group-hover:[animation-play-state:paused] will-change-transform">
                {[0, 1].map((loopIndex) => (
                  <ul
                    key={`logo-loop-${loopIndex}`}
                    aria-hidden={loopIndex === 1}
                    className="flex shrink-0 items-center gap-6 pr-6 sm:gap-8 sm:pr-8 md:gap-12 md:pr-12"
                  >
                    {useCms
                      ? cmsItems.map((item) => (
                          <li
                            key={`${loopIndex}-${item.id}`}
                            className="inline-flex h-8 items-center justify-center opacity-56 transition duration-300 hover:opacity-92 sm:h-9"
                          >
                            <span className="relative inline-flex h-full w-[6.2rem] items-center justify-center sm:w-[7rem] md:w-[8.2rem]">
                              <Image
                                src={item.image_url_dark}
                                alt={item.label}
                                width={176}
                                height={48}
                                className="h-full w-full object-contain dark:hidden"
                                sizes="(min-width: 768px) 8.2rem, (min-width: 640px) 7rem, 6.2rem"
                                unoptimized={item.image_url_dark.startsWith("http")}
                              />
                              <Image
                                src={item.image_url_light}
                                alt={item.label}
                                width={176}
                                height={48}
                                className="hidden h-full w-full object-contain dark:block"
                                sizes="(min-width: 768px) 8.2rem, (min-width: 640px) 7rem, 6.2rem"
                                unoptimized={item.image_url_light.startsWith("http")}
                              />
                            </span>
                          </li>
                        ))
                      : stripLogos.map((logo) => (
                          <li
                            key={`${loopIndex}-${logo.key}`}
                            className="inline-flex h-8 items-center justify-center opacity-56 transition duration-300 hover:opacity-92 sm:h-9"
                          >
                            <span className="relative inline-flex h-full w-[6.2rem] items-center justify-center sm:w-[7rem] md:w-[8.2rem]">
                              <Image
                                src={getMarqueeLogoSrc(logo.baseName, "dark")}
                                alt={logo.alt}
                                width={176}
                                height={48}
                                className="h-full w-full object-contain dark:hidden"
                                sizes="(min-width: 768px) 8.2rem, (min-width: 640px) 7rem, 6.2rem"
                              />
                              <Image
                                src={getMarqueeLogoSrc(logo.baseName, "light")}
                                alt={logo.alt}
                                width={176}
                                height={48}
                                className="hidden h-full w-full object-contain dark:block"
                                sizes="(min-width: 768px) 8.2rem, (min-width: 640px) 7rem, 6.2rem"
                              />
                            </span>
                          </li>
                        ))}
                  </ul>
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      <SectionReveal className="container" effect="zoom">
        <SectionHeading eyebrow="Selected Work" title="Strategic work, delivered." />
        <div className="section-shell relative overflow-hidden border-white/14 bg-[#0d0d0f]/94 p-4 md:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accentA/35 to-transparent" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accentA/12 blur-3xl" />

          <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-white/12 pb-4">
            <p className="max-w-xl text-sm text-ivory/66 md:text-base">
              Every project starts with a problem and ends with a platform. Here&apos;s a selection of brands and websites we&apos;ve designed and built for businesses worldwide.
            </p>
            <Link href="/works" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ivory/74 transition-colors duration-300 hover:text-ivory">
              View all projects
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <HomeProjectsSlider projects={projectCards} />
        </div>
      </SectionReveal>

      <SectionReveal className="container" effect="zoom">
        <div className="section-shell relative overflow-hidden border-accentA/20 p-0">
          <div className="pointer-events-none absolute -left-20 -top-20 hidden h-60 w-60 rounded-full bg-accentA/8 blur-[100px] md:block" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 hidden h-48 w-48 rounded-full bg-accentB/6 blur-[80px] md:block" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accentA/5 blur-[60px] md:block" />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-accentA/50 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px bg-gradient-to-r from-transparent via-accentA/25 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-px bg-gradient-to-b from-transparent via-accentA/20 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-px bg-gradient-to-b from-transparent via-accentA/20 to-transparent" />

          <div className="relative z-10 px-6 py-10 text-center md:px-12 md:py-16 lg:py-20">
            <p className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-accentA/80">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-accentA/60" aria-hidden="true" />
              Ready to start?
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-accentA/60" aria-hidden="true" />
            </p>

            <h2 className="mx-auto mt-6 max-w-3xl text-[clamp(2.2rem,5.5vw,4rem)] font-semibold leading-[1.1] tracking-tight">
              Let&apos;s build your brand and website <span className="gradient-text">the right way.</span>
            </h2>

            <div className="mx-auto mt-5 h-[2px] w-24 overflow-hidden rounded-full bg-border/20">
              <div className="h-full w-full animate-[shimmer_2.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-accentA/80 to-transparent" />
            </div>

            <p className="mx-auto mt-6 max-w-lg text-[0.95rem] leading-relaxed text-fg/60 md:text-base">
              Tell us what you&apos;re working on. We handle the strategy, design, and development from first brief to launch day.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="relative overflow-hidden px-8 shadow-[0_0_30px_rgba(0,82,204,0.25)]">
                <Link href="/contact">
                  <span className="relative z-10">Start a Project</span>
                </Link>
              </Button>
              <Link href="/works" className="link-sweep text-sm text-fg/60 transition-colors hover:text-fg/90 sm:text-base">
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="container" effect="left">
        <SectionHeading eyebrow="About" title="A studio that does both." />
        <FounderIntroSection showIntroLabel={false} />
      </SectionReveal>

      <SectionReveal className="container" effect="right">
        <SectionHeading eyebrow="Services" title="Everything you need to build a strong digital presence." />
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => {
            const ServiceIcon = serviceIcons[service.key] ?? Sparkles;
            return (
              <article
                key={service.key}
                className="group relative overflow-hidden rounded-2xl border border-border/16 bg-card/72 p-6 shadow-[0_8px_20px_rgba(13,13,15,0.06)] transition-transform duration-200 hover:-translate-y-0.5 md:p-7"
              >
                <Link href={`/services/${service.key}`} className="absolute inset-0 z-20" aria-label={`Learn more about ${service.title}`} />
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accentA/0 blur-2xl transition-[background-color] duration-500 group-hover:bg-accentA/8" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accentA/28 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-accentA/28 bg-accentA/8 text-accentA transition-[border-color,background-color,box-shadow] duration-200 group-hover:border-accentA/44 group-hover:bg-accentA/14 group-hover:shadow-[0_0_0_4px_rgba(0,163,255,0.08)]">
                    <ServiceIcon className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <h3 className="mt-4 text-[1.05rem] font-semibold text-fg/96 md:text-lg">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg/62 md:text-[0.95rem]">{service.body}</p>
                  {"outcome" in service && service.outcome ? (
                    <p className="mt-3 border-t border-border/10 pt-3 text-xs text-fg/50">
                      <span className="font-medium text-accentA/80">Result: </span>{service.outcome}
                    </p>
                  ) : null}
                  <span className="mt-4 inline-flex items-center gap-1 text-[0.68rem] uppercase tracking-[0.16em] text-accentA/0 transition-[color,opacity] duration-200 group-hover:text-accentA/86">
                    Learn more
                    <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </SectionReveal>

      <SectionReveal className="container mt-6 md:mt-8 lg:mt-10" effect="right">
        <SectionHeading eyebrow="Testimonials" title="Client Stories" />
        <DeferredTestimonialsSection items={testimonials} metrics={testimonialMetrics} showLeadText={false} />
      </SectionReveal>

      <SectionReveal className="container" effect="left">
        <SectionHeading eyebrow="Support" title="FAQ" />
        <div className="mx-auto max-w-3xl space-y-4">
          {homeFaqs.map((item, index) => (
            <details
              key={item.id}
              open={index === 0}
              className="group rounded-[1.9rem] border border-border/16 bg-card/78 px-4 py-4 transition-colors duration-300 open:border-accentA/70 open:shadow-[0_0_0_1px_rgba(0,163,255,0.2)] sm:px-6 sm:py-5 md:px-7"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/45 focus-visible:ring-offset-2 focus-visible:ring-offset-bg [&::-webkit-details-marker]:hidden">
                <h3 className="text-base font-medium sm:text-lg md:text-[1.32rem]">{item.q}</h3>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border/22 bg-bg/76 p-[0.45rem] text-fg/72 shadow-[0_8px_18px_rgba(13,13,15,0.08)] transition-[border-color,background-color,color] duration-150 group-open:border-accentA/40 group-open:bg-accent-gradient group-open:text-ivory">
                  <Plus className="h-[1.06rem] w-[1.06rem] stroke-[2.6] group-open:hidden" />
                  <Minus className="hidden h-[1.06rem] w-[1.06rem] stroke-[2.6] group-open:block" />
                </span>
              </summary>
              <p className="pt-4 text-sm leading-relaxed text-fg/68 md:text-base">{item.a}</p>
            </details>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal className="container" effect="zoom">
        <SectionHeading eyebrow="Contact" title="Let's Build Something You're Proud Of" />
        <div className="section-shell relative overflow-hidden border-border/14 bg-bg/62 p-4 md:p-5">
          <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-accentA/12 blur-3xl" />
          <div className="relative z-10 space-y-3">
            <h3 className="text-lg font-semibold md:text-xl">Tell us what you&apos;re working on.</h3>
            <p className="max-w-[46rem] text-sm leading-relaxed text-fg/64">
              A new brand, a website redesign, or a CMS setup. Whatever stage you are at, we would love to hear about it.
              <br />
              We respond within 24 hours with clear next steps. No jargon, no pressure.
            </p>

            <DeferredLeadForm />

            <div className="border-t border-border/14 pt-3">
              <div className="flex flex-col gap-2.5 md:flex-row md:items-end md:justify-between">
                <p className="text-[0.72rem] text-fg/56">Response time: within 24 hours</p>
                <div className="flex flex-wrap items-center gap-4 text-sm md:justify-end">
                  <a href={`mailto:${companyContact.email}`} className="link-sweep inline-flex w-fit items-center gap-2 text-fg/74">
                    <Mail className="h-4 w-4 text-accentA" aria-hidden="true" />
                    <span>{companyContact.email}</span>
                  </a>
                  <a href={`tel:${companyContact.phoneHref}`} className="link-sweep inline-flex w-fit items-center gap-2 text-fg/74">
                    <Phone className="h-4 w-4 text-accentA" aria-hidden="true" />
                    <span>{companyContact.phoneDisplay}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
