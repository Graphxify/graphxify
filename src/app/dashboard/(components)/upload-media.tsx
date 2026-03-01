"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function UploadMedia({ onUploaded }: { onUploaded: (url: string) => void }): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function uploadFile(file: File) {
    if (loading) return;
    if (!file.type.startsWith("image/")) {
      setStatus("Only image files are allowed.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setStatus("Max upload size is 8MB.");
      return;
    }

    setLoading(true);
    setStatus("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/uploads", { method: "POST", body: formData, credentials: "include", cache: "no-store" });
      const payload = (await res.json()) as { url?: string; message?: string };

      if (res.ok && payload.url) {
        onUploaded(payload.url);
        setStatus("Upload successful.");
      } else {
        setStatus(payload.message || "Upload failed.");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="rounded-lg border border-dashed border-border/26 bg-card/56 p-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) uploadFile(file);
      }}
      aria-label="Drag and drop upload"
    >
      <p className="mb-2 text-sm text-fg/66">Drag & drop image, or pick a file.</p>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file);
          e.currentTarget.value = "";
        }}
      />
      <Button
        type="button"
        variant="secondary"
        disabled={loading}
        onClick={() => {
          fileInputRef.current?.click();
        }}
      >
        {loading ? "Uploading..." : "Choose file"}
      </Button>
      {status ? <p className="mt-2 text-xs text-fg/72">{status}</p> : null}
    </div>
  );
}
