'use client'

import { motion }       from 'framer-motion'
import { staggerChild } from '@/lib/motion'
import { DURATION, EASE } from '@/lib/motion'

export interface WorkCardData {
  id:        string
  title:     string
  category:  string
  year:      string
  thumbnail: string
  slug:      string
  featured?: boolean
}

interface WorkCardProps extends WorkCardData {
  aspectRatio?: '4/3' | '16/9' | '3/4'
}

export function WorkCard({
  title,
  category,
  year,
  slug,
  aspectRatio = '4/3',
}: WorkCardProps) {
  return (
    // Outer li wrapper carries stagger variant — isolated from hover state.
    // Inner article carries all hover logic.
    // Separating these prevents variant name collisions between stagger and hover.
    <motion.li
      variants={staggerChild.fadeUp}
      className="list-none"
    >
      <motion.article
        className="group cursor-pointer overflow-hidden rounded-[var(--radius-lg)]"
        style={{
          backgroundColor: 'var(--depth-2)',
          backgroundImage: 'var(--glow-card)',
          border:          '1px solid var(--border-default)',
          boxShadow:       'var(--card-shadow)',
        }}
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        <a
          href={`/work/${slug}`}
          className="block"
          aria-label={`View ${title} case study`}
        >
          {/* Thumbnail container — clipped, no overflow */}
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio }}
          >
            {/* Thumbnail scales on parent hover via variant propagation */}
            <motion.div
              className="h-full w-full"
              variants={{
                rest:  { scale: 1 },
                hover: { scale: 1.04,
                         transition: { duration: DURATION.moderate, ease: EASE.ui } },
              }}
            >
              <div
                className="h-full w-full"
                style={{ backgroundColor: 'var(--depth-3)' }}
                role="img"
                aria-label={`${title} preview`}
              />
            </motion.div>

            {/* Overlay — siblings receive parent hover via variant propagation */}
            <motion.div
              className="absolute inset-0 flex flex-col justify-end p-5"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)',
              }}
              variants={{
                rest:  { opacity: 0, y: 10 },
                hover: { opacity: 1,  y: 0,
                         transition: { duration: DURATION.fast, ease: EASE.ui } },
              }}
            >
              <span
                className="text-label mb-1.5"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {category} · {year}
              </span>
              <span
                className="text-sm font-medium tracking-tight"
                style={{ color: 'var(--fg-primary)' }}
              >
                View Case Study →
              </span>
            </motion.div>
          </div>

          {/* Card body */}
          <motion.div
            className="p-5"
            variants={{
              rest:  { y: 0 },
              hover: { y: -2,
                       transition: { duration: DURATION.fast, ease: EASE.ui } },
            }}
          >
            <motion.div
              className="flex items-start justify-between gap-4"
              variants={{
                rest:  {},
                hover: {},
              }}
            >
              <h3
                className="text-h3"
                style={{ color: 'var(--fg-primary)' }}
              >
                {title}
              </h3>
              {/* Arrow — slides right on hover */}
              <motion.span
                aria-hidden
                className="mt-1 shrink-0 text-sm"
                style={{ color: 'var(--fg-tertiary)' }}
                variants={{
                  rest:  { x: 0,  opacity: 0 },
                  hover: { x: 2,  opacity: 1,
                           transition: { duration: DURATION.micro, ease: EASE.ui } },
                }}
              >
                ↗
              </motion.span>
            </motion.div>
            <p
              className="mt-1 text-label"
              style={{ color: 'var(--fg-tertiary)' }}
            >
              {category}
            </p>
          </motion.div>
        </a>

        {/* Card border brightens on hover — separate motion element for perf */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[var(--radius-lg)]"
          style={{ border: '1px solid transparent' }}
          variants={{
            rest:  { borderColor: 'transparent' },
            hover: { borderColor: 'var(--border-strong)',
                     transition: { duration: DURATION.micro } },
          }}
        />
      </motion.article>
    </motion.li>
  )
}
