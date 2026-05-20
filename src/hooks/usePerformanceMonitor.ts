'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export interface PerformanceData {
  fps: number
  frameTime: number
  avgFrameTime: number
  droppedFrames: number
  memoryUsage: number
  gpuMemory: number
  timestamp: number
}

export const usePerformanceMonitor = (options = { sampleInterval: 1000 }) => {
  const [performance, setPerformance] = useState<PerformanceData>({
    fps: 60,
    frameTime: 16.67,
    avgFrameTime: 16.67,
    droppedFrames: 0,
    memoryUsage: 0,
    gpuMemory: 0,
    timestamp: Date.now(),
  })

  const metricsRef = useRef({
    frameCount: 0,
    lastTime: performance.now(),
    frameTimeSum: 0,
    frameTimes: [] as number[],
    droppedFrames: 0,
    maxFrameTime: 0,
  })

  const rafRef = useRef<number>()

  // Monitor frame performance
  useEffect(() => {
    const monitoring = metricsRef.current

    const measureFrame = () => {
      const now = performance.now()
      const frameTime = now - monitoring.lastTime
      monitoring.lastTime = now

      monitoring.frameTimes.push(frameTime)
      if (monitoring.frameTimes.length > 60) {
        monitoring.frameTimes.shift()
      }

      // Track dropped frames (>33ms = below 30fps)
      if (frameTime > 33) {
        monitoring.droppedFrames++
      }

      monitoring.frameTimeSum += frameTime
      monitoring.frameCount++

      // Update metrics at sample interval
      if (monitoring.frameCount * frameTime >= options.sampleInterval) {
        const fps = Math.round((monitoring.frameCount * 1000) / (monitoring.frameCount * frameTime))
        const avgFrameTime = monitoring.frameTimeSum / monitoring.frameCount
        const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0
        const totalMemory = (performance as any).memory?.jsHeapSizeLimit || 0

        setPerformance({
          fps,
          frameTime: monitoring.frameTimes[monitoring.frameTimes.length - 1] || 0,
          avgFrameTime,
          droppedFrames: monitoring.droppedFrames,
          memoryUsage: Math.round(memoryUsage / 1048576), // Convert to MB
          gpuMemory: Math.round((totalMemory / 1048576) * 0.3), // Estimate GPU usage
          timestamp: Date.now(),
        })

        monitoring.frameCount = 0
        monitoring.frameTimeSum = 0
        monitoring.droppedFrames = 0
      }

      rafRef.current = requestAnimationFrame(measureFrame)
    }

    rafRef.current = requestAnimationFrame(measureFrame)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [options.sampleInterval])

  // Determine performance level
  const getPerformanceLevel = useCallback((): 'excellent' | 'good' | 'fair' | 'poor' => {
    if (performance.fps >= 55) return 'excellent'
    if (performance.fps >= 45) return 'good'
    if (performance.fps >= 30) return 'fair'
    return 'poor'
  }, [performance.fps])

  // Check if frame budget exceeded
  const isFrameBudgetExceeded = useCallback((): boolean => {
    return performance.avgFrameTime > 16.67 // 60fps target
  }, [performance.avgFrameTime])

  // Get quality recommendation
  const getQualityRecommendation = useCallback(
    (): 'high' | 'medium' | 'low' => {
      const level = getPerformanceLevel()
      if (level === 'excellent' || level === 'good') return 'high'
      if (level === 'fair') return 'medium'
      return 'low'
    },
    [getPerformanceLevel]
  )

  return {
    performance,
    getPerformanceLevel,
    isFrameBudgetExceeded,
    getQualityRecommendation,
  }
}

export default usePerformanceMonitor
