'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export interface TouchGesture {
  type: 'tap' | 'longPress' | 'swipe' | 'pinch' | 'rotate'
  direction?: 'up' | 'down' | 'left' | 'right'
  velocity?: number
  scale?: number
  rotation?: number
}

export interface TouchState {
  isTouch: boolean
  isSwiping: boolean
  startPoint: { x: number; y: number } | null
  currentPoint: { x: number; y: number } | null
  velocity: { x: number; y: number }
}

export const useTouchInteraction = (element?: React.RefObject<HTMLElement>) => {
  const [touchState, setTouchState] = useState<TouchState>({
    isTouch: false,
    isSwiping: false,
    startPoint: null,
    currentPoint: null,
    velocity: { x: 0, y: 0 },
  })

  const gestureRef = useRef<TouchGesture | null>(null)
  const longPressTimeoutRef = useRef<NodeJS.Timeout>()
  const lastTimeRef = useRef<number>(0)
  const touchesRef = useRef<Map<number, Touch>>(new Map())
  const supportsHapticsRef = useRef<boolean>(false)

  // Detect haptic support
  useEffect(() => {
    supportsHapticsRef.current =
      typeof navigator !== 'undefined' && 'vibrate' in navigator
  }, [])

  // Handle touch start
  const handleTouchStart = useCallback((event: TouchEvent) => {
    const touch = event.touches[0]
    const startPoint = { x: touch.clientX, y: touch.clientY }

    setTouchState((prev) => ({
      ...prev,
      isTouch: true,
      startPoint,
      currentPoint: startPoint,
    }))

    touchesRef.current.clear()
    for (let i = 0; i < event.touches.length; i++) {
      touchesRef.current.set(event.touches[i].identifier, event.touches[i])
    }

    lastTimeRef.current = Date.now()

    // Set long press timeout
    longPressTimeoutRef.current = setTimeout(() => {
      gestureRef.current = { type: 'longPress' }
      triggerHaptics(20)
    }, 500)
  }, [])

  // Handle touch move
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!touchState.startPoint) return

    const touch = event.touches[0]
    const currentPoint = { x: touch.clientX, y: touch.clientY }

    // Calculate velocity
    const now = Date.now()
    const deltaTime = now - lastTimeRef.current
    const velocity = {
      x: (currentPoint.x - (touchState.currentPoint?.x || 0)) / (deltaTime || 1),
      y: (currentPoint.y - (touchState.currentPoint?.y || 0)) / (deltaTime || 1),
    }

    setTouchState((prev) => ({
      ...prev,
      isSwiping: true,
      currentPoint,
      velocity,
    }))

    lastTimeRef.current = now

    // Clear long press if moving significantly
    const distance = Math.hypot(
      currentPoint.x - touchState.startPoint.x,
      currentPoint.y - touchState.startPoint.y
    )
    if (distance > 10) {
      clearTimeout(longPressTimeoutRef.current)
    }

    // Handle pinch gesture
    if (event.touches.length === 2) {
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )

      // Calculate scale (simplified)
      const prevDistance = Math.hypot(
        (touchesRef.current.get(touch2.identifier)?.clientX || touch2.clientX) -
          touch1.clientX,
        (touchesRef.current.get(touch2.identifier)?.clientY || touch2.clientY) -
          touch1.clientY
      )

      const scale = distance / (prevDistance || 1)

      gestureRef.current = {
        type: 'pinch',
        scale: Math.max(0.5, Math.min(2, scale)),
      }
    }
  }, [touchState.startPoint, touchState.currentPoint])

  // Handle touch end
  const handleTouchEnd = useCallback((event: TouchEvent) => {
    clearTimeout(longPressTimeoutRef.current)

    if (touchState.startPoint && touchState.currentPoint) {
      const deltaX = touchState.currentPoint.x - touchState.startPoint.x
      const deltaY = touchState.currentPoint.y - touchState.startPoint.y
      const distance = Math.hypot(deltaX, deltaY)
      const speed = Math.hypot(touchState.velocity.x, touchState.velocity.y)

      // Determine gesture type
      if (distance < 10 && !gestureRef.current) {
        gestureRef.current = { type: 'tap' }
        triggerHaptics(10)
      } else if (distance > 50) {
        // Swipe detection
        const angle = Math.atan2(deltaY, deltaX)
        let direction: 'up' | 'down' | 'left' | 'right'

        if (Math.abs(angle) < Math.PI / 4) direction = 'right'
        else if (Math.abs(angle) > (3 * Math.PI) / 4) direction = 'left'
        else if (angle > Math.PI / 4) direction = 'down'
        else direction = 'up'

        gestureRef.current = {
          type: 'swipe',
          direction,
          velocity: speed,
        }

        if (speed > 0.5) triggerHaptics(15)
      }
    }

    setTouchState((prev) => ({
      ...prev,
      isTouch: false,
      isSwiping: false,
      startPoint: null,
      currentPoint: null,
    }))

    touchesRef.current.clear()
  }, [touchState.startPoint, touchState.currentPoint, touchState.velocity])

  // Trigger haptic feedback
  const triggerHaptics = useCallback((duration: number = 10) => {
    if (!supportsHapticsRef.current) return

    if ('vibrate' in navigator) {
      navigator.vibrate(duration)
    }
  }, [])

  // Get last gesture
  const getLastGesture = useCallback((): TouchGesture | null => {
    return gestureRef.current
  }, [])

  // Clear gesture
  const clearGesture = useCallback(() => {
    gestureRef.current = null
  }, [])

  // Set up event listeners
  useEffect(() => {
    const target = element?.current || window

    target.addEventListener('touchstart', handleTouchStart, { passive: false })
    target.addEventListener('touchmove', handleTouchMove, { passive: false })
    target.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      target.removeEventListener('touchstart', handleTouchStart)
      target.removeEventListener('touchmove', handleTouchMove)
      target.removeEventListener('touchend', handleTouchEnd)
      clearTimeout(longPressTimeoutRef.current)
    }
  }, [element, handleTouchStart, handleTouchMove, handleTouchEnd])

  return {
    touchState,
    getLastGesture,
    clearGesture,
    triggerHaptics,
  }
}

export default useTouchInteraction
