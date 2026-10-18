import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-[transform,background-color,color,box-shadow] duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentB focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-fg text-white hover:bg-charcoal-2",
        secondary: "bg-white text-fg hover:bg-white/80 shadow-[inset_0_0_0_1px_rgba(10,10,10,0.08)]",
        accent: "bg-accentB text-white hover:bg-[#0047b3]",
        inverse: "bg-white text-fg hover:bg-white/90",
        dark: "bg-fg text-white hover:bg-charcoal-2",
        ghost: "text-fg hover:bg-fg/[0.06]",
        link: "rounded-none p-0 text-accentB underline-offset-4 hover:underline",
        destructive: "bg-white text-fg hover:bg-red-50 hover:text-red-700"
      },
      size: {
        default: "h-10 px-5",
        sm: "h-9 px-4 text-[0.8125rem]",
        lg: "h-[3.25rem] px-7 text-[0.9375rem]",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
