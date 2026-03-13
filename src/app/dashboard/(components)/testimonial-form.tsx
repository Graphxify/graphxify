"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/form-feedback";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { emitCmsContentChanged } from "@/lib/client/cms-sync";
import { submitFormDataRequest } from "@/lib/forms/shared";

type TestimonialItem = {
  id?: string;
  name?: string;
  role?: string;
  quote?: string;
  rating?: number;
  status?: "draft" | "pending" | "published" | "rejected";
  sort_order?: number;
};

export function TestimonialForm({ item }: { item?: TestimonialItem | null }): JSX.Element {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const formData = new FormData(event.currentTarget);

    const endpoint = "/api/dashboard/testimonials";
    const method = item?.id ? "PUT" : "POST";

    try {
      const result = await submitFormDataRequest<{ id: string }>(endpoint, formData, method);
      const savedId = result.data && typeof result.data === "object" && "id" in result.data
        ? String((result.data as { id?: string }).id || "")
        : "";

      if (!result.success || !savedId) {
        setError(result.message || "Save failed");
        return;
      }

      emitCmsContentChanged("testimonial.saved");
      setNotice(result.message || "Saved successfully.");
      router.push(`/dashboard/testimonials/${savedId}`);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Request failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" aria-label="Testimonial editor">
      <input type="hidden" name="id" defaultValue={String(item?.id ?? "")} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required defaultValue={String(item?.name ?? "")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role / Company</Label>
          <Input id="role" name="role" required defaultValue={String(item?.role ?? "")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quote">Quote</Label>
        <Textarea
          id="quote"
          name="quote"
          required
          className="min-h-[180px]"
          defaultValue={String(item?.quote ?? "")}
          placeholder="Write a full testimonial quote."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input id="sortOrder" name="sortOrder" type="number" min={0} max={9999} defaultValue={String(item?.sort_order ?? 0)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Rating (1–5)</Label>
          <Input id="rating" name="rating" type="number" min={1} max={5} defaultValue={String(item?.rating ?? 5)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            className="h-11 w-full rounded-lg border border-border/20 bg-card/72 px-3 text-sm text-fg"
            defaultValue={String(item?.status ?? "draft")}
          >
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <FormAlert message={error} />
      <FormAlert message={notice} type="success" />

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
