'use client'

import { motion }       from 'framer-motion'
import { FadeIn }       from '@/components/ui/motion/FadeIn'
import { StaggerList }  from '@/components/ui/motion/StaggerList'
import { staggerChild, DURATION, EASE } from '@/lib/motion'

// ── Data ──────────────────────────────────────────────────────────────────────

const CAPABILITIES = [
  {
    title:       'UX Research',
    description: 'User interviews, usability testing, journey mapping, and synthesis that turns observations into decisions.',
    tags:        ['Interviews', 'Usability Testing', 'Journey Mapping', 'Synthesis'],
  },
  {
    title:       'Product Design',
    description: 'End-to-end product thinking — from flows and wireframes to pixel-precise UI and design systems that scale.',
    tags:        ['Information Architecture', 'Wireframing', 'Prototyping', 'Design Systems'],
  },
  {
    title:       'Brand Identity',
    description: 'Visual identity systems built to be distinctive, flexible, and consistent across every surface.',
    tags:        ['Logo Design', 'Typography', 'Color Systems', 'Brand Guidelines'],
  },
  {
    title:       'Web Design',
    description: 'Marketing sites and campaign pages that convert — built with performance, accessibility, and craft.',
    tags:        ['Landing Pages', 'Motion', 'Responsive', 'Accessibility'],
  },
  {
    title:       'Design Leadership',
    description: 'Mentoring teams, establishing processes, reviewing work, and raising the quality bar across an organization.',
    tags:        ['Team Mentoring', 'Critique', 'Process Design', 'Workshops'],
  },
  {
    title:       'Prototyping',
    description: 'Interactive prototypes in Figma or code — detailed enough to test, fast enough to iterate on.',
    tags:        ['Figma', 'Framer', 'Code Prototypes', 'User Testing'],
  },
] as const

// ── Capability Card ───────────────────────────────────────────────────────────

interface CapabilityCardProps {
  title:       string
  description: string
  tags:        readonly string[]
}

function CapabilityCard({ title, description, tags }: CapabilityCardProps) {
  return (
    <motion.div
      variants={staggerChild.fadeUp}
      className="group flex flex-col gap-5 rounded-xl p-6 transition-colors"
      style={{
        backgroundColor: 'var(--depth-2)',
        border:          '1px solid var(--border-subtle)',
        backgroundImage: 'var(--glow-card)',
        transition:      `border-color var(--dur-micro) var(--ease-ui),
                          background-color var(--dur-micro) var(--ease-ui)`,
      }}
      whileHover={{
        y: -4,
        transition: { duration: DURATION.fast, ease: EASE.ui },
      }}
      onHoverStart={e => {
        ;(e.target as HTMLElement)
          .closest('[data-capability]')
          ?.setAttribute('style',
            'border-color: var(--border-strong); background-color: var(--depth-3)'
          )
      }}
    >
      <div data-capability className="flex flex-col gap-3">
        <h3
          className="text-h3"
          style={{ color: 'var(--fg-primary)' }}
        >
          {title}
        </h3>
        <p
          className="text-body"
          style={{
            color:     'var(--fg-secondary)',
            maxWidth:  '32ch',
            lineHeight: '1.6',
          }}
        >
          {description}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span
            key={tag}
            className="text-label rounded-full px-3 py-1"
            style={{
              color:           'var(--fg-tertiary)',
              backgroundColor: 'var(--depth-4)',
              border:          '1px solid var(--border-subtle)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function Capabilities() {
  return (
    <section
      id="capabilities"
      style={{
        paddingBlock:    'var(--section-gap)',
        backgroundColor: 'var(--depth-1)',
        borderTop:       '1px solid var(--border-subtle)',
        borderBottom:    '1px solid var(--border-subtle)',
      }}
    >
      <div className="container-page">

        {/* Section header */}
        <div className="mb-16 flex flex-col gap-4">
          <FadeIn direction="up" delay={0}>
            <span
              className="text-label"
              style={{ color: 'var(--color-accent)' }}
            >
              Capabilities
            </span>
          </FadeIn>
          <FadeIn direction="up" delay={0.08}>
            <h2
              className="text-h2"
              style={{ color: 'var(--fg-primary)', maxWidth: '14ch' }}
            >
              What I bring to the table.
            </h2>
          </FadeIn>
        </div>

        {/* 3-col grid */}
        <StaggerList
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          speed="base"
          as="div"
        >
          {CAPABILITIES.map(cap => (
            <CapabilityCard key={cap.title} {...cap} />
          ))}
        </StaggerList>

        {/* Tooling strip */}
        <FadeIn direction="up" delay={0.2}>
          <div
            className="mt-16 flex flex-col gap-4 rounded-xl p-6 sm:flex-row sm:items-center sm:justify-between"
            style={{
              backgroundColor: 'var(--depth-2)',
              border:          '1px solid var(--border-subtle)',
            }}
          >
            <p
              className="text-label"
              style={{ color: 'var(--fg-tertiary)' }}
            >
              Primary tools
            </p>
            <div className="flex flex-wrap items-center gap-6">
              {['Figma', 'Framer', 'VS Code', 'Notion', 'Loom', 'Maze'].map(tool => (
                <span
                  key={tool}
                  className="text-sm font-medium"
                  style={{ color: 'var(--fg-secondary)' }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
