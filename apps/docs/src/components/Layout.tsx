'use client'

import { Github } from 'honestui/icons'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

import { Logo, Logomark } from '@/components/Logo'
import { MobileNavigation } from '@/components/MobileNavigation'
import { Navigation } from '@/components/Navigation'
import { Search } from '@/components/Search'
import { ThemeSwitch } from '@/components/ThemeSwitch'

function Header() {
  let [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 flex flex-none items-center border-b border-border bg-background px-4 py-5 transition duration-500 sm:px-6 lg:px-8',
        isScrolled
          ? 'backdrop-blur-sm supports-[backdrop-filter]:bg-background/90'
          : '',
      )}
    >
      <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(560px,760px)_minmax(0,1fr)] lg:gap-6">
        <div className="relative flex min-w-0 items-center lg:justify-self-start">
          <div className="mr-4 flex lg:hidden">
            <MobileNavigation />
          </div>
          <Link href="/" aria-label="Home page">
            <Logomark className="lg:hidden" />
            <Logo className="hidden lg:flex" />
          </Link>
        </div>

        <div className="hidden lg:block lg:w-full">
          <Search />
        </div>

        <div className="relative flex shrink-0 items-center justify-end gap-4 sm:gap-6 lg:justify-self-end">
          <div className="lg:hidden">
            <Search />
          </div>
          <ThemeSwitch />
          <Link href="https://github.com/connorlove/the-lyceum-project" className="group" aria-label="GitHub">
            <Github aria-hidden="true" className="h-6 w-6 text-muted-foreground transition group-hover:text-foreground" />
          </Link>
        </div>
      </div>
    </header>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  let pathname = usePathname()

  return (
    <div className="flex w-full flex-col">
      <Header />
      <div className="relative mx-auto flex w-full max-w-8xl flex-auto justify-center sm:px-2 lg:px-8 xl:px-12">
        <div className="hidden lg:relative lg:block lg:flex-none">
          <div className="absolute inset-y-0 right-0 w-[50vw] bg-muted/30 dark:hidden" />
          <div className="absolute top-16 right-0 bottom-0 hidden h-12 w-px bg-linear-to-t from-border dark:block" />
          <div className="absolute top-28 right-0 bottom-0 hidden w-px bg-border dark:block" />
          <div className="sticky top-19 -ml-0.5 h-[calc(100vh-4.75rem)] w-64 overflow-x-hidden overflow-y-auto py-16 pr-8 pl-0.5 xl:w-72 xl:pr-16">
            <Navigation />
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
