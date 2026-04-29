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

      {/* Ghost — single FM variant system, no competing inline style mutations */}
      <motion.a
        href="#contact"
        className="inline-flex items-center gap-2 rounded-lg border px-6 py-3
                   text-sm font-medium"
        initial="rest"
        whileHover="hover"
        whileTap="pressed"
        variants={{
          rest:    { opacity: 1,    borderColor: 'rgba(255,255,255,0.08)', color: 'var(--fg-secondary)', scale: 1 },
          hover:   { opacity: 1,    borderColor: 'rgba(255,255,255,0.18)', color: 'var(--fg-primary)',   scale: 1,
                     transition: { duration: DURATION.micro, ease: EASE.micro } },
          pressed: { scale: 0.97,   transition: { duration: DURATION.instant } },
        }}
      >
        Let's Talk
        <motion.span
          aria-hidden
          variants={{
            rest:  { x: 0 },
            hover: { x: 3, transition: { duration: DURATION.micro, ease: EASE.ui } },
          }}
        >
          →
        </motion.span>
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
      {/* Line only — "Scroll" label removed (the animation communicates it) */}
      <motion.div
        className="h-12 w-px origin-top"
        style={{ backgroundColor: 'var(--fg-tertiary)' }}
        animate={shouldReduce ? {} : {
          scaleY:  [1, 0.4, 1],
          opacity: [0.35, 0.1, 0.35],
        }}
        transition={{
          duration: 1.8,
          ease:     'easeInOut',
          delay:    1.4,
          repeat:   2,
        }}
      />
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

          {/* Statement — specific, not generic. Answers: what do you actually do? */}
          <motion.h1
            className="text-hero"
            style={{ color: 'var(--fg-primary)' }}
            {...pageLoad.heroStatement}
          >
            I close the gap
            <br />
            between{' '}
            <em
              style={{
                fontStyle: 'italic',
                color:     'var(--fg-secondary)',
              }}
            >
              strategy
            </em>
            <br />
            and screen.
          </motion.h1>

          {/* Sub-role — specific location and POV, not a job title list */}
          <motion.p
            className="text-lead"
            style={{ color: 'var(--fg-secondary)', maxWidth: '38ch' }}
            {...pageLoad.heroSub}
          >
            UX design and brand strategy for companies
            that care about the difference between
            good and{' '}
            <span style={{ color: 'var(--fg-primary)' }}>deliberate</span>.
          </motion.p>

          <HeroCTAs />

        </div>
      </div>

      <ScrollIndicator />
    </section>
  )
}
