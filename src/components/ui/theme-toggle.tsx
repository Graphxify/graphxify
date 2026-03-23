"use client";

import { Moon, Sun } from "lucide-react";
import { useGraphxifyTheme } from "@/components/theme/theme-context";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps): JSX.Element {
  const { theme, setTheme } = useGraphxifyTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex h-8 w-16 cursor-pointer rounded-full p-1 shadow-[0_10px_24px_rgba(9,18,37,0.12)] transition-[transform,border-color,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(9,18,37,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:translate-y-0 active:scale-[0.97]",
        isDark ? "border border-zinc-800 bg-zinc-950" : "border border-zinc-300 bg-zinc-50",
        className
      )}
    >
      <span className="flex w-full items-center justify-between">
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300",
            isDark ? "translate-x-0 bg-zinc-800" : "translate-x-8 bg-white ring-1 ring-zinc-300"
          )}
        >
          {isDark ? <Moon className="h-4 w-4 text-white" strokeWidth={1.5} /> : <Sun className="h-4 w-4 text-zinc-800" strokeWidth={1.75} />}
        </span>
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300",
            isDark ? "bg-transparent" : "-translate-x-8"
          )}
        >
          {isDark ? <Sun className="h-4 w-4 text-gray-500" strokeWidth={1.5} /> : <Moon className="h-4 w-4 text-zinc-700" strokeWidth={1.75} />}
        </span>
      </span>
    </button>
  );
}
