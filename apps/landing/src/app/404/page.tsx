import { Link } from '@/components/elements/link'
import { ArrowRight } from 'honestui/icons'
import { HeroSimpleCentered } from '@/components/sections/hero-simple-centered'

export default function Page() {
  return (
    <>
      <HeroSimpleCentered
        headline="Page not found"
        subheadline={<p>Sorry, but the page you were looking for could not be found.</p>}
        cta={
          <Link href="/">
            Go back home <ArrowRight aria-hidden="true" className="inline-block size-4 shrink-0" />
          </Link>
        }
      />
    </>
  )
}
