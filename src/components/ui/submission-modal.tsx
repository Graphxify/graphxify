"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";
import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SubmissionModalProps = {
  open: boolean;
  onClose: () => void;
  type: "success" | "error";
  title: string;
  message: string;
  /** Optional CTA button */
  cta?: { label: string; href?: string; onClick?: () => void };
  /** Auto-dismiss after ms (0 = no auto-dismiss) */
  autoDismiss?: number;
};

const BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const PANEL_VARIANTS = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 26, stiffness: 340, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 12,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
  },
};

const ICON_VARIANTS = {
  hidden: { scale: 0, rotate: -30, opacity: 0 },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { type: "spring" as const, damping: 14, stiffness: 280, delay: 0.12 },
  },
};

const RING_VARIANTS = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring" as const, damping: 18, stiffness: 200, delay: 0.06 },
  },
};

export function SubmissionModal({
  open,
  onClose,
  type,
  title,
  message,
  cta,
  autoDismiss = 0,
}: SubmissionModalProps): JSX.Element {
  const handleClose = useCallback(() => onClose(), [onClose]);

  // Auto-dismiss
  useEffect(() => {
    if (!open || autoDismiss <= 0) return;
    const timer = setTimeout(handleClose, autoDismiss);
    return () => clearTimeout(timer);
  }, [open, autoDismiss, handleClose]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  const isSuccess = type === "success";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="submission-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            variants={BACKDROP_VARIANTS}
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border/20 bg-card/95 shadow-[0_24px_64px_rgba(0,0,0,0.4)] backdrop-blur-xl"
            variants={PANEL_VARIANTS}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-fg/40 transition-colors hover:bg-fg/8 hover:text-fg/70"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Decorative glows */}
            <span
              className={cn(
                "pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full blur-3xl",
                isSuccess ? "bg-accentA/12" : "bg-red-500/12"
              )}
            />
            <span
              className={cn(
                "pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full blur-3xl",
                isSuccess ? "bg-emerald-500/10" : "bg-amber-500/10"
              )}
            />

            <div className="relative z-10 flex flex-col items-center px-6 pb-6 pt-8 text-center">
              {/* Icon with ring */}
              <div className="relative mb-5">
                <motion.div
                  className={cn(
                    "absolute -inset-3 rounded-full",
                    isSuccess
                      ? "bg-gradient-to-br from-accentA/15 via-emerald-500/10 to-transparent"
                      : "bg-gradient-to-br from-red-500/15 via-amber-500/10 to-transparent"
                  )}
                  variants={RING_VARIANTS}
                />
                <motion.div
                  className={cn(
                    "relative flex h-16 w-16 items-center justify-center rounded-full border",
                    isSuccess
                      ? "border-emerald-500/30 bg-emerald-500/10"
                      : "border-amber-500/30 bg-amber-500/10"
                  )}
                  variants={ICON_VARIANTS}
                >
                  {isSuccess ? (
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" strokeWidth={1.5} />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-amber-400" strokeWidth={1.5} />
                  )}
                </motion.div>
              </div>

              {/* Title */}
              <motion.h2
                id="submission-modal-title"
                className="text-xl font-semibold text-fg"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.3 }}
              >
                {title}
              </motion.h2>

              {/* Message */}
              <motion.p
                className="mt-2 max-w-xs text-sm leading-relaxed text-fg/60"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.3 }}
              >
                {message}
              </motion.p>

              {/* Actions */}
              <motion.div
                className="mt-6 flex w-full flex-col gap-2.5"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                {cta ? (
                  cta.href ? (
                    <Button
                      asChild
                      size="lg"
                      className="h-11 w-full rounded-xl border border-accentA/45 bg-accent-gradient text-ivory shadow-[0_8px_20px_rgba(0,82,204,0.2)] hover:border-accentA/55 hover:brightness-105"
                    >
                      <a href={cta.href}>{cta.label}</a>
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={cta.onClick ?? handleClose}
                      className="h-11 w-full rounded-xl border border-accentA/45 bg-accent-gradient text-ivory shadow-[0_8px_20px_rgba(0,82,204,0.2)] hover:border-accentA/55 hover:brightness-105"
                    >
                      {cta.label}
                    </Button>
                  )
                ) : null}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-xs text-fg/50 hover:text-fg/72"
                >
                  {cta ? "Close" : "Got It"}
                </Button>
              </motion.div>
            </div>

            {/* Bottom accent line */}
            <div
              className={cn(
                "h-0.5 w-full",
                isSuccess ? "bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" : "bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"
              )}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
