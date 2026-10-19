import { notFound } from "next/navigation";
import { TestimonialForm } from "@/app/dashboard/(components)/testimonial-form";
import { DeleteContentButton } from "@/app/dashboard/(components)/delete-content-button";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Card, CardContent } from "@/components/ui/card";
import { getTestimonialById } from "@/db/queries/testimonials";
import { requirePermission } from "@/lib/auth/requireRole";

type Params = { id: string };

export default async function DashboardTestimonialEditorPage({ params }: { params: Promise<Params> }) {
  await requirePermission("content.testimonials.edit");
  const { id } = await params;
  const isNew = id === "new";

  const testimonial = isNew ? null : await getTestimonialById(id);
  if (!isNew && !testimonial) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <RevealStagger className="space-y-6">
        <RevealItem className="space-y-1">
          <p className="inline-flex items-center gap-2 rounded-full bg-white py-1 pl-2.5 pr-3 text-[0.8125rem] font-semibold text-fg"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-fg" />Editor</p>
          <h1 className="text-[clamp(2rem,3.4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">{isNew ? "Create testimonial" : "Edit testimonial"}</h1>
        </RevealItem>

        <RevealItem>
          <Card>
            <CardContent className="p-6">
              <TestimonialForm item={testimonial} />
            </CardContent>
          </Card>
        </RevealItem>

        {!isNew ? (
          <RevealItem>
            <DeleteContentButton type="testimonial" id={id} />
          </RevealItem>
        ) : null}
      </RevealStagger>
    </section>
  );
}
