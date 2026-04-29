'use client'

import { useState }              from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeIn }                from '@/components/ui/motion/FadeIn'
import { StaggerList }           from '@/components/ui/motion/StaggerList'
import { WorkCard, WorkCardData } from '@/components/work/WorkCard'
import { DURATION, EASE }        from '@/lib/motion'

// ── Data ──────────────────────────────────────────────────────────────────────
// Replace with your CMS/MDX source in production

const PROJECTS: WorkCardData[] = [
  { id: '1', title: 'Apex — Brand Identity',    category: 'Brand',   year: '2024', thumbnail: '/work/apex.webp',    slug: 'apex-brand-identity',    featured: true  },
  { id: '2', title: 'Flow — Product Design',    category: 'UX',      year: '2024', thumbnail: '/work/flow.webp',    slug: 'flow-product-design'                      },
  { id: '3', title: 'Harvest — Web Design',     category: 'Web',     year: '2024', thumbnail: '/work/harvest.webp', slug: 'harvest-web-design'                       },
  { id: '4', title: 'Ember — SaaS Platform',    category: 'UX',      year: '2023', thumbnail: '/work/ember.webp',   slug: 'ember-saas-platform',    featured: true  },
  { id: '5', title: 'Nori — Type Studio',       category: 'Brand',   year: '2023', thumbnail: '/work/nori.webp',    slug: 'nori-type-studio'                         },
]

const FILTERS = ['All', 'UX', 'Brand', 'Web'] as const
type Filter = typeof FILTERS[number]

// ── Filter Tab ────────────────────────────────────────────────────────────────

interface FilterTabProps {
  label:    Filter
  active:   boolean
  onClick:  () => void
}

function FilterTab({ label, active, onClick }: FilterTabProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="relative px-4 py-1.5 text-label rounded-full transition-colors"
      style={{
        color:           active ? 'var(--fg-primary)'   : 'var(--fg-tertiary)',
        backgroundColor: active ? 'var(--depth-3)'      : 'transparent',
        border:          `1px solid ${active ? 'var(--border-strong)' : 'transparent'}`,
      }}
    >
      {label}
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function SelectedWork() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All')

  const filtered = activeFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeFilter)

  // Row 1 — first 3 projects (equal columns)
  const row1 = filtered.slice(0, 3)
  // Row 2 — remaining (asymmetric: wide + narrow)
  const row2 = filtered.slice(3)

  return (
    <section
      id="work"
      className="container-page"
      style={{ paddingBlock: 'var(--section-gap)' }}
    >
      {/* Section header */}
      <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <FadeIn direction="up" delay={0}>
          <div className="flex flex-col gap-2">
            <span
              className="text-label"
              style={{ color: 'var(--color-accent)' }}
            >
              Selected Work
            </span>
            <h2
              className="text-h2"
              style={{ color: 'var(--fg-primary)' }}
            >
              Projects that earned trust.
            </h2>
          </div>
        </FadeIn>

        {/* Filter tabs */}
        <FadeIn direction="up" delay={0.1}>
          <div
            className="flex items-center gap-1 rounded-full p-1"
            style={{
              backgroundColor: 'var(--depth-2)',
              border:          '1px solid var(--border-subtle)',
            }}
            role="group"
            aria-label="Filter projects by category"
          >
            {FILTERS.map(f => (
              <FilterTab
                key={f}
                label={f}
                active={activeFilter === f}
                onClick={() => setActiveFilter(f)}
              />
            ))}
          </div>
        </FadeIn>
      </div>

      {/* Grid — two rows with intentional asymmetry */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.fast, ease: EASE.ui }}
          className="flex flex-col gap-6"
        >
          {/* Row 1 — up to 3 equal columns */}
          {row1.length > 0 && (
            <StaggerList
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              speed="base"
            >
              {row1.map(project => (
                <li key={project.id} className="list-none">
                  <WorkCard {...project} aspectRatio="4/3" />
                </li>
              ))}
            </StaggerList>
          )}

          {/* Row 2 — asymmetric: 2/3 + 1/3 */}
          {row2.length > 0 && (
            <StaggerList
              className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]"
              speed="base"
            >
              {row2.map((project, i) => (
                <li key={project.id} className="list-none">
                  <WorkCard
                    {...project}
                    aspectRatio={i === 0 ? '16/9' : '4/3'}
                  />
                </li>
              ))}
            </StaggerList>
          )}
        </motion.div>
      </AnimatePresence>

      {/* View all link */}
      <FadeIn direction="up" delay={0.2}>
        <div className="mt-12 flex justify-center">
          <motion.a
            href="/work"
            className="inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: 'var(--fg-secondary)' }}
            whileHover={{ color: 'var(--fg-primary)' }}
            transition={{ duration: DURATION.micro }}
          >
            View all work
            <motion.span
              aria-hidden
              whileHover={{ x: 4 }}
              transition={{ duration: DURATION.micro, ease: EASE.ui }}
            >
              →
            </motion.span>
          </motion.a>
        </div>
      </FadeIn>
    </section>
  )
}
