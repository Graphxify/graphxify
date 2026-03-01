import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-lg border border-[rgba(242,240,235,0.18)] bg-[rgba(13,13,15,0.85)] px-3 py-2 text-sm placeholder:text-[rgba(242,240,235,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentA disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
