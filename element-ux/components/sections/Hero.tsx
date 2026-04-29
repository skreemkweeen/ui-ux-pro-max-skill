'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { pageLoad, buttonHover, DURATION, EASE } from '@/lib/motion'

// ── Sub-components ────────────────────────────────────────────────────────────

function AvailabilityBadge() {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      className="inline-flex items-center gap-2"
      {...pageLoad.heroLabel}
    >
      {/* Gold dot — pulses once on load, then rests */}
      <motion.span
        aria-hidden
        className="block h-2 w-2 rounded-full"
        style={{ backgroundColor: 'var(--color-accent)' }}
        animate={shouldReduce ? {} : {
          scale:   [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration:   0.65,
          ease:       'easeInOut',
          delay:      0.9,
          repeat:     0,
        }}
      />
      <span
        className="text-label"
        style={{ color: 'var(--color-accent)' }}
      >
        Available for projects
      </span>
    </motion.div>
  )
}

function HeroCTAs() {
  return (
    <motion.div
      className="flex flex-wrap items-center gap-4"
      {...pageLoad.heroCta}
    >
      {/* Primary — with glow bloom on hover */}
      <motion.a
        href="#work"
        className="relative inline-flex items-center gap-2 rounded-lg px-6 py-3
                   text-sm font-medium overflow-hidden"
        style={{
          backgroundColor: 'var(--fg-primary)',
          color:           'var(--fg-inverse)',
        }}
        initial="rest"
        whileHover="hover"
        whileTap="pressed"
        variants={buttonHover.primary}
      >
        {/* Glow bloom — behind button, appears on hover */}
        <motion.span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-lg"
          style={{
            filter:     'blur(14px)',
            background: 'var(--color-accent)',
          }}
          variants={buttonHover.glow}
        />
        View Selected Work
        <span aria-hidden>↓</span>
      </motion.a>

      {/* Ghost */}
      <motion.a
        href="#contact"
        className="inline-flex items-center gap-2 rounded-lg border px-6 py-3
                   text-sm font-medium transition-colors"
        style={{
          borderColor: 'var(--border-default)',
          color:       'var(--fg-secondary)',
        }}
        initial="rest"
        whileHover="hover"
        whileTap="pressed"
        variants={buttonHover.ghost}
        onHoverStart={e => {
          ;(e.target as HTMLElement).style.borderColor = 'var(--border-strong)'
          ;(e.target as HTMLElement).style.color       = 'var(--fg-primary)'
        }}
        onHoverEnd={e => {
          ;(e.target as HTMLElement).style.borderColor = 'var(--border-default)'
          ;(e.target as HTMLElement).style.color       = 'var(--fg-secondary)'
        }}
      >
        Let's Talk
        <span aria-hidden>→</span>
      </motion.a>
    </motion.div>
  )
}

function ScrollIndicator() {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2
                 flex flex-col items-center gap-2"
      {...pageLoad.scrollIndicator}
      aria-hidden
    >
      <motion.div
        className="h-10 w-px"
        style={{ backgroundColor: 'var(--fg-tertiary)' }}
        animate={shouldReduce ? {} : {
          scaleY:  [1, 0.5, 1],
          opacity: [0.4, 0.15, 0.4],
        }}
        transition={{
          duration: 1.6,
          ease:     'easeInOut',
          delay:    1.2,
          repeat:   2,
        }}
      />
      <span className="text-label" style={{ color: 'var(--fg-tertiary)' }}>
        Scroll
      </span>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex h-svh min-h-[600px] flex-col justify-center"
    >
      {/* Ambient glow — barely perceptible gold bloom at top of canvas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'var(--glow-hero)' }}
      />

      <div className="container-page">
        <div className="flex max-w-4xl flex-col gap-8">

          <AvailabilityBadge />

          {/* Statement — largest type on the page */}
          <motion.h1
            className="text-hero"
            style={{ color: 'var(--fg-primary)' }}
            {...pageLoad.heroStatement}
          >
            Designing products
            <br />
            {/* Italic word — one editorial moment */}
            <em
              className="not-italic"
              style={{
                fontStyle: 'italic',
                color:     'var(--fg-secondary)',
              }}
            >
              people
            </em>{' '}
            remember.
          </motion.h1>

          {/* Sub-role line */}
          <motion.p
            className="text-lead"
            style={{ color: 'var(--fg-secondary)' }}
            {...pageLoad.heroSub}
          >
            UX Designer · Brand Strategist · Based in New York
          </motion.p>

          <HeroCTAs />

        </div>
      </div>

      <ScrollIndicator />
    </section>
  )
}
