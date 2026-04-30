'use client'

import { useRef }                from 'react'
import { motion, useScroll,
         useTransform }          from 'framer-motion'
import { FadeIn }                from '@/components/ui/motion/FadeIn'
import { staggerChild, DURATION, EASE } from '@/lib/motion'

// ── Data ──────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    number:       '01',
    title:        'Discover',
    description:  'Research, stakeholder interviews, competitive audits, and user observation. No assumptions — only evidence.',
    deliverables: ['Research synthesis', 'User interviews', 'Competitive audit'],
  },
  {
    number:       '02',
    title:        'Define',
    description:  'Problem framing, opportunity mapping, and a strategy brief that aligns everyone before pixels are drawn.',
    deliverables: ['Strategy brief', 'Problem statement', 'Success metrics'],
  },
  {
    number:       '03',
    title:        'Design',
    description:  'Wireframes, interaction design, visual systems, and high-fidelity prototypes built to test and ship.',
    deliverables: ['Wireframes', 'Design system', 'Interactive prototype'],
  },
  {
    number:       '04',
    title:        'Deliver',
    description:  'Usability testing, dev handoff, implementation review, and post-launch iteration based on real usage.',
    deliverables: ['Dev specs', 'Usability testing', 'Launch support'],
  },
] as const

// ── Animated progress line ────────────────────────────────────────────────────
// Draws itself as the section scrolls into view. Sits above the step numbers,
// connecting them horizontally. Not decorative — it's the process narrative.

function ProgressLine() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target:  ref,
    offset:  ['start 0.8', 'end 0.3'],
  })
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={ref} className="relative mb-8 hidden h-px lg:block">
      {/* Track */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'var(--border-subtle)' }}
      />
      {/* Fill — animates left to right on scroll */}
      <motion.div
        className="absolute inset-y-0 left-0 origin-left"
        style={{
          scaleX,
          backgroundColor: 'var(--color-accent)',
          opacity:          0.5,
        }}
      />
      {/* Step dots — sit on the line at equal intervals */}
      <div className="absolute inset-0 flex items-center">
        {STEPS.map((_, i) => (
          <div key={i} className="flex flex-1 justify-center">
            <motion.div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: 'var(--color-accent)' }}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 0.7 }}
              viewport={{ once: true }}
              transition={{ duration: DURATION.fast, ease: EASE.ui, delay: i * 0.12 }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Step card ─────────────────────────────────────────────────────────────────

interface StepCardProps {
  number:       string
  title:        string
  description:  string
  deliverables: readonly string[]
  index:        number
}

function StepCard({ number, title, description, deliverables, index }: StepCardProps) {
  return (
    <motion.div
      className="flex flex-col gap-5"
      variants={staggerChild.fadeUp}
      custom={index}
    >
      {/* Number — large, muted, tied visually to the line above */}
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="text-label"
          style={{ color: 'var(--color-accent)', opacity: 0.7 }}
        >
          {number}
        </span>
        <span
          className="h-px flex-1"
          aria-hidden
          style={{ backgroundColor: 'var(--border-subtle)' }}
        />
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-h3" style={{ color: 'var(--fg-primary)' }}>
          {title}
        </h3>
        <p
          className="text-body"
          style={{ color: 'var(--fg-secondary)', lineHeight: 1.6 }}
        >
          {description}
        </p>
      </div>

      {/* Deliverables */}
      <ul className="flex flex-col gap-2 pt-2">
        {deliverables.map(item => (
          <li
            key={item}
            className="flex items-center gap-2 text-label"
            style={{ color: 'var(--fg-tertiary)' }}
          >
            <span
              aria-hidden
              className="h-px w-3 shrink-0"
              style={{ backgroundColor: 'var(--color-accent)', opacity: 0.6 }}
            />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function Process() {
  return (
    <section
      id="process"
      className="container-page"
      style={{ paddingBlock: 'var(--section-gap)' }}
    >
      {/* Header — asymmetric two-col breaks the repeated label → h2 pattern */}
      <div className="mb-20 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr]">
        <FadeIn direction="up" delay={0}>
          <div className="flex flex-col gap-3">
            <span className="text-label" style={{ color: 'var(--color-accent)' }}>
              Process
            </span>
            <h2 className="text-h2" style={{ color: 'var(--fg-primary)' }}>
              Rigorous
              <br />
              by design.
            </h2>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.1}>
          <div className="flex flex-col justify-end gap-4">
            <p
              className="text-lead"
              style={{ color: 'var(--fg-secondary)', maxWidth: '48ch' }}
            >
              Every engagement follows the same arc — not because it's a
              template, but because great outcomes require the same
              foundations every time.
            </p>
            <p
              className="text-body"
              style={{ color: 'var(--fg-tertiary)', maxWidth: '48ch' }}
            >
              The process is invisible to the end user. It's essential to
              the outcome.
            </p>
          </div>
        </FadeIn>
      </div>

      {/* Scroll-driven progress line — positioned ABOVE step numbers */}
      <ProgressLine />

      {/* Steps — 4-col grid, no card backgrounds — the content is the design */}
      <motion.div
        className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden:  {},
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
        }}
      >
        {STEPS.map((step, i) => (
          <StepCard key={step.number} {...step} index={i} />
        ))}
      </motion.div>
    </section>
  )
}
