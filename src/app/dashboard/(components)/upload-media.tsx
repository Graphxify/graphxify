"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function UploadMedia({ onUploaded }: { onUploaded: (url: string) => void }): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function uploadFile(file: File) {
    setLoading(true);
    setStatus("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/uploads", { method: "POST", body: formData });
    const payload = (await res.json()) as { url?: string; message?: string };
    if (res.ok && payload.url) {
      onUploaded(payload.url);
      setStatus("Upload successful.");
    } else {
      setStatus(payload.message || "Upload failed.");
    }

    setLoading(false);
  }

  return (
    <div
      className="rounded-lg border border-dashed border-[rgba(242,240,235,0.2)] p-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) uploadFile(file);
      }}
      aria-label="Drag and drop upload"
    >
      <p className="mb-2 text-sm text-[rgba(242,240,235,0.75)]">Drag & drop image here, or choose a file.</p>
      <label className="inline-block">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
          }}
        />
        <Button type="button" variant="secondary" disabled={loading}>
          {loading ? "Uploading..." : "Choose file"}
        </Button>
      </label>
      {status ? <p className="mt-2 text-xs text-[rgba(242,240,235,0.8)]">{status}</p> : null}
    </div>
  );
}
