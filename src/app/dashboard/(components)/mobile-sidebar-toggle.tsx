"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export function MobileSidebarToggle({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Hamburger button — visible only on mobile */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="fixed right-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-xl border border-border/20 bg-card/90 backdrop-blur transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-accentA/24 hover:bg-card hover:shadow-[0_12px_24px_rgba(9,18,37,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:translate-y-0 active:scale-[0.97] md:hidden"
                aria-label={open ? "Close menu" : "Open menu"}
            >
                {open ? <X className="h-5 w-5 text-fg" /> : <Menu className="h-5 w-5 text-fg" />}
            </button>

            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-bg/60 backdrop-blur-sm md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar content — on mobile: slide-in from left, on desktop: always visible */}
            <div
                className={`
          fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:transition-none
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
                onClick={(e) => {
                    // Close on link clicks on mobile
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
