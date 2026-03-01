"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Status = { type: "success" | "error"; message: string } | null;

export function LeadForm(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

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
      setStatus({ type: "success", message: "Thanks. We received your inquiry and will respond shortly." });
    } else {
      setStatus({ type: "error", message: payload.message || "Could not submit your request." });
    }

    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-label="Lead form">
      <AnimatePresence>
        {status ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-2 rounded-lg border border-border/20 bg-card/65 p-3 text-sm"
          >
            {status.type === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-accentA" /> : <AlertTriangle className="mt-0.5 h-4 w-4 text-accentB" />}
            <span className="text-fg/78">{status.message}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <Input name="name" placeholder="Name" required aria-label="Name" />
      <Input name="email" type="email" placeholder="Email" required aria-label="Email" />
      <Textarea name="message" placeholder="Tell us about your product and goals" required aria-label="Message" />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Sending..." : "Send inquiry"}
      </Button>
    </form>
  );
}
