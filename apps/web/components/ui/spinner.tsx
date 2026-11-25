import { LoaderCircle, type LoaderCircleProps } from "honestui/icons"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: LoaderCircleProps) {
  return (
    <LoaderCircle
      role="status"
      aria-label="Loading"
      className={cn("size-4 motion-safe:animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
