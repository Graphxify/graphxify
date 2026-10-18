import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type FaqItem = { q: string; a: React.ReactNode };

/** White rounded native disclosures: keyboard and screen-reader friendly by default. */
export function FaqList({ items, defaultOpen = 0, className }: { items: readonly FaqItem[]; defaultOpen?: number | null; className?: string }): JSX.Element {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item, index) => (
        <details key={item.q} open={index === defaultOpen} className="group rounded-[1.5rem] bg-white px-6 transition-shadow duration-300 open:shadow-[0_20px_40px_-30px_rgba(10,10,10,0.35)] md:px-8">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden">
            <h3 className="text-[1.0625rem] font-bold tracking-[-0.015em] text-fg md:text-lg">{item.q}</h3>
            <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-fg text-white transition-transform duration-300 ease-out group-open:rotate-45">
              <Plus className="h-4 w-4" />
            </span>
          </summary>
          <div className="t-body max-w-[64ch] pb-7">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
