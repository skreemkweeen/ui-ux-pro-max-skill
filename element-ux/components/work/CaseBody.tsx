'use client'

import { useRef }                 from 'react'
import Image                      from 'next/image'
import { motion, useInView }      from 'framer-motion'
import { stagger, staggerChild, DURATION, EASE } from '@/lib/motion'
import type { CaseStudy, CaseImage, ProcessSection, Metric } from '@/lib/cases'

// ── Section utilities ─────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-label mb-3" style={{ color: 'var(--color-accent)' }}>
      {children}
    </p>
  )
}

function RevealBlock({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?:   number
  className?: string
}) {
  const ref      = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: DURATION.base, ease: EASE.enter, delay }}
    >
      {children}
    </motion.div>
  )
}

// ── Metrics bar ───────────────────────────────────────────────────────────────

function MetricsBar({ metrics }: { metrics: Metric[] }) {
  const ref      = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-xl sm:grid-cols-3"
      style={{ border: '1px solid var(--border-default)' }}
      variants={stagger.containerFast}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          variants={staggerChild.scaleFade}
          className="flex flex-col gap-1.5 px-8 py-7"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <span
            className="text-h2 font-display"
            style={{
              color:       'var(--color-accent)',
              fontFamily:  'var(--font-display)',
              letterSpacing: '-0.03em',
            }}
          >
            {m.value}
          </span>
          <span className="text-label" style={{ color: 'var(--fg-tertiary)' }}>
            {m.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}

// ── Process timeline ──────────────────────────────────────────────────────────

function ProcessPhase({ p, index }: { p: ProcessSection; index: number }) {
  const ref      = useRef<HTMLLIElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.li
      ref={ref}
      className="relative grid gap-6 md:grid-cols-[2fr_3fr]"
      initial={{ opacity: 0, x: -16 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: DURATION.base, ease: EASE.enter, delay: index * 0.09 }}
    >
      {/* Phase header */}
      <div>
        <div
          className="mb-2 flex items-center gap-3"
          style={{ color: 'var(--fg-tertiary)' }}
        >
          <span className="text-label tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
          <hr
            className="flex-1"
            style={{ borderColor: 'var(--border-subtle)' }}
          />
        </div>
        <h3
          className="text-h3"
          style={{ color: 'var(--fg-primary)' }}
        >
          {p.phase}
        </h3>
      </div>

      {/* Phase content */}
      <div className="flex flex-col gap-4">
        <p className="text-body" style={{ color: 'var(--fg-secondary)', lineHeight: 1.75 }}>
          {p.description}
        </p>
        <ul className="flex flex-wrap gap-2">
          {p.outputs.map(o => (
            <li
              key={o}
              className="text-label rounded-md px-3 py-1.5"
              style={{
                color:           'var(--fg-secondary)',
                backgroundColor: 'var(--depth-3)',
                border:          '1px solid var(--border-subtle)',
              }}
            >
              {o}
            </li>
          ))}
        </ul>
      </div>
    </motion.li>
  )
}

// ── Image grid ────────────────────────────────────────────────────────────────

function CaseImageItem({ img, index }: { img: CaseImage; index: number }) {
  const ref      = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden rounded-xl ${
        img.full ? 'w-full' : 'mx-auto w-full max-w-3xl'
      }`}
      style={{
        aspectRatio: img.full ? '16/8' : '16/9',
        background:  'var(--depth-3)',
        border:      '1px solid var(--border-subtle)',
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: DURATION.moderate, ease: EASE.enter, delay: 0.05 * (index % 2) }}
    >
      <Image
        src={img.src}
        alt={img.alt}
        fill
        className="object-cover"
        sizes={img.full ? '100vw' : '(max-width: 768px) 100vw, 768px'}
      />
    </motion.div>
  )
}

function CaseImageGrid({ images }: { images: CaseImage[] }) {
  return (
    <div className="flex flex-col gap-4">
      {images.map((img, i) => (
        <CaseImageItem key={img.src} img={img} index={i} />
      ))}
    </div>
  )
}

// ── Main CaseBody ─────────────────────────────────────────────────────────────

interface Props { cs: CaseStudy }

export function CaseBody({ cs }: Props) {
  const PROSE = 'max-w-prose mx-auto'

  return (
    <article style={{ paddingBlock: 'var(--section-gap)' }}>
      <div className="container-page flex flex-col gap-24">

        {/* Overview + Problem ─────────────────────────────── */}
        <section aria-label="Overview and Problem">
          <div className={`${PROSE} flex flex-col gap-12`}>

            <RevealBlock>
              <SectionLabel>Overview</SectionLabel>
              <p
                className="text-lead"
                style={{ color: 'var(--fg-secondary)', lineHeight: 1.8 }}
              >
                {cs.overview}
              </p>
            </RevealBlock>

            <RevealBlock delay={0.08}>
              <SectionLabel>The Problem</SectionLabel>
              <p
                className="text-body"
                style={{ color: 'var(--fg-secondary)', lineHeight: 1.8 }}
              >
                {cs.problem}
              </p>
            </RevealBlock>

          </div>
        </section>

        {/* First image ────────────────────────────────────── */}
        {cs.images.length > 0 && (
          <section aria-label="Featured image">
            <CaseImageGrid images={cs.images.slice(0, 1)} />
          </section>
        )}

        {/* Process ────────────────────────────────────────── */}
        <section aria-label="Process">
          <RevealBlock className="mb-12">
            <SectionLabel>Process</SectionLabel>
            <h2 className="text-h2" style={{ color: 'var(--fg-primary)' }}>
              How we got there.
            </h2>
          </RevealBlock>

          <ol className="flex flex-col gap-14">
            {cs.process.map((p, i) => (
              <ProcessPhase key={p.phase} p={p} index={i} />
            ))}
          </ol>
        </section>

        {/* Remaining images ───────────────────────────────── */}
        {cs.images.length > 1 && (
          <section aria-label="Process images">
            <CaseImageGrid images={cs.images.slice(1)} />
          </section>
        )}

        {/* Result ─────────────────────────────────────────── */}
        <section aria-label="Result">
          <div className={PROSE}>
            <RevealBlock>
              <SectionLabel>Outcome</SectionLabel>
              <p
                className="text-lead"
                style={{ color: 'var(--fg-secondary)', lineHeight: 1.8 }}
              >
                {cs.result}
              </p>
            </RevealBlock>

            <MetricsBar metrics={cs.metrics} />
          </div>
        </section>

      </div>
    </article>
  )
}
