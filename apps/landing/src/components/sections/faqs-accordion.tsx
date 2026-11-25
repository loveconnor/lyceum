import { ElDisclosure } from '@tailwindplus/elements/react'
import { clsx } from 'clsx/lite'
import { type ComponentProps, type ReactNode, useId } from 'react'
import { Subheading } from '../elements/subheading'
import { Text } from '../elements/text'
import { Minus, Plus } from 'honestui/icons'

export function Faq({
  id,
  question,
  answer,
  ...props
}: { question: ReactNode; answer: ReactNode } & ComponentProps<'div'>) {
  let autoId = useId()
  id = id || autoId

  return (
    <div id={id} {...props}>
      <button
        type="button"
        id={`${id}-question`}
        command="--toggle"
        commandfor={`${id}-answer`}
        className="flex w-full items-start justify-between gap-6 py-4 text-left text-base/7 text-mist-950 dark:text-white"
      >
        {question}
        <Plus aria-hidden="true" className="h-lh w-4 in-aria-expanded:hidden" />
        <Minus aria-hidden="true" className="h-lh w-4 not-in-aria-expanded:hidden" />
      </button>
      <ElDisclosure
        id={`${id}-answer`}
        hidden
        className="-mt-2 flex flex-col gap-2 pr-12 pb-4 text-sm/7 text-mist-700 dark:text-mist-400"
      >
        {answer}
      </ElDisclosure>
    </div>
  )
}

export function FAQsAccordion({
  headline,
  subheadline,
  className,
  children,
  ...props
}: {
  headline?: ReactNode
  subheadline?: ReactNode
} & ComponentProps<'section'>) {
  return (
    <section className={clsx('py-16', className)} {...props}>
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 lg:max-w-5xl lg:px-10">
        <div className="flex flex-col gap-6">
          <Subheading>{headline}</Subheading>
          {subheadline && <Text className="flex flex-col gap-4 text-pretty">{subheadline}</Text>}
        </div>
        <div className="divide-y divide-mist-950/10 border-y border-mist-950/10 dark:divide-white/10 dark:border-white/10">
          {children}
        </div>
      </div>
    </section>
  )
}
