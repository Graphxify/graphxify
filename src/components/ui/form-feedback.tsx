"use client";

import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type FormAlertProps = {
  message?: string;
  type?: "error" | "success" | "info";
  className?: string;
};

export function FormAlert({
  message,
  type = "error",
  className
}: FormAlertProps): JSX.Element | null {
  if (!message) {
    return null;
  }

  const Icon = type === "success" ? CheckCircle2 : type === "info" ? Info : AlertTriangle;

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm",
        type === "success" && "border-emerald-500/20 bg-emerald-500/8 text-emerald-400",
        type === "info" && "border-border/18 bg-card/70 text-fg/74",
        type === "error" && "border-amber-500/20 bg-amber-500/8 text-amber-300",
        className
      )}
      role="alert"
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

export function FieldErrorText({ id, message }: { id?: string; message?: string }): JSX.Element | null {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="text-xs text-accentB" role="alert">
      {message}
    </p>
  );
}
