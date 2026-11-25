import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-hui-ink placeholder:text-hui-muted selection:bg-primary selection:text-primary-foreground border-hui-field-edge h-9 w-full min-w-0 rounded-hui-control border-[0.5px] bg-hui-field px-3 py-1 text-base motion-safe:[transition:var(--hui-transition-interactive)] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-65 md:text-sm',
        'focus-visible:border-hui-focus focus-visible:outline-2 focus-visible:outline-transparent focus-visible:shadow-hui-focus',
        'aria-invalid:focus-visible:shadow-hui-invalid aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
