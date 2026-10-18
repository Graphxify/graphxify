import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Badge } from "@/components/site/badge";
import { Button } from "@/components/ui/button";
import { companyContact } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** The closing panel: charcoal with a blue and green glow. One per page, last. */
export function CtaBlock({
  title = "Ready to build something you're proud of?",
  body = "Tell us what you're working on. We reply within 24 hours with clear next steps. No jargon, no pressure.",
  className,
  contained = true,
  children
}: {
  title?: React.ReactNode;
  body?: React.ReactNode;
  className?: string;
  /** false when the caller already provides a `.container`. */
  contained?: boolean;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <section className={cn(contained && "container", className)}>
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-charcoal px-6 py-14 text-white md:rounded-[2.5rem] md:px-14 md:py-20">
        <div aria-hidden="true" className="absolute -right-24 -top-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-accentA/25 blur-[120px]" />
        <div aria-hidden="true" className="absolute -bottom-40 -left-20 -z-10 h-[22rem] w-[22rem] rounded-full bg-green/15 blur-[120px]" />
        <div className="flex flex-col items-center text-center">
          <Badge tone="dark" dot="green">
            Available for new projects
          </Badge>
          <h2 className="t-h2 mt-6 max-w-[16ch] text-white">{title}</h2>
          <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-white/64">{body}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="inverse">
              <Link href="/contact">Start a project</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10">
              <a href={`tel:${companyContact.phoneHref}`}>
                <Phone className="h-4 w-4" aria-hidden="true" />
                {companyContact.phoneDisplay}
              </a>
            </Button>
          </div>
          <a href={`mailto:${companyContact.email}`} className="mt-5 inline-flex items-center gap-2 text-[0.9375rem] text-white/64 hover:text-white">
            <Mail className="h-4 w-4" aria-hidden="true" />
            {companyContact.email}
          </a>
        </div>
        {children ? <div className="mx-auto mt-12 max-w-4xl">{children}</div> : null}
      </div>
    </section>
  );
}
