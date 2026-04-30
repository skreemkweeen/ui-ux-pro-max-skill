'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { stagger, staggerChild, DURATION, EASE } from '@/lib/motion'

// ── Data ──────────────────────────────────────────────────────────────────────

interface Testimonial {
  quote:    string
  name:     string
  title:    string
  company:  string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:   'Working with Element UX was the first time a designer came back and said "that brief is wrong — here's why." That directness saved us six weeks and a rebrand.',
    name:    'Marcus Webb',
    title:   'VP Product',
    company: 'Meridian SaaS',
  },
  {
    quote:   'The research phase alone changed how we think about our customers. The design was almost secondary — which is exactly the right order.',
    name:    'Priya Lakhani',
    title:   'Co-founder & CEO',
    company: 'Folio Health',
  },
  {
    quote:   'We've worked with four agencies. This was the first engagement where I didn't have to explain what "polish" means.',
    name:    'Jonas Richter',
    title:   'Chief of Staff',
    company: 'Apex Capital',
  },
]

// ── Testimonial Card ──────────────────────────────────────────────────────────

function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.li
      variants={staggerChild.fadeUp}
      className="list-none"
    >
      <article
        className="relative flex h-full flex-col gap-8 rounded-xl p-8 md:p-10"
        style={{
          background:   'var(--card-bg)',
          border:       '1px solid var(--border-default)',
          boxShadow:    'var(--card-shadow)',
        }}
      >
        {/* Opening quote mark */}
        <span
          aria-hidden
          className="absolute right-8 top-6 select-none"
          style={{
            fontFamily:  'var(--font-display)',
            fontSize:    '5rem',
            lineHeight:  1,
            color:       'var(--border-subtle)',
            fontWeight:  700,
          }}
        >
          "
        </span>

        {/* Quote */}
        <blockquote
          className="relative text-body"
          style={{
            color:     'var(--fg-secondary)',
            maxWidth:  '38ch',
            lineHeight: 1.75,
          }}
        >
          {t.quote}
        </blockquote>

        {/* Attribution */}
        <footer className="mt-auto flex items-center gap-3">
          {/* Avatar placeholder — initial monogram */}
          <div
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-label"
            style={{
              backgroundColor: 'var(--depth-4)',
              color:           'var(--color-accent)',
              border:          '1px solid var(--border-default)',
            }}
          >
            {t.name.charAt(0)}
          </div>
          <div>
            <div
              className="text-sm font-medium"
              style={{ color: 'var(--fg-primary)' }}
            >
              {t.name}
            </div>
            <div
              className="text-label mt-0.5"
              style={{ color: 'var(--fg-tertiary)' }}
            >
              {t.title} · {t.company}
            </div>
          </div>
        </footer>
      </article>
    </motion.li>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export function Testimonials() {
  const ref       = useRef<HTMLElement>(null)
  const isInView  = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="testimonials"
      ref={ref}
      className="relative"
      style={{ paddingBlock: 'var(--section-gap)' }}
    >
      <div className="container-page">

        {/* Header */}
        <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: DURATION.base, ease: EASE.enter }}
          >
            <p
              className="text-label mb-3"
              style={{ color: 'var(--color-accent)' }}
            >
              Client Feedback
            </p>
            <h2
              className="text-h2"
              style={{ color: 'var(--fg-primary)' }}
            >
              The work speaks.
              <br />
              <span style={{ color: 'var(--fg-secondary)' }}>
                So do the clients.
              </span>
            </h2>
          </motion.div>

          <motion.p
            className="text-body sm:max-w-xs sm:text-right"
            style={{ color: 'var(--fg-tertiary)' }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: DURATION.base, ease: EASE.enter, delay: 0.15 }}
          >
            Engagements go deep. These are people I've worked with more than once.
          </motion.p>
        </div>

        {/* Grid */}
        <motion.ul
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={stagger.container}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} t={t} index={i} />
          ))}
        </motion.ul>

      </div>
    </section>
  )
}
