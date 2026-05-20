'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export interface ChoreographyConfig {
  paused?: boolean
  autoPlay?: boolean
  onComplete?: () => void
}

export const useChoreography = (config: ChoreographyConfig = {}) => {
  const { paused = true, autoPlay = false, onComplete } = config
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    // Create master timeline
    const masterTl = gsap.timeline({
      paused,
      defaults: {
        ease: 'power3.inOut',
        duration: 0.8,
      },
      onComplete,
    })

    timelineRef.current = masterTl

    // ACT I: Introduction (0-2.5s)
    masterTl.add('intro', 0)

    masterTl.to(
      '.hero',
      {
        opacity: 1,
        y: 0,
        duration: 1,
      },
      'intro'
    )

    masterTl.to(
      '.hero-headline',
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
      },
      'intro+=0.2'
    )

    masterTl.to(
      '.hero-subtitle',
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
      },
      'intro+=0.5'
    )

    // ACT II: Content Reveal (2.5-6s)
    masterTl.add('content', '+=0.3')

    masterTl.staggerTo(
      '.case-study-item',
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
      },
      0.15,
      'content'
    )

    // ACT III: CTA & Conversion (6s+)
    masterTl.add('cta', '+=0.5')

    masterTl.to(
      '.cta-button',
      {
        scale: 1.05,
        duration: 0.6,
        yoyo: true,
        repeat: 1,
      },
      'cta'
    )

    // Auto-play if configured
    if (autoPlay) {
      masterTl.play()
    }

    // Cleanup
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [paused, autoPlay, onComplete])

  return {
    timeline: timelineRef.current,
    play: () => timelineRef.current?.play(),
    pause: () => timelineRef.current?.pause(),
    reverse: () => timelineRef.current?.reverse(),
    seek: (time: number) => timelineRef.current?.seek(time),
    progress: () => timelineRef.current?.progress() ?? 0,
  }
}

// Stagger animation utilities
export const staggerUtils = {
  // Reveal from bottom
  revealUp: (duration = 0.6, stagger = 0.15) => ({
    y: 100,
    opacity: 0,
    duration,
    stagger,
    ease: 'back.out',
  }),

  // Reveal from left
  revealLeft: (duration = 0.6, stagger = 0.15) => ({
    x: -50,
    opacity: 0,
    duration,
    stagger,
    ease: 'power2.out',
  }),

  // Reveal from right
  revealRight: (duration = 0.6, stagger = 0.15) => ({
    x: 50,
    opacity: 0,
    duration,
    stagger,
    ease: 'power2.out',
  }),

  // Word-by-word reveal
  wordByWord: (duration = 0.05, delay = 0) => ({
    duration,
    delay,
    ease: 'power2.inOut',
  }),

  // Scale in with opacity
  scaleIn: (duration = 0.6, stagger = 0.15) => ({
    scale: 0,
    opacity: 0,
    duration,
    stagger,
    ease: 'back.out',
  }),
}

export default useChoreography
