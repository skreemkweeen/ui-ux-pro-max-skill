'use client'

import { useEffect, useState }  from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { pageLoad, DURATION, EASE } from '@/lib/motion'

const NAV_LINKS = [
  { label: 'Work',     href: '#work'         },
  { label: 'Process',  href: '#process'      },
  { label: 'About',    href: '#about'        },
] as const

// ── Nav link with sliding underline ──────────────────────────────────────────

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <motion.a
      href={href}
      className="relative py-1 text-sm"
      style={{ color: 'var(--fg-secondary)' }}
      whileHover="hover"
      initial="rest"
      animate="rest"
      variants={{
        rest:  { color: 'var(--fg-secondary)' },
        hover: { color: 'var(--fg-primary)',
                 transition: { duration: DURATION.micro } },
      }}
    >
      {label}
      {/* Underline — scales in from left */}
      <motion.span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-left"
        style={{ backgroundColor: 'var(--color-accent)' }}
        variants={{
          rest:  { scaleX: 0 },
          hover: { scaleX: 1,
                   transition: { duration: DURATION.fast, ease: EASE.ui } },
        }}
      />
    </motion.a>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function Nav() {
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const shouldReduce = useReducedMotion()

  // Frosted glass triggers after 60px scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        {...pageLoad.nav}
      >
        <div
          className="transition-all"
          style={{
            backgroundColor: scrolled
              ? 'rgba(8, 8, 9, 0.82)'
              : 'transparent',
            backdropFilter:   scrolled ? 'blur(20px) saturate(1.4)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'none',
            borderBottom:     scrolled
              ? '1px solid var(--border-subtle)'
              : '1px solid transparent',
            transition: `background-color 300ms var(--ease-ui),
                         backdrop-filter  300ms var(--ease-ui),
                         border-color     300ms var(--ease-ui)`,
          }}
        >
          <div className="container-page flex h-14 items-center justify-between">

            {/* Logo */}
            <motion.a
              href="#hero"
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: 'var(--fg-primary)' }}
              whileHover={{ opacity: 0.7 }}
              transition={{ duration: DURATION.micro }}
            >
              {/* Mark — geometric square with gold inset */}
              <span
                aria-hidden
                className="flex h-6 w-6 items-center justify-center rounded"
                style={{
                  backgroundColor: 'var(--depth-3)',
                  border:          '1px solid var(--border-default)',
                }}
              >
                <span
                  className="block h-2 w-2 rounded-sm"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                />
              </span>
              Element UX
            </motion.a>

            {/* Desktop nav */}
            <nav
              className="hidden items-center gap-8 md:flex"
              aria-label="Primary navigation"
            >
              {NAV_LINKS.map(link => (
                <NavLink key={link.href} {...link} />
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden items-center gap-4 md:flex">
              <motion.a
                href="#contact"
                className="rounded-full border px-4 py-1.5 text-sm font-medium"
                style={{
                  borderColor: 'var(--border-default)',
                  color:       'var(--fg-secondary)',
                }}
                whileHover={{
                  borderColor: 'var(--border-accent)',
                  color:       'var(--color-accent)',
                  transition:  { duration: DURATION.micro },
                }}
                whileTap={{ scale: 0.97 }}
              >
                Contact
              </motion.a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="flex flex-col gap-1.5 md:hidden"
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  className="block h-px w-6"
                  style={{ backgroundColor: 'var(--fg-primary)' }}
                  animate={shouldReduce ? {} : mobileOpen
                    ? i === 0 ? { rotate: 45,  y: 5,  opacity: 1 }
                    : i === 1 ? { opacity: 0 }
                    :           { rotate: -45, y: -5, opacity: 1 }
                    : { rotate: 0, y: 0, opacity: 1 }
                  }
                  transition={{ duration: DURATION.fast, ease: EASE.ui }}
                />
              ))}
            </button>

          </div>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <motion.div
          className="fixed inset-0 z-40 flex flex-col justify-center px-8"
          style={{ backgroundColor: 'var(--depth-0)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.fast }}
        >
          <nav className="flex flex-col gap-8" aria-label="Mobile navigation">
            {[...NAV_LINKS, { label: 'Contact', href: '#contact' }].map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-h2"
                style={{ color: 'var(--fg-primary)' }}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: DURATION.base, ease: EASE.enter, delay: i * 0.06 }}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>
        </motion.div>
      )}
    </>
  )
}
