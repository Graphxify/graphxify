import Image from "next/image";
import { Images } from "lucide-react";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllMarqueeItems } from "@/db/queries/marquee";
import { requirePermission } from "@/lib/auth/requireRole";
import { deleteMarqueeItem, toggleMarqueeItem } from "./actions";
import { EditMarqueeItem } from "./edit-marquee-item";
import { AddMarqueeItem } from "./add-marquee-item";

export default async function DashboardMarqueePage() {
  await requirePermission("content.works.edit_any");
  const items = await getAllMarqueeItems();

  return (
    <section className="space-y-5">
      <RevealStagger className="space-y-5">

        {/* Header */}
        <RevealItem>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Site</p>
            <h1 className="text-3xl font-semibold">Marquee</h1>
            <p className="text-sm text-fg/56">
              Manage the scrolling logo strip on the homepage. Add or remove images, or hide individual items without deleting them.
            </p>
          </div>
        </RevealItem>

        {/* Current items */}
        <RevealItem>
          <div className="section-shell border-border/18 bg-card/72 p-4 md:p-6">
            <p className="mb-4 text-xs uppercase tracking-[0.18em] text-fg/44">
              Current items — {items.length}
            </p>

            {items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <Images className="h-8 w-8 text-fg/28" />
                <p className="text-sm text-fg/56">No marquee items yet. Add your first image below.</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`group relative overflow-hidden rounded-xl border bg-card/60 p-3 transition-[border-color] duration-200 ${
                      item.enabled ? "border-border/18" : "border-border/10 opacity-50"
                    }`}
                  >
                    {/* Image preview — dark + light side by side */}
                    <div className="relative mb-3 grid grid-cols-2 gap-1.5">
                      <div className="flex h-14 items-center justify-center overflow-hidden rounded-lg border border-border/12 bg-bg/48">
                        <Image
                          src={item.image_url_dark}
                          alt={`${item.label} dark`}
                          width={120}
                          height={36}
                          className="max-h-8 w-auto object-contain"
                          unoptimized
                        />
                      </div>
                      <div className="flex h-14 items-center justify-center overflow-hidden rounded-lg border border-border/12 bg-fg/6">
                        <Image
                          src={item.image_url_light}
                          alt={`${item.label} light`}
                          width={120}
                          height={36}
                          className="max-h-8 w-auto object-contain"
                          unoptimized
                        />
                      </div>
                    </div>

                    {/* Label + status */}
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-fg/88">{item.label}</p>
                      <Badge variant={item.enabled ? "success" : "secondary"} className="shrink-0 text-[0.6rem]">
                        {item.enabled ? "Visible" : "Hidden"}
                      </Badge>
                    </div>

                    {/* URLs truncated */}
                    <p className="mb-0.5 truncate text-[0.68rem] text-fg/40">{item.image_url_dark}</p>
                    <p className="mb-3 truncate text-[0.68rem] text-fg/40">{item.image_url_light}</p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {/* Toggle visible/hidden */}
                      <form action={toggleMarqueeItem} className="flex-1">
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="enabled" value={String(!item.enabled)} />
                        <Button
                          type="submit"
                          variant="secondary"
                          size="sm"
                          className="h-8 w-full text-xs"
                        >
                          {item.enabled ? "Hide" : "Show"}
                        </Button>
                      </form>

                      <EditMarqueeItem
                        id={item.id}
                        image_url_dark={item.image_url_dark}
                        image_url_light={item.image_url_light}
                        label={item.label}
                      />

                      {/* Delete */}
                      <form action={deleteMarqueeItem}>
                        <input type="hidden" name="id" value={item.id} />
                        <Button
                          type="submit"
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-red-400 hover:bg-red-500/8 hover:text-red-400"
                        >
                          Remove
                        </Button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </RevealItem>

        {/* Add new item */}
        <RevealItem>
          <div className="section-shell border-border/18 bg-card/72 p-4 md:p-6">
            <p className="mb-4 text-xs uppercase tracking-[0.18em] text-fg/44">Add image</p>
            <AddMarqueeItem />
          </div>
        </RevealItem>

        {/* Usage notes */}
        <RevealItem>
          <div className="rounded-xl border border-border/12 bg-bg/48 px-4 py-3">
            <p className="text-[0.7rem] uppercase tracking-[0.16em] text-fg/40">Notes</p>
            <ul className="mt-2 space-y-1 text-xs text-fg/56">
              <li>• Changes appear on the homepage within 60 seconds (ISR revalidation).</li>
              <li>• "Hide" keeps the item in the list but removes it from the public marquee without deleting it.</li>
              <li>• Items are displayed in sort order (ascending). The order is set automatically as items are added.</li>
              <li>• For best results use a transparent-background image at 176 × 48 px (SVG preferred).</li>
            </ul>
          </div>
        </RevealItem>

      </RevealStagger>
    </section>
  );
}
