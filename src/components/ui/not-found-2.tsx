import Link from "next/link";
import { HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

// Crawlable routes back into the site, so a mistyped or retired URL is a
// dead end for neither visitors nor crawlers. The page still returns HTTP 404.
const recoveryLinks = [
  { href: "/works", label: "View Work" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" }
] as const;

export function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4">
      <Empty className="max-w-xl bg-card/76 backdrop-blur-md">
        <EmptyHeader>
          <EmptyTitle
            className="font-extrabold leading-none text-[clamp(5.5rem,18vw,8.75rem)] text-fg/90"
            style={{
              WebkitMaskImage:
                "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.86) 26%, rgba(255,255,255,0.2) 46%, rgba(255,255,255,0.04) 58%, rgba(255,255,255,0) 70%)",
              maskImage:
                "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.86) 26%, rgba(255,255,255,0.2) 46%, rgba(255,255,255,0.04) 58%, rgba(255,255,255,0) 70%)"
            }}
          >
            <h1 className="font-[inherit]">
              404<span className="sr-only"> — Page not found</span>
            </h1>
          </EmptyTitle>
          <EmptyDescription className="-mt-9 text-fg/78">
            The page you&apos;re looking for might have been <br />
            moved or doesn&apos;t exist.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link href="/">
                <HomeIcon className="mr-2 size-4" data-icon="inline-start" />
                Go Home
              </Link>
            </Button>
          </div>
          <nav aria-label="Popular pages" className="mt-4">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-fg/66">
              {recoveryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-sweep hover:text-fg">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </EmptyContent>
      </Empty>
    </div>
  );
}
