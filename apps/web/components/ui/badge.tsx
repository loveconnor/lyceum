import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants= cva(
  "relative inline-flex shrink-0 items-center justify-center gap-[var(--hui-space-2)] whitespace-nowrap rounded-[var(--hui-radius-1)] border-0 px-1.5 py-[var(--hui-space-1)] [font-style:normal] [font-weight:var(--hui-font-weight-medium)] outline-none focus-visible:[outline:var(--hui-focus-ring)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [a&,button&]:cursor-pointer [a&,button&]:pointer-coarse:after:absolute [a&,button&]:pointer-coarse:after:size-full [a&,button&]:pointer-coarse:after:min-h-11 [a&,button&]:pointer-coarse:after:min-w-11",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--hui-color-background-accent-primary)] text-[var(--hui-color-foreground-accent-primary-hover)]",
        destructive:
          "bg-[var(--hui-danger-3)] text-[var(--hui-color-foreground-danger-primary)]",
        outline:
          "border-[0.5px] border-[var(--hui-color-border-base-primary)] bg-transparent text-[var(--hui-color-foreground-base-primary)]",
        secondary:
          "bg-[var(--hui-color-background-neutral-secondary)] text-[var(--hui-color-foreground-base-primary)]",
        info: "bg-[var(--hui-color-background-accent-primary)] text-[var(--hui-color-foreground-accent-primary-hover)]",
        success:
          "bg-[var(--hui-color-background-success-primary)] text-[var(--hui-color-foreground-success-primary-hover)]",
        warning:
          "bg-[var(--hui-color-background-attention-primary)] text-[var(--hui-color-foreground-attention-primary)]",
        error:
          "bg-[var(--hui-danger-3)] text-[var(--hui-color-foreground-danger-primary)]",
      },
      size: {
        default:
          "h-[22px] text-[length:var(--hui-font-size-small)] tracking-[var(--hui-letter-spacing-small)] leading-[var(--hui-line-height-small)] [&_svg:not([class*='size-'])]:size-[var(--hui-space-4)]",
        sm: "h-[18px] text-[length:var(--hui-font-size-micro)] tracking-[var(--hui-letter-spacing-micro)] leading-[var(--hui-line-height-micro)] [&_svg:not([class*='size-'])]:size-[10px]",
        lg: "h-[var(--hui-space-8)] text-[length:var(--hui-font-size-regular)] tracking-[var(--hui-letter-spacing-regular)] leading-[var(--hui-line-height-regular)] [&_svg:not([class*='size-'])]:size-[14px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
