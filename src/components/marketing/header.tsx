import Link from "next/link";
import { marketingNav } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function MarketingHeader(): JSX.Element {
  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(242,240,235,0.12)] bg-[rgba(13,13,15,0.9)] backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-[0.16em]">
          GRAPHXIFY
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {marketingNav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-[rgba(242,240,235,0.85)] hover:text-ivory">
              {item.label}
            </Link>
          ))}
        </nav>
        <Button asChild size="sm">
          <Link href="/contact">Book a call</Link>
        </Button>
      </div>
    </header>
  );
}
