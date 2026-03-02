"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emitCmsContentChanged } from "@/lib/client/cms-sync";

type MetricRow = {
  id?: string;
  value: string;
  label: string;
  sort_order: number;
};

export function TestimonialMetricsForm({ initialRows }: { initialRows: MetricRow[] }): JSX.Element {
  const router = useRouter();
  const [rows, setRows] = useState<MetricRow[]>(initialRows);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function updateRow(index: number, patch: Partial<MetricRow>) {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function addRow() {
    setRows((current) => [
      ...current,
      {
        id: `metric-${Date.now()}`,
        value: "",
        label: "",
        sort_order: current.length
      }
    ]);
  }

  function removeRow(index: number) {
    setRows((current) => current.filter((_, i) => i !== index).map((row, i) => ({ ...row, sort_order: i })));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      metrics: rows.map((row, index) => ({
        id: row.id,
        value: row.value,
        label: row.label,
        sort_order: Number.isFinite(row.sort_order) ? row.sort_order : index
      }))
    };

    try {
      const response = await fetch("/api/dashboard/testimonial-metrics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
        cache: "no-store"
      });

      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(result.message || "Save failed");
        return;
      }

      setNotice("Metrics saved.");
      emitCmsContentChanged("testimonial-metrics.saved");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {rows.map((row, index) => (
        <div key={row.id || `row-${index}`} className="rounded-xl border border-border/18 bg-card/62 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.18em] text-fg/60">Metric {index + 1}</p>
            {rows.length > 1 ? (
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="text-xs text-fg/64 underline underline-offset-4"
              >
                Remove
              </button>
            ) : null}
          </div>

          <div className="grid gap-3 md:grid-cols-[0.35fr_0.65fr]">
            <div className="space-y-2">
              <Label htmlFor={`metric-value-${index}`}>Value</Label>
              <Input
                id={`metric-value-${index}`}
                value={row.value}
                onChange={(event) => updateRow(index, { value: event.target.value })}
                placeholder="26+"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`metric-label-${index}`}>Label</Label>
              <Input
                id={`metric-label-${index}`}
                value={row.label}
                onChange={(event) => updateRow(index, { label: event.target.value })}
                placeholder="Finalized Projects"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={addRow}>
          Add metric
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save metrics"}
        </Button>
      </div>

      {error ? <p className="text-sm text-fg/74">{error}</p> : null}
      {notice ? <p className="text-sm text-fg/74">{notice}</p> : null}
    </form>
  );
}

