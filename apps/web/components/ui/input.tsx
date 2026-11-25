"use client"

import { Input as InputPrimitive } from "@base-ui-components/react/input"

import { cn } from "@/lib/utils"

function Input({
  className,
  wrapperClassName,
  size = "default",
  ...props
}: Omit<InputPrimitive.Props, "size"> & {
  wrapperClassName?: string
  size?: "sm" | "default" | "lg" | number
}) {
  return (
    <span
      data-slot="input-control"
      className={cn(
        "relative inline-flex w-full items-center text-base/5 sm:text-sm rounded-hui-control border-[0.5px] border-hui-field-edge bg-hui-field text-hui-ink motion-safe:[transition:var(--hui-transition-interactive)] not-has-[input:is(:disabled,:read-only,[aria-invalid=true])]:hover:border-hui-focus focus-within:border-hui-focus focus-within:outline-hidden has-disabled:border-hui-line has-disabled:bg-hui-subtle has-disabled:opacity-65 has-[[aria-invalid=true]]:border-destructive has-[[aria-invalid=true]]:focus-within:border-destructive has-[[aria-invalid=true]]:focus-within:shadow-hui-invalid",
        wrapperClassName
      )}
    >
      <InputPrimitive
        data-slot="input"
        className={cn(
          "w-full min-w-0 appearance-none rounded-[inherit] border-0 bg-transparent px-3 py-2 shadow-none outline-none placeholder:text-hui-muted disabled:cursor-not-allowed",
          size === "sm" &&
            "px-2.5 py-1",
          size === "lg" && "py-2.5",
          props.type === "search" &&
            "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
          props.type === "file" &&
            "text-muted-foreground file:me-3 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          className
        )}
        size={typeof size === "number" ? size : undefined}
        {...props}
      />
    </span>
  )
}

export { Input }
