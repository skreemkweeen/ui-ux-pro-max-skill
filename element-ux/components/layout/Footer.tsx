'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { DURATION, EASE } from '@/lib/motion'

// ── Data ──────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Work',         href: '#work'         },
  { label: 'Process',      href: '#process'       },
  { label: 'Capabilities', href: '#capabilities'  },
  { label: 'About',        href: '#about'         },
]

const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Dribbble', href: 'https://dribbble.com' },
  { label: 'Read.cv',  href: 'https://read.cv'      },
]

// ── Footer Link ───────────────────────────────────────────────────────────────

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isExternal = href.startsWith('http')
  return (
    <motion.a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="text-label transition-colors"
      style={{ color: 'var(--fg-tertiary)' }}
      whileHover={{
        color:      'var(--fg-primary)',
        transition: { duration: DURATION.micro, ease: EASE.micro },
      }}
      data-magnetic
    >
      {children}
    </motion.a>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

export function Footer() {
  const ref      = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const year = new Date().getFullYear()

  return (
    <footer
      ref={ref}
      role="contentinfo"
      style={{
        borderTop:      '1px solid var(--border-subtle)',
        paddingBlock:   'clamp(3rem, 6vw, 5rem)',
        backgroundColor: 'var(--depth-1)',
      }}
    >
      <div className="container-page">

        {/* Top row */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">

          {/* Wordmark + tagline */}
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: DURATION.base, ease: EASE.enter }}
          >
            <div className="flex items-center gap-2">
              <span
                className="text-h3"
                style={{ color: 'var(--fg-primary)', fontFamily: 'var(--font-display)' }}
              >
                Element
              </span>
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: 'var(--color-accent)' }}
              />
            </div>
            <p
              className="text-label"
              style={{ color: 'var(--fg-tertiary)', maxWidth: '26ch' }}
            >
              UX design &amp; brand strategy for companies that care about deliberate.
            </p>
          </motion.div>

          {/* Link columns */}
          <motion.div
            className="flex gap-16"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: DURATION.base, ease: EASE.enter, delay: 0.12 }}
          >
            <div className="flex flex-col gap-4">
              <span className="text-label" style={{ color: 'var(--fg-primary)' }}>
                Navigation
              </span>
              {NAV_LINKS.map(l => (
                <FooterLink key={l.href} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-label" style={{ color: 'var(--fg-primary)' }}>
                Elsewhere
              </span>
              {SOCIAL_LINKS.map(l => (
                <FooterLink key={l.href} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </div>
          </motion.div>

          {/* CTA column */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: DURATION.base, ease: EASE.enter, delay: 0.2 }}
          >
            <span className="text-label" style={{ color: 'var(--fg-primary)' }}>
              Start a project
            </span>
            <a
              href="mailto:hello@elementux.co"
              className="text-body transition-colors"
              style={{ color: 'var(--color-accent)' }}
            >
              hello@elementux.co
            </a>
            <p className="text-label" style={{ color: 'var(--fg-tertiary)' }}>
              Response within 24h
            </p>
          </motion.div>

        </div>

        {/* Divider */}
        <motion.hr
          className="my-10"
          style={{ borderColor: 'var(--border-subtle)' }}
          initial={{ scaleX: 0, transformOrigin: 'left' }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: DURATION.slow, ease: EASE.ui, delay: 0.25 }}
        />

        {/* Bottom row */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: DURATION.base, ease: EASE.enter, delay: 0.35 }}
        >
          <p className="text-label" style={{ color: 'var(--fg-tertiary)' }}>
            © {year} Element UX. All rights reserved.
          </p>
          <p className="text-label" style={{ color: 'var(--fg-tertiary)' }}>
            Designed and built with deliberate intent.
          </p>
        </motion.div>

      </div>
    </footer>
  )
}
