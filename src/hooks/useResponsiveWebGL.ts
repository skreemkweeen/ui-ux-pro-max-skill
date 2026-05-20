'use client'

import { useEffect, useRef, useState } from 'react'

export interface Viewport {
  width: number
  height: number
  aspect: number
  dpi: number
  isMobile: boolean
  isTablet: boolean
}

export interface PerformanceMetrics {
  fps: number
  gpuMemory: number
  canPostProcess: boolean
  qualityLevel: 'high' | 'medium' | 'low'
}

export const useResponsiveWebGL = () => {
  const [viewport, setViewport] = useState<Viewport>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 720,
    aspect: typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 16 / 9,
    dpi: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
    isTablet: typeof window !== 'undefined' ? window.innerWidth < 1024 && window.innerWidth >= 768 : false,
  })

  const [performance, setPerformance] = useState<PerformanceMetrics>({
    fps: 60,
    gpuMemory: 0,
    canPostProcess: true,
    qualityLevel: 'high',
  })

  const fpsRef = useRef(0)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(Date.now())

  // Handle window resize
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const dpi = Math.min(window.devicePixelRatio, 2)

      setViewport({
        width,
        height,
        aspect: width / height,
        dpi,
        isMobile: width < 768,
        isTablet: width < 1024 && width >= 768,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Monitor performance metrics
  useEffect(() => {
    const updatePerformance = () => {
      const now = Date.now()
      const delta = now - lastTimeRef.current

      frameCountRef.current++

      if (delta >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / delta)
        fpsRef.current = fps

        // Determine quality level based on FPS
        let qualityLevel: 'high' | 'medium' | 'low' = 'high'
        let canPostProcess = true

        if (fps < 30) {
          qualityLevel = 'low'
          canPostProcess = false
        } else if (fps < 50) {
          qualityLevel = 'medium'
          canPostProcess = false
        }

        setPerformance({
          fps,
          gpuMemory: 0,
          canPostProcess,
          qualityLevel,
        })

        frameCountRef.current = 0
        lastTimeRef.current = now
      }

      requestAnimationFrame(updatePerformance)
    }

    const rafId = requestAnimationFrame(updatePerformance)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Get pixel ratio with max cap
  const getOptimalPixelRatio = () => {
    if (typeof window === 'undefined') return 1
    return Math.min(window.devicePixelRatio, 2)
  }

  // Get quality settings based on device
  const getQualitySettings = () => {
    const { isMobile, isTablet } = viewport
    const { qualityLevel } = performance

    return {
      // Shadow resolution
      shadowMapSize: isMobile ? 1024 : isTablet ? 1536 : 2048,

      // Particle count multiplier
      particleMultiplier: isMobile ? 0.5 : isTablet ? 0.75 : 1,

      // Post-processing
      enableBloom: !isMobile && qualityLevel !== 'low',
      enableDOF: !isMobile && qualityLevel === 'high',
      enableFilmGrain: qualityLevel !== 'low',

      // Shader quality
      shaderPrecision: isMobile ? 'mediump' : 'highp',

      // Animation frame skip
      animationFrameSkip: isMobile ? 2 : 1,
    }
  }

  return {
    viewport,
    performance,
    getOptimalPixelRatio,
    getQualitySettings,
    fps: fpsRef.current,
  }
}

export default useResponsiveWebGL
