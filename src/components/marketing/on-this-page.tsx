import { cn } from "@/lib/utils";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Sticky in-page contents card for long-form pages. Desktop (lg+) only; anchors need matching ids. */
export function OnThisPage({ items, numbered = false, className }: { items: { id: string; label: string }[]; numbered?: boolean; className?: string }): JSX.Element | null {
  if (items.length < 2) return null;
  return (
    <nav aria-label="On this page" className={cn("hidden rounded-[1.5rem] bg-white p-6 lg:sticky lg:top-28 lg:block lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto", className)}>
      <p className="text-[0.8125rem] font-bold text-fg">On this page</p>
      <ol className="mt-4 space-y-0.5">
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="-mx-3 flex gap-3 rounded-xl px-3 py-2 text-[0.875rem] font-medium leading-snug text-fg/60 transition-colors duration-200 hover:bg-bg hover:text-fg"
            >
              {numbered ? <span className="tabular-nums text-fg/40">{String(index + 1).padStart(2, "0")}</span> : null}
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
