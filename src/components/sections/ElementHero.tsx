'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, Bounds } from '@react-three/drei'
import CinematicLoader from '@components/loading/CinematicLoader'
import CathedralScene from '@components/immersive/CathedralScene'
import useLoaderStore from '@hooks/useLoaderStore'
import useResponsiveWebGL from '@hooks/useResponsiveWebGL'
import usePerformanceMonitor from '@hooks/usePerformanceMonitor'
import gsap from 'gsap'

export interface ElementHeroProps {
  onExploreClick?: () => void
  onHeroComplete?: () => void
  enableAudio?: boolean
  colorScheme?: 'luxury' | 'minimal' | 'ethereal'
}

export const ElementHero = ({
  onExploreClick,
  onHeroComplete,
  enableAudio = false,
  colorScheme = 'luxury',
}: ElementHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const heroTextRef = useRef<HTMLDivElement>(null)

  const { phase } = useLoaderStore()
  const setProgress = useLoaderStore((state) => state.setProgress)
  const setPhase = useLoaderStore((state) => state.setPhase)

  const { viewport } = useResponsiveWebGL()
  const { performance } = usePerformanceMonitor()

  const [showCathedral, setShowCathedral] = useState(false)

  // Simulate asset loading
  useEffect(() => {
    const startTime = Date.now()
    const targetDuration = 3200 // 3.2 seconds for loading

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(100, (elapsed / targetDuration) * 100)

      setProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setPhase('complete')
      }
    }, 50)

    return () => clearInterval(interval)
  }, [setProgress, setPhase])

  // Reveal cathedral when loader completes
  useEffect(() => {
    if (phase === 'complete') {
      // Small delay for smooth transition
      setTimeout(() => {
        setShowCathedral(true)

        // Animate hero text in
        if (heroTextRef.current) {
          gsap.fromTo(
            heroTextRef.current,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              delay: 0.5,
            }
          )
        }

        onHeroComplete?.()
      }, 300)
    }
  }, [phase, onHeroComplete])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
    >
      {/* Cinematic Loader */}
      <CinematicLoader
        isVisible={phase !== 'complete'}
        duration={3200}
        onComplete={() => {
          console.log('Loader transition complete')
        }}
      />

      {/* Cathedral Environment */}
      {showCathedral && (
        <div
          className="absolute inset-0 animate-fadeIn"
          ref={canvasRef}
        >
          <Canvas
            dpr={viewport.dpi}
            gl={{
              antialias: true,
              powerPreference: 'high-performance',
              alpha: false,
              precision: 'highp',
            }}
            camera={{
              position: [0, 5, 25],
              fov: 75,
              near: 0.1,
              far: 1000,
            }}
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            {/* Preload assets */}
            <Preload all />

            {/* Cathedral scene */}
            <Bounds fit clip observe>
              <CathedralScene
                colorScheme={colorScheme}
                enableBreathing={true}
                enableAnomalies={true}
              />
            </Bounds>
          </Canvas>
        </div>
      )}

      {/* Hero Typography Overlay */}
      {showCathedral && (
        <div
          ref={heroTextRef}
          className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center"
          style={{
            opacity: 0,
          }}
        >
          {/* Main Title */}
          <h1 className="text-7xl md:text-8xl font-serif font-bold text-white mb-8 text-center drop-shadow-2xl">
            ELEMENT
            <span
              className="block"
              style={{
                color: '#d4af37',
              }}
            >
              UX
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-400 mb-12 font-light text-center max-w-xl">
            Luxury-Tech Cinematic Design System
          </p>

          {/* CTA Button */}
          <button
            onClick={onExploreClick}
            className="pointer-events-auto px-8 py-4 rounded text-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: '#d4af37',
              color: '#0a0a0a',
            }}
          >
            Explore
          </button>

          {/* Scroll Hint */}
          <div className="absolute bottom-12 flex flex-col items-center gap-2">
            <p className="text-xs uppercase tracking-widest text-gray-600">
              Scroll to explore
            </p>
            <svg
              className="w-6 h-6 text-gold-accent animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Performance Monitor (Dev Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 text-xs text-white bg-black/50 p-3 rounded font-mono">
          <div>FPS: {performance.fps}</div>
          <div>Device: {viewport.isMobile ? 'Mobile' : 'Desktop'}</div>
          <div>Phase: {phase}</div>
        </div>
      )}
    </div>
  )
}

export default ElementHero
