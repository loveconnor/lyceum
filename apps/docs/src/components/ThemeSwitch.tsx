'use client'

import { Sun, Moon } from 'honestui/icons'
import { useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'

export function ThemeSwitch() {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  )
  const { theme, setTheme } = useTheme()

  if (!mounted) {
    return <div className="h-9 w-9" />
  }

  const resolved = theme === 'system' ? 'light' : theme

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-hui-control border-[0.5px] border-hui-field-edge bg-hui-field text-hui-muted motion-safe:transition-colors hover:bg-hui-subtle hover:text-hui-ink focus-visible:outline-2 focus-visible:outline-hui-focus focus-visible:outline-offset-2"
      onClick={() => setTheme(resolved === 'light' ? 'dark' : 'light')}
    >
      {resolved === 'light' ? <Sun aria-hidden="true" className="h-4 w-4" /> : <Moon aria-hidden="true" className="h-4 w-4" />}
    </button>
  )
}
