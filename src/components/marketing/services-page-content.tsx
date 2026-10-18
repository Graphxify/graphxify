import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLink } from "@/components/site/arrow-link";
import { CtaBlock } from "@/components/site/cta-block";
import { PageHero } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/site/project-card";
import { Reveal } from "@/components/site/reveal";
import { SectionIntro } from "@/components/site/section-intro";
import { CheckItem, RenderImage, serviceFacts, serviceHref, serviceInfo, serviceRender } from "@/components/marketing/service-detail";
import type { ServiceWorkCard } from "@/app/(marketing)/services/work-cards";
import { getProjectArt } from "@/lib/project-art";
import { cn } from "@/lib/utils";

const comparison = {
  typical: ["One-off designs", "Hard-to-manage websites", "Rigid page builders", "Slow heavy builds", "Frequent redesigns required"],
  graphxify: ["Structured brand systems", "Scalable website architecture", "Clean CMS structure", "Fast modern performance", "Built for long-term growth"]
} as const;

const startingPoints = [
  {
    scenario: "Starting from scratch",
    recommendation: "Begin with Brand Systems to establish your identity, then move into Web Design and Development.",
    service: "brand-systems"
  },
  {
    scenario: "You have a brand but need a new website",
    recommendation: "Web Design and Web Development using your existing brand assets.",
    service: "web-design"
  },
  {
    scenario: "Your site is live but your team can't update it",
    recommendation: "CMS Architecture as a standalone engagement to restructure your content management.",
    service: "cms-architecture"
  }
] as const;

const pad = (n: number): string => String(n).padStart(2, "0");
const cardHover = "transition-[transform,box-shadow] duration-300 ease-out hover:shadow-lift motion-safe:hover:-translate-y-1";

