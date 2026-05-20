'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import useBreathingArchitecture, { useAnomalySystem } from '@hooks/useBreathingArchitecture'
import useHeroInteraction from '@hooks/useHeroInteraction'
import useHeroScroll from '@hooks/useHeroScroll'
import LightingSetup from '@components/scenes/LightingSetup'
import AtmosphericLayers from '@components/scenes/AtmosphericLayers'
import CathedralRipple from '@components/effects/CathedralRipple'

export interface CathedralSceneProps {
  colorScheme?: 'luxury' | 'minimal' | 'ethereal'
  enableBreathing?: boolean
  enableAnomalies?: boolean
}

const CathedralFloor: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <mesh
      ref={meshRef}
      receiveShadow
      position={[0, -5, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[20, 20, 1]}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
      <meshStandardMaterial
        color="#1a1a1a"
        metalness={0.1}
        roughness={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

const CathedralColumn: React.FC<{ position: [number, number, number] }> = ({
  position,
}) => {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.5, 20, 16]} />
        <meshStandardMaterial
          color="#0f0f0f"
          metalness={0.05}
          roughness={0.9}
          emissive="#d4af37"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Capital (top of column) */}
      <mesh position={[0, 10, 0]} castShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Base */}
      <mesh position={[0, -10, 0]} castShadow>
        <cylinderGeometry args={[1.8, 1.5, 1, 16]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.15}
          roughness={0.7}
        />
      </mesh>
    </group>
  )
}

const CathedralVault: React.FC = () => {
  const vaultRef = useRef<THREE.Mesh>(null)

  // Create arched ceiling geometry
  const geometry = useMemo(() => {
    const arc = new THREE.BufferGeometry()
    const points = []

    for (let i = 0; i <= 32; i++) {
      const angle = (i / 32) * Math.PI
      const x = Math.cos(angle) * 12
      const y = Math.sin(angle) * 12

      // Create a surface instead of just a curve
      for (let j = 0; j <= 32; j++) {
        const z = (j / 32 - 0.5) * 20

        points.push(new THREE.Vector3(x, y, z))
      }
    }

    arc.setFromPoints(points)
    return arc
  }, [])

  return (
    <mesh ref={vaultRef} position={[0, 8, 0]} castShadow>
      <latheGeometry args={[new THREE.LineCurve(new THREE.Vector2(0, 0), new THREE.Vector2(12, 12)).points, 32]} />
      <meshStandardMaterial
        color="#1a1a1a"
        metalness={0.08}
        roughness={0.85}
        emissive="#d4af37"
        emissiveIntensity={0.03}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export const CathedralScene: React.FC<CathedralSceneProps> = ({
  colorScheme = 'luxury',
  enableBreathing = true,
  enableAnomalies = true,
}) => {
  const { camera } = useThree()
  const breathing = useBreathingArchitecture(enableBreathing)
  const anomaly = useAnomalySystem(enableAnomalies)
  const { interaction, isRippleActive } = useHeroInteraction(true)
  const { scrollProgress } = useHeroScroll(true)

  // Apply breathing to camera
  useFrame(() => {
    if (enableBreathing) {
      camera.position.y += breathing.cameraOffsetY * 0.01
      camera.position.z += breathing.cameraOffsetZ * 0.01
    }
  })

  return (
    <>
      {/* Lighting */}
      <LightingSetup
        ambientIntensity={breathing.lightIntensity}
        directionalIntensity={1.2}
        rimIntensity={0.4}
        shadowMapSize={2048}
        enableShadows={true}
      />

      {/* Atmospheric Layers */}
      <AtmosphericLayers
        fogColor="#0a0a0a"
        fogNear={10}
        fogFar={100}
        ambience="dark"
        glowIntensity={breathing.particleOpacity}
        particleCount={80}
      />

      {/* Cathedral Architecture */}
      {/* Floor */}
      <CathedralFloor />

      {/* Columns */}
      <CathedralColumn position={[-8, 0, -8]} />
      <CathedralColumn position={[8, 0, -8]} />
      <CathedralColumn position={[-8, 0, 8]} />
      <CathedralColumn position={[8, 0, 8]} />

      {/* Vault/Ceiling */}
      <CathedralVault />

      {/* Decorative arch elements */}
      <mesh position={[0, 12, -15]} castShadow>
        <torusGeometry args={[8, 0.5, 16, 100]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.1}
          roughness={0.8}
          emissive="#d4af37"
          emissiveIntensity={0.02}
        />
      </mesh>

      {/* Ripple Effect on Interaction */}
      {isRippleActive && interaction && (
        <CathedralRipple
          position={interaction.worldPosition}
          strength={interaction.strength}
          isActive={true}
        />
      )}

      {/* Anomaly effect overlay (visual feedback) */}
      {anomaly.isActive && (
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            color={anomaly.type === 'flicker' ? '#ffffff' : '#d4af37'}
            opacity={anomaly.intensity * 0.1}
            transparent
            depthTest={false}
          />
        </mesh>
      )}
    </>
  )
}

export default CathedralScene
