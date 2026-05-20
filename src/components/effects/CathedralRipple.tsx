'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface CathedralRippleProps {
  position: THREE.Vector3 | null
  strength?: number
  isActive?: boolean
}

const RippleRing: React.FC<{
  position: THREE.Vector3
  progress: number
  strength: number
}> = ({ position, progress, strength }) => {
  const scale = 0.5 + progress * 8 // Expands from 0.5 to 8.5 units
  const opacity = 1 - progress // Fades from 1 to 0

  return (
    <mesh position={position} scale={[scale, 1, scale]}>
      <ringGeometry args={[1, 1.2, 32]} />
      <meshBasicMaterial
        color="#d4af37"
        opacity={opacity * strength * 0.6}
        transparent
        depthTest={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export const CathedralRipple: React.FC<CathedralRippleProps> = ({
  position,
  strength = 1,
  isActive = false,
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)
  const startTimeRef = useRef(Date.now())
  const rippleDuration = 1000 // 1 second ripple animation

  useFrame(() => {
    if (!position || !isActive) return

    const elapsed = Date.now() - startTimeRef.current
    const progress = Math.min(1, elapsed / rippleDuration)

    if (groupRef.current) {
      // Subtle vertical pulse from impact
      groupRef.current.position.y = Math.sin(progress * Math.PI) * 0.2
    }

    timeRef.current = progress
  })

  if (!position || !isActive) return null

  return (
    <group ref={groupRef} position={position}>
      {/* Multiple ripple rings for layered effect */}
      <RippleRing position={position} progress={Math.max(0, timeRef.current - 0)} strength={strength} />
      <RippleRing
        position={position}
        progress={Math.max(0, timeRef.current - 0.2)}
        strength={strength * 0.7}
      />
      <RippleRing
        position={position}
        progress={Math.max(0, timeRef.current - 0.4)}
        strength={strength * 0.4}
      />

      {/* Impact glow point */}
      <mesh position={position} scale={[0.5, 0.5, 0.5]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial
          color="#d4af37"
          opacity={(1 - timeRef.current) * strength * 0.8}
          transparent
          depthTest={false}
        />
      </mesh>
    </group>
  )
}

export default CathedralRipple
