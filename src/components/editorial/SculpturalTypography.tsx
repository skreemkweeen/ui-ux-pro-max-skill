'use client'

import React, { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'

export interface SculpturalTypographyProps {
  // Called after reveal sequence completes
  onRevealed?: () => void
  // Anomaly intensity from 0-1 — drives distortion
  anomalyIntensity?: number
  anomalyActive?: boolean
  // Scroll progress drives dissolution
  scrollProgress?: number
  // Whether to show the human moment (intimate line)
  showIntimateLayer?: boolean
}

export const SculpturalTypography: React.FC<SculpturalTypographyProps> = ({
  onRevealed,
  anomalyIntensity = 0,
  anomalyActive = false,
  scrollProgress = 0,
  showIntimateLayer = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const intimateRef = useRef<HTMLDivElement>(null)
  const hasRevealed = useRef(false)

  // Initial reveal sequence — emerges from darkness
  useEffect(() => {
    if (hasRevealed.current || !containerRef.current) return
    hasRevealed.current = true

    gsap.set(containerRef.current, { opacity: 0 })
    gsap.set(titleRef.current, {
      opacity: 0,
      y: 14,
      filter: 'blur(8px)',
    })
    gsap.set(lineRef.current, {
      scaleX: 0,
      transformOrigin: 'left center',
      opacity: 0,
    })
    gsap.set(intimateRef.current, { opacity: 0 })

    const tl = gsap.timeline({
      onComplete: onRevealed,
    })

    // Container fades in first
    tl.to(containerRef.current, {
      opacity: 1,
      duration: 0.01,
    })

    // Title surfaces from blur and depth
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1.8,
      ease: 'power3.out',
    }, 0.2)

    // Accent line extends slowly
    tl.to(lineRef.current, {
      scaleX: 1,
      opacity: 0.6,
      duration: 1.2,
      ease: 'power3.inOut',
    }, 1.4)

    // Intimate layer appears last — quiet, unhurried
    if (showIntimateLayer) {
      tl.to(intimateRef.current, {
        opacity: 1,
        duration: 1.4,
        ease: 'power2.inOut',
      }, 2.6)
    }
  }, [onRevealed, showIntimateLayer])

  // Anomaly distortion — typography bends reality briefly
  useEffect(() => {
    if (!titleRef.current) return

    if (anomalyActive) {
      gsap.to(titleRef.current, {
        skewX: 0.8,
        skewY: 0.3,
        letterSpacing: '0.06em',
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(titleRef.current, {
            skewX: 0,
            skewY: 0,
            letterSpacing: '-0.02em',
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)',
          })
        },
      })
    }
  }, [anomalyActive])

  // Scroll dissolves typography into the space
  const titleOpacity = Math.max(0, 1 - scrollProgress * 1.6)
  const titleY = scrollProgress * -12

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none flex flex-col justify-center"
      style={{
        paddingLeft: 'clamp(32px, 7vw, 96px)',
        paddingRight: 'clamp(32px, 7vw, 96px)',
      }}
    >
      {/* Typography lives at lower-left — architectural, not centered */}
      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(80px, 14vh, 180px)',
          left: 'clamp(32px, 7vw, 96px)',
          maxWidth: '640px',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          transition: 'none',
        }}
      >
        {/* Accent line — extends before the title reveals */}
        <div
          ref={lineRef}
          style={{
            width: '48px',
            height: '1px',
            backgroundColor: '#d4af37',
            marginBottom: '20px',
            opacity: 0,
          }}
        />

        {/* Primary title — architectural weight */}
        <div
          ref={titleRef}
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            fontSize: 'clamp(3rem, 8vw, 6.5rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'rgba(255,255,255,0.96)',
            // Edge fog — typography bleeds into environment
            maskImage:
              'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.2) 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.2) 100%)',
          }}
        >
          <span style={{ display: 'block' }}>ELEMENT</span>
          <span
            style={{
              display: 'block',
              color: '#d4af37',
              opacity: 0.9,
            }}
          >
            UX
          </span>
        </div>

        {/* Human moment — intimate, one line, poetic */}
        <div
          ref={intimateRef}
          style={{
            marginTop: '32px',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 300,
            fontSize: 'clamp(0.8rem, 1.4vw, 1rem)',
            lineHeight: 1.7,
            letterSpacing: '0.04em',
            color: 'rgba(180,180,180,0.55)',
            maxWidth: '340px',
            // Fades at the right edge into fog
            maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
          }}
        >
          I'm interested in what digital spaces
          <br />
          can make you feel.
        </div>
      </div>
    </div>
  )
}

export default SculpturalTypography
