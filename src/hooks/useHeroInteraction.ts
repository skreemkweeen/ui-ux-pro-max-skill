'use client'

import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

export interface PresenceState {
  // Normalized cursor position in world space
  cursorX: number
  cursorY: number
  velocity: number
  // How "present" the user feels — decays over time, intensifies on movement
  presence: number
  // Light distortion — slight offset from cursor affecting rim light
  lightOffsetX: number
  lightOffsetY: number
}

export const useHeroInteraction = (enabled = true) => {
  const { camera, size } = useThree()

  const cursorRef = useRef({ x: 0, y: 0 })
  const prevCursorRef = useRef({ x: 0, y: 0 })
  const presenceRef = useRef(0)
  const velocityRef = useRef(0)
  const timeRef = useRef(0)

  const [presence, setPresence] = useState<PresenceState>({
    cursorX: 0,
    cursorY: 0,
    velocity: 0,
    presence: 0,
    lightOffsetX: 0,
    lightOffsetY: 0,
  })

  // Track cursor without announcing it
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const handleMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -((e.clientY / window.innerHeight) * 2 - 1)

      const dx = nx - cursorRef.current.x
      const dy = ny - cursorRef.current.y
      velocityRef.current = Math.sqrt(dx * dx + dy * dy) * 60 // scale to ~0-1 range

      prevCursorRef.current = { ...cursorRef.current }
      cursorRef.current = { x: nx, y: ny }

      // Presence increases with movement
      presenceRef.current = Math.min(1, presenceRef.current + velocityRef.current * 0.4)
    }

    const handleLeave = () => {
      velocityRef.current = 0
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('mouseleave', handleLeave)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseleave', handleLeave)
    }
  }, [enabled])

  // Decay presence and emit state each frame
  useFrame(() => {
    timeRef.current += 0.016

    // Presence decays slowly when idle — 8 second half-life
    presenceRef.current *= 0.9982
    velocityRef.current *= 0.88

    const p = presenceRef.current

    setPresence({
      cursorX: cursorRef.current.x,
      cursorY: cursorRef.current.y,
      velocity: velocityRef.current,
      presence: p,
      // Rim light shifts subtly toward cursor
      lightOffsetX: cursorRef.current.x * 3 * p,
      lightOffsetY: cursorRef.current.y * 2 * p,
    })
  })

  return presence
}

export default useHeroInteraction
