"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, X, Trash2 } from "lucide-react";
import { emitCmsContentChanged } from "@/lib/client/cms-sync";

type Props = {
  id: string;
  status: string;
  canModerate: boolean;
  canDelete: boolean;
};

export function TestimonialActions({ id, status, canModerate, canDelete }: Props): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState("");

  async function updateStatus(newStatus: "published" | "rejected") {
    setLoading(newStatus);
    try {
      const response = await fetch("/api/dashboard/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
        credentials: "include",
        cache: "no-store"
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        alert(payload.message || `Failed to ${newStatus === "published" ? "approve" : "reject"}`);
        return;
      }

      emitCmsContentChanged("testimonial.saved");
      router.refresh();
    } catch {
      alert("Request failed");
    } finally {
      setLoading("");
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this testimonial? This cannot be undone.")) return;
    setLoading("delete");
    try {
      const response = await fetch(`/api/dashboard/testimonials?id=${id}`, {
        method: "DELETE",
        credentials: "include",
        cache: "no-store"
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        alert(payload.message || "Failed to delete");
        return;
      }

      emitCmsContentChanged("testimonial.deleted");
      router.refresh();
    } catch {
      alert("Request failed");
    } finally {
      setLoading("");
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      {/* Approve button (only shown if not already published) */}
      {canModerate && status !== "published" ? (
        <button
          type="button"
          onClick={() => updateStatus("published")}
          disabled={loading !== ""}
          title="Approve"
          className="grid h-7 w-7 place-items-center rounded-md border border-emerald-500/20 bg-emerald-500/8 text-emerald-400 transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/16 disabled:opacity-40"
        >
          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      ) : null}

      {/* Reject button (only shown if not already rejected) */}
      {canModerate && status !== "rejected" ? (
        <button
          type="button"
          onClick={() => updateStatus("rejected")}
          disabled={loading !== ""}
          title="Reject"
          className="grid h-7 w-7 place-items-center rounded-md border border-amber-500/20 bg-amber-500/8 text-amber-400 transition-colors hover:border-amber-500/40 hover:bg-amber-500/16 disabled:opacity-40"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      ) : null}

      {/* Delete button */}
      {canDelete ? (
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading !== ""}
          title="Delete"
          className="grid h-7 w-7 place-items-center rounded-md border border-red-500/20 bg-red-500/8 text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/16 disabled:opacity-40"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      ) : null}
    </div>
  );
}
