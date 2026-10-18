import { SectionIntro } from "@/components/site/section-intro";

/** v3 name kept for existing markup; renders a left-aligned v4 SectionIntro. */
export function SectionHeader({
  label,
  title,
  intro,
  action,
  as = "h2",
  className
}: {
  label?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  action?: React.ReactNode;
  as?: "h1" | "h2";
  className?: string;
}): JSX.Element {
  return <SectionIntro align="left" badge={label} title={title} lead={intro} action={action} as={as} className={className} />;
}
