'use client'

import { useState, useId }         from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FadeIn }                  from '@/components/ui/motion/FadeIn'
import { buttonHover, DURATION, EASE } from '@/lib/motion'

// ── Form field ────────────────────────────────────────────────────────────────

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label:   string
  id:      string
  as?:     'input' | 'textarea'
  rows?:   number
}

function Field({ label, id, as = 'input', rows = 4, ...props }: FieldProps) {
  const [focused, setFocused] = useState(false)

  const sharedClassName = `
    w-full rounded-lg px-4 text-sm outline-none
    transition-colors duration-150
  `
  const sharedStyle = {
    height:          as === 'input' ? 'var(--input-height)' : 'auto',
    paddingBlock:    as === 'textarea' ? '0.75rem' : undefined,
    backgroundColor: 'var(--input-bg)',
    border:          `1px solid ${focused ? 'var(--border-accent)' : 'var(--border-default)'}`,
    borderRadius:    'var(--input-radius)',
    color:           'var(--fg-primary)',
    fontFamily:      'var(--font-body)',
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-label"
        style={{ color: 'var(--fg-tertiary)' }}
      >
        {label}
      </label>

      <div className="relative">
        {as === 'textarea' ? (
          <textarea
            id={id}
            rows={rows}
            className={sharedClassName}
            style={sharedStyle}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={id}
            className={sharedClassName}
            style={{ ...sharedStyle, height: 'var(--input-height)' }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        {/* Focus glow — beneath field */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 rounded-lg"
          style={{
            filter:     'blur(10px)',
            background: 'var(--color-accent)',
          }}
          animate={{ opacity: focused ? 0.1 : 0 }}
          transition={{ duration: DURATION.micro, ease: EASE.micro }}
        />
      </div>
    </div>
  )
}

// ── Success state ─────────────────────────────────────────────────────────────

function SuccessMessage() {
  return (
    <motion.div
      className="flex flex-col items-center gap-4 py-12 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: DURATION.base, ease: EASE.enter }}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full text-lg"
        style={{
          backgroundColor: 'var(--depth-3)',
          border:          '1px solid var(--border-accent)',
          color:           'var(--color-accent)',
        }}
      >
        ✓
      </div>
      <div>
        <p
          className="text-h3 mb-1"
          style={{ color: 'var(--fg-primary)' }}
        >
          Message received.
        </p>
        <p
          className="text-body"
          style={{ color: 'var(--fg-secondary)' }}
        >
          I'll be in touch within 24 hours.
        </p>
      </div>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function CTA() {
  const [sent, setSent]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const shouldReduce            = useReducedMotion()
  const nameId    = useId()
  const emailId   = useId()
  const typeId    = useId()
  const messageId = useId()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    // Replace with your form endpoint (Resend, Formspree, etc.)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setSent(true)
  }

  return (
    <section
      id="contact"
      className="container-page"
      style={{ paddingBlock: 'var(--section-gap)' }}
    >
      <div className="mx-auto max-w-2xl">

        {/* Heading block */}
        <FadeIn direction="up" delay={0}>
          <div className="mb-12 flex flex-col gap-4 text-center">
            <span
              className="text-label"
              style={{ color: 'var(--color-accent)' }}
            >
              Start a project
            </span>
            <h2
              className="text-h2"
              style={{ color: 'var(--fg-primary)' }}
            >
              Let's build something
              <br />
              worth remembering.
            </h2>
            <p
              className="text-lead mx-auto"
              style={{
                color:    'var(--fg-secondary)',
                maxWidth: '42ch',
              }}
            >
              Available from Q2 2025. Tell me about your project and
              I'll get back to you within 24 hours.
            </p>
          </div>
        </FadeIn>

        {/* Form card */}
        <FadeIn direction="up" delay={0.12}>
          <div
            className="rounded-2xl p-8"
            style={{
              backgroundColor: 'var(--depth-2)',
              backgroundImage: 'var(--glow-card)',
              border:          '1px solid var(--border-default)',
            }}
          >
            {sent ? (
              <SuccessMessage />
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
                noValidate
              >
                {/* Name + Email — side by side on larger screens */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    id={nameId}
                    label="Name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    required
                  />
                  <Field
                    id={emailId}
                    label="Email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    required
                  />
                </div>

                {/* Project type */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={typeId}
                    className="text-label"
                    style={{ color: 'var(--fg-tertiary)' }}
                  >
                    Project type
                  </label>
                  <select
                    id={typeId}
                    name="type"
                    className="h-10 w-full rounded-lg px-4 text-sm outline-none"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      border:          '1px solid var(--border-default)',
                      borderRadius:    'var(--input-radius)',
                      color:           'var(--fg-primary)',
                      fontFamily:      'var(--font-body)',
                      appearance:      'none',
                    }}
                  >
                    <option value="">Select a service…</option>
                    <option value="ux">UX Research &amp; Design</option>
                    <option value="product">Product Design</option>
                    <option value="brand">Brand Identity</option>
                    <option value="web">Web Design</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <Field
                  id={messageId}
                  label="Message"
                  as="textarea"
                  name="message"
                  rows={4}
                  placeholder="Tell me about your project — timeline, goals, and what success looks like."
                  required
                />

                {/* Submit */}
                <div className="flex items-center justify-between pt-2">
                  <p
                    className="text-label"
                    style={{ color: 'var(--fg-tertiary)' }}
                  >
                    Response within 24 hours
                  </p>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="relative inline-flex items-center gap-2 overflow-hidden
                               rounded-lg px-6 py-3 text-sm font-medium"
                    style={{
                      backgroundColor: loading
                        ? 'var(--depth-4)'
                        : 'var(--fg-primary)',
                      color:   'var(--fg-inverse)',
                      cursor:  loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1,
                    }}
                    initial="rest"
                    whileHover={loading ? undefined : 'hover'}
                    whileTap={loading ? undefined : 'pressed'}
                    variants={buttonHover.primary}
                  >
                    {/* Glow bloom on hover */}
                    {!loading && (
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 -z-10 rounded-lg"
                        style={{
                          filter:     'blur(14px)',
                          background: 'var(--color-accent)',
                        }}
                        variants={buttonHover.glow}
                      />
                    )}
                    {loading ? 'Sending…' : 'Send Message'}
                    {!loading && <span aria-hidden>→</span>}
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </FadeIn>

        {/* Alternative contact */}
        <FadeIn direction="up" delay={0.2}>
          <div
            className="mt-8 flex flex-col items-center gap-4 text-center
                       sm:flex-row sm:justify-center"
          >
            <p
              className="text-label"
              style={{ color: 'var(--fg-tertiary)' }}
            >
              Or reach me directly
            </p>
            <a
              href="mailto:hello@elementux.co"
              className="text-sm transition-colors"
              style={{ color: 'var(--fg-secondary)' }}
              onMouseEnter={e =>
                ((e.target as HTMLElement).style.color = 'var(--fg-primary)')
              }
              onMouseLeave={e =>
                ((e.target as HTMLElement).style.color = 'var(--fg-secondary)')
              }
            >
              hello@elementux.co
            </a>
            <span
              aria-hidden
              style={{ color: 'var(--border-default)' }}
              className="hidden sm:inline"
            >
              ·
            </span>
            <div className="flex items-center gap-4">
              {[
                { label: 'LinkedIn', href: '#' },
                { label: 'Dribbble', href: '#' },
                { label: 'Twitter', href: '#' },
              ].map(link => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="text-label"
                  style={{ color: 'var(--fg-tertiary)' }}
                  whileHover={{
                    color:      'var(--fg-primary)',
                    transition: { duration: DURATION.micro },
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
