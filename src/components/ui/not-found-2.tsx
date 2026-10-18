import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GraphxifyLogo } from "@/components/marketing/graphxify-logo";
import { Badge } from "@/components/site/badge";
import { Button } from "@/components/ui/button";

// Crawlable routes back into the site, so a mistyped or retired URL is a
// dead end for neither visitors nor crawlers. The page still returns HTTP 404.
const recoveryLinks = [
  { href: "/services", label: "Services", body: "Brand, design, development and CMS." },
  { href: "/process", label: "Process", body: "How a project runs, stage by stage." },
  { href: "/contact", label: "Contact", body: "Tell us about your project." }
] as const;

// Rendered by the root not-found route, outside the marketing layout: no site header here.
export function NotFound() {
  return (
    <main className="container flex min-h-[100svh] flex-col pb-10 pt-5 md:pb-14 md:pt-8">
      <Link href="/" aria-label="Graphxify home" className="inline-flex w-fit self-center rounded-full bg-white px-5 py-3 md:self-start">
        <GraphxifyLogo alt="Graphxify" width={246} height={68} priority className="h-auto w-[7rem] md:w-[7.5rem]" />
      </Link>

      <div className="flex flex-1 flex-col items-center justify-center py-16 text-center md:py-24">
        <Badge dot="blue">404</Badge>
        <h1 className="t-display mt-7 max-w-[12ch] text-fg">
          Page not <span className="text-accentB">found</span>.
        </h1>
        <p className="t-lead mt-6 max-w-[44ch]">The page you&apos;re looking for might have been moved or doesn&apos;t exist.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/works">See our work</Link>
          </Button>
        </div>
      </div>

      <nav aria-label="Popular pages">
        <ul className="grid gap-3 md:grid-cols-3 md:gap-4">
          {recoveryLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full items-center justify-between gap-4 rounded-[1.75rem] bg-white p-6 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lift motion-reduce:transform-none md:p-7"
              >
                <span>
                  <span className="t-h3 block text-fg">{link.label}</span>
                  <span className="t-small mt-1 block">{link.body}</span>
                </span>
                <span aria-hidden="true" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg text-fg transition-colors duration-200 group-hover:bg-fg group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
