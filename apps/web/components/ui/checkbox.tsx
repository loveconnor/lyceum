"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check as CheckIcon, Minus as MinusIcon } from "honestui/icons"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer group/checkbox size-4 shrink-0 cursor-pointer rounded-[4px] border-[0.5px] border-hui-field-edge bg-hui-field motion-safe:[transition:var(--hui-transition-interactive)] motion-safe:active:scale-[var(--hui-scale-pressed-strong)] outline-none focus-visible:outline-2 focus-visible:outline-hui-focus focus-visible:outline-offset-2 [&:is([data-state=checked],[data-state=indeterminate])]:border-primary [&:is([data-state=checked],[data-state=indeterminate])]:bg-primary [&:is([data-state=checked],[data-state=indeterminate])]:text-primary-foreground aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3 group-data-[state=indeterminate]/checkbox:hidden" />
        <MinusIcon className="hidden size-3 group-data-[state=indeterminate]/checkbox:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
