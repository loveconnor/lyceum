import { Sun, MoonStar, Monitor } from 'honestui/icons'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import clsx from 'clsx'

const themes = [
  { name: 'Light', value: 'light', icon: Sun },
  { name: 'Dark', value: 'dark', icon: MoonStar },
  { name: 'System', value: 'system', icon: Monitor },
]

export function ThemeSelector(
  props: React.ComponentPropsWithoutRef<typeof Listbox<'div'>>,
) {
  let { theme, setTheme } = useTheme()
  let [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-6 w-6" />
  }

  return (
    <Listbox as="div" value={theme} onChange={setTheme} {...props}>
      <Label className="sr-only">Theme</Label>
      <ListboxButton
        className="flex h-6 w-6 items-center justify-center rounded-hui-item border-[0.5px] border-hui-line bg-hui-surface shadow-hui-soft focus-visible:outline-2 focus-visible:outline-hui-focus focus-visible:outline-offset-2"
        aria-label="Theme"
      >
        <Sun aria-hidden="true"
          className={clsx(
            'h-4 w-4 dark:hidden',
            theme === 'system' ? 'text-slate-400' : 'text-sky-400',
          )}
        />
        <MoonStar aria-hidden="true"
          className={clsx(
            'hidden h-4 w-4 dark:block',
            theme === 'system' ? 'text-slate-400' : 'text-sky-400',
          )}
        />
      </ListboxButton>
      <ListboxOptions className="absolute top-full left-1/2 mt-3 w-36 -translate-x-1/2 space-y-1 rounded-hui-control border-[0.5px] border-hui-overlay-edge bg-hui-overlay p-2 text-sm font-medium shadow-hui-overlay">
        {themes.map((theme) => (
          <ListboxOption
            key={theme.value}
            value={theme.value}
            className={({ focus, selected }) =>
              clsx(
                'flex cursor-pointer items-center rounded-hui-item p-1 select-none',
                {
                  'text-sky-500': selected,
                  'text-slate-900 dark:text-white': focus && !selected,
                  'text-slate-700 dark:text-slate-400': !focus && !selected,
                  'bg-hui-subtle': focus,
                },
              )
            }
          >
            {({ selected }) => (
              <>
                <div className="rounded-md bg-white p-1 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-700 dark:ring-white/5 dark:ring-inset">
                  <theme.icon
                    aria-hidden="true"
                    className={clsx(
                      'h-4 w-4',
                      selected
                        ? 'text-sky-400 dark:text-sky-400'
                        : 'text-slate-400',
                    )}
                  />
                </div>
                <div className="ml-3">{theme.name}</div>
              </>
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}
