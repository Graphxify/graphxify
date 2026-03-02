import { notFound } from "next/navigation";
import { TestimonialForm } from "@/app/dashboard/(components)/testimonial-form";
import { DeleteContentButton } from "@/app/dashboard/(components)/delete-content-button";
import { RevealItem, RevealStagger } from "@/components/motion/reveal-stagger";
import { Card, CardContent } from "@/components/ui/card";
import { getTestimonialById } from "@/db/queries/testimonials";
import { requireRole } from "@/lib/auth/requireRole";

type Params = { id: string };

export default async function DashboardTestimonialEditorPage({ params }: { params: Params }) {
  await requireRole(["admin", "mod"]);
  const isNew = params.id === "new";

  const testimonial = isNew ? null : await getTestimonialById(params.id);
  if (!isNew && !testimonial) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <RevealStagger className="space-y-6">
        <RevealItem className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/56">Editor</p>
          <h1 className="text-3xl font-semibold">{isNew ? "Create testimonial" : "Edit testimonial"}</h1>
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
            <DeleteContentButton type="testimonial" id={params.id} />
          </RevealItem>
        ) : null}
      </RevealStagger>
    </section>
  );
}