export function ServicesPageContent({ works }: { works: readonly ServiceWorkCard[] }): JSX.Element {
  const featured = new Set(serviceInfo.map((service) => service.art.slug));
  // Lead with case studies the service sections above don't already show.
  const selectedWork = [...works.filter((work) => !featured.has(work.pathSlug)), ...works.filter((work) => featured.has(work.pathSlug))].slice(0, 3);

  return (
    <>
      <PageHero
        label="Services"
        title={
          <>
            Branding and websites built as one <span className="text-accentB">system</span>.
          </>
        }
        lead="We handle brand identity, web design, and development as a complete, connected system. No handoffs, no gaps, no version mismatch between what was designed and what was built."
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
      />

      {/* Overview: four cards that jump to each service below. */}
      <nav aria-label="Services on this page" className="container">
        <ol className="grid gap-3 md:gap-4 lg:grid-cols-12">
          {serviceInfo.map((service, index) => {
            const render = serviceRender(service, works);
            return (
              <Reveal as="li" key={service.key} delay={(index % 4) * 60} className={index === 0 || index === 3 ? "lg:col-span-7" : "lg:col-span-5"}>
                <a href={`#${service.key}`} className={cn("group flex h-full items-center gap-5 rounded-[2rem] bg-white p-3 pr-5 md:gap-6 md:pr-7", cardHover)}>
                  {render ? (
                    <span className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-[1.5rem] md:w-32" style={{ backgroundColor: getProjectArt(render.work.pathSlug).stage }}>
                      <RenderImage src={render.src} work={render.work} sizes="128px" decorative />
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1 py-2">
                    <span className="t-small block">{pad(index + 1)}</span>
                    <span className="t-h3 mt-1 block text-fg">{service.title}</span>
                    <span className="t-body mt-1 block !text-[0.9375rem] !leading-snug">{service.description}</span>
                  </span>
                  <span aria-hidden="true" className="hidden h-10 w-10 shrink-0 place-items-center rounded-full bg-bg text-fg transition-colors duration-200 group-hover:bg-fg group-hover:text-white sm:grid">
                    <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                  </span>
                </a>
              </Reveal>
            );
          })}
        </ol>
      </nav>

      {/* One big card per service, render alternating left and right. */}
      <div className="container mt-16 flex flex-col gap-5 md:mt-24 md:gap-6">
        {serviceInfo.map((service, index) => {
          const render = serviceRender(service, works);
          const flip = index % 2 === 1;
          return (
            <Reveal key={service.key}>
              <article id={service.key} aria-labelledby={`${service.key}-title`} className="scroll-mt-24 rounded-[2rem] bg-white md:scroll-mt-28 p-3 md:rounded-[2.5rem] md:p-4">
                <div className="grid gap-3 md:gap-4 lg:grid-cols-2">
                  {render ? (
                    <Link
                      href={`/works/${render.work.pathSlug}`}
                      className={cn("group relative block aspect-[4/3] overflow-hidden rounded-[1.5rem] md:aspect-[16/10] md:rounded-[2rem] lg:self-center", flip && "lg:order-last")}
                      style={{ backgroundColor: getProjectArt(render.work.pathSlug).stage }}
                    >
                      <RenderImage src={render.src} alt={render.alt} work={render.work} sizes="(max-width: 1023px) 100vw, 600px" priority={index === 0} />
                    </Link>
                  ) : null}
                  <div className="flex flex-col px-3 pb-4 pt-4 md:px-6 md:pb-6 lg:px-8 lg:py-8">
                    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                      <p className="t-small">
                        {pad(index + 1)} / {pad(serviceInfo.length)}
                      </p>
                      {render ? (
                        <ArrowLink href={`/works/${render.work.pathSlug}`} className="!text-[0.875rem] text-fg/64">
                          Pictured: {render.pictured}
                        </ArrowLink>
                      ) : null}
                    </div>
                    <h2 id={`${service.key}-title`} className="mt-3 text-[clamp(2rem,3.6vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-fg">
                      {service.title}
                    </h2>
                    <p className="mt-4 text-[1.125rem] font-bold leading-snug tracking-[-0.015em] text-fg">{service.description}</p>
                    <p className="t-body mt-3 !text-[0.9375rem]">{service.body}</p>
                    <h3 className="mt-8 text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-fg/60">Deliverables</h3>
                    <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                      {service.deliverables.map((item) => (
                        <CheckItem key={item}>{item}</CheckItem>
                      ))}
                    </ul>
                    <div className="mt-auto pt-8">
                      <Button asChild>
                        <Link href={serviceHref(service.key)}>
                          Explore {service.title}
                          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
                <dl className="mt-3 grid divide-y divide-white overflow-hidden rounded-[1.25rem] bg-bg md:mt-4 md:grid-cols-3 md:gap-3 md:divide-y-0 md:overflow-visible md:rounded-none md:bg-transparent">
                  {serviceFacts(service).map((fact) => (
                    <div key={fact.label} className="bg-bg px-5 py-4 md:rounded-[1.25rem]">
                      <dt className="t-small">{fact.label}</dt>
                      <dd className="mt-1 text-[0.9375rem] font-bold leading-snug tracking-[-0.01em] text-fg">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* Built differently */}
      <section className="container section">
        <Reveal>
          <SectionIntro badge="Why Graphxify" title={<>Built <span className="text-accentB">differently</span>.</>} lead="A more structured way to design brands and build modern websites." />
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:mt-16 md:grid-cols-2">
          <Reveal className="rounded-[2rem] bg-white p-8 md:p-10">
            <h3 className="t-h3 text-fg/70">Typical agency</h3>
            <ul className="mt-7 space-y-4">
              {comparison.typical.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[0.9375rem] font-semibold text-fg/60">
                  <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-bg text-fg/50">
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
                  <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green text-fg">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Where to start */}
      <section className="container section">
        <Reveal>
          <SectionIntro
            badge="Where to start"
            title={<>Not sure which service you <span className="text-accentB">need</span>?</>}
            lead="Most projects combine two or three services. Here is a quick guide."
          />
        </Reveal>
        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
          {startingPoints.map((item, index) => {
            const service = serviceInfo.find((entry) => entry.key === item.service);
            return (
              <Reveal as="li" key={item.scenario} delay={index * 80}>
                <Link href={serviceHref(item.service)} className={cn("group flex h-full flex-col rounded-[2rem] bg-white p-7 md:p-8", cardHover)}>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-fg text-[0.9375rem] font-extrabold text-white">{index + 1}</span>
                  <h3 className="t-h3 mt-10 max-w-[18ch] text-fg">{item.scenario}</h3>
                  <p className="t-body mt-2 flex-1 !text-[0.9375rem]">{item.recommendation}</p>
                  <span className="mt-8 inline-flex items-center gap-1.5 text-[0.9375rem] font-bold text-fg">
                    See {service?.title}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
        <p className="t-body mt-10 text-center">
          Still not sure?{" "}
          <Link href="/contact" className="font-semibold text-accentB underline-offset-4 hover:underline">
            Tell us about your project
          </Link>{" "}
          and we will recommend the right path.
        </p>
      </section>

      {/* Selected work */}
      {selectedWork.length ? (
        <section className="container section">
          <Reveal>
            <SectionIntro badge="Work" title={<>Selected <span className="text-accentB">work</span>.</>} />
          </Reveal>
          <ul className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3 md:gap-6">
            {selectedWork.map((work, index) => (
              <Reveal as="li" key={work.id} delay={index * 80}>
                <ProjectCard
                  className={cardHover}
                  href={`/works/${work.pathSlug}`}
                  slug={work.pathSlug}
                  title={work.title}
                  industry={work.industry}
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
