import Link from "next/link";
import { BackToTop } from "@/components/marketing/back-to-top";
import { TorontoClock } from "@/components/marketing/toronto-clock";

export function MarketingFooter(): JSX.Element {
  return (
    <footer className="border-t border-[rgba(242,240,235,0.12)]">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm tracking-[0.16em]">GRAPHXIFY</p>
          <p className="text-sm text-[rgba(242,240,235,0.75)]">Enterprise websites + CMS systems built for premium brands.</p>
          <p className="text-sm text-[rgba(242,240,235,0.75)]">
            <TorontoClock />
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/privacy" className="hover:text-accentA">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-accentA">
            Terms
          </Link>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
