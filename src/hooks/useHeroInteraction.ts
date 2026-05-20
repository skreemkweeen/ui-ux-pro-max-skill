'use client'

import { useEffect, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export interface InteractionPoint {
  worldPosition: THREE.Vector3
  screenPosition: { x: number; y: number }
  strength: number
  timestamp: number
}

export const useHeroInteraction = (enabled = true) => {
  const { camera, scene, raycaster, pointer } = useThree()
  const [interaction, setInteraction] = useState<InteractionPoint | null>(null)
  const rippleActiveRef = useRef(false)
  const lastInteractionTimeRef = useRef(0)

  // Debounce ripple creation (max 1 per 500ms)
  const debounceDelay = 500

  useEffect(() => {
    if (!enabled) return

    const handleClick = (event: MouseEvent) => {
      const now = Date.now()
      if (now - lastInteractionTimeRef.current < debounceDelay) return

      lastInteractionTimeRef.current = now

      // Get normalized device coordinates
      const rect = (event.target as HTMLElement).getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      // Update raycaster
      raycaster.setFromCamera({ x, y }, camera)

      // Find intersection with floor plane
      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 5)
      const target = new THREE.Vector3()
      raycaster.ray.intersectPlane(floorPlane, target)

      // Create interaction event
      const interactionPoint: InteractionPoint = {
        worldPosition: target,
        screenPosition: { x: event.clientX, y: event.clientY },
        strength: 1,
        timestamp: now,
      }

      setInteraction(interactionPoint)
      rippleActiveRef.current = true

      // Trigger haptic feedback on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(10)
      }

      // Fade out ripple after 1 second
      setTimeout(() => {
        rippleActiveRef.current = false
      }, 1000)
    }

    // Touch support
    const handleTouchStart = (event: TouchEvent) => {
      const now = Date.now()
      if (now - lastInteractionTimeRef.current < debounceDelay) return

      lastInteractionTimeRef.current = now

      const touch = event.touches[0]
      const rect = (event.target as HTMLElement).getBoundingClientRect()
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera({ x, y }, camera)

      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 5)
      const target = new THREE.Vector3()
      raycaster.ray.intersectPlane(floorPlane, target)

      const interactionPoint: InteractionPoint = {
        worldPosition: target,
        screenPosition: { x: touch.clientX, y: touch.clientY },
        strength: 1,
        timestamp: now,
      }

      setInteraction(interactionPoint)
      rippleActiveRef.current = true

      if ('vibrate' in navigator) {
        navigator.vibrate([10, 20, 10])
      }

      setTimeout(() => {
        rippleActiveRef.current = false
      }, 1000)
    }

    window.addEventListener('click', handleClick)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })

    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('touchstart', handleTouchStart)
    }
  }, [enabled, camera, raycaster])

  return {
    interaction,
    isRippleActive: rippleActiveRef.current,
    clearInteraction: () => setInteraction(null),
  }
}

export default useHeroInteraction
