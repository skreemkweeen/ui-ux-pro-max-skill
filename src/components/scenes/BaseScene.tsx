'use client'

import React, { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, Bounds } from '@react-three/drei'
import useThreeScene from '@hooks/useThreeScene'
import useResponsiveWebGL from '@hooks/useResponsiveWebGL'
import usePerformanceMonitor from '@hooks/usePerformanceMonitor'
import useMobileOptimization from '@hooks/useMobileOptimization'

export interface BaseSceneProps {
  children?: React.ReactNode
  backgroundColor?: string
  ambientIntensity?: number
  directionalIntensity?: number
  enableShadows?: boolean
  enableFog?: boolean
  enablePostProcessing?: boolean
  onPerformanceChange?: (quality: 'high' | 'medium' | 'low') => void
  className?: string
}

export const BaseScene = React.forwardRef<HTMLDivElement, BaseSceneProps>(
  (
    {
      children,
      backgroundColor = '#0a0a0a',
      ambientIntensity = 0.6,
      directionalIntensity = 1.2,
      enableShadows = true,
      enableFog = true,
      enablePostProcessing = true,
      onPerformanceChange,
      className = '',
    },
    ref
  ) => {
    const { viewport, performance } = useResponsiveWebGL()
    const { device, settings } = useMobileOptimization()
    const { performance: perfMetrics, getQualityRecommendation } = usePerformanceMonitor()
    const qualityRef = useRef<'high' | 'medium' | 'low'>('high')

    // Monitor performance and adjust quality
    useEffect(() => {
      const quality = getQualityRecommendation()

      if (quality !== qualityRef.current) {
        qualityRef.current = quality
        onPerformanceChange?.(quality)
      }
    }, [perfMetrics.fps, getQualityRecommendation, onPerformanceChange])

    return (
      <div ref={ref} className={`w-full h-full overflow-hidden relative ${className}`}>
        <Canvas
          dpr={viewport.dpi}
          gl={{
            antialias: qualityRef.current !== 'low',
            powerPreference: device.type === 'mobile' ? 'low-power' : 'high-performance',
            alpha: false,
            precision: device.type === 'mobile' ? 'mediump' : 'highp',
          }}
          camera={{
            position: [0, 0, 5],
            fov: 75,
            near: 0.1,
            far: 1000,
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
          frameloop={device.type === 'mobile' ? 'demand' : 'always'}
        >
          {/* Preload assets */}
          <Preload all />

          {/* Performance bounds for optimization */}
          <Bounds fit clip observe>
            {children}
          </Bounds>
        </Canvas>

        {/* Performance monitor (dev only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-4 left-4 text-sm text-white bg-black/50 p-3 rounded backdrop-blur-sm font-mono">
            <div>FPS: {perfMetrics.fps}</div>
            <div>Frame: {perfMetrics.avgFrameTime.toFixed(1)}ms</div>
            <div>Quality: {qualityRef.current}</div>
            <div>Device: {device.type}</div>
          </div>
        )}
      </div>
    )
  }
)

BaseScene.displayName = 'BaseScene'

export default BaseScene
