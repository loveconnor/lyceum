import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full px-3 py-2 text-base md:text-sm placeholder:text-hui-muted disabled:cursor-not-allowed disabled:border-hui-line disabled:bg-hui-subtle disabled:opacity-65 rounded-hui-control border-[0.5px] border-hui-field-edge bg-hui-field text-hui-ink motion-safe:[transition:var(--hui-transition-interactive)] outline-none focus-visible:border-hui-focus focus-visible:outline-2 focus-visible:outline-transparent focus-visible:shadow-hui-focus aria-invalid:border-destructive aria-invalid:focus-visible:shadow-hui-invalid",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
