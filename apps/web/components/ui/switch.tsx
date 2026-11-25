"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-[0.5px] border-hui-line bg-hui-subtle px-[2px] motion-safe:[transition:var(--hui-transition-interactive)] data-[state=checked]:border-transparent data-[state=checked]:bg-primary outline-none focus-visible:outline-2 focus-visible:outline-hui-focus focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-3.5 rounded-full bg-hui-surface shadow-hui-key motion-safe:transition-transform data-[state=checked]:translate-x-[17px] data-[state=checked]:bg-primary-foreground rtl:data-[state=checked]:-translate-x-[17px]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
