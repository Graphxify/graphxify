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

  return (
    <button
      type="button"
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className={cn(
        "relative inline-flex h-10 w-[72px] items-center rounded-full border border-border/24 bg-card/80 px-1.5",
        className
      )}
    >
      <motion.span
        className="absolute left-1.5 top-1.5 h-7 w-7 rounded-full bg-fg"
        animate={{ x: isLight ? 32 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-1">
        <Sun className={cn("h-3.5 w-3.5", isLight ? "text-bg" : "text-fg/82")} />
        <Moon className={cn("h-3.5 w-3.5", isLight ? "text-fg/82" : "text-bg")} />
      </span>
    </button>
  );
}
