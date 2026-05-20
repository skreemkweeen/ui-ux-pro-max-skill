'use client'

import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface BreathingValues {
  lightIntensity: number
  particleOpacity: number
  cameraOffsetY: number
  cameraOffsetZ: number
  columnScale: number
  geometryDistortion: number
  shadowIntensity: number
}

export const useBreathingArchitecture = (enabled = true) => {
  const timeRef = useRef(0)
  const [breathing, setBreathing] = useState<BreathingValues>({
    lightIntensity: 0,
    particleOpacity: 0,
    cameraOffsetY: 0,
    cameraOffsetZ: 0,
    columnScale: 1,
    geometryDistortion: 0,
    shadowIntensity: 0,
  })

  // Breathing cycle durations (seconds) - all different for organic feel
  const cycles = useRef({
    light: 5.2,
    particle: 6.8,
    cameraY: 8.3,
    cameraZ: 10.1,
    column: 7.5,
    distortion: 9.2,
    shadow: 6.1,
  })

  // Update breathing values
  useFrame(() => {
    if (!enabled) return

    timeRef.current += 0.016 // ~60fps delta

    const baseLight = 0.6
    const baseShadow = 0.4

    // Sine wave oscillations with different periods
    const newBreathing: BreathingValues = {
      // Light breathing (0.6 ± 0.05)
      lightIntensity:
        baseLight +
        Math.sin((timeRef.current / cycles.current.light) * Math.PI * 2) * 0.05,

      // Particle opacity breathing (0.3 ± 0.05)
      particleOpacity:
        0.3 +
        Math.sin((timeRef.current / cycles.current.particle) * Math.PI * 2) *
          0.05,

      // Camera Y drift (subtle vertical motion)
      cameraOffsetY:
        Math.sin((timeRef.current / cycles.current.cameraY) * Math.PI * 2) *
        0.15,

      // Camera Z drift (in/out subtle)
      cameraOffsetZ:
        Math.sin((timeRef.current / cycles.current.cameraZ) * Math.PI * 2) *
        0.1,

      // Column scale breathing (1.0 ± 0.008)
      columnScale:
        1.0 +
        Math.sin((timeRef.current / cycles.current.column) * Math.PI * 2) *
          0.008,

      // Geometry micro-distortion (0 ± 0.002)
      geometryDistortion:
        Math.sin(
          (timeRef.current / cycles.current.distortion) * Math.PI * 2
        ) * 0.002,

      // Shadow intensity breathing
      shadowIntensity:
        baseShadow +
        Math.sin((timeRef.current / cycles.current.shadow) * Math.PI * 2) *
          0.04,
    }

    setBreathing(newBreathing)
  })

  return breathing
}

// Separate hook for anomaly system
export const useAnomalySystem = (enabled = true) => {
  const timeRef = useRef(0)
  const lastAnomalyTimeRef = useRef(0)
  const [anomaly, setAnomaly] = useState({
    isActive: false,
    intensity: 0,
    type: 'flicker' as 'flicker' | 'distortion' | 'displacement',
  })

  // Anomaly configuration
  const anomalyConfig = useRef({
    minInterval: 15000, // ms between anomalies
    maxInterval: 45000,
    nextAnomalyTime: Math.random() * 30000 + 15000,
    anomalyDuration: 0.5, // seconds
    probability: 0.7, // 70% chance an event triggers
  })

  useFrame(() => {
    if (!enabled) return

    timeRef.current += 0.016

    const now = Date.now()
    const timeSinceLastAnomaly = now - lastAnomalyTimeRef.current

    // Check if it's time for an anomaly
    if (timeSinceLastAnomaly > anomalyConfig.current.nextAnomalyTime) {
      // Random chance to actually trigger
      if (Math.random() < anomalyConfig.current.probability) {
        lastAnomalyTimeRef.current = now

        // Random anomaly type
        const types: ('flicker' | 'distortion' | 'displacement')[] = [
          'flicker',
          'distortion',
          'displacement',
        ]
        const type = types[Math.floor(Math.random() * types.length)]

        setAnomaly({
          isActive: true,
          intensity: 1,
          type,
        })

        // Auto-disable after duration
        setTimeout(() => {
          setAnomaly((prev) => ({
            ...prev,
            isActive: false,
          }))

          // Schedule next anomaly
          anomalyConfig.current.nextAnomalyTime =
            Math.random() *
              (anomalyConfig.current.maxInterval -
                anomalyConfig.current.minInterval) +
            anomalyConfig.current.minInterval
        }, anomalyConfig.current.anomalyDuration * 1000)
      }
    }

    // Fade anomaly intensity (in and out)
    if (anomaly.isActive) {
      setAnomaly((prev) => ({
        ...prev,
        intensity: Math.max(
          0,
          prev.intensity -
            (0.016 / (anomalyConfig.current.anomalyDuration / 2))
        ),
      }))
    }
  })

  return anomaly
}

export default useBreathingArchitecture
