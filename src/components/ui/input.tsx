import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-lg border border-border/18 bg-card/72 px-3 py-2 text-sm text-fg placeholder:text-fg/45 placeholder:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA/80 disabled:cursor-not-allowed disabled:opacity-50 dark:border-ivory/24 dark:bg-ivory/96 dark:text-graphite dark:placeholder:!text-graphite dark:placeholder:opacity-100",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
