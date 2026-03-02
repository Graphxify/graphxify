"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useGraphxifyTheme } from "@/components/theme/theme-context";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps): JSX.Element {
  const { theme, setTheme } = useGraphxifyTheme();
  const isLight = theme === "light";
  const thumbTravel = 32;

  return (
    <button
      type="button"
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className={cn(
        "relative inline-flex h-10 w-[72px] items-center rounded-full border border-border/20 bg-card/70 px-1.5 backdrop-blur",
        className
      )}
    >
      <motion.span
        className="absolute left-1.5 top-1.5 h-7 w-7 rounded-full bg-accent-gradient shadow-glow"
        animate={{ x: isLight ? 0 : thumbTravel }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />

      <span className="pointer-events-none absolute left-1.5 top-1.5 z-10 grid h-7 w-7 place-items-center text-fg/85">
        <Sun className="h-3.5 w-3.5" />
      </span>
      <span className="pointer-events-none absolute right-1.5 top-1.5 z-10 grid h-7 w-7 place-items-center text-fg/85">
        <Moon className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}
