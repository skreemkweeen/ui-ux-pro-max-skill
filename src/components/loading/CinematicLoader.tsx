'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import useLoaderStore from '@hooks/useLoaderStore'

export interface CinematicLoaderProps {
  onComplete?: () => void
  duration?: number
  isVisible?: boolean
}

export const CinematicLoader = ({
  onComplete,
  duration = 3500,
  isVisible = true,
}: CinematicLoaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLDivElement>(null)
  const fogRef = useRef<HTMLDivElement>(null)
  const hasRun = useRef(false)

  const { phase } = useLoaderStore()

  useEffect(() => {
    if (hasRun.current || !containerRef.current) return
    hasRun.current = true

    const tl = gsap.timeline()

    // Start: total darkness
    gsap.set([glowRef.current, wordRef.current], { opacity: 0 })
    gsap.set(fogRef.current, { opacity: 1 })

    // 0s – 1.5s: a single light breathes awake in the void
    tl.to(glowRef.current, {
      opacity: 0.18,
      scale: 1.08,
      duration: 1.8,
      ease: 'power2.inOut',
    }, 0)

    // 0.8s – 2.8s: the word surfaces — slowly, partially
    tl.to(wordRef.current, {
      opacity: 0.22,
      y: 0,
      duration: 2.2,
      ease: 'power3.out',
    }, 0.8)

    // 2.4s – 3.2s: breath holds, light intensifies slightly
    tl.to(glowRef.current, {
      opacity: 0.28,
      scale: 1.15,
      duration: 0.8,
      ease: 'power2.inOut',
    }, 2.4)

    // 3.2s: dissolve outward — fog expands, darkness opens
    tl.to(fogRef.current, {
      opacity: 0,
      scale: 1.06,
      duration: 1.1,
      ease: 'power2.inOut',
    }, duration / 1000 - 1.0)

    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.9,
      ease: 'power2.inOut',
      onComplete: () => onComplete?.(),
    }, duration / 1000 - 0.6)

  }, [duration, onComplete])

  // Graceful exit if phase signals complete externally
  useEffect(() => {
    if (phase !== 'complete' || !containerRef.current) return

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.9,
      ease: 'power2.inOut',
      delay: 0.3,
      onComplete: () => onComplete?.(),
    })
  }, [phase, onComplete])

  if (!isVisible) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black"
      style={{ pointerEvents: 'none' }}
    >
      {/* Fog layer — renders over glow, dissolves last */}
      <div
        ref={fogRef}
        className="absolute inset-0 bg-black"
        style={{ mixBlendMode: 'normal' }}
      />

      {/* Atmospheric light — single warm point breathing in void */}
      <div
        ref={glowRef}
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          width: '60vw',
          height: '60vw',
          maxWidth: '640px',
          maxHeight: '640px',
          transform: 'translate(-50%, -50%) scale(1)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 35%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Single word — surfaces from below, barely visible */}
      <div
        ref={wordRef}
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) translateY(8px)',
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          fontWeight: 400,
          letterSpacing: '0.35em',
          color: 'rgba(255,255,255,0.6)',
          textTransform: 'uppercase',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        Element
      </div>
    </div>
  )
}

export default CinematicLoader
