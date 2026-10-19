import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", {
  variants: {
    variant: {
      default: "border-border/18 bg-accentA/15 text-fg",
      secondary: "border-border/18 bg-card/62 text-fg/82",
      success: "border-green/25 bg-green/12 text-[#137a3a]",
      warning: "border-accentA/25 bg-accentA/12 text-accentB"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> { }

export function Badge({ className, variant, ...props }: BadgeProps): JSX.Element {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
