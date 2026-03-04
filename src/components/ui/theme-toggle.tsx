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
        "flex h-8 w-16 cursor-pointer rounded-full p-1 transition-all duration-300",
        isDark ? "border border-zinc-800 bg-zinc-950" : "border border-zinc-200 bg-white",
        className
      )}
    >
      <span className="flex w-full items-center justify-between">
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300",
            isDark ? "translate-x-0 bg-zinc-800" : "translate-x-8 bg-gray-200"
          )}
        >
          {isDark ? <Moon className="h-4 w-4 text-white" strokeWidth={1.5} /> : <Sun className="h-4 w-4 text-gray-700" strokeWidth={1.5} />}
        </span>
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300",
            isDark ? "bg-transparent" : "-translate-x-8"
          )}
        >
          {isDark ? <Sun className="h-4 w-4 text-gray-500" strokeWidth={1.5} /> : <Moon className="h-4 w-4 text-black" strokeWidth={1.5} />}
        </span>
      </span>
    </button>
  );
}
