'use client'

import Image           from 'next/image'
import { motion }      from 'framer-motion'
import { pageLoad, DURATION, EASE } from '@/lib/motion'
import type { CaseStudy } from '@/lib/cases'

// ── CaseHero ──────────────────────────────────────────────────────────────────
// Full-viewport hero for a case study.
// Structure:
//   - Hero image fills viewport (parallax handled via CSS transform on scroll)
//   - Gradient overlay bottom → top (text legibility)
//   - Metadata pills: category · year · role
//   - Title + tagline stagger in on mount
//
// Image is optional — falls back to a solid depth gradient.

interface Props { cs: CaseStudy }

const META_DELAY = 0.08

export function CaseHero({ cs }: Props) {
  const metaItems = [
    { label: 'Category', value: cs.category },
    { label: 'Client',   value: cs.client   },
    { label: 'Year',     value: cs.year      },
    { label: 'Duration', value: cs.duration  },
  ]

  return (
    <section
      className="relative flex h-svh min-h-[600px] flex-col justify-end overflow-hidden"
      aria-label={`${cs.title} case study`}
    >
      {/* Hero image / fallback gradient */}
      {cs.heroImage ? (
        <Image
          src={cs.heroImage}
          alt={`${cs.title} hero`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, var(--depth-3) 0%, var(--depth-1) 100%)',
          }}
        />
      )}

      {/* Dark gradient scrim — bottom-heavy for text legibility */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(8,8,9,0.96) 0%, rgba(8,8,9,0.5) 50%, rgba(8,8,9,0.15) 100%)',
        }}
      />

      {/* Content */}
      <div className="container-page relative z-10 pb-16 md:pb-24">

        {/* Meta pills */}
        <motion.div
          className="mb-8 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.fast, ease: EASE.enter, delay: 0.15 }}
        >
          {metaItems.map((item, i) => (
            <div
              key={item.label}
              className="flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                border:          '1px solid var(--border-default)',
                backdropFilter:  'blur(8px)',
              }}
            >
              <span className="text-label" style={{ color: 'var(--fg-tertiary)' }}>
                {item.label}
              </span>
              <span
                className="mx-1"
                style={{ color: 'var(--border-default)' }}
                aria-hidden
              >
                ·
              </span>
              <span className="text-label" style={{ color: 'var(--fg-secondary)' }}>
                {item.value}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Role line */}
        <motion.p
          className="text-label mb-4"
          style={{ color: 'var(--color-accent)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION.fast, ease: EASE.enter, delay: 0.22 }}
        >
          {cs.role}
        </motion.p>

        {/* Title */}
        <motion.h1
          className="text-h1 mb-4"
          style={{ color: 'var(--fg-primary)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE.enter, delay: 0.3 }}
        >
          {cs.title}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-lead"
          style={{ color: 'var(--fg-secondary)', maxWidth: '44ch' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.moderate, ease: EASE.enter, delay: 0.44 }}
        >
          {cs.tagline}
        </motion.p>

      </div>
    </section>
  )
}
