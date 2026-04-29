'use client'

import { motion }      from 'framer-motion'
import { cardHover }   from '@/lib/motion'
import { staggerChild } from '@/lib/motion'

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
  thumbnail,
  slug,
  aspectRatio = '4/3',
}: WorkCardProps) {
  return (
    // staggerChild.fadeUp applied by parent StaggerList
    <motion.article
      variants={staggerChild.fadeUp}
      className="surface-card group cursor-pointer overflow-hidden"
    >
      <a
        href={`/work/${slug}`}
        className="block"
        aria-label={`View ${title} case study`}
      >
        {/* Thumbnail — scales subtly on hover */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio }}
        >
          <motion.div
            className="h-full w-full"
            variants={cardHover.thumbnail}
            initial="rest"
            whileHover="hover"
          >
            {/* Placeholder — replace with next/image in production */}
            <div
              className="h-full w-full object-cover"
              style={{ backgroundColor: 'var(--depth-3)' }}
              role="img"
              aria-label={`${title} preview`}
            />
          </motion.div>

          {/* Hover overlay — slides up from bottom */}
          <motion.div
            className="absolute inset-0 flex flex-col justify-end p-5"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
            }}
            variants={cardHover.overlay}
            initial="rest"
            whileHover="hover"
          >
            <span
              className="text-label mb-1"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              {category} · {year}
            </span>
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--fg-primary)' }}
            >
              View Case Study →
            </span>
          </motion.div>
        </div>

        {/* Card body — lifts slightly on hover */}
        <motion.div
          className="p-5"
          variants={cardHover.body}
          initial="rest"
          whileHover="hover"
        >
          <h3
            className="text-h3 mb-1"
            style={{ color: 'var(--fg-primary)' }}
          >
            {title}
          </h3>
          <p
            className="text-label"
            style={{ color: 'var(--fg-secondary)' }}
          >
            {category}
          </p>
        </motion.div>
      </a>
    </motion.article>
  )
}
