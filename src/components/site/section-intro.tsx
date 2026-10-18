import { cn } from "@/lib/utils";
import { Badge } from "@/components/site/badge";

/** Badge + title + lead. Centered by default; `align="left"` for editorial sections. */
export function SectionIntro({
  badge,
  badgeIcon,
  title,
  lead,
  action,
  align = "center",
  tone = "light",
  as: Heading = "h2",
  className
}: {
  badge?: string;
  badgeIcon?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  action?: React.ReactNode;
  align?: "center" | "left";
  tone?: "light" | "dark";
  as?: "h1" | "h2";
  className?: string;
}): JSX.Element {
  const center = align === "center";
  return (
    <div className={cn("flex flex-col gap-5", center ? "items-center text-center" : "items-start", className)}>
      {badge ? (
        <Badge tone={tone} icon={badgeIcon}>
          {badge}
        </Badge>
      ) : null}
      <Heading className={cn(Heading === "h1" ? "t-h1" : "t-h2", "max-w-[18ch]", tone === "dark" ? "text-white" : "text-fg")}>{title}</Heading>
      {lead ? <p className={cn("t-lead max-w-[52ch]", tone === "dark" && "!text-white/64")}>{lead}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
