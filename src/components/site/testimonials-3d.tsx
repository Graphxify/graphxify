import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type Testimonial3DItem = { id: string; quote: string; name: string; role: string; rating?: number };

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function Card({ item, dark }: { item: Testimonial3DItem; dark: boolean }): JSX.Element {
  return (
    <figure className={cn("w-60 rounded-[1.5rem] p-5 shadow-[0_20px_40px_-24px_rgba(10,10,10,0.35)] md:w-64", dark ? "bg-fg text-white" : "bg-white text-fg")}>
      {item.rating ? (
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("h-3.5 w-3.5", i < Math.round(item.rating ?? 0) ? (dark ? "fill-green text-green" : "fill-fg text-fg") : "text-fg/20")} />
          ))}
        </div>
      ) : null}
      <blockquote className="mt-3 line-clamp-5 text-[0.9375rem] font-semibold leading-relaxed tracking-[-0.01em]">&ldquo;{item.quote}&rdquo;</blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full text-[0.75rem] font-extrabold", dark ? "bg-white text-fg" : "bg-fg text-white")}>{initials(item.name)}</span>
        <span className="min-w-0">
          <span className="block truncate text-[0.875rem] font-bold">{item.name}</span>
          <span className={cn("block truncate text-[0.75rem] font-medium", dark ? "text-white/60" : "text-fg/60")}>{item.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * 3D testimonial marquee (after the 21st.dev "3D Testimonials" / Magic UI 3D marquee pattern):
 * four vertical columns scrolling in alternate directions on a tilted plane. CSS-only.
 * The moving wall is decorative; every testimonial is also rendered once as an accessible list.
 */
export function Testimonials3D({ items, className }: { items: Testimonial3DItem[]; className?: string }): JSX.Element | null {
  if (items.length === 0) return null;
  // Each column starts at a different testimonial so neighbours never match.
  const columns = [0, 1, 2, 3].map((c) => items.map((_, i) => items[(i + c * 2) % items.length]));

  return (
    <div className={className}>
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item.id}>
            <blockquote>&ldquo;{item.quote}&rdquo;</blockquote>
            <p>
              {item.name}, {item.role}
              {item.rating ? `, rated ${item.rating} out of 5` : ""}
            </p>
          </li>
        ))}
      </ul>
      <div aria-hidden="true" className="relative h-[28rem] overflow-hidden sm:h-[34rem] rounded-[2rem] [perspective:1000px] md:h-[40rem]">
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-4 [transform:translateX(-50%)_translateY(-50%)_translateZ(-100px)_rotateX(20deg)_rotateY(-10deg)_rotateZ(20deg)]">
          {columns.map((column, c) => (
            <div key={c} className="h-[64rem] overflow-hidden">
              <div
                className={cn(
                  "flex flex-col motion-safe:animate-[marquee-y_var(--marquee-duration)_linear_infinite]",
                  c % 2 === 1 && "[animation-direction:reverse]"
                )}
                style={{ ["--marquee-duration" as string]: `${48 + c * 6}s` }}
              >
                {/* Two identical copies with trailing padding so -50% loops seamlessly. */}
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex flex-col gap-4 pb-4">
                    {column.map((item, i) => (
                      <Card key={`${item.id}-${i}`} item={item} dark={(i + c) % 4 === 0} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-bg" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-bg" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-bg" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-bg" />
      </div>
    </div>
  );
}
