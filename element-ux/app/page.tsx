import { Hero }          from '@/components/sections/Hero'
import { HeroWorkStrip } from '@/components/ui/MarqueeStrip'
import { SelectedWork }  from '@/components/sections/SelectedWork'
import { Process }       from '@/components/sections/Process'
import { Capabilities }  from '@/components/sections/Capabilities'
import { About }         from '@/components/sections/About'
import { Testimonials }  from '@/components/sections/Testimonials'
import { CTA }           from '@/components/sections/CTA'
import { Footer }        from '@/components/layout/Footer'

// Page is a server component — no 'use client' needed here.
// All interactive children opt-in individually.

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Visual pause moment — breaks the scroll rhythm between hero and work */}
      <HeroWorkStrip />

      <SelectedWork />
      <Process />
      <Capabilities />
      <About />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  )
}
