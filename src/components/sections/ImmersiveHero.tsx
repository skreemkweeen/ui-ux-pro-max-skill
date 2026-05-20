'use client'

import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import useChoreography from '@hooks/useChoreography'

export interface ImmersiveHeroProps {
  title: string
  subtitle?: string
  ctaText?: string
  onCTAClick?: () => void
  meshColor?: string
  enableParticles?: boolean
}

const ImmersiveHeroMesh = ({ color = '#d4af37' }: { color?: string }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)

  useFrame(() => {
    if (!meshRef.current) return

    timeRef.current += 0.001
    meshRef.current.rotation.x = Math.sin(timeRef.current) * 0.3
    meshRef.current.rotation.y += 0.0005
    meshRef.current.position.z = Math.sin(timeRef.current * 0.5) * 0.5
  })

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <icosahedronGeometry args={[2, 4]} />
      <meshStandardMaterial
        color={color}
        metalness={0.8}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

export const ImmersiveHero = ({
  title = 'ELEMENT UX',
  subtitle = 'Cinematic Design Intelligence',
  ctaText = 'Explore',
  onCTAClick,
  meshColor = '#d4af37',
  enableParticles = true,
}: ImmersiveHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)

  const { timeline } = useChoreography({
    staggerAmount: 0.15,
  })

  // Animate hero elements on mount
  useEffect(() => {
    if (!timeline || !containerRef.current) return

    // Set initial state
    gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
      opacity: 0,
      y: 20,
    })

    // Animate in sequence
    timeline
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
      .to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.6'
      )
      .to(
        ctaRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.4'
      )
  }, [timeline])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-black to-gray-900"
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full">
          <div className="w-full h-1/3 flex items-center justify-center">
            <ImmersiveHeroMesh color={meshColor} />
          </div>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight"
        >
          {title}
        </h1>

        <p
          ref={subtitleRef}
          className="text-lg md:text-2xl text-gray-400 mb-12 font-light leading-relaxed"
        >
          {subtitle}
        </p>

        <button
          ref={ctaRef}
          onClick={onCTAClick}
          className="px-8 py-4 bg-gold-accent hover:bg-gold-accent-light text-black font-semibold rounded transition-colors duration-300"
        >
          {ctaText}
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <svg
          className="w-6 h-6 text-white opacity-50"
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
  )
}

export default ImmersiveHero
