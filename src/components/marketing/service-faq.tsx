import { FaqList } from "@/components/site/faq-list";
import { SectionIntro } from "@/components/site/section-intro";

export type ServiceFaqItem = { q: string; a: string };

/**
 * Per-page FAQ block: centered intro + FaqList. Answers sit in native
 * <details>, so they are in the initial HTML for crawlers. No FAQPage schema:
 * Google retired the FAQ rich result in May 2026 for everything except
 * authoritative government and health sites, so the markup would do nothing.
 * Callers provide the section and container.
 */
export function ServiceFaq({ items, title = <>Common <span className="text-accentB">questions</span>.</> }: { items: readonly ServiceFaqItem[]; title?: React.ReactNode }): JSX.Element {
  return (
    <>
      <SectionIntro badge="FAQ" title={title} />
      <FaqList className="mx-auto mt-12 max-w-3xl md:mt-16" items={items} />
    </>
  );
}
