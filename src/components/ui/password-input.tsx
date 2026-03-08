"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function PasswordInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <input
                {...props}
                type={visible ? "text" : "password"}
                className={cn(
                    "flex h-11 w-full rounded-xl border border-border/18 bg-bg/50 px-4 pr-11 py-2 text-sm text-fg placeholder:text-fg/30 placeholder:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/80 focus:border-accentA/40 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
                    className
                )}
            />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-fg/40 transition-colors hover:text-fg/70"
                aria-label={visible ? "Hide password" : "Show password"}
                tabIndex={-1}
            >
                {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>
    );
}
