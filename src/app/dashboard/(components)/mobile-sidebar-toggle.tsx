"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function MobileSidebarToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button — visible only on mobile */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed right-4 top-[0.85rem] z-50 grid h-11 w-11 place-items-center rounded-full bg-fg text-white shadow-[0_8px_20px_rgba(10,10,10,0.18)] transition-transform duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentB focus-visible:ring-offset-2 focus-visible:ring-offset-bg md:hidden"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              className="grid place-items-center"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              className="grid place-items-center"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <Menu className="h-[1.125rem] w-[1.125rem]" strokeWidth={2.25} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-fg/40 backdrop-blur-[2px] md:hidden"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar content — on mobile: slide-in from left, on desktop: always visible */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-80 max-w-[88vw] bg-bg transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:relative md:w-auto md:max-w-none md:translate-x-0 md:bg-transparent md:transition-none ${open ? "translate-x-0" : "-translate-x-full"}`}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) {
            setOpen(false);
          }
        }}
      >
        {children}
      </div>
    </>
  );
}
