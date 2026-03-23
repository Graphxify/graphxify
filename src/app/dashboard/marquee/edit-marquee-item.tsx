"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadMedia } from "@/app/dashboard/(components)/upload-media";
import { updateMarqueeItem } from "./actions";

type Props = {
  id: string;
  image_url_dark: string;
  image_url_light: string;
  label: string;
};

export function EditMarqueeItem({ id, image_url_dark, image_url_light, label }: Props) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(image_url_dark);
  const [light, setLight] = useState(image_url_light);
  const [labelVal, setLabelVal] = useState(label);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const formData = new FormData();
    formData.set("id", id);
    formData.set("image_url_dark", dark);
    formData.set("image_url_light", light);
    formData.set("label", labelVal);
    const result = await updateMarqueeItem(formData);
    setPending(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setOpen(false);
    }
  }

  if (!open) {
    return (
      <Button type="button" variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setOpen(true)}>
        Edit
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-4 border-t border-border/12 pt-3">
      <div className="space-y-1.5">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-fg/44">Dark mode image</p>
        <UploadMedia onUploaded={setDark} currentUrl={dark} />
      </div>
      <div className="space-y-1.5">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-fg/44">Light mode image</p>
        <UploadMedia onUploaded={setLight} currentUrl={light} />
      </div>
      <div className="space-y-1">
        <label className="text-[0.68rem] text-fg/56">Label / alt text</label>
        <Input value={labelVal} onChange={(e) => setLabelVal(e.target.value)} className="h-8 text-xs" />
      </div>
      {error ? <p className="text-[0.68rem] text-red-400">{error}</p> : null}
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="h-7 text-xs" disabled={pending || !dark || !light}>
          {pending ? "Saving…" : "Save"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => { setOpen(false); setError(null); }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
