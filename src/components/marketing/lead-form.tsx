"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function LeadForm(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message")
      })
    });

    const payload = (await response.json()) as { message?: string };
    if (response.ok) {
      form.reset();
      setMessage("Thanks. Your request has been received.");
    } else {
      setMessage(payload.message || "Unable to submit lead.");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" aria-label="Lead form">
      <Input name="name" placeholder="Name" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Textarea name="message" placeholder="Tell us about your goals" required />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Submit inquiry"}
      </Button>
      {message ? <p className="text-sm text-[rgba(242,240,235,0.78)]">{message}</p> : null}
    </form>
  );
}
