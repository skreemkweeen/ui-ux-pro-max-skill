'use client'

import Link                  from 'next/link'
import { motion }            from 'framer-motion'
import { getCase }           from '@/lib/cases'
import { DURATION, EASE }    from '@/lib/motion'
import type { CaseStudy }    from '@/lib/cases'

// CaseNav — previous / next project navigation at the bottom of a case study.
// Shown as two wide tap targets side by side.

interface Props { cs: CaseStudy }

function NavItem({
  slug,
  direction,
}: {
  slug:       string
  direction: 'prev' | 'next'
}) {
  const target = getCase(slug)
  if (!target) return null

  const isPrev  = direction === 'prev'
  const arrow   = isPrev ? '←' : '→'
  const label   = isPrev ? 'Previous Project' : 'Next Project'

  return (
    <motion.div
      className="flex-1"
      initial={{ opacity: 0, x: isPrev ? -16 : 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: DURATION.base, ease: EASE.enter }}
    >
      <Link
        href={`/work/${target.slug}`}
        className="group flex flex-col gap-3 rounded-xl p-8 transition-colors"
        style={{
          backgroundColor: 'var(--card-bg)',
          border:          '1px solid var(--border-default)',
          textDecoration:  'none',
        }}
        data-magnetic
      >
        <span
          className="text-label"
          style={{ color: 'var(--fg-tertiary)' }}
        >
          {label}
        </span>

        <div
          className="flex items-center gap-3"
          style={{ justifyContent: isPrev ? 'flex-start' : 'flex-end' }}
        >
          {isPrev && (
            <motion.span
              style={{ color: 'var(--color-accent)' }}
              initial={{ x: 0 }}
              whileHover={{ x: -4 }}
              transition={{ duration: DURATION.micro, ease: EASE.ui }}
            >
              {arrow}
            </motion.span>
          )}
          <span
            className="text-h3"
            style={{ color: 'var(--fg-primary)' }}
          >
            {target.title}
          </span>
          {!isPrev && (
            <motion.span
              style={{ color: 'var(--color-accent)' }}
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ duration: DURATION.micro, ease: EASE.ui }}
            >
              {arrow}
            </motion.span>
          )}
        </div>

        <span
          className="text-label"
          style={{ color: 'var(--fg-tertiary)' }}
        >
          {target.category}
        </span>
      </Link>
    </motion.div>
  )
}

export function CaseNav({ cs }: Props) {
  const hasPrev = cs.prevSlug !== null
  const hasNext = cs.nextSlug !== null

  if (!hasPrev && !hasNext) return null

  return (
    <nav
      aria-label="Case study navigation"
      style={{
        borderTop:    '1px solid var(--border-subtle)',
        paddingBlock: 'clamp(3rem, 6vw, 5rem)',
      }}
    >
      <div className="container-page">

        <p
          className="text-label mb-8"
          style={{ color: 'var(--fg-tertiary)' }}
        >
          More Work
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          {hasPrev && cs.prevSlug && (
            <NavItem slug={cs.prevSlug} direction="prev" />
          )}
          {hasNext && cs.nextSlug && (
            <NavItem slug={cs.nextSlug} direction="next" />
          )}
        </div>

      </div>
    </nav>
  )
}
