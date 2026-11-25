import * as React from "react"
import { ChevronDown as ChevronDownIcon } from "honestui/icons"

import { cn } from "@/lib/utils"

function NativeSelect({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <div
      className="group/native-select relative w-fit has-[select:disabled]:opacity-50"
      data-slot="native-select-wrapper"
    >
      <select
        data-slot="native-select"
        className={cn(
          "border-hui-field-edge placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground hover:bg-hui-subtle h-9 w-full min-w-0 appearance-none rounded-hui-control border-[0.5px] bg-hui-field px-3 py-2 pr-9 text-sm shadow-hui-soft transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed",
          "focus-visible:border-hui-focus focus-visible:shadow-hui-focus focus-visible:outline-2 focus-visible:outline-transparent",
          "aria-invalid:focus-visible:shadow-hui-invalid aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
      <ChevronDownIcon
        className="text-muted-foreground pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 opacity-50 select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  )
}

function NativeSelectOption({ ...props }: React.ComponentProps<"option">) {
  return <option data-slot="native-select-option" {...props} />
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn(className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
