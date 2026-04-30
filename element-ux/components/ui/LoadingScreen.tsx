'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { DURATION, EASE } from '@/lib/motion'

// Loading screen — occupies full viewport, blocks render of page content.
// Sequence:
//   1. Logo mark fades + scales in
//   2. Counter ticks 0 → 100 over ~1.6s
//   3. Bar fills left → right
//   4. Whole overlay slides up and out — revealing page content
//
// Shown only on first visit (sessionStorage flag).
// Skipped entirely if user prefers reduced motion.

export function LoadingScreen() {
  const shouldReduce = useReducedMotion()
  const [visible,  setVisible]  = useState(false)
  const [progress, setProgress] = useState(0)
  const [exiting,  setExiting]  = useState(false)

  useEffect(() => {
    if (shouldReduce) return
    if (sessionStorage.getItem('element-ux:loaded')) return

    setVisible(true)

    const start    = performance.now()
    const duration = 1600

    const tick = (now: number) => {
      const elapsed = now - start
      const pct     = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(pct)

      if (pct < 100) {
        requestAnimationFrame(tick)
      } else {
        // Brief pause at 100 before exit
        setTimeout(() => {
          setExiting(true)
          setTimeout(() => {
            setVisible(false)
            sessionStorage.setItem('element-ux:loaded', '1')
          }, 800)
        }, 180)
      }
    }

    requestAnimationFrame(tick)
  }, [shouldReduce])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Loading"
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
          style={{ backgroundColor: 'var(--depth-0)' }}
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{
            y:          '-100%',
            transition: { duration: 0.72, ease: EASE.ui },
          }}
        >
          {/* Logo mark */}
          <motion.div
            className="mb-12 flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DURATION.moderate, ease: EASE.enter, delay: 0.1 }}
          >
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
          </motion.div>

          {/* Counter */}
          <motion.div
            className="text-label mb-4 tabular-nums"
            style={{ color: 'var(--fg-tertiary)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: DURATION.fast, delay: 0.2 }}
          >
            {String(progress).padStart(3, '0')}
          </motion.div>

          {/* Progress bar */}
          <div
            className="relative h-px overflow-hidden"
            style={{
              width:           '180px',
              backgroundColor: 'var(--border-subtle)',
            }}
          >
            <motion.div
              className="absolute inset-y-0 left-0"
              style={{ backgroundColor: 'var(--color-accent)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.05, ease: 'linear' }}
            />
          </div>

          {/* Exit curtain — fills screen before sliding up */}
          {exiting && (
            <motion.div
              className="absolute inset-0"
              style={{ backgroundColor: 'var(--depth-1)' }}
              initial={{ scaleY: 0, transformOrigin: 'bottom' }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, ease: EASE.enter }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
