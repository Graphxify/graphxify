import Image from "next/image";
import { Database, Fingerprint, PenTool } from "lucide-react";
import aboutGraphxifyVisual from "../../../public/images/about/about-graphxify-visual.png";
import { cn } from "@/lib/utils";

const focusItems = [
  {
    title: "Brand & Identity",
    description: "Everything from logo to messaging.",
    Icon: Fingerprint
  },
  {
    title: "Design & Development",
    description: "One team. No handoff gaps.",
    Icon: PenTool
  },
  {
    title: "Content Management",
    description: "Your team stays in control.",
    Icon: Database
  }
] as const;

const founderCopy =
  "Graphxify is a Toronto-based studio led by a designer who also builds, which means your project is never passed between people who do not communicate. We handle brand identity, web design, and development in one place, so what gets designed is exactly what gets built. No handoffs, no gaps, no surprises.";

export function FounderIntroSection({
  className,
  showIntroLabel = true
}: {
  className?: string;
  showIntroLabel?: boolean;
}): JSX.Element {
  return (
    <section className={cn("relative", className)}>
      {showIntroLabel ? <p className="mb-6 text-center text-[0.9rem] text-fg/54">(Intro)</p> : null}

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-border/20 bg-card/78 p-2.5">
          <div className="relative h-[19rem] overflow-hidden rounded-[1.65rem] sm:h-[22rem] md:h-[32rem]">
            <Image
              src={aboutGraphxifyVisual}
              alt="Graphxify brand and web systems preview"
              fill
              loading="lazy"
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 44vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(13,13,15,0)_35%,rgba(13,13,15,0.58)_100%)]" />
          </div>
        </div>

        <div className="section-shell border-border/20 bg-card/72 p-5 sm:p-6 md:p-8 lg:p-10">
          <h2 className="text-2xl font-semibold md:text-4xl">A studio that understands both sides.</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg/68 md:text-[1.18rem] md:leading-[1.5]">
            {founderCopy}
          </p>

          <div className="mt-7 border-t border-border/16 pt-5">
            <p className="text-[0.66rem] uppercase tracking-[0.16em] text-fg/58">Our Focus</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {focusItems.map((item) => {
                const Icon = item.Icon;
                return (
                  <article
                    key={item.title}
                    className="group rounded-xl border border-border/16 bg-bg/44 p-3.5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-border/28"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-accentA/30 bg-accentA/8 text-accentA transition-[transform,box-shadow] duration-200 group-hover:scale-[1.02] group-hover:shadow-[0_0_0_3px_rgba(0,163,255,0.12)]">
                      <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <p className="mt-2.5 text-[0.98rem] font-medium text-fg/92">{item.title}</p>
                    <p className="mt-1 text-sm text-fg/62">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
