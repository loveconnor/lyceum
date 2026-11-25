'use client'

import { ArrowRight } from 'honestui/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

import { navigation } from '@/lib/navigation'

function PageLink({
  title,
  href,
  dir = 'next',
  ...props
}: Omit<React.ComponentPropsWithoutRef<'div'>, 'dir' | 'title'> & {
  title: string
  href: string
  dir?: 'previous' | 'next'
}) {
  return (
    <div {...props}>
      <dt className="font-display text-sm font-medium text-foreground">
        {dir === 'next' ? 'Next' : 'Previous'}
      </dt>
      <dd className="mt-1">
        <Link
          href={href}
          className={clsx(
            'flex items-center gap-x-1 text-base font-semibold text-muted-foreground hover:text-foreground',
            dir === 'previous' && 'flex-row-reverse',
          )}
        >
          {title}
          <ArrowRight
            aria-hidden="true"
            className={clsx(
              'h-4 w-4 flex-none text-current',
              dir === 'previous' && '-scale-x-100',
            )}
          />
        </Link>
      </dd>
    </div>
  )
}

export function PrevNextLinks() {
  let pathname = usePathname()
  let allLinks = navigation.flatMap((section) => section.links)
  let linkIndex = allLinks.findIndex((link) => link.href === pathname)
  let previousPage = linkIndex > -1 ? allLinks[linkIndex - 1] : null
  let nextPage = linkIndex > -1 ? allLinks[linkIndex + 1] : null

  if (!nextPage && !previousPage) {
    return null
  }

  return (
    <dl className="mt-12 flex border-t border-border pt-6">
      {previousPage && <PageLink dir="previous" {...previousPage} />}
      {nextPage && <PageLink className="ml-auto text-right" {...nextPage} />}
    </dl>
  )
}
