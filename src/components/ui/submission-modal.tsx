"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { AlertTriangle, Check, X } from "lucide-react";
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
    <MotionConfig reducedMotion="user">
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
            className="absolute inset-0 bg-fg/50 backdrop-blur-sm"
            variants={BACKDROP_VARIANTS}
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white text-fg shadow-[0_40px_80px_-30px_rgba(10,10,10,0.5)]"
            variants={PANEL_VARIANTS}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-bg text-fg/70 transition-colors hover:bg-fg hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentB"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center px-7 pb-7 pt-10 text-center md:px-9 md:pb-9">
              {/* Icon: green means done; the warning stays neutral ink */}
              <div className="relative mb-6">
                <motion.div
                  className={cn("absolute -inset-2.5 rounded-full", isSuccess ? "bg-green/20" : "bg-fg/[0.06]")}
                  variants={RING_VARIANTS}
                />
                <motion.div
                  className={cn(
                    "relative flex h-16 w-16 items-center justify-center rounded-full",
                    isSuccess ? "bg-green text-fg" : "bg-fg text-white"
                  )}
                  variants={ICON_VARIANTS}
                >
                  {isSuccess ? (
                    <Check className="h-8 w-8" strokeWidth={2.5} />
                  ) : (
                    <AlertTriangle className="h-7 w-7" strokeWidth={2} />
                  )}
                </motion.div>
              </div>

              {/* Title */}
              <motion.h2
                id="submission-modal-title"
                className="text-[1.5rem] font-extrabold leading-tight tracking-[-0.03em] text-fg"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.3 }}
              >
                {title}
              </motion.h2>

              {/* Message */}
              <motion.p
                className="mt-3 max-w-[34ch] text-[0.9375rem] font-medium leading-relaxed text-fg/64"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.3 }}
              >
                {message}
              </motion.p>

              {/* Actions */}
              <motion.div
                className="mt-7 flex w-full flex-col gap-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                {cta ? (
                  cta.href ? (
                    <Button asChild size="lg" className="w-full">
                      <a href={cta.href}>{cta.label}</a>
                    </Button>
                  ) : (
                    <Button size="lg" onClick={cta.onClick ?? handleClose} className="w-full">
                      {cta.label}
                    </Button>
                  )
                ) : null}
                <Button
                  variant={cta ? "ghost" : "default"}
                  size="lg"
                  onClick={handleClose}
                  autoFocus={!cta}
                  className="w-full focus-visible:ring-offset-white"
                >
                  {cta ? "Close" : "Got it"}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
    </MotionConfig>
  );
}
