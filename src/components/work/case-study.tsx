import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { Badge } from "@/components/site/badge";
import { Reveal } from "@/components/site/reveal";
import { SectionIntro } from "@/components/site/section-intro";
import { Button } from "@/components/ui/button";
import { shouldBypassNextImageOptimization } from "@/lib/content-helpers";
import type { ProjectArt } from "@/lib/project-art";
import { cn } from "@/lib/utils";

export type CaseFact = { label: string; value: React.ReactNode };

/** Opening stage in the client's own colour: industry, title, summary, facts and the lead render. */
export function CaseHero({
  title,
  industry,
  summary,
  facts,
  image,
  imageAlt,
  art,
  liveUrl,
  analyticsSlug
}: {
  title: string;
  industry: string;
  summary: string;
  facts: CaseFact[];
  image: string;
  imageAlt: string;
  art: ProjectArt;
  liveUrl?: string;
  analyticsSlug: string;
}): JSX.Element {
  const light = art.tone === "light";
  return (
    <div
      className={cn("relative isolate overflow-hidden rounded-[2rem] px-3 pb-3 pt-12 md:rounded-[2.5rem] md:px-5 md:pb-5 md:pt-20 lg:pt-24", light ? "text-white" : "text-fg")}
      style={{ backgroundColor: art.stage }}
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(55%_60%_at_50%_0%,rgba(255,255,255,0.16),transparent)]" />
      <div className="flex flex-col items-center px-2 text-center md:px-5">
        <Badge tone={light ? "dark" : "light"}>{industry}</Badge>
        <h1 className="t-display mt-6 max-w-[14ch]">{title}</h1>
        <p className={cn("t-lead mt-6 max-w-[46ch]", light ? "!text-white/72" : "!text-fg/72")}>{summary}</p>
        <dl className="mt-9 flex max-w-4xl flex-wrap justify-center gap-2">
          {facts.map((fact) => (
            <div key={fact.label} className={cn("flex items-baseline gap-2 rounded-full px-4 py-2.5 text-[0.9375rem]", light ? "bg-white/10" : "bg-black/10")}>
              <dt className={light ? "text-white/60" : "text-fg/64"}>{fact.label}</dt>
              <dd className="font-bold">{fact.value}</dd>
            </div>
          ))}
        </dl>
        {liveUrl ? (
          <Button asChild size="lg" variant={light ? "inverse" : "default"} className="mt-8">
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" data-analytics-project={analyticsSlug}>
              Visit site
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        ) : null}
      </div>
      <div className="relative mt-12 aspect-[4/3] overflow-hidden rounded-[1.5rem] motion-safe:animate-[fadeIn_900ms_ease-out_both] md:mt-16 md:aspect-[16/9] md:rounded-[2rem]">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          unoptimized={shouldBypassNextImageOptimization(image)}
          sizes="(max-width: 1280px) 100vw, 1200px"
          className="object-cover"
        />
      </div>
    </div>
  );
}

/** The overview as one large statement: first sentence big, the rest as supporting copy. */
export function CaseOverview({ text }: { text: string }): JSX.Element {
  // A sentence ends after a lowercase word, so initialisms like "B.O.S.S." don't split the statement.
  const [, statement = text, rest = ""] = text.match(/^(.+?[a-z0-9)]{2}[.!?])\s+([\s\S]+)$/) ?? [];
  return (
    <section aria-labelledby="case-overview" className="container section">
      <Reveal className="grid gap-8 md:grid-cols-12 md:gap-10">
        <h2 id="case-overview" className="md:col-span-3 md:pt-3">
          <Badge className="tracking-normal">Overview</Badge>
        </h2>
        <div className="md:col-span-9">
          <p className="t-h2 max-w-[20ch] text-fg">{statement}</p>
          {rest ? <p className="t-lead mt-8 max-w-[52ch] md:mt-10">{rest}</p> : null}
        </div>
      </Reveal>
    </section>
  );
}

/** Challenge, approach and solution as numbered cards, then the result on a dark card. */
export function CaseStory({ steps, result, services }: { steps: Array<{ title: string; body: string }>; result: string; services: string[] }): JSX.Element {
  return (
    <section aria-label="Challenge, approach and solution" className="container section pt-0 md:pt-0 lg:pt-0">
      <Reveal>
        <SectionIntro align="left" badge="The project" title={<>From challenge to <span className="text-accentB">result</span></>} />
      </Reveal>
      <ol className={cn("mt-12 grid gap-4 md:mt-16", steps.length === 2 ? "md:grid-cols-2" : "lg:grid-cols-3")}>
        {steps.map((step, index) => (
          <Reveal as="li" key={step.title} delay={index * 80} className="flex flex-col rounded-[2rem] bg-white p-7 md:p-8">
            <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-full bg-fg text-[0.9375rem] font-extrabold text-white">
              {index + 1}
            </span>
            <h3 className="t-h3 mt-10 text-fg">{step.title}</h3>
            <p className="t-body mt-3">{step.body}</p>
          </Reveal>
        ))}
      </ol>
      {result ? (
        <Reveal className="mt-4 grid gap-10 rounded-[2rem] bg-fg p-7 text-white md:grid-cols-12 md:gap-8 md:rounded-[2.5rem] md:p-12 lg:p-14">
          <div className="md:col-span-8">
            <h3 className="inline-flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-1.5 pr-3.5 text-[0.8125rem] font-semibold tracking-normal">
              <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-green text-fg">
                <Check className="h-3.5 w-3.5" />
              </span>
              Result
            </h3>
            <p className="mt-7 max-w-[30ch] text-[clamp(1.375rem,2.6vw,2.25rem)] font-bold leading-[1.2] tracking-[-0.03em]">{result}</p>
          </div>
          {services.length ? (
            <div className="md:col-span-4 md:border-l md:border-white/10 md:pl-10">
              <p className="text-[0.875rem] font-semibold text-white/60">Delivered</p>
              <ul className="mt-5 space-y-3.5">
                {services.map((service) => (
                  <li key={service} className="flex items-center gap-3 text-[0.9375rem] font-semibold">
                    <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green text-fg">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Reveal>
      ) : null}
    </section>
  );
}
