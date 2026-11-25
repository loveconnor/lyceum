import clsx from 'clsx'
import { Download, Lightbulb, Paintbrush, Plug, SlidersHorizontal, TriangleAlert, type DownloadProps } from 'honestui/icons'

const icons = {
  installation: Download,
  presets: SlidersHorizontal,
  plugins: Plug,
  theming: Paintbrush,
  lightbulb: Lightbulb,
  warning: TriangleAlert,
}

const iconStyles = {
  blue: 'text-sky-700 dark:text-sky-400',
  amber: 'text-amber-800 dark:text-amber-400',
}

export function Icon({
  icon,
  color = 'blue',
  className,
  ...props
}: {
  color?: keyof typeof iconStyles
  icon: keyof typeof icons
} & Omit<DownloadProps, 'color'>) {
  const IconComponent = icons[icon]

  return <IconComponent aria-hidden="true" className={clsx(className, iconStyles[color])} {...props} />
}
