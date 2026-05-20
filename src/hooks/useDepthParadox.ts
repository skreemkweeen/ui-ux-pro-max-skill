'use client'

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'

export interface DepthParadoxState {
  isActive: boolean
  targetSlab: 'left' | 'right' | null
  depth: number
  shadowLag: number
  cameraCompensation: number
  fogAdjustment: number
}

export const useDepthParadox = (enabled = true) => {
  const stateRef = useRef<DepthParadoxState>({
    isActive: false,
    targetSlab: null,
    depth: 0,
    shadowLag: 0,
    cameraCompensation: 0,
    fogAdjustment: 0,
  })

  const lastScrollRef = useRef(0)
  const lastInteractionRef = useRef(0)
  const nextTriggerRef = useRef(Date.now() + Math.random() * 15000 + 30000)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  // Detect stillness: no scroll in last 2s, no mouse movement in last 1.5s
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const handleScroll = () => {
      lastScrollRef.current = Date.now()
    }

    const handleMouseMove = () => {
      lastInteractionRef.current = Date.now()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [enabled])

  // Monitor for stillness and trigger paradox
  useFrame(() => {
    if (!enabled) return

    const now = Date.now()
    const timeSinceScroll = now - lastScrollRef.current
    const timeSinceInteraction = now - lastInteractionRef.current

    const isStill = timeSinceScroll > 2000 && timeSinceInteraction > 1500

    if (isStill && now > nextTriggerRef.current && !stateRef.current.isActive) {
      // Trigger paradox
      triggerParadox()
      nextTriggerRef.current = now + Math.random() * 15000 + 30000
    }
  })

  const triggerParadox = () => {
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    stateRef.current.isActive = true
    stateRef.current.targetSlab = Math.random() > 0.5 ? 'left' : 'right'

    const tl = gsap.timeline({
      onComplete: () => {
        stateRef.current.isActive = false
        stateRef.current.targetSlab = null
      },
    })

    // Gentle drift into impossible depth: 0.5s acceleration
    tl.to(stateRef.current, {
      depth: 1.8, // Drifts deeper than perspective allows
      shadowLag: 0.6, // Shadows lag behind geometry
      cameraCompensation: -0.08, // Micro-camera lean to maintain illusion
      fogAdjustment: 1.2, // Fog density increases unnaturally
      duration: 0.5,
      ease: 'power2.inOut',
    }, 0)

    // Sustain impossible state for 1.2s — user should feel something's wrong but not see it
    tl.to(stateRef.current, {
      duration: 1.2,
    }, 0.5)

    // Soft resolution: 0.8s elastic return to normal
    // Shadow and fog resolve faster than depth (creates additional uncertainty)
    tl.to(stateRef.current, {
      depth: 0,
      shadowLag: 0,
      cameraCompensation: 0,
      fogAdjustment: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.4)',
    }, 1.7)

    timelineRef.current = tl
  }

  return stateRef.current
}

export default useDepthParadox
