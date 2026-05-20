'use client'

import ElementHero from '@components/sections/ElementHero'

export default function HeroPage() {
  return (
    <main
      style={{
        background: '#0a0a0a',
        // Extra height lets the scroll transition breathe
        minHeight: '200vh',
      }}
    >
      <ElementHero />
    </main>
  )
}
