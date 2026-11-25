import Link from 'next/link'
import clsx from 'clsx'

const variantStyles = {
  primary:
    'bg-primary text-primary-foreground shadow-hui-key hover:bg-foreground',
  secondary:
    'bg-hui-subtle text-hui-ink hover:bg-hui-hover',
}

type ButtonProps = {
  variant?: keyof typeof variantStyles
} & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
)

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  className = clsx(
    'inline-flex min-h-9 items-center justify-center rounded-hui-control px-4 py-2 text-sm/5 font-medium outline-none focus-visible:outline-2 focus-visible:outline-hui-focus focus-visible:outline-offset-2 motion-safe:[transition:var(--hui-transition-interactive)] motion-safe:not-disabled:active:scale-[var(--hui-scale-pressed)] disabled:opacity-65',
    variantStyles[variant],
    className,
  )

  return typeof props.href === 'undefined' ? (
    <button className={className} {...props} />
  ) : (
    <Link className={className} {...props} />
  )
}
