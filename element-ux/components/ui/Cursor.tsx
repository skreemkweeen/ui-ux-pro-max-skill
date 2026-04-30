'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Custom cursor — two layers:
//   Dot:  12px, snaps to pointer exactly (no spring — instant feedback)
//   Ring: 36px, follows with a spring (trails slightly behind — feels alive)
//
// Magnetic effect: interactive elements pull the ring toward their center.
// Implemented by listening to [data-magnetic] elements globally.
//
// Hidden on coarse-pointer (touch) devices via CSS in tokens.css.

type CursorState = 'default' | 'hover' | 'click' | 'text'

const SPRING = { stiffness: 500, damping: 38, mass: 0.6 }
const RING_SPRING = { stiffness: 220, damping: 28, mass: 0.8 }

export function Cursor() {
  const [state, setState] = useState<CursorState>('default')
  const [visible, setVisible]  = useState(false)

  // Raw pointer position
  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)

  // Dot follows raw pointer — no lag
  const dotX = useSpring(rawX, SPRING)
  const dotY = useSpring(rawY, SPRING)

  // Ring trails with softer spring
  const ringX = useSpring(rawX, RING_SPRING)
  const ringY = useSpring(rawY, RING_SPRING)

  // Track magnetic pull target
  const magnetRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    // Only run on fine pointer (mouse) — skip on touch
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (e: PointerEvent) => {
      if (!visible) setVisible(true)

      const target = e.target as HTMLElement

      // Magnetic: if hovering a [data-magnetic] element, pull ring toward center
      const magEl = target.closest<HTMLElement>('[data-magnetic]')
      if (magEl) {
        const rect    = magEl.getBoundingClientRect()
        const centerX = rect.left + rect.width  / 2
        const centerY = rect.top  + rect.height / 2
        // Pull: lerp 40% toward element center
        const pullX = e.clientX + (centerX - e.clientX) * 0.35
        const pullY = e.clientY + (centerY - e.clientY) * 0.35
        magnetRef.current = { x: pullX, y: pullY }
      } else {
        magnetRef.current = null
      }

      rawX.set(magnetRef.current ? magnetRef.current.x : e.clientX)
      rawY.set(magnetRef.current ? magnetRef.current.y : e.clientY)

      // Cursor state from element type
      if (
        target.closest('a, button, [role="button"], [data-cursor="hover"]')
      ) {
        setState('hover')
      } else if (
        target.closest('input, textarea, [contenteditable]')
      ) {
        setState('text')
      } else {
        setState('default')
      }
    }

    const onDown  = () => setState(s => s === 'hover' ? 'click' : s)
    const onUp    = () => setState(s => s === 'click' ? 'hover' : 'default')
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    document.addEventListener('pointermove',  onMove,  { passive: true })
    document.addEventListener('pointerdown',  onDown)
    document.addEventListener('pointerup',    onUp)
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('pointerenter', onEnter)

    return () => {
      document.removeEventListener('pointermove',  onMove)
      document.removeEventListener('pointerdown',  onDown)
      document.removeEventListener('pointerup',    onUp)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('pointerenter', onEnter)
    }
  }, [rawX, rawY, visible])

  if (typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  const ringSize = state === 'hover' ? 52 : state === 'text' ? 4 : 36
  const ringOpacity = state === 'click' ? 0.5 : 1
  const dotSize  = state === 'text' ? 2 : 6

  return (
    <>
      {/* Ring — trails, enlarges on hover */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full"
        style={{
          x:        ringX,
          y:        ringY,
          translateX: '-50%',
          translateY: '-50%',
          opacity:   visible ? ringOpacity : 0,
          border:   '1px solid rgba(255,255,255,0.35)',
          mixBlendMode: 'difference',
        }}
        animate={{
          width:  ringSize,
          height: ringSize,
        }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Dot — snaps instantly to pointer */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full"
        style={{
          x:          dotX,
          y:          dotY,
          translateX: '-50%',
          translateY: '-50%',
          opacity:    visible ? 1 : 0,
          backgroundColor: state === 'hover'
            ? 'var(--color-accent)'
            : 'rgba(255,255,255,0.9)',
          mixBlendMode: 'difference',
        }}
        animate={{
          width:  dotSize,
          height: dotSize,
        }}
        transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  )
}
