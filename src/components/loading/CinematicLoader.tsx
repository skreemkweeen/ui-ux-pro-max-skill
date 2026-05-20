'use client'

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import useLoaderStore from '@hooks/useLoaderStore'
import { progressEmitter } from '@utils/loader/ProgressEmitter'

export interface CinematicLoaderProps {
  onComplete?: () => void
  duration?: number
  isVisible?: boolean
}

export const CinematicLoader = ({
  onComplete,
  duration = 3500,
  isVisible = true,
}: CinematicLoaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const geometryRef = useRef<HTMLDivElement>(null)
  const progressRingRef = useRef<SVGCircleElement>(null)
  const percentTextRef = useRef<HTMLDivElement>(null)

  const { progress, phase } = useLoaderStore()
  const [displayProgress, setDisplayProgress] = useState(0)

  // Animate progress display (smooth lerp from current to target)
  useEffect(() => {
    if (progress === displayProgress) return

    const tween = gsap.to(
      { current: displayProgress },
      {
        current: progress,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: function () {
          setDisplayProgress(Math.round(this.targets()[0].current))
        },
      }
    )

    return () => tween.kill()
  }, [progress, displayProgress])

  // Rotate geometry
  useEffect(() => {
    if (!geometryRef.current || phase === 'complete') return

    const timeline = gsap.timeline({ repeat: -1 })
    timeline.to(
      geometryRef.current,
      {
        rotationZ: 360,
        rotationX: 180,
        duration: 6,
        ease: 'none',
      },
      0
    )

    return () => timeline.kill()
  }, [phase])

  // Update progress ring (circumference stroke)
  useEffect(() => {
    if (!progressRingRef.current) return

    const circle = progressRingRef.current
    const circumference = 2 * Math.PI * 45 // radius = 45
    const offset = circumference - (displayProgress / 100) * circumference

    gsap.to(circle, {
      strokeDashoffset: offset,
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [displayProgress])

  // Handle loader completion
  useEffect(() => {
    if (phase !== 'complete' || !containerRef.current) return

    const tween = gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      delay: 0.5,
      onComplete: () => {
        onComplete?.()
      },
    })

    return () => tween.kill()
  }, [phase, onComplete])

  if (!isVisible) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black opacity-100 transition-opacity"
      style={{
        pointerEvents: phase === 'complete' ? 'none' : 'auto',
      }}
    >
      {/* Background atmosphere */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-black to-black opacity-60" />
        {/* Subtle glow particles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-accent rounded-full blur-3xl opacity-5" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-accent rounded-full blur-3xl opacity-3" />
      </div>

      {/* Center geometry */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Rotating icosahedron */}
        <div
          ref={geometryRef}
          className="mb-8 w-24 h-24 flex items-center justify-center"
          style={{
            perspective: '1000px',
          }}
        >
          <div
            className="w-20 h-20 relative"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Golden wireframe icosahedron representation */}
            <div
              className="absolute inset-0 border-2 border-gold-accent/40 rounded-2xl"
              style={{
                transform: 'rotateX(20deg) rotateY(20deg)',
              }}
            />
            <div
              className="absolute inset-2 border border-gold-accent/30 rounded-xl"
              style={{
                transform: 'rotateX(-20deg) rotateY(-20deg)',
              }}
            />
            {/* Center glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-gold-accent opacity-60 blur-lg" />
            </div>
          </div>
        </div>

        {/* Progress ring */}
        <svg className="w-40 h-40 mb-8" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(212, 175, 55, 0.1)"
            strokeWidth="1"
          />

          {/* Progress circle */}
          <circle
            ref={progressRingRef}
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(212, 175, 55, 0.8)"
            strokeWidth="1"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45}
            strokeLinecap="round"
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50px 50px',
              transition: 'stroke-dashoffset 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>

        {/* Percentage text */}
        <div ref={percentTextRef} className="text-sm font-light tracking-widest text-gold-accent">
          {displayProgress}%
        </div>

        {/* Loading text */}
        <p className="mt-6 text-xs uppercase tracking-[0.15em] text-gray-500 opacity-50">
          {phase === 'initializing' && 'Initializing environment...'}
          {phase === 'loading' && 'Loading cathedral...'}
          {phase === 'revealing' && 'Revealing experience...'}
          {phase === 'complete' && ''}
        </p>
      </div>
    </div>
  )
}

export default CinematicLoader
