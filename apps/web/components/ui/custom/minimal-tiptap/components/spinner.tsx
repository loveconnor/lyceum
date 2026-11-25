import { LoaderCircle, type LoaderCircleProps } from 'honestui/icons'
import { cn } from '@/lib/utils'

export function Spinner({ className, ...props }: LoaderCircleProps) {
  return <LoaderCircle aria-hidden="true" className={cn('motion-safe:animate-spin', className)} {...props} />
}
