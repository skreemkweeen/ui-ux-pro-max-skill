'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import useBreathingArchitecture, { useAnomalySystem } from '@hooks/useBreathingArchitecture'
import useHeroInteraction from '@hooks/useHeroInteraction'
import LightingSetup from '@components/scenes/LightingSetup'

export interface CathedralSceneProps {
  enableBreathing?: boolean
  enableAnomalies?: boolean
}

// Dark reflective plane — infinite spatial ground
const SpatialGround: React.FC<{ breathe: number }> = ({ breathe }) => {
  const ref = useRef<THREE.Mesh>(null)

  return (
    <mesh ref={ref} position={[0, -4.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[120, 120, 1, 1]} />
      <meshStandardMaterial
        color="#0a0a0a"
        metalness={0.25 + breathe * 0.04}
        roughness={0.85}
        envMapIntensity={0.2}
      />
    </mesh>
  )
}

// Monolithic slab — Tadao Ando, not classical column
const MonolithSlab: React.FC<{
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  emissive?: number
}> = ({
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  emissive = 0,
}) => (
  <mesh
    position={position}
    rotation={rotation}
    scale={scale}
    castShadow
    receiveShadow
  >
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial
      color="#0d0d0d"
      metalness={0.06}
      roughness={0.92}
      emissive="#d4af37"
      emissiveIntensity={emissive}
    />
  </mesh>
)

// Void plane — a surface of pure reflected darkness hanging in space
const SuspendedPlane: React.FC<{
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  opacity?: number
}> = ({ position, rotation, scale, opacity = 0.06 }) => (
  <mesh position={position} rotation={rotation} scale={scale}>
    <planeGeometry args={[1, 1, 1, 1]} />
    <meshStandardMaterial
      color="#111111"
      metalness={0.4}
      roughness={0.6}
      transparent
      opacity={opacity}
      side={THREE.DoubleSide}
    />
  </mesh>
)

// Impossible void light — punctures space with luminous absence
const VoidLight: React.FC<{ intensity: number; position: [number, number, number] }> = ({
  intensity,
  position,
}) => {
  const ref = useRef<THREE.Mesh>(null)
  const time = useRef(0)

  useFrame(() => {
    time.current += 0.004
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshBasicMaterial
      mat.opacity = (0.04 + Math.sin(time.current) * 0.015) * intensity
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[0.4, 8]} />
      <meshBasicMaterial
        color="#d4af37"
        transparent
        opacity={0.04}
        depthTest={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export const CathedralScene: React.FC<CathedralSceneProps> = ({
  enableBreathing = true,
  enableAnomalies = true,
}) => {
  const { camera } = useThree()
  const breathing = useBreathingArchitecture(enableBreathing)
  const anomaly = useAnomalySystem(enableAnomalies)
  const presence = useHeroInteraction(true)

  // Presence modulates rim light position — user shapes the space
  const rimLightRef = useRef<THREE.PointLight>(null)

  // Drift camera on breathing cycle + presence lean
  useFrame(() => {
    if (!enableBreathing) return
    camera.position.y += breathing.cameraOffsetY * 0.008
    camera.position.z += breathing.cameraOffsetZ * 0.006

    // Presence gently tilts the camera toward cursor — barely perceptible
    camera.position.x += (presence.lightOffsetX * 0.012 - camera.position.x * 0.003)
    camera.position.y += (presence.lightOffsetY * 0.006 - (camera.position.y - 5) * 0.002)

    // Rim light follows presence
    if (rimLightRef.current) {
      rimLightRef.current.position.x += ((-10 + presence.lightOffsetX * 4) - rimLightRef.current.position.x) * 0.04
      rimLightRef.current.position.y += ((5 + presence.lightOffsetY * 2) - rimLightRef.current.position.y) * 0.04
      rimLightRef.current.intensity = 0.28 + presence.presence * 0.14
    }
  })

  // Scale anomaly: subtle geometry response
  const anomalyScale = anomaly.isActive ? 1 + anomaly.intensity * 0.008 : 1

  return (
    <>
      {/* Lighting rig */}
      <LightingSetup
        ambientIntensity={breathing.lightIntensity * 0.8}
        directionalIntensity={0.9}
        directionalPosition={[6, 16, 4]}
        rimColor="#fffaf0"
        rimIntensity={0.28}
        shadowMapSize={2048}
        enableShadows={true}
      />

      {/* Presence-aware rim light — environment becomes aware of user */}
      <pointLight
        ref={rimLightRef}
        position={[-10, 5, 8]}
        intensity={0.28}
        color="#fffaf0"
        distance={50}
        decay={2}
      />

      {/* Secondary fill — cold side light */}
      <pointLight
        position={[-14, 8, -6]}
        intensity={0.15}
        color="#e8f0ff"
        distance={60}
        decay={2}
      />

      {/* Atmospheric fog — inherits scene background */}
      <fog attach="fog" args={['#0a0a0a', 14, 90]} />

      {/* Ground plane */}
      <SpatialGround breathe={breathing.lightIntensity - 0.6} />

      {/*
        Monolithic architecture — abstracted, non-literal
        Suggests scale and enclosure without naming it
      */}

      {/* Left vertical mass — wide slab receding into fog */}
      <MonolithSlab
        position={[-9, 6 * anomalyScale, -12]}
        scale={[2.2, 28, 3.5]}
        rotation={[0, 0.06, 0]}
        emissive={0.012 + breathing.geometryDistortion * 2}
      />

      {/* Right vertical mass — asymmetric, narrower */}
      <MonolithSlab
        position={[11, 4, -18]}
        scale={[1.6, 22, 2.8]}
        rotation={[0, -0.04, 0.01]}
        emissive={0.008}
      />

      {/* Far rear wall — where the space ends, or doesn't */}
      <MonolithSlab
        position={[0, 5, -32]}
        scale={[38, 24, 1.2]}
        rotation={[0, 0, 0]}
        emissive={0.004}
      />

      {/* Low horizontal mass — anchors the space */}
      <MonolithSlab
        position={[-4, -2.5, -8]}
        scale={[6, 0.5, 4]}
        rotation={[0, 0.02, 0]}
        emissive={0}
      />

      {/* Ceiling fragment — partial, suggests enclosure without showing it */}
      <MonolithSlab
        position={[2, 14, -14]}
        scale={[22, 0.6, 12]}
        rotation={[0.01, 0, 0]}
        emissive={0.006}
      />

      {/* Suspended void planes — spatial tension */}
      <SuspendedPlane
        position={[-7, 10, -20]}
        rotation={[0, 0.15, 0]}
        scale={[0.8, 20, 0.01]}
        opacity={0.04}
      />
      <SuspendedPlane
        position={[9, 8, -24]}
        rotation={[0, -0.08, 0.02]}
        scale={[0.5, 16, 0.01]}
        opacity={0.03}
      />

      {/* Void light shafts — barely perceptible */}
      <VoidLight intensity={breathing.lightIntensity} position={[-2, 8, -10]} />
      <VoidLight intensity={breathing.lightIntensity * 0.6} position={[5, 6, -16]} />

      {/* Anomaly: barely-visible distortion layer */}
      {anomaly.isActive && anomaly.type !== 'displacement' && (
        <mesh position={[0, 0, -5]} scale={[50, 50, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#ffffff"
            opacity={anomaly.intensity * 0.025}
            transparent
            depthTest={false}
          />
        </mesh>
      )}
    </>
  )
}

export default CathedralScene
