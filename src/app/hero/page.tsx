'use client'

import React, { useEffect, useRef } from 'react'
import CinematicLoader from '@components/loading/CinematicLoader'
import useLoaderStore from '@hooks/useLoaderStore'
import { progressEmitter } from '@utils/loader/ProgressEmitter'
import gsap from 'gsap'

export default function HeroPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { phase } = useLoaderStore()
  const setProgress = useLoaderStore((state) => state.setProgress)
  const setPhase = useLoaderStore((state) => state.setPhase)

  // Simulate asset loading with progress
  useEffect(() => {
    const startTime = Date.now()
    const targetDuration = 3500 // 3.5 seconds

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

  const handleLoaderComplete = () => {
    // Reveal hero content
    console.log('Loader complete, revealing hero environment')
  }

  return (
    <div ref={containerRef} className="w-full h-screen bg-black overflow-hidden">
      {/* Cinematic Loader */}
      <CinematicLoader onComplete={handleLoaderComplete} isVisible={phase !== 'complete'} />

      {/* Hero Environment (will mount after loader complete) */}
      {phase === 'complete' && (
        <div className="absolute inset-0 animate-fadeIn">
          <div className="w-full h-full flex items-center justify-center">
            {/* Placeholder for cathedral scene */}
            <div className="text-center">
              <h1 className="text-5xl font-serif text-white mb-4">ELEMENT UX</h1>
              <p className="text-lg text-gray-400">Cathedral environment initializing...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
