"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b border-border/14", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    icon?: "chevron" | "plusminus";
  }
>(({ className, children, icon = "chevron", ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group flex flex-1 items-center justify-between py-5 text-left text-sm font-medium tracking-[0.02em] transition-all hover:text-accentA",
        className
      )}
      {...props}
    >
      {children}
      {icon === "plusminus" ? (
        <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
          <Plus className="h-4 w-4 transition-all duration-200 group-data-[state=open]:scale-75 group-data-[state=open]:opacity-0" />
          <Minus className="absolute h-4 w-4 scale-75 opacity-0 transition-all duration-200 group-data-[state=open]:scale-100 group-data-[state=open]:opacity-100" />
        </span>
      ) : (
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn("overflow-hidden text-sm text-fg/68 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down", className)}
    {...props}
  >
    <div className="pb-5">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
