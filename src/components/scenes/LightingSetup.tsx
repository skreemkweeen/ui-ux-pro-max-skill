'use client'

import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

export interface LightingConfig {
  ambientColor?: string
  ambientIntensity?: number
  directionalColor?: string
  directionalIntensity?: number
  directionalPosition?: [number, number, number]
  rimColor?: string
  rimIntensity?: number
  rimPosition?: [number, number, number]
  shadowMapSize?: number
  shadowBias?: number
  enableShadows?: boolean
}

export const LightingSetup = ({
  ambientColor = '#ffffff',
  ambientIntensity = 0.6,
  directionalColor = '#ffffff',
  directionalIntensity = 1.2,
  directionalPosition = [10, 10, 10],
  rimColor = '#ffffff',
  rimIntensity = 0.4,
  rimPosition = [-10, 5, 10],
  shadowMapSize = 2048,
  shadowBias = -0.0001,
  enableShadows = true,
}: LightingConfig) => {
  const ambientLightRef = useRef<THREE.AmbientLight>(null)
  const directionalLightRef = useRef<THREE.DirectionalLight>(null)
  const rimLightRef = useRef<THREE.PointLight>(null)

  // Configure shadow camera for optimal quality
  useEffect(() => {
    if (!directionalLightRef.current || !enableShadows) return

    const light = directionalLightRef.current
    light.shadow.mapSize.set(shadowMapSize, shadowMapSize)
    light.shadow.camera.near = 0.5
    light.shadow.camera.far = 500
    light.shadow.camera.left = -50
    light.shadow.camera.right = 50
    light.shadow.camera.top = 50
    light.shadow.camera.bottom = -50
    light.shadow.bias = shadowBias
    light.shadow.normalBias = 0.05

    // Update shadow map
    if (light.shadow.map) {
      light.shadow.map.dispose()
    }
  }, [shadowMapSize, shadowBias, enableShadows])

  return (
    <>
      {/* Ambient Light - Fill light for overall illumination */}
      <ambientLight
        ref={ambientLightRef}
        color={ambientColor}
        intensity={ambientIntensity}
      />

      {/* Directional Light - Key light with shadows */}
      <directionalLight
        ref={directionalLightRef}
        color={directionalColor}
        intensity={directionalIntensity}
        position={directionalPosition}
        castShadow={enableShadows}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-near={0.5}
        shadow-camera-far={500}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={shadowBias}
      />

      {/* Rim/Accent Light - Add depth and separation */}
      <pointLight
        ref={rimLightRef}
        color={rimColor}
        intensity={rimIntensity}
        position={rimPosition}
        distance={100}
        decay={2}
      />

      {/* Environment lighting for realistic material rendering */}
      <mesh position={[0, 50, 0]} visible={false}>
        <sphereGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
    </>
  )
}

export default LightingSetup
