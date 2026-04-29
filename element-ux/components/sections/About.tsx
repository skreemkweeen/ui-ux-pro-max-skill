'use client'

import { useEffect, useRef }       from 'react'
import { motion, useInView,
         useMotionValue, animate }  from 'framer-motion'
import { FadeIn }                  from '@/components/ui/motion/FadeIn'
import { EASE }                    from '@/lib/motion'

// ── Animated stat counter ─────────────────────────────────────────────────────

interface StatProps {
  value:  number
  suffix: string
  label:  string
}

function AnimatedStat({ value, suffix, label }: StatProps) {
  const ref      = useRef<HTMLSpanElement>(null)
  const motionVal = useMotionValue(0)
  const inView   = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!inView) return
    const controls = animate(motionVal, value, {
      duration: 1.4,
      ease:     EASE.ui as [number, number, number, number],
    })
    return controls.stop
  }, [inView, value, motionVal])

  useEffect(() =>
    motionVal.on('change', v => {
      if (ref.current) ref.current.textContent = Math.round(v) + suffix
    })
  , [motionVal, suffix])

  return (
    <div className="flex flex-col gap-1">
      <div
        className="font-display text-4xl font-bold leading-none"
        style={{
          fontFamily:    'var(--font-display)',
          color:         'var(--fg-primary)',
          letterSpacing: '-0.03em',
        }}
      >
        <span ref={ref} aria-live="polite">0{suffix}</span>
      </div>
      <p
        className="text-label"
        style={{ color: 'var(--fg-tertiary)' }}
      >
        {label}
      </p>
    </div>
  )
}

// ── Portrait placeholder ───────────────────────────────────────────────────────

function Portrait() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{ aspectRatio: '3/4' }}
    >
      {/* Image — replace with next/image in production */}
      <div
        className="h-full w-full"
        style={{ backgroundColor: 'var(--depth-3)' }}
        role="img"
        aria-label="Portrait of the designer"
      />

      {/* Corner accent — top-right decorative mark */}
      <div
        aria-hidden
        className="absolute right-4 top-4 h-8 w-8 rounded-full border"
        style={{ borderColor: 'var(--color-accent)', opacity: 0.5 }}
      />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function About() {
  return (
    <section
      id="about"
      className="container-page"
      style={{ paddingBlock: 'var(--section-gap)' }}
    >
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">

        {/* Left — portrait */}
        <FadeIn direction="left" delay={0}>
          <Portrait />
        </FadeIn>

        {/* Right — content */}
        <FadeIn direction="right" delay={0.12}>
          <div className="flex flex-col justify-center gap-10">

            {/* Label + heading */}
            <div className="flex flex-col gap-3">
              <span
                className="text-label"
                style={{ color: 'var(--color-accent)' }}
              >
                About
              </span>
              <h2
                className="text-h2"
                style={{ color: 'var(--fg-primary)' }}
              >
                The best design is invisible.
              </h2>
            </div>

            {/* Philosophy */}
            <div
              className="flex flex-col gap-4 text-body"
              style={{ color: 'var(--fg-secondary)', maxWidth: 'var(--container-text)' }}
            >
              <p>
                I'm a UX designer and brand strategist with eight years of
                experience helping companies build products people love and
                businesses they can be proud of.
              </p>
              <p>
                My work sits at the intersection of rigorous research and
                intentional craft — where clarity of thinking meets quality
                of execution. I believe the most powerful design is the kind
                that gets out of the way and lets the product speak.
              </p>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-6 border-t pt-8"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <AnimatedStat value={8}  suffix="+"  label="Years experience" />
              <AnimatedStat value={40} suffix="+"  label="Projects shipped"  />
              <AnimatedStat value={18} suffix=""   label="Clients served"    />
            </div>

            {/* Tool stack */}
            <div className="flex flex-col gap-3">
              <p
                className="text-label"
                style={{ color: 'var(--fg-tertiary)' }}
              >
                Tools & methods
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Figma', 'Framer', 'Notion', 'Maze',
                  'React', 'Tailwind', 'Loom', 'Miro',
                ].map(tool => (
                  <motion.span
                    key={tool}
                    className="rounded-full px-3 py-1 text-sm"
                    style={{
                      color:           'var(--fg-secondary)',
                      backgroundColor: 'var(--depth-2)',
                      border:          '1px solid var(--border-subtle)',
                    }}
                    whileHover={{
                      borderColor: 'var(--border-strong)',
                      color:        'var(--fg-primary)',
                      transition:   { duration: 0.15 },
                    }}
                  >
                    {tool}
                  </motion.span>
                ))}
              </div>
            </div>

          </div>
        </FadeIn>

      </div>
    </section>
  )
}
