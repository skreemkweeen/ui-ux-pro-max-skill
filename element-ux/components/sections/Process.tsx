'use client'

import { motion }       from 'framer-motion'
import { FadeIn }       from '@/components/ui/motion/FadeIn'
import { StaggerList }  from '@/components/ui/motion/StaggerList'
import { staggerChild } from '@/lib/motion'

// ── Data ──────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    number:      '01',
    title:       'Discover',
    description: 'Research, stakeholder interviews, competitive audits, and user observation. No assumptions — only evidence.',
    deliverables: ['Research synthesis', 'User interviews', 'Competitive audit'],
  },
  {
    number:      '02',
    title:       'Define',
    description: 'Problem framing, opportunity mapping, and a strategy brief that aligns everyone before pixels are drawn.',
    deliverables: ['Strategy brief', 'Problem statement', 'Success metrics'],
  },
  {
    number:      '03',
    title:       'Design',
    description: 'Wireframes, interaction design, visual systems, and high-fidelity prototypes built to test and ship.',
    deliverables: ['Wireframes', 'Design system', 'Interactive prototype'],
  },
  {
    number:      '04',
    title:       'Deliver',
    description: 'Usability testing, dev handoff, implementation review, and post-launch iteration based on real usage.',
    deliverables: ['Dev specs', 'Usability testing', 'Launch support'],
  },
] as const

// ── Step Card ─────────────────────────────────────────────────────────────────

interface StepCardProps {
  number:       string
  title:        string
  description:  string
  deliverables: readonly string[]
  index:        number
}

function StepCard({ number, title, description, deliverables }: StepCardProps) {
  return (
    <motion.div
      variants={staggerChild.slideRight}
      className="flex flex-col gap-5 rounded-xl p-6"
      style={{
        backgroundColor: 'var(--depth-1)',
        border:          '1px solid var(--border-subtle)',
      }}
    >
      {/* Step number — decorative, muted */}
      <span
        aria-hidden
        className="font-display text-5xl font-bold leading-none"
        style={{
          fontFamily:  'var(--font-display)',
          color:       'var(--border-default)',
          letterSpacing: '-0.04em',
        }}
      >
        {number}
      </span>

      <div className="flex flex-col gap-3">
        <h3
          className="text-h3"
          style={{ color: 'var(--fg-primary)' }}
        >
          {title}
        </h3>
        <p
          className="text-body"
          style={{ color: 'var(--fg-secondary)', maxWidth: '28ch' }}
        >
          {description}
        </p>
      </div>

      {/* Deliverables list */}
      <ul
        className="flex flex-col gap-2 border-t pt-4"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {deliverables.map(item => (
          <li
            key={item}
            className="flex items-center gap-2 text-label"
            style={{ color: 'var(--fg-tertiary)' }}
          >
            <span
              aria-hidden
              className="h-px w-3 shrink-0"
              style={{ backgroundColor: 'var(--color-accent)' }}
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
      {/* Section header */}
      <div
        className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2"
        style={{ alignItems: 'end' }}
      >
        <FadeIn direction="up" delay={0}>
          <div className="flex flex-col gap-3">
            <span
              className="text-label"
              style={{ color: 'var(--color-accent)' }}
            >
              Process
            </span>
            <h2
              className="text-h2"
              style={{ color: 'var(--fg-primary)' }}
            >
              Rigorous by design.
            </h2>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.1}>
          <p
            className="text-lead"
            style={{ color: 'var(--fg-secondary)', maxWidth: 'var(--container-text)' }}
          >
            Every engagement follows a structured arc — from research to
            delivery. The process is invisible to the end user and
            essential to the outcome.
          </p>
        </FadeIn>
      </div>

      {/* Step grid — 4 columns desktop, 2 tablet, 1 mobile */}
      <StaggerList
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        speed="slow"
        as="div"
      >
        {STEPS.map((step, i) => (
          <StepCard key={step.number} {...step} index={i} />
        ))}
      </StaggerList>

      {/* Connector line — desktop only, decorative */}
      <FadeIn direction="none" delay={0.5}>
        <div
          aria-hidden
          className="mt-8 hidden h-px lg:block"
          style={{
            background: `linear-gradient(to right,
              transparent 0%,
              var(--border-subtle) 15%,
              var(--border-default) 50%,
              var(--border-subtle) 85%,
              transparent 100%
            )`,
          }}
        />
      </FadeIn>
    </section>
  )
}
