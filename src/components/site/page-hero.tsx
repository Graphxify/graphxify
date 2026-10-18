import { cn } from "@/lib/utils";
import { Badge } from "@/components/site/badge";
import { Breadcrumbs, type Crumb } from "@/components/site/breadcrumbs";

export type HeroFact = { label: string; value: React.ReactNode };

/** Inner-page opener: trail, badge, title, lead, actions, facts as white chips, optional media. */
export function PageHero({
  crumbs,
  label,
  title,
  lead,
  actions,
  facts,
  aside,
  className
}: {
  crumbs?: Crumb[];
  label?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  actions?: React.ReactNode;
  facts?: HeroFact[];
  aside?: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <header className={cn("container pb-14 pt-8 md:pb-20 md:pt-12", className)}>
      {crumbs?.length ? <Breadcrumbs items={crumbs} /> : null}
      <div className={cn("grid gap-10", crumbs?.length && "mt-8 md:mt-12", aside ? "lg:grid-cols-12 lg:items-center" : "justify-items-center text-center")}>
        <div className={cn("flex flex-col gap-6", aside ? "items-start lg:col-span-6" : "items-center")}>
          {label ? <Badge>{label}</Badge> : null}
          <h1 className={cn("t-h1 max-w-[16ch] text-fg")}>{title}</h1>
          {lead ? <div className="t-lead max-w-[52ch]">{lead}</div> : null}
          {actions ? <div className={cn("mt-2 flex flex-wrap gap-3", !aside && "justify-center")}>{actions}</div> : null}
        </div>
        {aside ? <div className="lg:col-span-6">{aside}</div> : null}
      </div>
      {facts?.length ? (
        <dl className={cn("mt-12 grid grid-cols-2 gap-3 md:mt-16", facts.length >= 4 ? "md:grid-cols-4" : "md:grid-cols-3")}>
          {facts.map((fact) => (
            <div key={fact.label} className="rounded-[1.5rem] bg-white p-5 md:p-6">
              <dt className="t-small">{fact.label}</dt>
              <dd className="mt-2 text-[1.0625rem] font-bold tracking-[-0.015em] text-fg">{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </header>
  );
}
