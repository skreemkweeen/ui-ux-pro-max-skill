'use client'

import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'

export interface ScrollPhase {
  type: 'hero' | 'transitioning' | 'exiting'
  progress: number // 0-1
}

export const useHeroScroll = (enabled = true) => {
  const { camera } = useThree()
  const [scrollPhase, setScrollPhase] = useState<ScrollPhase>({
    type: 'hero',
    progress: 0,
  })

  const cameraStartRef = useRef({
    position: [0, 5, 25],
    fov: 75,
  })

  const cameraTargetRef = useRef({
    position: [0, 15, 45],
    fov: 65,
  })

  const scrollProgressRef = useRef(0)
  const cameraTweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    if (!enabled) return

    const handleScroll = () => {
      // Calculate scroll progress (normalized 0-1)
      const windowHeight = window.innerHeight
      const maxScroll = window.innerHeight * 0.75 // Trigger transition within 75vh of scroll

      const scrollProgress = Math.min(1, window.scrollY / maxScroll)
      scrollProgressRef.current = scrollProgress

      // Determine phase
      let phase: ScrollPhase['type'] = 'hero'
      if (scrollProgress > 0.8) {
        phase = 'exiting'
      } else if (scrollProgress > 0) {
        phase = 'transitioning'
      }

      setScrollPhase({
        type: phase,
        progress: scrollProgress,
      })

      // Animate camera
      if (cameraTweenRef.current) {
        cameraTweenRef.current.kill()
      }

      cameraTweenRef.current = gsap.to(camera.position, {
        x: gsap.utils.interpolate(
          cameraStartRef.current.position[0],
          cameraTargetRef.current.position[0],
          scrollProgress
        ),
        y: gsap.utils.interpolate(
          cameraStartRef.current.position[1],
          cameraTargetRef.current.position[1],
          scrollProgress
        ),
        z: gsap.utils.interpolate(
          cameraStartRef.current.position[2],
          cameraTargetRef.current.position[2],
          scrollProgress
        ),
        duration: 0,
      })

      // Animate FOV (subtle change)
      camera.fov = gsap.utils.interpolate(
        cameraStartRef.current.fov,
        cameraTargetRef.current.fov,
        scrollProgress
      )
      camera.updateProjectionMatrix()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (cameraTweenRef.current) {
        cameraTweenRef.current.kill()
      }
    }
  }, [enabled, camera])

  return {
    scrollPhase,
    scrollProgress: scrollProgressRef.current,
    getTextOpacity: () => Math.max(0, 1 - scrollProgressRef.current * 1.5),
  }
}

export default useHeroScroll
