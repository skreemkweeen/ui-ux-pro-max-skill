'use client'

import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export interface AtmosphericConfig {
  fogColor?: string
  fogNear?: number
  fogFar?: number
  ambience?: 'light' | 'dark' | 'dramatic'
  glowIntensity?: number
  particleCount?: number
}

export const AtmosphericLayers = ({
  fogColor = '#0a0a0a',
  fogNear = 10,
  fogFar = 500,
  ambience = 'dark',
  glowIntensity = 0.3,
  particleCount = 50,
}: AtmosphericConfig) => {
  const particlesRef = useRef<THREE.Points>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)

  // Create particle system for atmosphere
  useEffect(() => {
    if (!particlesRef.current) return

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200

      velocities[i * 3] = (Math.random() - 0.5) * 0.1
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))

    // Store velocities for animation
    ;(particlesRef.current as any).userData.velocities = velocities

    return () => {
      geometry.dispose()
    }
  }, [particleCount])

  // Animate particles
  useFrame(() => {
    if (!particlesRef.current) return

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
    const velocities = (particlesRef.current as any).userData.velocities as Float32Array

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += velocities[i * 3]
      positions[i * 3 + 1] += velocities[i * 3 + 1]
      positions[i * 3 + 2] += velocities[i * 3 + 2]

      // Wrap around boundaries
      if (positions[i * 3] > 100) positions[i * 3] = -100
      if (positions[i * 3] < -100) positions[i * 3] = 100
      if (positions[i * 3 + 1] > 100) positions[i * 3 + 1] = -100
      if (positions[i * 3 + 1] < -100) positions[i * 3 + 1] = 100
      if (positions[i * 3 + 2] > 100) positions[i * 3 + 2] = -100
      if (positions[i * 3 + 2] < -100) positions[i * 3 + 2] = 100
    }

    ;(particlesRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate =
      true
  })

  // Determine color based on ambience
  const getAmbienceColor = () => {
    switch (ambience) {
      case 'light':
        return '#ffffff'
      case 'dramatic':
        return '#d4af37'
      default:
        return '#a8a8a8'
    }
  }

  return (
    <>
      {/* Fog for depth */}
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />

      {/* Particle atmosphere */}
      <points ref={particlesRef} userData={{ velocities: new Float32Array() }}>
        <bufferGeometry />
        <pointsMaterial
          color={getAmbienceColor()}
          size={0.5}
          sizeAttenuation
          transparent
          opacity={glowIntensity * 0.5}
          depthWrite={false}
        />
      </points>

      {/* Gradient backdrop using plane */}
      <mesh position={[0, 0, -100]} scale={[200, 200, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={fogColor} toneMapped={false} />
      </mesh>

      {/* Subtle glow overlay */}
      <mesh position={[0, 0, 0]} scale={[1000, 1000, 1]} renderOrder={-1}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color={getAmbienceColor()}
          opacity={glowIntensity * 0.05}
          transparent
          toneMapped={false}
        />
      </mesh>
    </>
  )
}

export default AtmosphericLayers
