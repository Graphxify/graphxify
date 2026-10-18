import { CtaBlock } from "@/components/site/cta-block";

/** Legacy name kept so existing pages pick up the v3 CTA block. */
export function SiteCtaSection({ className }: { className?: string }): JSX.Element {
  return <CtaBlock className={className} contained={false} />;
}
