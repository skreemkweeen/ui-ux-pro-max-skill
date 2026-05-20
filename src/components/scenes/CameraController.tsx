'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

export interface CameraTarget {
  position?: [number, number, number]
  lookAt?: [number, number, number]
  duration?: number
  ease?: string
}

export const CameraController = ({
  autoLook = true,
  enableDamping = true,
  dampingFactor = 0.05,
  minDistance = 1,
  maxDistance = 100,
  onCameraMove,
}: {
  autoLook?: boolean
  enableDamping?: boolean
  dampingFactor?: number
  minDistance?: number
  maxDistance?: number
  onCameraMove?: (position: THREE.Vector3) => void
}) => {
  const { camera } = useThree()
  const dampingRef = useRef({
    position: new THREE.Vector3(),
    targetPosition: camera.position.clone(),
  })

  // Animate camera to target
  const goTo = useCallback((target: CameraTarget) => {
    const { position = camera.position.toArray() as [number, number, number],
            lookAt = [0, 0, 0],
            duration = 2,
            ease = 'power3.inOut' } = target

    // Animate camera position
    gsap.to(camera.position, {
      x: position[0],
      y: position[1],
      z: position[2],
      duration,
      ease,
    })

    // Animate camera lookAt
    const targetPoint = new THREE.Vector3(...lookAt)
    gsap.to(dampingRef.current.targetPosition, {
      x: targetPoint.x,
      y: targetPoint.y,
      z: targetPoint.z,
      duration,
      ease,
    })
  }, [camera])

  // Reset camera to default position
  const reset = useCallback((duration = 1) => {
    goTo({
      position: [0, 0, 5],
      lookAt: [0, 0, 0],
      duration,
      ease: 'power2.inOut',
    })
  }, [goTo])

  // Update frame with damping
  useFrame(() => {
    if (enableDamping && autoLook) {
      const targetPos = dampingRef.current.targetPosition

      // Lerp camera to look at target
      if (!targetPos.equals(new THREE.Vector3(0, 0, 0))) {
        const dir = new THREE.Vector3()
          .subVectors(targetPos, camera.position)
          .normalize()

        camera.lookAt(targetPos)
      }
    }

    if (onCameraMove) {
      onCameraMove(camera.position)
    }
  })

  return null
}

export default CameraController
