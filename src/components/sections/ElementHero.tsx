'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import CinematicLoader from '@components/loading/CinematicLoader'
import CathedralScene from '@components/immersive/CathedralScene'
import SculpturalTypography from '@components/editorial/SculpturalTypography'
import useLoaderStore from '@hooks/useLoaderStore'
import useResponsiveWebGL from '@hooks/useResponsiveWebGL'

export interface ElementHeroProps {
  onHeroComplete?: () => void
}

export const ElementHero = ({ onHeroComplete }: ElementHeroProps) => {
  const canvasWrapRef = useRef<HTMLDivElement>(null)

  const { phase } = useLoaderStore()
  const setProgress = useLoaderStore((state) => state.setProgress)
  const setPhase = useLoaderStore((state) => state.setPhase)

  const { viewport } = useResponsiveWebGL()

  const [showEnvironment, setShowEnvironment] = useState(false)
  const [showTypography, setShowTypography] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Simulate progressive asset loading
  useEffect(() => {
    const start = Date.now()
    const duration = 3200

    const tick = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / duration) * 100)
      setProgress(p)
      if (p >= 100) {
        clearInterval(tick)
        setPhase('complete')
      }
    }, 50)

    return () => clearInterval(tick)
  }, [setProgress, setPhase])

  // Stage environment then typography
  useEffect(() => {
    if (phase !== 'complete') return
    const t1 = setTimeout(() => setShowEnvironment(true), 200)
    const t2 = setTimeout(() => setShowTypography(true), 800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [phase])

  // Scroll: track progress for typography dissolution and scene deepening
  useEffect(() => {
    const onScroll = () => {
      const max = window.innerHeight * 0.8
      setScrollProgress(Math.min(1, window.scrollY / max))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (showEnvironment) onHeroComplete?.()
  }, [showEnvironment, onHeroComplete])

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">

      {/* Atmospheric loader */}
      <CinematicLoader
        isVisible={phase !== 'complete'}
        duration={3200}
      />

      {/* Cathedral environment */}
      {showEnvironment && (
        <div
          ref={canvasWrapRef}
          className="absolute inset-0"
          style={{
            opacity: 0,
            animation: 'fadeIn 1.2s ease-out 0s forwards',
          }}
        >
          <Canvas
            dpr={Math.min(viewport.dpi, 2)}
            gl={{
              antialias: !viewport.isMobile,
              powerPreference: viewport.isMobile ? 'low-power' : 'high-performance',
              alpha: false,
            }}
            camera={{
              position: [0, 5, 25],
              fov: 72,
              near: 0.1,
              far: 500,
            }}
          >
            <Preload all />
            <CathedralScene
              enableBreathing={true}
              enableAnomalies={true}
            />
          </Canvas>
        </div>
      )}

      {/* Sculptural typography — architectural, lower-left */}
      {showTypography && (
        <SculpturalTypography
          scrollProgress={scrollProgress}
          showIntimateLayer={true}
        />
      )}

      {/* Inline animation definition */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default ElementHero
