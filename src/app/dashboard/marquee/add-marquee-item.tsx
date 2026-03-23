"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadMedia } from "@/app/dashboard/(components)/upload-media";
import { addMarqueeItem } from "./actions";

export function AddMarqueeItem() {
  const [dark, setDark] = useState("");
  const [light, setLight] = useState("");
  const [label, setLabel] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const formData = new FormData();
    formData.set("image_url_dark", dark);
    formData.set("image_url_light", light);
    formData.set("label", label);
    const result = await addMarqueeItem(formData);
    setPending(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setDark("");
      setLight("");
      setLabel("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="text-xs text-fg/60">
            Dark mode image <span className="text-red-400">*</span>
          </p>
          <p className="text-[0.68rem] text-fg/40">Shown on light backgrounds.</p>
          <UploadMedia onUploaded={setDark} currentUrl={dark} />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs text-fg/60">
            Light mode image <span className="text-red-400">*</span>
          </p>
          <p className="text-[0.68rem] text-fg/40">Shown on dark backgrounds.</p>
          <UploadMedia onUploaded={setLight} currentUrl={light} />
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="marquee-label" className="text-xs text-fg/60">
          Label / alt text
        </label>
        <Input
          id="marquee-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Acme Corp"
          className="h-9 text-sm"
        />
        <p className="text-[0.68rem] text-fg/40">Used for accessibility. Defaults to &quot;Logo&quot; if left blank.</p>
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <Button type="submit" size="sm" className="h-9" disabled={pending || !dark || !light}>
        {pending ? "Adding…" : "Add to marquee"}
      </Button>
    </form>
  );
}
