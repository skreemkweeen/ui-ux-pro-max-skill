'use client'

import { useRef }              from 'react'
import { motion, useReducedMotion,
         useScroll, useTransform } from 'framer-motion'

interface MarqueeStripProps {
  items:     string[]
  speed?:    number   // pixels per second
  direction?: 'left' | 'right'
  className?: string
}

// ── Single scrolling track ────────────────────────────────────────────────────

function Track({
  items,
  speed     = 40,
  direction = 'left',
}: Omit<MarqueeStripProps, 'className'>) {
  const shouldReduce = useReducedMotion()

  // Duplicate enough times to ensure seamless loop
  const repeated = [...items, ...items, ...items, ...items]
  const sign     = direction === 'left' ? '-' : ''

  return (
    <div className="flex overflow-hidden">
      <motion.div
        className="flex shrink-0 items-center gap-0"
        animate={shouldReduce ? {} : {
          x: [`0%`, `${sign}${100 / 4}%`],
        }}
        transition={{
          duration:   (items.length * 220) / speed,
          ease:       'linear',
          repeat:     Infinity,
          repeatType: 'loop',
        }}
        style={{ width: 'max-content' }}
      >
        {repeated.map((item, i) => (
          <div key={i} className="flex items-center">
            <span
              className="whitespace-nowrap px-6 text-label"
              style={{ color: 'var(--fg-tertiary)' }}
            >
              {item}
            </span>
            {/* Separator dot */}
            <span
              aria-hidden
              className="h-1 w-1 shrink-0 rounded-full"
              style={{ backgroundColor: 'var(--color-accent)', opacity: 0.5 }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function MarqueeStrip({ items, speed, direction, className }: MarqueeStripProps) {
  const ref             = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  // Subtle parallax on the strip itself as it enters/exits viewport
  const y = useTransform(scrollYProgress, [0, 1], ['8px', '-8px'])

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden py-5 ${className ?? ''}`}
      style={{
        y,
        borderTop:    '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
      aria-hidden
    >
      <Track items={items} speed={speed} direction={direction} />
    </motion.div>
  )
}

// ── Pre-configured strip for between Hero and Work ────────────────────────────

const STRIP_ITEMS = [
  'UX Research',
  'Brand Strategy',
  'Product Design',
  'Design Systems',
  'Interaction Design',
  'Prototyping',
  'Web Design',
  'Design Leadership',
]

export function HeroWorkStrip() {
  return (
    <MarqueeStrip
      items={STRIP_ITEMS}
      speed={35}
      direction="left"
    />
  )
}
